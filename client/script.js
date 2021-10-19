const button = document.querySelector('button');

button.addEventListener('click', () => {
  //the following is all the code you need in the client's side
  //Could be improved with async/await
  console.log('I got clicked');
  //since the client and the server are on different url, I'll add : http://localhost:3000/
  //In the console log we'll face a CORS issue
  //To get around CORS: npm i cors in the server
  fetch('http://localhost:3000/checkout-process-session', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 3 },
        { id: 2, quantity: 1 },
      ],
    }),
  })
    .then((res) => {
      if (res.ok) return res.json(); //if success
      return res.json().then((json) => Promise.reject(json)); //if failure
    })
    .then(({ url }) => {
      console.log(url);
      window.location = url;
    })
    .catch((e) => {
      console.error(e.error);
    });
});
