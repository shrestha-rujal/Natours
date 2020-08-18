import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// DOM ELEMENTS
const mapBoxElement = document.getElementById('map');
const loginFormElement = document.querySelector('.form');
const logoutBtn = document.getElementById('logout-btn');

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
