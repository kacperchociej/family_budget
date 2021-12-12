import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">This field is required!</div>
    );
  }
};

export default class ShareBudget extends Component {
  constructor(props) {
    super(props);

    this.handleShare = this.handleShare.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);

    this.state = {
      username: '',
      message: ''
    }
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  handleShare(e) {
    e.preventDefault();

    this.setState({
      message: ''
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      let username = this.state.username;
      var id = this.props.budget_id;

      BudgetService.shareBudget(id, username).then(
        response => {
          window.location.reload();
        },
        error => {
          if (error.response.data.code === 'token_not_valid') {
            AuthService.logout().then(() => {
              this.props.history.push('/login');
              window.location.reload();
            })
          }
          const message = JSON.stringify(error.response.data.detail) ||
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
      <div>
        <h3>Share with user</h3>
        <hr/>
        <Form className="w-25" onSubmit={this.handleShare} ref={c => this.form = c}>
        {this.state.message && (
          <div className="form-group">
          <div className="alert alert-danger" role="alert">{this.state.message}</div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Enter username to share</label>
          <Input type="text" className="form-control" name="username" value={this.state.username} onChange={this.onChangeUsername} validations={[required]}>
          </Input>
        </div>
        <br/>

        <div className="form-group">
          <button className="btn btn-primary btn-block">Share</button>
        </div>

        <CheckButton
          style={{ display: "none" }}
          ref={c => {
          this.checkBtn = c;
          }}
        />
        </Form>
      </div>
    )
  }
}
