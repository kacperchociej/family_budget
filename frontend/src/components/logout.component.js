import React, { Component } from "react";

import AuthService from "../services/auth.service";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AuthService.logout()
    .then(() => {
      this.props.history.push('/login');
      window.location.reload();
    });
  }

  render() {
    return (<div></div>)
  }
}