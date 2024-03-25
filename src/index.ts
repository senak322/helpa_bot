import { Context, Telegraf } from "telegraf";
import mongoose from "mongoose";
import dotenv from "dotenv";
import LocalSession from "telegraf-session-local";
import { startCommand } from "./commands/start";
import { backToMainMenu } from "./middlewares/backToMainMenu";

interface MySessionContext extends Context {
  session?: {
    state?: string;
    // Другие свойства сессии
  };
}

dotenv.config();

if (!process.env.TG_TOKEN) {
  throw new Error("Token is not provided in .env file");
}

const botToken: string = process.env.TG_TOKEN;
const mongodbUri: string = process.env.MONGODB_URI!;

const bot = new Telegraf<MySessionContext>(botToken, {});
const localSession = new LocalSession({ database: ".session_db.json" });

mongoose
  .connect(mongodbUri)
  .then(() => console.log("MongoDB подключен"))
  .catch((e) => console.error("Ошибка подключения к MongoDB", e));

bot.use(localSession.middleware());

// bot.use(backButton);
bot.use(backToMainMenu);

startCommand(bot);

bot.launch();
