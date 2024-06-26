import { Markup } from "telegraf";
import { config } from "../utils/config";
const { mainMenuBtn } = config;

export const giveExchangeMenu = Markup.keyboard([
  ["USDT💲"],
  [mainMenuBtn],
]).resize();