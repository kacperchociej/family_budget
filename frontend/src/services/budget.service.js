import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://0.0.0.0:8010/api/budgets/";

class BudgetService {
    getBudgets() {
      return axios.get(API_URL, { headers: authHeader() })
    }
    getBudgetsByUrl(url) {
      return axios.get(url, { headers: authHeader() })
    }
    getBudget() {}
    addBudget() {}
    removeBudget() {}
    shareBudget() {}
    getSharedPeople() {}
    revokeBudgetAccess() {}
    getSharedBudgets() {
      return axios.get(API_URL + 'shared/me/', { headers: authHeader() })
    }
    getSharedBudgetsByUrl(url) {
      return axios.get(url, { headers: authHeader() })
    }
}

export default new BudgetService();
