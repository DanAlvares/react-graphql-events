import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchHandler = () => {
    this.setState({ isLogin: !this.state.isLogin });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (!email.trim().length || !password.length) {
      return;
    }

    let reqBody = {
      query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
      variables: { email, password }
    }

    if (!this.state.isLogin) {
      reqBody = {
        query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
        variables: {
          email, password
        }
      }
    }

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(res => {
      if (res.data.login.token) {
        const { token, userId, tokenExpiration } = res.data.login;
        console.log(this.context)
        this.context.login(token, userId, tokenExpiration);
      }
    }).catch(console.error)
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h2>{this.state.isLogin ? 'Login' : 'Sign up'}</h2>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={this.switchHandler}>Switch to {!this.state.isLogin ? 'Login' : 'Sign up'}</button>
          <button type="submit">{this.state.isLogin ? 'Login' : 'Sign up'}</button>
        </div>
      </form>
    )
  }
}

export default AuthPage; 