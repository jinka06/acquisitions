import express from 'express';
import { createUsersTable } from './models/user.model.js';

const app = express();
await createUsersTable();

app.get('/', (req, res) => {
  res.status(200).send('Everything is ok within the API');
});

export default app;
