import axios from 'axios';
import { showAlert } from './alert';

const createReview = async ({ tour, tourSlug, review, rating }) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        tour,
        review,
        rating,
      },
    });

    if (res.data.status) {
      showAlert('success', 'Review successfully added!');
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign(`/tour/${tourSlug}`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default createReview;
