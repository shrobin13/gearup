import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import { authRoutes } from './modules/auth/auth.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { categoriesRoutes } from './modules/categories/categories.route.js';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to gearup!");
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use(errorHandler);

export default app;
