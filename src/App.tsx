import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.css'
import StressFlow from './components/StressFlow';
import Workflow from './components/Workflow'
import WorkflowWithWaypoints from './components/WorkflowWithWaypoints';
import WorkflowWithEditableAnchors from './components/WorkflowWithEditableAnchors';

function App() {
  return (
    <Router>
      <div className="App">
        <div style={{ position: 'fixed', zIndex: 1000, right: 64, bottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <a href="/anchors">1. Workflow with editable anchors</a>
        </div>
        <Switch>
          <Route path="/anchors">
            <WorkflowWithEditableAnchors />
          </Route>
          <Route path="/waypoints">
            <WorkflowWithWaypoints />
          </Route>
          <Route path="/stress">
            <StressFlow />
          </Route>
          <Route path="/">
            <Workflow />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
