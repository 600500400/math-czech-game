import { Component, type ReactNode } from 'react';
export default class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<div className="learning-app"><main className="learn-main"><section className="learn-panel"><h1>Tahle stránka se nepodařila načíst.</h1><p>Uložené lekce zůstávají na zařízení. Zkus stránku načíst znovu.</p><button className="learn-button primary" onClick={()=>window.location.reload()}>Znovu načíst</button><a className="learn-button secondary" href="/">Vrátit se domů</a></section></main></div>:this.props.children;}
}
