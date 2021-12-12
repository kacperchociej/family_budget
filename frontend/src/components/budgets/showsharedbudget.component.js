import React, { Component } from "react";
import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";

export default class ShowSharedBudget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      message: ''
    }
  }

  componentDidMount() {
    let access = localStorage.getItem('access');
    var id = this.props.match.params.id;

    BudgetService.getSharedBudget(id).then(
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
    let { content, message } = this.state;
    let time = new Date(content.granted_at).toLocaleTimeString();
    let date = new Date(content.granted_at).toLocaleDateString();
    let budget = content.budget;

    return (
      <div>
        {message ? (
          <div className="alert alert-danger" role="alert">{message}</div>
        ) : (
          <div className="container">
            <h3>Budget access</h3>
            <hr/>
            <p>Shared by: <b>{content.shared_by}</b></p>
            <p>Granted at: <b>{time + ' ' + date}</b></p>
            <br/>

            {budget && (
              <div>
                <h3>Budget details</h3>
                <hr/>
                <p>Name: <b>{budget.name}</b></p>
                <p>Month: <b>{budget.month}</b></p>
                <p>Year: <b>{budget.year}</b></p>
                <p>Total income: <b>{budget.total_income}</b></p>
                <p>Total expense: <b>{budget.total_expense}</b></p>
                <p>Balance: <b>{budget.total_income - budget.total_expense}</b></p>
                <p>Created at: <b>{
                  new Date(budget.created_at).toLocaleTimeString() + ' ' + new Date(budget.created_at).toLocaleDateString()
                }</b></p>

                <h3>Incomes</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Who</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    { budget.incomes && budget.incomes.map(income => 
                      <tr>
                        <td>{income.who}</td>
                        <td>{income.category}</td>
                        <td>{income.amount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <h3>Expenses</h3>
                <table className="table">
                  <thead>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </thead>
                  <tbody>
                    { budget.expenses && budget.expenses.map(expense => 
                      <tr>
                        <td>{expense.name}</td>
                        <td>{expense.category}</td>
                        <td>{expense.amount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}