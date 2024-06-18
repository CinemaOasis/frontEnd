// stripe.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PSWWOKTvKKZFxxj4GPaec7bKRE5hw7I9S1lVrcSstAKZnI8irlGecs2t29ixBD5JJrFzHEJRt6G6lQfZ29aFINV00SzJ5zJPV'); // Reemplaza con tu clave pública de Stripe

export default stripePromise;
