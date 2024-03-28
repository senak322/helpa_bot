import { Markup, Telegraf, Context } from "telegraf";
import crypto from "crypto";
import { giveExchangeMenu } from "../keyboards/giveExchangeMenu";
import { MySessionContext } from "../utils/types";
import { sendWebMenu } from "../keyboards/sendWebMenu";
import { config } from "../utils/config";

export const exchangeCommand = (bot: Telegraf<MySessionContext>) => {
  bot.hears("💸 Купить HELPA", (ctx) => {
    ctx.session = {} as any;
    ctx.session.state = "selectingSendCurrency";
    ctx.reply("Инструкция");
    ctx.reply("Выберите монету отправки 👇", giveExchangeMenu);
  });

  bot.hears(["USDT💲"], (ctx) => {
    // Логика для выбора сети отправки
    if (ctx.session.state === "selectingSendCurrency") {
      ctx.session.state = "selectingWebCurrency";
      ctx.session.sendCurrency = ctx.message.text;

      // Логика для выбора валюты получения
      let menu;
      switch (ctx.session.sendCurrency) {
        case "USDT💲":
          menu = sendWebMenu(config.usdtWebs);
          break;
      }
      // ctx.session.menuReceiveCurrency = menu;
      ctx.reply(
        `Вы отдаёте ${ctx.session.sendCurrency}
Выберите сеть по которой отправите монету 👇`,
        menu
      );
    }
  });
  bot.hears(config.usdtWebs, (ctx) => {
    // Логика для выбора сети отправки
    if (ctx.session.state === "selectingWebCurrency")
      ctx.session.state = "enteringAmount";
    ctx.session.sendWebCurrency = ctx.message.text;

    // Логика для выбора суммы получения
    let limitFrom = 0;
    let limitTo = 0;
    let currencyName = "";

    switch (ctx.session.sendCurrency) {
      case "USDT💲":
        limitFrom = 100;
        limitTo = 50000;
        currencyName = "💲USDT";

        break;
    }
    ctx.session.currencyName = currencyName;
    ctx.session.limitFrom = limitFrom;
    ctx.session.limitTo = limitTo;
  });
};
