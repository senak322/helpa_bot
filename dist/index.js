"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.TG_TOKEN) {
    throw new Error("Token is not provided in .env file");
}
const botToken = process.env.TG_TOKEN;
const bot = new telegraf_1.Telegraf(botToken, {});
bot.start((ctx) => ctx.reply('Привет! Я бот для обмена криптовалют.'));
// Добавь обработку команд здесь
bot.launch();
