import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './App.css'
import Sidebar from './components/sidebar/Sidebar';
import Workflow from './components/Workflow';
import Toolbar from './components/toolbar/Toolbar';

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
      <SnackbarProvider maxSnack={3}>
        <Router>
          <div className="App">
            <Switch>
              <Route path="/">
                <Sidebar />
                <Toolbar />
                <Workflow />
              </Route>
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
