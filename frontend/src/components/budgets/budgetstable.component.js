import React, { Component } from "react";
import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import Input from "react-validation/build/input";

export default class BudgetsTable extends Component {
  constructor(props) {
    super(props);

    this.onClickPreviousNext = this.onClickPreviousNext.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.onChangeBudgetMonth = this.onChangeBudgetMonth.bind(this);
    this.onChangeBudgetYear = this.onChangeBudgetYear.bind(this);
    this.handleFilterBudgets = this.handleFilterBudgets.bind(this);

    this.state = {
      budgets: '',
      filter: '',
      budgetMonth: '',
      budgetYear: null
    };
  }

  onChangeBudgetMonth(e) {
    this.setState({
      budgetMonth: e.target.value
    })
  }

  onChangeBudgetYear(e) {
    this.setState({
      budgetYear: e.target.value
    })
  }

  handleFilterBudgets() {
    let params = [];
    let { budgetMonth, budgetYear } = this.state;
    if (budgetMonth) {
      params.push('month=' + budgetMonth);
    }
    if (budgetYear) {
      params.push('year=' + budgetYear);
    }
    params = '?' + params.join('&')

    BudgetService.getBudgets(params).then(
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

  componentDidMount() {
    BudgetService.getBudgets('').then(
      response => {
        this.setState({
          budgets: response.data
        });
      },
      error => {
        if (error.response.data.code === 'token_not_valid') {
          AuthService.logout().then(() => {
            this.props.history.push('/login');
            window.location.reload();
          })
        }
      }
    );
  }

  onClickPreviousNext(url) {
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
        <h5>Filters</h5>
        <div>
          <span className="d-inline">Month</span>&nbsp;
          <input type="text" name="budgetMonth" style={{width: "100px"}} value={this.state.budgetMonth} onChange={this.onChangeBudgetMonth} >
          </input>&nbsp;
          <span className="d-inline">Year</span>&nbsp;
          <input type="number" name="budgetYear" style={{width: "100px"}} value={this.state.budgetYear} onChange={this.onChangeBudgetYear} >
          </input>&nbsp;
          <button className="btn btn-outline-success btn-sm" onClick={this.handleFilterBudgets}>Filter</button>
        </div>
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
