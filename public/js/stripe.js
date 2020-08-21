import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_e0nuQ60Y39XDAWiIC2khmrnp005MRcJwCZ'); /* eslint-disable-line */

const bookTour = async (tourId) => {
  try {
    const sessionResponse = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    await stripe.redirectToCheckout({
      sessionId: sessionResponse.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export default bookTour;
