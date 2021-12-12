import React, { Component } from "react";
import BudgetService from "../../services/budget.service";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";

export default class SharedBudgetsTable extends Component {
  constructor(props) {
    super(props);

    this.onClickPreviousNext = this.onClickPreviousNext.bind(this);

    this.onChangeBudgetUsername = this.onChangeBudgetUsername.bind(this);
    this.onChangeBudgetMonth = this.onChangeBudgetMonth.bind(this);
    this.onChangeBudgetYear = this.onChangeBudgetYear.bind(this);
    this.handleFilterBudgets = this.handleFilterBudgets.bind(this);

    this.state = {
      sharedBudgets: '',
      budgetUsername: '',
      budgetMonth: '',
      budgetYear: null
    };
  }

  onChangeBudgetUsername(e) {
    this.setState({
      budgetUsername: e.target.value
    })
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
    let { budgetUsername, budgetMonth, budgetYear } = this.state;
    if (budgetUsername) {
      params.push('username=' + budgetUsername);
    }
    if (budgetMonth) {
      params.push('month=' + budgetMonth);
    }
    if (budgetYear) {
      params.push('year=' + budgetYear);
    }
    params = '?' + params.join('&')
    
    BudgetService.getSharedBudgets(params).then(
      response => {
        this.setState({
          sharedBudgets: response.data
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
    BudgetService.getSharedBudgets('').then(
      response => {
        this.setState({
          sharedBudgets: response.data
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

  onClickPreviousNext(url) {
    let access = localStorage.getItem('access');
    
    if (access) {
      BudgetService.getSharedBudgetsByUrl(url).then(
        response => {
          this.setState({
            sharedBudgets: response.data
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

  render() {
    const { sharedBudgets } = this.state;
    const results = sharedBudgets.results;
    
    return (
        <div>
          <h5>Filters</h5>
          <div>
            <span className="d-inline">User</span>&nbsp;
            <input type="text" name="budgetUsername" style={{width: "100px"}} value={this.state.budgetUsername} onChange={this.onChangeBudgetUsername} >
            </input>&nbsp;
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
                <th>Shared by</th>
                <th>Shared at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              { results && sharedBudgets.results.map(shared =>
                <tr key={shared.pk}>
                  <td>{shared.budget.name}</td>
                  <td>{shared.budget.month}</td>
                  <td>{shared.budget.year}</td>
                  <td>{shared.shared_by}</td>
                  <td>{new Date(shared.granted_at).toLocaleTimeString() + ' ' + new Date(shared.granted_at).toLocaleDateString()}</td>
                  <td>
                      <Link to={"shared/" + shared.pk} className="btn btn-outline-primary btn-sm">Show</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="container">
            {sharedBudgets.count !== null && <p>Total: {sharedBudgets.count} elements.</p>}
            <div className="btn-group" role="group" aria-label="Basic example">
              {sharedBudgets.previous && <button type="button" className="btn btn-secondary" onClick={() => this.onClickPreviousNext(sharedBudgets.previous)}>Prev</button>}
              {sharedBudgets.next && <button type="button" className="btn btn-secondary" onClick={() => this.onClickPreviousNext(sharedBudgets.next)}>Next</button>}
            </div>
          </div>
        </div>
      );
  }
}
