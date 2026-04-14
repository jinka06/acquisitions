import express from 'express';
import { createUsersTable } from './models/user.model.js';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js'
import securityMiddleware from './middleware/security.middleware.js'

const app = express();
await createUsersTable();

app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) }}));
app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions');
  res.status(200).send('Everything is ok within the API');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() })
})

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is currently running!'})
})

app.use('/api/auth', router)

export default app;
