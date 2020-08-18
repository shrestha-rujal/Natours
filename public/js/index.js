import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateCredentials } from './accountSettings';

// DOM ELEMENTS
const mapBoxElement = document.getElementById('map');
const loginFormElement = document.querySelector('#login-form');
const logoutBtn = document.getElementById('logout-btn');
const profileFormElement = document.querySelector('#profile-form');

// DELEGATION

if (mapBoxElement) {
  const locations = JSON.parse(mapBoxElement.dataset.locations);
  displayMap(locations);
}

if (loginFormElement) {
  loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login({ email, password });
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (profileFormElement) {
  profileFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    updateCredentials({ name, email });
  });
}
