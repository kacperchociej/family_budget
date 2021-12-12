import './App.css';

import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


import AuthService from "./services/auth.service";

import Budgets from "./components/budgets.component";
import Login from "./components/login.component";
import Logout from "./components/logout.component";
import Register from "./components/register.component";
import ShowSharedBudget from './components/budgets/showsharedbudget.component';
import ShowBudget from './components/budgets/showbudget.component';

class App extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);

    this.state = {
      user: undefined
    };
  }
  
  logout() {
    AuthService.logout();
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    this.setState({
      user: user
    });
  }

  render() {
    const { user } = this.state;

    return (
      <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: '#e3f2fd'}}>
          <div className="container">
            <Link to={"/"} className="navbar-brand">Family budget</Link>

            <div className="navbar-nav mr-auto">
              {user && (
                <li className="nav-item">
                  <Link to={"/budgets"} className="nav-link">Budgets</Link>
                </li>
              )}
            </div>

            {user ? (
              <div className="navbar-nav ml-auto">
                <span className="navbar-text">Hi, {user}.</span>
                <li className="nav-item">
                  <Link to={"/logout"} className="nav-link">Logout</Link>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">Register</Link>
                </li>
              </div>
            )}
          </div>
        </nav>

        <br/>
        
        <div className="container">
          <div className="jumbotron">
            <Route path='/budgets' component={Budgets}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/register" component={Register} />
            <Route path="/shared/:id" component={ShowSharedBudget} />
            <Route path="/budget/:id" component={ShowBudget} />
          </div>
        </div>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
