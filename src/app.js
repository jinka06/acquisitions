import express from 'express';
import { createUsersTable } from './models/user.model.js';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
await createUsersTable();

app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) }}));

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions');
  res.status(200).send('Everything is ok within the API');
});

export default app;
