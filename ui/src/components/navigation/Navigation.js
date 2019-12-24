import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../logo.svg';
import AuthContext from '../../context/auth-context';
import './Navigation.css'

const Navigation = props => (
  <AuthContext.Consumer>
    {
      value => (
        <header className="main-nav">
          <div className="main-nav__logo">
            <img src={logo} alt="React Logo" width="35" />
            <h1> GraphQL Events</h1>
          </div>
          <nav className="main-nav__items">
            <ul>
              <li><NavLink to="/events">Events</NavLink></li>
              {value.token && (
                <React.Fragment>
                  <li><NavLink to="/bookings">Bookings</NavLink></li>
                  <li><a onClick={value.logout}>Logout</a></li>
                </React.Fragment>
              )
              }
              {!value.token && <li><NavLink to="/auth">Login</NavLink></li>}
            </ul>
          </nav>
        </header>
      )
    }
  </AuthContext.Consumer>
)

export default Navigation;