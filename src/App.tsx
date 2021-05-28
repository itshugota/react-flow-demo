import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './App.css'
import Sidebar from './components/sidebar/Sidebar';
import Workflow from './components/Workflow';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#222267',
      main: '#000034',
      dark: '#000012',
    },
    text: {
      primary: '#000034',
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          {/* <div style={{ position: 'fixed', zIndex: 1000, right: 64, bottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <a href="/">1. Workflow with editable anchors</a>
          </div> */}
          <Switch>
            <Route path="/">
              <Sidebar />
              <Workflow />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
