console.log('hello from parcel!');
import { login } from './login';

const form = document.forms[0];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login({ email, password });
});
