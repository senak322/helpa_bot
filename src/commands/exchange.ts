import { Markup, Telegraf, Context } from "telegraf";
import crypto from "crypto";
import { giveExchangeMenu } from "../keyboards/giveExchangeMenu";
import { MySessionContext } from "../utils/types";

interface IexchangeCommand {
    () => void
}

export const exchangeCommand: MySessionContext = (bot: Telegraf<Context>) => {
    bot.hears("💸 Новый обмен", (ctx) => {
      
  
      ctx.session = {};
      ctx.session.state = "selectingSendCurrency";
      
      ctx.reply("Выберите валюту отправки 👇", giveExchangeMenu);
    });
  
}