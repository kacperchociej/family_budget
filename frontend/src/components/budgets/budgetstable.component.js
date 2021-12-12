import React, { Component } from "react";
import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";

export default class BudgetsTable extends Component {
  constructor(props) {
    super(props);

    this.onClickPreviousNext = this.onClickPreviousNext.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      budgets: ''
    };
  }

  componentDidMount() {
    let access = localStorage.getItem('access');
    
    if (access) {
      BudgetService.getBudgets().then(
        response => {
          this.setState({
            budgets: response.data
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
        }
      );
    }
  }

  onClickPreviousNext(url) {
    let access = localStorage.getItem('access');
    
    if (access) {
      BudgetService.getBudgetsByUrl(url).then(
        response => {
          this.setState({
            budgets: response.data
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
        }
      );
    }
  }

  handleDelete(id) {
    BudgetService.removeBudget(id).then(
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
      }
    );
  }

  render() {
    const { budgets } = this.state;
    const results = budgets.results;
    
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Month</th>
              <th>Year</th>
              <th>Incomes</th>
              <th>Expenses</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { results && budgets.results.map(budget =>
              <tr key={budget.pk}>
                <td>{budget.name}</td>
                <td>{budget.month}</td>
                <td>{budget.year}</td>
                <td>{budget.incomes.length}</td>
                <td>{budget.expenses.length}</td>
                <td>{new Date(budget.created_at).toLocaleTimeString() + ' ' + new Date(budget.created_at).toLocaleDateString()}</td>
                <td>
                  <Link to={"budget/" + budget.pk} className="btn btn-outline-primary btn-sm">Show</Link>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => this.handleDelete(budget.pk)}>Delete</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="container">
          {budgets.count !== null && <p>Total: {budgets.count} elements.</p>}
          <div className="btn-group" role="group" aria-label="Basic example">
            {budgets.previous && <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.onClickPreviousNext(budgets.previous)}>Prev</button>}
            {budgets.next && <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.onClickPreviousNext(budgets.next)}>Next</button>}
          </div>
        </div>
      </div>
    );
  }
}
