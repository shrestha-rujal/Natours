import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_e0nuQ60Y39XDAWiIC2khmrnp005MRcJwCZ'); 

const bookTour = async (tourId) => {
  try {
    console.log('calling');
    const sessionResponse = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log('hello');

    await stripe.redirectToCheckout({
      sessionId: sessionResponse.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export default bookTour;
