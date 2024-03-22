const axios = require('axios');

module.exports = createAnOrder = (amount) => {
  const baseUrl = 'https://sandbox-merchant.revolut.com/';

  let data = JSON.stringify({
    amount: amount,
    currency: 'GBP'
  });

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: baseUrl + 'api/orders',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Bearer sk_JHnt6KZyaDfEYf510T_7XpGd6qGlV3FxY5DVpRSfxtXvp2J9n1MuYFNQvFYVkNhe",
      'Revolut-Api-Version': '2023-09-01',
    },
    data: data
  };

  return new Promise ((resolve, reject) => {
    axios(config)
      .then((response) => {
        resolve(JSON.stringify(response.data));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
