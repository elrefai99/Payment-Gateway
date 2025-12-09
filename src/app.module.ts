import { Application } from "express";

export default (app: Application) => {
     app.use("/api/v1/paymob", require("./module/Paymob/paymob.module").default);
}
