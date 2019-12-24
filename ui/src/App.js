import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import Navigation from './components/Navigation/Navigation';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import AuthContext from './context/auth-context';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('RG-Events-Token'));
  const [userId, setUserId] = useState(sessionStorage.getItem('RG-Events-UserId'));

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    sessionStorage.setItem('RG-Events-Token', token)
    sessionStorage.setItem('RG-Events-UserId', token)
  }

  const logout = () => {
    setToken(null);
    setUserId(null);
    sessionStorage.removeItem('RG-Events-Token')
    sessionStorage.removeItem('RG-Events-UserId')
  }

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider value={{ token, userId, login, logout }}>
          <Navigation />
          <main className="main-content">
            <Switch>
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}

              {!token && <Redirect to="/auth" exact />}
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
