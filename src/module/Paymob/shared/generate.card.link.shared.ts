import axios from "axios";
import { paymobENV } from "../env";

export async function generatePaymentKeyCard(authToken: string, orderReg: string, packageData: any, user: any) {

     const paymentReg = await axios.post(`${paymobENV.PAYMOB_API}/acceptance/payment_keys`, {
          auth_token: authToken,
          amount_cents: packageData.price * 100,
          expiration: 3600,
          order_id: orderReg,
          billing_data: {
               apartment: "NA",
               email: user.email,
               floor: "NA",
               first_name: user.fullname,
               street: "NA",
               building: "NA",
               phone_number: user.code + user.phone,
               shipping_method: "NA",
               postal_code: "NA",
               city: "NA",
               country: "egypt",
               last_name: "NA",
               state: "NA",
          },
          currency: "EGP",
          integration_id: paymobENV.PAYMOB_INTEGRATION_ID_CARD_TEST,
     }
     );
     const linkRedirect = `https://accept.paymob.com/api/acceptance/iframes/${paymobENV.PAYMOB_IFREAMS_ID}?payment_token=${paymentReg.data.token}`;

     return linkRedirect;
}
