import axios from 'axios';
import { showAlert } from './alert';

const updateAccountCredentials = async ({ data, isPassword = false }) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/users/update${isPassword ? 'Password' : 'User'}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Changes saved successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default updateAccountCredentials;
