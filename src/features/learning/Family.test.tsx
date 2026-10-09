import { beforeEach,afterEach,it,expect,vi } from 'vitest';
import { render,screen,fireEvent,cleanup,waitFor } from '@testing-library/react';
import { MemoryRouter,Routes,Route } from 'react-router-dom';
import { AuthContext,type AuthContextType } from '@/contexts/AuthContext';
import { FamilyProvider } from './family';
import { useFamily,type LearnerProfile } from './family-context';
import { LearningProvider } from './LearningProvider';
import { useLearning } from './context';
import Children from './Children';
import Practice from './Practice';
import Account from './Account';
import ConnectParent from './ConnectParent';
import { storageKey } from './storage';

const mock=vi.hoisted(()=>({profiles:[] as LearnerProfile[],draft:null as null|{learner_id:string;revision:number;payload:unknown},rpc:vi.fn(),signInWithOtp:vi.fn(),verifyOtp:vi.fn(),signInWithOAuth:vi.fn(),signInAnonymously:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{
 auth:{getSession:async()=>({data:{session:{user:{id:'parent'}}}}),signInWithOtp:mock.signInWithOtp,verifyOtp:mock.verifyOtp,signInWithOAuth:mock.signInWithOAuth,signInAnonymously:mock.signInAnonymously},rpc:mock.rpc,
 from:(table:string)=>{let single=false;let learner='parent';const builder={select:()=>builder,eq:(field:string,value:string)=>{if(['user_id','learner_id'].includes(field))learner=value;return builder;},in:()=>builder,not:()=>builder,is:()=>builder,maybeSingle:()=>{single=true;return builder;},upsert:()=>builder,then:(resolve:(v:unknown)=>void)=>Promise.resolve({data:single?(table==='user_levels'?{total_xp:learner==='parent'?275:0}:table==='learning_drafts'&&mock.draft?.learner_id===learner?mock.draft:null):[],error:null}).then(resolve)};return builder;},
}}));
const auth:AuthContextType={authState:{mode:'cloud',user:{id:'parent',username:'Kamil'},profile:null,isLoading:false,isAuthenticated:true,error:null},signIn:async()=>{},signUp:async()=>{},signOut:async()=>{},cleanupAuthState:()=>{},setLocalUser:async()=>{}};
const own:LearnerProfile={id:'parent',owner_id:'parent',name:'Kamil',kind:'self',access:'self'};
const child:LearnerProfile={id:'child',owner_id:'parent',name:'Gábi',kind:'child',access:'guardian'};
beforeEach(()=>{localStorage.clear();vi.stubEnv('VITE_EMAIL_LOGIN_ENABLED','true');mock.draft=null;mock.signInAnonymously.mockResolvedValue({error:null});sessionStorage.clear();mock.profiles=[own,child];mock.rpc.mockImplementation(async(name:string,args:Record<string,unknown>)=>({error:null,data:name==='my_learners'?mock.profiles:['get_learning_sessions','get_learner_words'].includes(name)?[]:name==='get_learning_badges'?{}:name==='add_child'?(mock.profiles=[...mock.profiles,{...child,id:'second',name:String(args.p_name)}]):{revision:1,conflict:false,payload:{sessions:[]}}}));mock.signInWithOtp.mockResolvedValue({error:null});mock.verifyOtp.mockResolvedValue({error:null});});
afterEach(()=>{cleanup();vi.unstubAllEnvs();});
function Controls(){const family=useFamily();const learning=useLearning();return <><p>Aktivní profil {family.active?.name}</p><p>Výukové ID {learning.learnerId}</p><button onClick={()=>family.select('child')}>Vybrat Gábi</button><button onClick={()=>family.select('parent')}>Vlastní učení</button><Practice subject="math"/></>;}
const mount=(view:React.ReactNode)=>(render(<MemoryRouter><AuthContext.Provider value={auth}><FamilyProvider><LearningProvider>{view}</LearningProvider></FamilyProvider></AuthContext.Provider></MemoryRouter>));
it('keeps parent and child lessons in their stable profile when switching and reopening on another device',async()=>{
 const first=mount(<Controls/>);await screen.findByText('Aktivní profil Kamil');fireEvent.click(screen.getByText('Vybrat Gábi'));await screen.findByText('Výukové ID child');fireEvent.click(screen.getByRole('button',{name:'Začít lekci'}));
 const saved=JSON.parse(localStorage.getItem(storageKey('child',true))!);expect(saved.sessions[0].learnerId).toBe('child');
 fireEvent.click(screen.getByText('Vlastní učení'));await screen.findByText('Výukové ID parent');expect(screen.getByRole('button',{name:'Začít lekci'})).toBeInTheDocument();first.unmount();
 mock.profiles=[{...child,access:'learner'}];mock.draft={learner_id:'child',revision:1,payload:{sessions:saved.sessions,preferences:saved.preferences}};localStorage.clear();mount(<Controls/>);await screen.findByText('Aktivní profil Gábi');expect(screen.getByText('Výukové ID child')).toBeInTheDocument();expect(screen.getByRole('heading',{name:/= \?/})).toBeInTheDocument();
});
it('creates a child without an account-type or family-name form',async()=>{
 mount(<Children/>);await screen.findByRole('heading',{name:'Moje děti'});fireEvent.change(screen.getByLabelText('Jméno dítěte'),{target:{value:'Eliška'}});fireEvent.click(screen.getByRole('button',{name:'Přidat dítě'}));await screen.findByRole('heading',{name:'Eliška'});expect(mock.rpc).toHaveBeenCalledWith('add_child',{p_name:'Eliška'});
});
it('does not show the parent dashboard to a linked child',async()=>{
 mock.profiles=[{...child,access:'learner'}];mount(<Children/>);await screen.findByRole('heading',{name:'Tvoje procvičování'});expect(screen.queryByLabelText('Jméno dítěte')).not.toBeInTheDocument();
});
it('offers Google and passwordless email without inactive providers or role selection',async()=>{
 render(<MemoryRouter><AuthContext.Provider value={{...auth,authState:{...auth.authState,mode:'local',user:null}}}><Routes><Route path="*" element={<Account/>}/></Routes></AuthContext.Provider></MemoryRouter>);
 expect(screen.queryByRole('button',{name:'Facebook'})).not.toBeInTheDocument();expect(screen.queryByLabelText('Typ profilu')).not.toBeInTheDocument();fireEvent.change(screen.getByLabelText('E-mail'),{target:{value:'test@example.com'}});fireEvent.click(screen.getByRole('button',{name:'Pokračovat e-mailem'}));await waitFor(()=>expect(mock.signInWithOtp).toHaveBeenCalled());await screen.findByLabelText('Kód z e-mailu');
});
it('allows a child device to request pairing without Google or email',async()=>{
 render(<MemoryRouter><AuthContext.Provider value={{...auth,authState:{...auth.authState,mode:'local',user:null}}}><Account/></AuthContext.Provider></MemoryRouter>);
 fireEvent.click(screen.getByRole('button',{name:'Mám kód od rodiče'}));fireEvent.click(screen.getByRole('button',{name:'Připojit zařízení bez Google a e-mailu'}));await waitFor(()=>expect(mock.signInAnonymously).toHaveBeenCalled());expect(sessionStorage.getItem('procvicka:pair')).toBe('true');
});
it('generates a device code next to the selected child and keeps it separate from siblings',async()=>{
 mock.profiles=[own,child,{...child,id:'sibling',name:'Míša'}];
 const original=mock.rpc.getMockImplementation()!;
 mock.rpc.mockImplementation(async(name,args)=>name==='issue_learner_invite'?{error:null,data:{code:'ABCDEF123456',expires_at:'2026-10-09T12:00:00Z'}}:original(name,args));
 mount(<Children/>);await screen.findByRole('heading',{name:'Gábi'});
 fireEvent.click(screen.getAllByRole('button',{name:'Vytvořit kód pro dítě'})[0]);
 await screen.findByText('ABCDEF123456');expect(mock.rpc).toHaveBeenCalledWith('issue_learner_invite',{p_learner_id:'child'});
 expect(screen.getByRole('heading',{name:'Kód pro Gábi'})).toBeInTheDocument();expect(screen.queryByRole('heading',{name:'Kód pro Míša'})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Skrýt kód'}));expect(screen.queryByText('ABCDEF123456')).not.toBeInTheDocument();
});
it('offers a visible parent-link code and preserves the existing learner identity',async()=>{
 const original=mock.rpc.getMockImplementation()!;
 mock.rpc.mockImplementation(async(name,args)=>name==='issue_learner_invite'?{error:null,data:{code:'123456ABCDEF',expires_at:'2026-10-09T12:00:00Z'}}:original(name,args));
 mount(<ConnectParent/>);fireEvent.click(await screen.findByRole('button',{name:'Vytvořit kód pro rodiče'}));
 await screen.findByText('123456ABCDEF');expect(mock.rpc).toHaveBeenCalledWith('issue_learner_invite',{p_learner_id:'parent',p_purpose:'guardian'});
 expect(screen.getByRole('button',{name:'Kopírovat kód'})).toBeInTheDocument();expect(mock.rpc).not.toHaveBeenCalledWith('add_child',expect.anything());
});
it('shows a failed code generation and allows retry instead of displaying a fake code',async()=>{
 const original=mock.rpc.getMockImplementation()!;
 mock.rpc.mockImplementation(async(name,args)=>name==='issue_learner_invite'?{error:{message:'Připojení se nezdařilo.'},data:null}:original(name,args));
 mount(<ConnectParent/>);fireEvent.click(await screen.findByRole('button',{name:'Vytvořit kód pro rodiče'}));
 await screen.findByText('Připojení se nezdařilo.');expect(screen.getByRole('button',{name:'Vytvořit kód pro rodiče'})).toBeEnabled();expect(screen.queryByRole('button',{name:'Kopírovat kód'})).not.toBeInTheDocument();
});
