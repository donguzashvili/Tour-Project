import axios from 'axios';

export async function login(obj) {
  console.log('shemodi');
  try {
    const body = JSON.stringify(obj);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const res = await axios.post('http://localhost:5000/api/v1/users/login', {
      headers: myHeaders,
      method: 'POST',
      body,
      redirect: 'follow',
    });

    const response = res.json();
    console.log(response);

    // fetch('http://localhost:5000/api/v1/users/login', {
    //   headers: myHeaders,
    //   method: 'POST',
    //   body,
    //   redirect: 'follow',
    // }).then((res) => {
    //   if (res.status === 200) {
    //     window.location.assign('/');
    //   }
    // });
  } catch (err) {
    console.log(err);
  }
}
