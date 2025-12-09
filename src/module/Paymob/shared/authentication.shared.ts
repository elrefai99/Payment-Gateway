import axios from "axios";
import { paymobENV } from "../env";
import ServerError from "../../../utils/api.errors.utils";

export async function authenticate() {
     try {
          let data = {
               api_key: paymobENV.Paymob_API_Key_TEST,
          };
          const headers = {
               "Content-Type": "application/json",
          };
          let response = await axios.post(`${paymobENV.PAYMOB_API}/auth/tokens`, data, {
               headers,
          });

          const accessToken = response.data.token;

          return accessToken;
     }
     catch (err: any) {
          throw new ServerError(err.message, 500)
     }
}

