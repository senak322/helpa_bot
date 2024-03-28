import { Context } from "telegraf";

export interface MySessionContext extends Context {
  session: {
    state: string
    sendCurrency: string
    sendWebCurrency: string
    currencyName: string
    limitFrom: number
    limitTo: number
  } 
  message: any;
}
