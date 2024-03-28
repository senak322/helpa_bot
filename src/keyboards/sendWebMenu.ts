import { Markup } from "telegraf";
import { config } from "../utils/config";

const { backBtn, mainMenuBtn } = config;

export const sendWebMenu = (currencies: string[]) => {
  const keyboard = currencies.map((currency) => [currency]);
  keyboard.push([mainMenuBtn, backBtn]);

  return Markup.keyboard(keyboard).resize();
};
