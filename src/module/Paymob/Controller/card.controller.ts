import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.utils";
import { authenticate } from "../shared/authentication.shared";
import { registerOrder } from "../shared/register.order.shared";
import { generatePaymentKeyCard } from "../shared/generate.card.link.shared";

export const cardController = asyncHandler(
     async (_req: Request, res: Response, _next: NextFunction) => {
          const payment_data = {
               price: 1800,
               PaymentEn: "Banha City",
               descriptionAr: "HAHAHAHAHAHA"
          }
          const user = {
               _id: "88s5ad5555f74036",
               email: "elrefai99@lesoll.com",
               fullname: "Mohamed Mostafa",
               code: "+20",
               phone: "1142314446"
          }

          const tokenization_request: string = await authenticate()
          const order_id: string = await registerOrder(tokenization_request, payment_data)
          const payment_link: string = await generatePaymentKeyCard(tokenization_request, order_id, payment_data, user)


          res.status(200).json({ code: 200, status: "OK", link: payment_link })
     }
)
