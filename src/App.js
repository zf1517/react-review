import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Switch,Link } from 'react-router-dom';
import TestContext from './pages/context/index';
import TestRef from './pages/ref/index';

function App() {
  return (
    <div className="App">
      <Link to='/context'>context</Link> 
      <Link to='/ref'>ref</Link> 
      <Switch>
        <Route path="/context" component={TestContext} />
        <Route path="/ref" component={TestRef} />
      </Switch>
    </div>
  );
}

export default App;
