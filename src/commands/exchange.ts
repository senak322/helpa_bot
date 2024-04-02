import { Markup, Telegraf, Context } from "telegraf";
import crypto from "crypto";
import { giveExchangeMenu } from "../keyboards/giveExchangeMenu";
import { MySessionContext } from "../utils/types";
import { sendWebMenu } from "../keyboards/sendWebMenu";
import { config } from "../utils/config";
import { mainMenu } from "../keyboards/mainMenu";

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
    let limitToRecieve = 0;
    let limitFromRecieve = 0;
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
        if (ctx.session.currencyName === "HELPA") {
          limitFromRecieve = 100000;
          limitToRecieve = 1000000;
        }
        ctx.session.limitFromRecieve = limitFromRecieve;
        ctx.session.limitToRecieve = limitToRecieve;
        ctx.reply(
          `Введите сумму, которую хотите получить
Укажите сумму от ${ctx.session.limitFromRecieve} до ${ctx.session.limitToRecieve} в ${ctx.session.currencyName}`,
          Markup.keyboard([
            [`Указать сумму в ${ctx.session.sendCurrency}`],
            [mainMenuBtn, backBtn],
          ]).resize()
        );
      } else if (
        !isNaN(Number(ctx.message.text)) &&
        isWithinLimits(
          Number(ctx.message.text),
          ctx.session.limitFrom,
          ctx.session.limitTo
        )
      ) {
        // Пользователь ввел корректную сумму
        // Далее логика обработки обмена
        ctx.session.howToSend = Number(ctx.message.text);
        const howToRecieve = await getExchangeFormula(ctx, rate);
        ctx.session.howToRecieve = howToRecieve;
        ctx.session.state = "chooseSendBank";
        ctx.reply(
          `Вы отправляете ${ctx.session.howToSend} ${ctx.session.sendCurrency}
К получению ${howToRecieve} ${ctx.session.currencyName}
укажите кошелек отправления 👇`,
          mainMenu
        );
      } else {
        // Пользователь ввел некорректные данные

        ctx.reply(
          `⚠️ Введите число от ${
            ctx.session.state === "enteringAmount"
              ? ctx.session.limitFrom
              : ctx.session.limitFromRecieve
          } до ${
            ctx.session.state === "enteringAmount"
              ? ctx.session.limitTo
              : ctx.session.limitToRecieve
          }
`
        );
      }
    } else if (
      ctx.message.text === `Указать сумму в ${ctx.session.sendCurrency}`
    ) {
      ctx.session.state = "enteringAmount";
      ctx.reply(
        `Введите сумму, которую хотите отправить от ${ctx.session.limitFrom} до ${ctx.session.limitTo} в ${ctx.session.sendCurrency}`,
        Markup.keyboard([
          [`Указать сумму в ${ctx.session.currencyName}`],
          [mainMenuBtn, backBtn],
        ]).resize()
      );
    } else {
      // Сообщаем пользователю об ошибке и просим ввести сумму заново
      ctx.reply(
        `⚠️ Введенная сумма должна быть числом от ${ctx.session.limitFromRecieve} до ${ctx.session.limitToRecieve} в ${ctx.session.currencyName}. Пожалуйста, попробуйте снова:`,
        Markup.keyboard([
          [`Указать сумму в ${ctx.session.sendCurrency}`],
          [mainMenuBtn, backBtn],
        ]).resize()
      );
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

function isWithinLimits(amount: number, min: number, max: number) {
  return amount >= min && amount <= max;
}

async function getExchangeFormula(ctx, rate): Promise<number> {
  let receiveSum = 0;
  if (0 >= ctx.session.amount) {
    ctx.reply(
      `⚠️ Введите число от ${
        ctx.session.state === "enteringAmount"
          ? ctx.session.limitFrom
          : ctx.session.limitFromRecieve
      } до ${
        ctx.session.state === "enteringAmount"
          ? ctx.session.limitTo
          : ctx.session.limitToRecieve
      }`
    );
    return;
  }

  if (ctx.session.state === "enteringAmount") {
    const initialReceiveSum = rate * ctx.message.text;
    receiveSum = Math.floor(initialReceiveSum - initialReceiveSum * comission);
  } else if (ctx.session.state === "enteringReceiveAmount") {
    const comissionRate = await howMuchComission(ctx, rate);
    // Рассчитываем сумму к отправке с учетом комиссии
    receiveSum = Math.floor(ctx.message.text / (rate * (1 - comissionRate)));
  }
  return receiveSum;
}

const formatDate = (date: Date) => {
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const howMuchComission = async (ctx) => {
  let comission = 0;

  // const amount =
  //   ctx.session.state === "enteringAmount"
  //     ? ctx.message.text
  //     : ctx.session.state === "enteringReceiveAmount"
  //     ? ctx.message.text / rate
  //     : 0;

  if (ctx.session.sendCurrency === "USDT💲") {
    comission = 0.05;
  }

  return comission;
};
