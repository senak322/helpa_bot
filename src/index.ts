import { Telegraf } from 'telegraf';
import dotenv from "dotenv";

dotenv.config();

if (!process.env.TG_TOKEN) {
    throw new Error("Token is not provided in .env file");
  }

const botToken:string = process.env.TG_TOKEN;

const bot = new Telegraf( botToken, {});

bot.start((ctx) => ctx.reply('Привет! Я бот для обмена криптовалют.'));
// Добавь обработку команд здесь

bot.launch();