// @ts-ignore
import * as ccavneue from "node-ccavenue";
import { CCAVENUE_WORKING_KEY, MERCHANT_ID } from "../env";

// @ts-ignores
const ccav = new ccavneue.Configure({
  merchant_id: MERCHANT_ID,
  working_key: CCAVENUE_WORKING_KEY,
});

interface IOrderInput {
  order_id: number;
  currency: string;
  amount: number;
  redirect_url: string;
  billing_name: string;
}

export const encryptCcAvenue = (order: IOrderInput): string => {
  return ccav.getEncryptedOrder(order);
};

export const decryptCcAvenue = (encodedData: any) => {
  const decyptedData = ccav.redirectResponseToJson(encodedData);

  return {
    data: decyptedData,
    responceCode: decyptedData.order_status,
  };
};
