import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Everything is ok within the API');
});

export default app;
