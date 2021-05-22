import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.css'
import Sidebar from './components/sidebar/Sidebar';
import WorkflowWithEditableAnchors from './components/WorkflowWithEditableAnchors';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <div style={{ position: 'fixed', zIndex: 1000, right: 64, bottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <a href="/">1. Workflow with editable anchors</a>
        </div> */}
        <Switch>
          <Route path="/">
            <Sidebar />
            <WorkflowWithEditableAnchors />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
