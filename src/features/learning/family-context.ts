import {createContext,useContext} from 'react';
export interface LearnerProfile { id:string;owner_id:string;name:string;kind:'self'|'child';access:'self'|'guardian'|'learner' }
export interface FamilyValue {profiles:LearnerProfile[];active:LearnerProfile|null;loading:boolean;error:string;refresh:()=>Promise<void>;select:(id:string)=>void}
export const FamilyContext=createContext<FamilyValue>({profiles:[],active:null,loading:false,error:'',refresh:async()=>{},select:()=>{}});
export const useFamily=()=>useContext(FamilyContext);
