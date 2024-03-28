import { Markup, Telegraf, Context } from "telegraf";
import crypto from "crypto";
import { giveExchangeMenu } from "../keyboards/giveExchangeMenu";
import { MySessionContext } from "../utils/types";
import { sendWebMenu } from "../keyboards/sendWebMenu";
import { config } from "../utils/config";

const { usdtWebs, mainMenuBtn, backBtn } = config;

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
          menu = sendWebMenu(usdtWebs);
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
  bot.hears(usdtWebs, (ctx) => {
    // Логика для выбора сети отправки
    if (ctx.session.state === "selectingWebCurrency") {
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
          currencyName = "HELPA";

          break;
      }
      ctx.session.currencyName = currencyName;
      ctx.session.limitFrom = limitFrom;
      ctx.session.limitTo = limitTo;
      ctx.reply(
        `✍️ Напиши мне сумму, в ${ctx.session.sendCurrency} которую хочешь обменять от ${ctx.session.limitFrom} до ${ctx.session.limitTo} 
Если тебе нужно получить конкретную сумму в ${ctx.session.currencyName} жми «Указать сумму в ${ctx.session.currencyName}»`,
        Markup.keyboard([
          [`Указать сумму в ${ctx.session.currencyName}`],
          [mainMenuBtn, backBtn],
        ]).resize()
      );
    }
  });
  bot.on("text", async (ctx) => {
    let limitToRecieve;
    let limitFromRecieve;
    if (ctx.session.state === "enteringAmount") {
      const sendCurrency = ctx.session.sendCurrency;
      const rate = await getExchangeRate(sendCurrency);
      if (ctx.message.text === backBtn) {
        // Пропускаем обработку, чтобы позволить middleware обработать это
        return;
      }
      if (ctx.message.text === `Указать сумму в ${ctx.session.currencyName}`) {
        // Логика переключения валюты
        ctx.session.state = "enteringReceiveAmount";
        
      }
    }
  });
};

const getExchangeRate = async (value: string): Promise<number> => {
  const res = 0;
  if (value === "USDT💲") {
    const res = await Promise.resolve(1000);
    console.log(res);
  }
  return res;
};
