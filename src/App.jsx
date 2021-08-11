import React, { useEffect, useState } from 'react';
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
import { initializeReactFlowyStore } from 'react-flowy/lib';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#222267',
      main: '#000034',
      dark: '#000012',
    },
    text: {
      primary: '#000034',
    },
  },
});

function App() {
  const [storeId, setStoreId] = useState();

  useEffect(() => {
    const id = initializeReactFlowyStore();

    setStoreId(id);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <div className="App">
            <Switch>
              <Route path="/">
                {storeId &&
                  <>
                    <Sidebar storeId={storeId} />
                    <Toolbar storeId={storeId} />
                    <Workflow storeId={storeId} />
                  </>
                }
              </Route>
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
