import React, { Component } from "react";
import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";
import SharedPeople from "./budgetsharedwith.component";

export default class ShowBudget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      message: ''
    }
  }

  componentDidMount() {
    var id = this.props.match.params.id;

    BudgetService.getBudget(id).then(
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
    let budget = content;

    return (
      <div>
        {message ? (
          <div className="alert alert-danger" role="alert">{message}</div>
        ) : (
          <div className="container">
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
                      <tr key={income.pk}>
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
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    { budget.expenses && budget.expenses.map(expense => 
                      <tr key={expense.pk}>
                        <td>{expense.name}</td>
                        <td>{expense.category}</td>
                        <td>{expense.amount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <SharedPeople history={this.props.history} budget_id={budget.pk}/>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}