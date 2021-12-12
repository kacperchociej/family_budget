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
    getBudget(id) {
      return axios.get(API_URL + id, { headers: authHeader() })
    }
    addBudget() {

    }
    removeBudget(id) {
      return axios.delete(API_URL + id + '/', { headers: authHeader() })
    }
    shareBudget(id, user) {
      return axios.post(API_URL + id + '/share/', {user: user}, { headers: authHeader() })
    }
    revokeBudgetAccess(id) {
      return axios.delete(API_URL + 'revoke/' + id + '/', { headers: authHeader() })
    }
    getSharedPeople(id) {
      return axios.get(API_URL + id + '/shared', { headers: authHeader() })
    }
    getSharedBudget(id) {
      return axios.get(API_URL + 'shared/me/' + id, { headers: authHeader() })
    }
    getSharedBudgets() {
      return axios.get(API_URL + 'shared/me/', { headers: authHeader() })
    }
    getSharedBudgetsByUrl(url) {
      return axios.get(url, { headers: authHeader() })
    }
}

export default new BudgetService();
