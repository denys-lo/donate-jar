const express = require('express');
const cors = require('cors');
const createAnOrder = require('./createAnOrderEndpoint');

const app = express();
app.use(cors({ origin: '*' }));
const jsonParser = express.json();

app.get('/', (req, res) => res.send('Hi, I am a server!'));

app.post('/revolutCardField', jsonParser, (req, res) => {
  createAnOrder(req.body.amount)
    .then(result => res.send(result))
    .catch(error => res.send({
      message: 'Failed to create an order.',
      details: error
    }));
});

app.listen(8000, () => console.log('Server is running on 8000 port'))
