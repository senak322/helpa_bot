import { Context, MiddlewareFn, Telegraf } from "telegraf";
import mongoose from "mongoose";
import dotenv from "dotenv";
import LocalSession from "telegraf-session-local";
import { startCommand } from "./commands/start";
import { backToMainMenu } from "./middlewares/backToMainMenu";
import { exchangeCommand } from "./commands/exchange";
import { MySessionContext } from "./utils/types";

dotenv.config();

if (!process.env.TG_TOKEN) {
  throw new Error("Token is not provided in .env file");
}

const botToken: string = process.env.TG_TOKEN;
const mongodbUri: string = process.env.MONGODB_URI!;

const bot = new Telegraf<MySessionContext>(botToken, {});
const localSession = new LocalSession({ database: ".session_db.json" });
const adaptedLocalSessionMiddleware: MiddlewareFn<MySessionContext> = (ctx, next) => {
  return localSession.middleware()(ctx as any, next);
};

mongoose
  .connect(mongodbUri)
  .then(() => console.log("MongoDB подключен"))
  .catch((e) => console.error("Ошибка подключения к MongoDB", e));

bot.use(adaptedLocalSessionMiddleware);

// bot.use(backButton);
bot.use(backToMainMenu);

startCommand(bot);
exchangeCommand(bot);

bot.launch();
