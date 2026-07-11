import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routes/route.js';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to gearup!");
});

app.use("/api", router);
app.use(errorHandler);

export default app;
