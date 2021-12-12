import React, { Component } from "react";
import BudgetService from "../services/budget.service";
import AuthService from "../services/auth.service";
import BudgetsTable from "./budgets/budgetstable.component"
import SharedBudgetsTable from "./budgets/sharedbudgetstable.component"

export default class Budgets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      budgets: '',
      sharedBudgets: ''
    };
  }

  render() {
    const user = localStorage.getItem('user');

    return (
      <div>
        {user && (
          <div className="container">
            <div className="row">
              <div className="col">
                <h3>My budgets</h3>
                <hr/>
                <BudgetsTable history={this.props.history} />
              </div>
              <div className="col">
                <h3>Shared with me</h3>
                <hr/>
                <SharedBudgetsTable history={this.props.history} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}