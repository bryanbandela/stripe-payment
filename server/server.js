require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5500', //we're currently running the server on port 5500. Also in the url input: replace http://127.0.0.1/ with localhost
  })
);

//Pass the stripe key
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, { priceInCents: 1000, name: 'Buy tea' }],
  [2, { priceInCents: 2000, name: 'Buy coffee' }],
]);

app.post('/checkout-process-session', async (req, res) => {
  try {
    //sripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], //other option include["bank transfert"]
      mode: 'payment', //other option include "subscription"
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id); //with an Id you'll "get" the value of a map object
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents, //it is important to hide the price from client. Store it in Db,etc
          },
          quantity: item.quantity,
        };
      }), //Array of items we're sending down to purchase and format them in a way that stripe expects them to
      success_url: `${process.env.CLIENT_URL}/success.html`, //where to send the user on success
      cancel_url: `${process.env.CLIENT_URL}/failure.html`, //where to send user on failure
    });
    res.json({ url: session.url }); //the session has a url
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('App listening to port 3000');
});

//Note: When you change things in .env always restart the server
//If your frontend and backend are not in the same folder then use a different method
//In the second git push : I deal with different url
//In the client's console log we'll face a CORS issue since the client (from a different url) tries to access a route in the server
//To get around CORS: npm i cors in the server
//Make sure you change the redirect to the appropriate page
