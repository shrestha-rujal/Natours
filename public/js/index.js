import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import updateAccountCredentials from './accountSettings';

// DOM ELEMENTS
const mapBoxElement = document.getElementById('map');
const loginFormElement = document.querySelector('#login-form');
const logoutBtn = document.getElementById('logout-btn');
const profileFormElement = document.querySelector('#profile-form');
const passwordFormElement = document.querySelector('#password-form');

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

    updateAccountCredentials({ data: { name, email } });
  });
}

if (passwordFormElement) {
  passwordFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.querySelector('.btn-save-password');
    const currentPasswordEl = document.querySelector('#password-current');
    const passwordEl = document.querySelector('#password');
    const passwordConfirmEl = document.querySelector('#password-confirm');

    const currentPassword = currentPasswordEl.value;
    const password = passwordEl.value;
    const passwordConfirm = passwordConfirmEl.value;

    saveBtn.textContent = 'Updating...';

    await updateAccountCredentials({
      data: { currentPassword, password, passwordConfirm },
      isPassword: true,
    });

    saveBtn.textContent = 'Save password';
    currentPasswordEl.value = '';
    passwordEl.value = '';
    passwordConfirmEl.value = '';
  });
}
