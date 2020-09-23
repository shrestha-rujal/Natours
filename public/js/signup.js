/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (signinData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: signinData,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'New Account Created!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
