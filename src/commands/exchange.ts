import { Markup, Telegraf, Context } from "telegraf";
import crypto from "crypto";
import { giveExchangeMenu } from "../keyboards/giveExchangeMenu";
import { MySessionContext } from "../utils/types";

// interface IexchangeCommand {
//     () => void
// }

export const exchangeCommand = (bot: Telegraf<MySessionContext>) => {
    bot.hears("💸 Новый обмен", (ctx) => {
      console.log();
      
      ctx.session = {};
      ctx.session.state = "selectingSendCurrency";
      
      ctx.reply("Выберите валюту отправки 👇", giveExchangeMenu);
    });
  
}