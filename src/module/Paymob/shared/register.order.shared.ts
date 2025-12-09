import axios from "axios";
import { paymobENV } from "../env";

export async function registerOrder(token: string, packageData: any) {

     const orderReg = await axios.post(`${paymobENV.PAYMOB_API}/ecommerce/orders`, {
          auth_token: token,
          delivery_needed: "false",
          amount_cents: packageData.price * 100,
          items: [
               {
                    name: `${packageData.PaymentEn}`,
                    amount_cents: `${packageData.price * 100}`,
                    description: `${packageData.descriptionAr}`,
                    quantity: "1",
               },
          ],
     });

     let id = orderReg.data.id;
     return id;
}
