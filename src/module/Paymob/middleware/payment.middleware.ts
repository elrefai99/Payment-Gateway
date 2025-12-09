import { NextFunction, Request, Response } from "express";
import crypto from 'crypto';
import { asyncHandler } from "../../../utils/asyncHandler.utils";
import ServerError from "../../../utils/api.errors.utils";

export const paymentStatController = asyncHandler(
     async (req: Request, _res: Response, next: NextFunction) => {
          const obj = req.query as any
          const hmac: string =
               obj?.amount_cents +
               obj?.created_at +
               obj.currency +
               obj.error_occured +
               obj.has_parent_transaction +
               obj.id +
               obj.integration_id +
               obj.is_3d_secure +
               obj.is_auth +
               obj.is_capture +
               obj.is_refunded +
               obj.is_standalone_payment +
               obj.is_voided +
               obj.order +
               obj.owner +
               obj.pending +
               obj['source_data.pan'] +
               obj['source_data.sub_type'] +
               obj['source_data.type'] +
               obj.success;

          const hashedHmac = crypto
               .createHmac("SHA512", process.env.PAYMOB_HMAC as string)
               .update(hmac)
               .digest("hex");

          if (!req.query.hmac || req.query.hmac !== hashedHmac) {
               next(new ServerError("HMAC verification failed", 400));
               return
          }
          next()
          return
     }
)
