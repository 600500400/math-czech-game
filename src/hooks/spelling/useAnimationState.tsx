import { useCallback,useEffect,useRef,useState } from 'react';
export function useAnimationState(){
 const [lastAnswerCorrect,setLastAnswerCorrect]=useState<boolean|null>(null);
 const [showAnimation,setShowAnimation]=useState(false);
 const [animationId,setAnimationId]=useState(0);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const active=useRef(false),generation=useRef(0),forceCleanup=useRef<(()=>void)|null>(null);
 const clear=useCallback(()=>{if(timer.current!==null)clearTimeout(timer.current);timer.current=null;generation.current++;},[]);
 useEffect(()=>()=>{clear();active.current=false;},[clear]);
 const emergencyCleanup=useCallback(()=>{clear();setShowAnimation(false);setLastAnswerCorrect(null);active.current=false;setAnimationId(generation.current);forceCleanup.current?.();},[clear]);
 const setShowAnimationSafe=useCallback((value:boolean)=>{clear();active.current=value;setShowAnimation(value);setAnimationId(generation.current);},[clear]);
 const scheduleAnimationHide=useCallback((delay=1500)=>{if(timer.current!==null)clearTimeout(timer.current);const token=generation.current;timer.current=setTimeout(()=>{if(token===generation.current){setShowAnimation(false);setLastAnswerCorrect(null);active.current=false;timer.current=null;}},delay);},[]);
 return {lastAnswerCorrect,showAnimation,animationId,setLastAnswerCorrect,setShowAnimation:setShowAnimationSafe,scheduleAnimationHide,resetAnimation:emergencyCleanup,emergencyCleanup,registerForceCleanup:(cleanup:()=>void)=>{forceCleanup.current=cleanup;},isAnimationActive:()=>active.current};
}

