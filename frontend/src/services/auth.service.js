import axios from "axios";

const API_URL = "http://0.0.0.0:8010/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login/', {
        username,
        password,
      })
      .then(response => {
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        if (response.data.access) {
          localStorage.setItem('access', JSON.stringify(response.data.access));
        }
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
        }

        return response.data;
      });
  }

  refresh() {
    let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    
    // not enough time to add rotation to the frontend ;/

    return axios.post(API_URL + 'refresh/', {refresh_token: refresh_token})
    .then(response => {
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.access) {
        localStorage.setItem('access', JSON.stringify(response.data.access));
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
      }

      return response.data;
    })
  }

  register(username, password, password2) {
    return axios.post(API_URL + 'register/', {
      username,
      password,
      password2
    })
    .then(response => {
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.access) {
        localStorage.setItem('access', JSON.stringify(response.data.access));
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
      }

      return response.data;
    });
  }

  logout() {
    return axios
      .post(API_URL + 'logout/', {
        'refresh_token': JSON.parse(localStorage.getItem('refresh_token'))
      })
      .then(response => {
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh_token');
      })
      .catch(error => {
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh_token');
      });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();