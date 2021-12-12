export default function authHeader() {
    const access = JSON.parse(localStorage.getItem('access'));
  
    if (access) {
      return { Authorization: 'Bearer ' + access };
    } else {
      return {};
    }
  }