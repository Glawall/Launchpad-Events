import router from "./routes";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.use(errorHandler);

export default app;
