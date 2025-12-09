import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.utils";
import { authenticate } from "../shared/authentication.shared";
import { registerOrder } from "../shared/register.order.shared";
import { generatePaymentKeyCard } from "../shared/generate.card.link.shared";
import { Prisma } from "@prisma/client";
import prisma from "../../../config/db.conf";

export const cardController = asyncHandler(
     async (_req: Request, res: Response, _next: NextFunction) => {
          const getPackage = {
               price: 1800,
               PaymentEn: "Lesoll",
               descriptionAr: "HAHAHAHAHAHA"
          }
          const user = {
               _id: "88s5ad5555f74036",
               email: "m.mostafa@lesoll.com",
               fullname: "Mohamed Mostafa",
               code: "+20",
               phone: "1142314446"
          }
          if (!getPackage) {
               res.status(400).json({ code: 400, status: "Bad Request", message: "This package not here" })
               return
          }

          const getPaymobAuthToken: string = await authenticate()
          const getNewIdOfOrderPaymob: string = await registerOrder(getPaymobAuthToken, getPackage)
          const getRedirectLink: string = await generatePaymentKeyCard(getPaymobAuthToken, getNewIdOfOrderPaymob, getPackage, user)

          const database = await prisma.orderPaymob.create({
               data: {
                    userId: parseInt(user._id, 16),
                    order_id: `${getNewIdOfOrderPaymob}`,
                    price: getPackage.price
               } as Prisma.OrderPaymobUncheckedCreateInput
          });

          res.status(200).json({ code: 200, status: "OK", database, getRedirectLink })
     }
)
