import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../logo.svg';
import './Navigation.css'

const Navigation = props => (
    <header className="main-nav">
        <div className="main-nav__logo">
            <img src={logo} alt="React Logo" width="35" />
            <h1>  GraphQL Events</h1>
        </div>
        <nav className="main-nav__items">
            <ul>
                <li><NavLink to="/auth">Login</NavLink></li>
                <li><NavLink to="/events">Events</NavLink></li>
                <li><NavLink to="/bookings">Bookings</NavLink></li>
            </ul>
        </nav>
    </header>
)

export default Navigation;