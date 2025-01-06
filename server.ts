import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './src/config/db';
import postRouter from "./src/api/routers/postRouter";
import constants from './src/constants';

connectDB(constants.MONGO_URI);

const app:Express = express();

const port:number = constants.PORT;
const serverUrl:string = constants.SERVER_URL;

app.use(cors());
app.use(express.json());

app.use("/api/v1", postRouter);

app.get("/",async (req:Request, res:Response) => {
  return res.send(`<h1>Running on Port : ${port}</h1>`);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Open Browser: http://localhost:${port}`);
});
