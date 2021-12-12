import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">This field is required!</div>
    );
  }
};

export default class Register extends Component {
    constructor(props) {
      super(props);

      this.handleRegister = this.handleRegister.bind(this);
      this.onChangeUsername = this.onChangeUsername.bind(this);
      this.onChangePassword = this.onChangePassword.bind(this);
      this.onChangePassword2 = this.onChangePassword2.bind(this);

      this.state = {
        username: '',
        password: '',
        password2: '',
        message: ''
      }
    }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  onChangePassword2(e) {
    this.setState({
      password2: e.target.value
    })
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: ''
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(this.state.username, this.state.password, this.state.password2)
      .then(() => {
          this.props.history.push('/');
          window.location.reload();
        },
        error => {
          const message = JSON.stringify(error.response.data.non_field_errors) || 
          JSON.stringify(error.response.data.detail) ||
          JSON.stringify(error.response.data) || 
          error.message || error.toString();

          this.setState({
            message: message
          })
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-4 offset-md-4">
        <div className="card card-container">
          <div className="card-body">
            <h3 className="card-title">Register</h3>

            <Form onSubmit={this.handleRegister} ref={c => this.form = c}>
              {this.state.message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">{this.state.message}</div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input type="text" className="form-control" name="username" value={this.state.username} onChange={this.onChangeUsername} validations={[required]}>
                </Input>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input type="password" className="form-control" name="password" value={this.state.password} onChange={this.onChangePassword} validations={[required]}>
                </Input>
              </div>

              <div className="form-group">
                <label htmlFor="password">Repeat password</label>
                <Input type="password" className="form-control" name="password2" value={this.state.password2} onChange={this.onChangePassword2} validations={[required]}>
                </Input>
              </div>
              <br/>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Register</button>
              </div>

              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        </div>
      </div>
    )
  }
    
}