import { beforeEach,describe,it,expect,vi } from 'vitest';
import { fireEvent,render,screen,cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext,type AuthContextType } from '@/contexts/AuthContext';
import { LearningProvider } from './LearningProvider';
import Practice from './Practice';
import { storageKey } from './storage';
import type { LessonSession } from './types';
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth:{getSession:vi.fn(async()=>({data:{session:null}}))}}}));
const context:AuthContextType={authState:{mode:'local',user:{id:'gabi',username:'Gábi'},profile:null,isLoading:false,isAuthenticated:true,error:null},signIn:async()=>{},signUp:async()=>{},signOut:async()=>{},cleanupAuthState:()=>{},setLocalUser:async()=>{}};
const mount=(subject:'math'|'english'='math',user='gabi')=>render(<MemoryRouter><AuthContext.Provider value={{...context,authState:{...context.authState,user:{id:user,username:user}}}}><LearningProvider><Practice subject={subject}/></LearningProvider></AuthContext.Provider></MemoryRouter>);
const session=()=>JSON.parse(localStorage.getItem(storageKey('gabi',false))!).sessions[0] as LessonSession;
beforeEach(()=>{cleanup();localStorage.clear();Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:function(){this.open=true;}});});
describe('production lesson controls and persistence',()=>{
  it('guards double submits in React and keeps the fifth answer in the summary',()=>{
    mount();fireEvent.click(screen.getByRole('button',{name:'5'}));fireEvent.click(screen.getByRole('button',{name:'Začít lekci'}));
    for(let i=0;i<5;i++){
      const current=session();fireEvent.change(screen.getByLabelText('Výsledek'),{target:{value:current.tasks[i].expected[0]}});
      const check=screen.getByRole('button',{name:'Zkontrolovat'});fireEvent.click(check);fireEvent.click(check);
      expect(session().attempts).toHaveLength(i+1);
      expect(check).toBeDisabled();
      fireEvent.click(screen.getByRole('button',{name:i===4?'Zobrazit výsledky':'Další úloha'}));
    }
    expect(screen.getByText('5 / 5')).toBeInTheDocument();expect(session().status).toBe('completed');expect(session().xp).toBe(75);
  });
  it('restores a paused session and isolates it from another profile',()=>{
    const first=mount();fireEvent.click(screen.getByRole('button',{name:'Začít lekci'}));fireEvent.click(screen.getByRole('button',{name:'Pauza'}));expect(session().phase).toBe('paused');first.unmount();
    const reloaded=mount();expect(screen.getByRole('heading',{name:'Chvilka na oddech.'})).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Pokračovat v lekci'}));expect(session().phase).toBe('answering');fireEvent.click(screen.getByRole('button',{name:'Pauza'}));fireEvent.click(screen.getByRole('button',{name:'Ukončit a zobrazit výsledky'}));expect(screen.getByRole('heading',{name:'Vrátíme se k tomu později.'})).toBeInTheDocument();reloaded.unmount();
    mount('math','misa');expect(screen.getByRole('button',{name:'Začít lekci'})).toBeInTheDocument();expect(localStorage.getItem(storageKey('gabi',false))).toBeTruthy();
  });
  it('does not reveal a bilingual answer on the front of an English card',()=>{
    mount('english');fireEvent.click(screen.getByRole('button',{name:'5'}));fireEvent.click(screen.getByRole('button',{name:'Začít lekci'}));const current=session();const task=current.tasks[0];if(task.subject!=='english')throw new Error('Expected English');
    expect(screen.queryByText(task.word.czech,{exact:true})).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:'Vím'})).not.toBeInTheDocument();
    for(let i=0;i<5;i++){fireEvent.click(screen.getByRole('button',{name:'Ukázat překlad'}));fireEvent.click(screen.getByRole('button',{name:'Vím'}));fireEvent.click(screen.getByRole('button',{name:i===4?'Zobrazit výsledky':'Další úloha'}));}
    expect(screen.getByText('5 / 5')).toBeInTheDocument();expect(session().attempts).toHaveLength(5);expect(session().attempts.every(a=>a.assessment==='self')).toBe(true);
  });
});

