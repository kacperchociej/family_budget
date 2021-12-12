import React, { Component } from "react";
import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";

export default class SharedPeople extends Component {
  constructor(props) {
    super(props);

    this.revoke = this.revoke.bind(this);

    this.state = {
      content: ''
    }
  }

  revoke(id) {
    BudgetService.revokeBudgetAccess(id).then(
      response => {
        window.location.reload();
      },
      error => {
        console.log(error.response.data);
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

  componentDidMount() {
    var id = this.props.budget_id;

    BudgetService.getSharedPeople(id).then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        console.log(error.response.data);
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

  render() {
    let { content } = this.state;

    return (
      <div>
        <h3>Shared users</h3>
        <hr/>
        {content && content.users.map(user => 
          <div key={user.user_id}>
          <div className="d-inline p-2">{user.username}</div>
            <button className="d-inline p-2 btn btn-outline-danger" onClick={() => this.revoke(user.access_id)}>Revoke</button>
          </div>
        )}
      </div>
    )
  }
}
