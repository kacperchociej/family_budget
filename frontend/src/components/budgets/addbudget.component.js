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

export default class AddBudget extends Component {
  constructor(props) {
    super(props);

    this.handleAddBudget = this.handleAddBudget.bind(this);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);

    this.onChangeIncomeWho = this.onChangeIncomeWho.bind(this);
    this.onChangeIncomeCategory = this.onChangeIncomeCategory.bind(this);
    this.onChangeIncomeAmount = this.onChangeIncomeAmount.bind(this);

    this.onChangeExpenseWhat = this.onChangeExpenseWhat.bind(this);
    this.onChangeExpenseCategory = this.onChangeExpenseCategory.bind(this);
    this.onChangeExpenseAmount = this.onChangeExpenseAmount.bind(this);

    this.handleAddIncome = this.handleAddIncome.bind(this);
    this.handleAddExpense = this.handleAddExpense.bind(this);

    this.state = {
      name: '',
      month: 'January',
      year: 2000,
      incomeWho: '',
      incomeCategory: 0,
      incomeAmount: 0,
      incomes: [],
      expenseWhat: '',
      expenseCategory: 0,
      expenseAmount: 0,
      expenses: [],
      incomeCategories: [],
      expenseCategories: [],
      message: ''
    }
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    })
  }

  onChangeMonth(e) {
    this.setState({
      month: e.target.value
    })
  }

  onChangeYear(e) {
    this.setState({
      year: e.target.value
    })
  }

  handleAddBudget(e) {
    e.preventDefault();

    this.setState({
      message: ''
    });

    this.form1.validateAll();

    if (this.checkBtn1.context._errors.length === 0) {
      let { name, month, year, incomes, expenses } = this.state;
      let data = {
        name: name,
        month: month,
        year: year,
        incomes: incomes,
        expenses: expenses
      };

      BudgetService.addBudget(data).then(
        response => {
          this.props.history.push('/budgets');
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

  onChangeIncomeWho(e) {
    this.setState({
      incomeWho: e.target.value
    })
  }

  onChangeIncomeCategory(e) {
    this.setState({
      incomeCategory: e.target.value
    })
  }

  onChangeIncomeAmount(e) {
    this.setState({
      incomeAmount: e.target.value
    })
  }

  handleAddIncome(e) {
    e.preventDefault();

    this.setState({
      message: ''
    });

    this.form2.validateAll();

    if (this.checkBtn2.context._errors.length === 0) {
      let category = this.state.incomeCategories[this.state.incomeCategory];
      let item = {
        who: this.state.incomeWho,
        category: category.pk,
        amount: this.state.incomeAmount
      }
      this.setState({ incomes: [...this.state.incomes, item] });
    }
  }

  onChangeExpenseWhat(e) {
    this.setState({
      expenseWhat: e.target.value
    })
  }

  onChangeExpenseCategory(e) {
    this.setState({
      expenseCategory: e.target.value
    })
  }

  onChangeExpenseAmount(e) {
    this.setState({
      expenseAmount: e.target.value
    })
  }

  handleAddExpense(e) {
    e.preventDefault();

    this.setState({
      message: ''
    });

    this.form3.validateAll();

    if (this.checkBtn3.context._errors.length === 0) {
      let category = this.state.expenseCategories[this.state.expenseCategory];
      let item = {
        name: this.state.expenseWhat,
        category: category.pk,
        amount: this.state.expenseAmount
      }
      this.setState({ expenses: [...this.state.expenses, item] });
    }
  }

  componentDidMount() {
    BudgetService.getIncomeCategories().then(
      response => {
        this.setState({
          incomeCategories: response.data
        })
      },
      error => {
        const message = JSON.stringify(error.response.data.detail) ||
          JSON.stringify(error.response.data) || 
          error.message || error.toString();

          this.setState({
              message: message
          })
      }
    );

    BudgetService.getExpenseCategories().then(
      response => {
        this.setState({
          expenseCategories: response.data
        })
      },
      error => {
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
    let { message } = this.state;

    return (
      <div className="row">
        <div className="col">
          <Form onSubmit={this.handleAddBudget} ref={c => this.form1 = c}>
            <h3>Create new budget</h3><hr/>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">{this.state.message}</div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Input type="text" className="form-control" name="name" value={this.state.name} onChange={this.onChangeName} validations={[required]}>
              </Input>
            </div>

            <div className="form-group">
              <label htmlFor="month">Month</label>
              <Input type="text" className="form-control" name="month" value={this.state.month} onChange={this.onChangeMonth} validations={[required]}>
              </Input>
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <Input type="number" className="form-control" name="year" value={this.state.year} onChange={this.onChangeYear} validations={[required]}>
              </Input>
            </div>

            <h5>Added incomes:</h5>
            {this.state.incomes.length === 0 ? (
              <p><i>No incomes added. Use form to add incomes.</i></p>
            ) : (
              <ul>
              {this.state.incomes && this.state.incomes.map((income, i) => 
                <li key={i}>Who: {income.who} | category: {income.category} | amount: {income.amount}.</li>
              )}
              </ul>
            )}
            <h5>Added expenses:</h5>
            {this.state.expenses.length === 0 ? (
              <p><i>No expenses added. Use form to add expenses.</i></p>
            ) : (
              <ul>
              {this.state.expenses && this.state.expenses.map((expense, i) => 
                <li key={i}>What: {expense.name} | category: {expense.category} | amount: {expense.amount}.</li>
              )}
              </ul>
            )}

            <div className="form-group">
              <button className="btn btn-primary w-100">Create budget</button>
            </div>

            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn1 = c;
              }}
            />
          </Form>
        </div>

        <div className="col">
          <Form onSubmit={this.handleAddIncome} ref={c => this.form2 = c}>
            <h3>Add new income</h3><hr/>

            <div className="form-group">
              <label htmlFor="incomeWho">Who</label>
              <Input type="text" className="form-control" name="incomeWho" value={this.state.incomeWho} onChange={this.onChangeIncomeWho} validations={[required]}>
              </Input>
            </div>
            <div className="form-group">
              <label htmlFor="incomeCategory">Category</label>
              <select className="form-control" name="incomeCategory" value={this.state.incomeCategory} onChange={this.onChangeIncomeCategory} validations={[required]}>
                {this.state.incomeCategories && this.state.incomeCategories.map((category, i) => 
                  <option key={category.pk} value={i}>{category.name}</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="incomeAmount">Amount</label>
              <Input type="number" className="form-control" name="incomeAmount" value={this.state.incomeAmount} onChange={this.onChangeIncomeAmount} validations={[required]}>
              </Input>
            </div>
            <br/>

            <div className="form-group">
              <button className="btn btn-outline-success w-100">Add income</button>
            </div>

            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn2 = c;
              }}
            />
          </Form><br/>
          <Form onSubmit={this.handleAddExpense} ref={c => this.form3 = c}>
            <h3>Add new expense</h3><hr/>

            <div className="form-group">
              <label htmlFor="expenseWhat">What</label>
              <Input type="text" className="form-control" name="expenseWhat" value={this.state.expenseWhat} onChange={this.onChangeExpenseWhat} validations={[required]}>
              </Input>
            </div>
            <div className="form-group">
              <label htmlFor="expenseCategory">Category</label>
              <select className="form-control" name="expenseCategory" value={this.state.expenseCategory} onChange={this.onChangeExpenseCategory} validations={[required]}>
                {this.state.expenseCategories && this.state.expenseCategories.map((category, i) => 
                  <option key={category.pk} value={i}>{category.name}</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expenseAmount">Amount</label>
              <Input type="number" className="form-control" name="expenseAmount" value={this.state.expenseAmount} onChange={this.onChangeExpenseAmount} validations={[required]}>
              </Input>
            </div>
            <br/>

            <div className="form-group">
              <button className="btn btn-outline-success w-100">Add expense</button>
            </div>

            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn3 = c;
              }}
            />
          </Form>
        </div>
      </div>
    )
  }
}
