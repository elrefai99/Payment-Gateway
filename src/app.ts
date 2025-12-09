process
     .on("unhandledRejection", (reason, p) => {
          console.error(reason, "Unhandled Rejection at Promise", p);
     })
     .on("uncaughtException", (err) => {
          console.error(err, "\n Uncaught Exception thrown \n");
          console.log("LOL");
          process.exit(1);
     });
import 'reflect-metadata';
import "dotenv/config"
import express, { Request, Response } from 'express'
import client from "prom-client";
import appConf from './app.conf';
import appModule from './app.module';

const app = express()


appConf(app)
appModule(app)

app.get('/metrics', async (_req, res) => {
     res.set('Content-Type', client.register.contentType);
     res.end(await client.register.metrics());
});

app.use(async (_req: Request, res: Response) => {
     res.status(404).send('This is not the API route you are looking for')
})
const PORT: number = Number(process.env.PORT) || 9999
app.listen(PORT, () => {
     console.log("🌐 Server is running on:", process.env.SITE_API_Local_URL)
})
