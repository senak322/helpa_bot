import { Context, MiddlewareFn } from "telegraf";
import { mainMenu } from "../keyboards/mainMenu";
import { config } from "../utils/config";

interface MyContext extends Context {
  session?: {
    state?: string;
  } | null;
  message: any;
}

export const backToMainMenu: MiddlewareFn<MyContext> = async (ctx, next) => {
  if ("text" in ctx.message && ctx.message.text === "📲 Главное меню") {
    ctx.session = null;
    await ctx.reply(config.mainMessage, mainMenu);
  } else {
    return next();
  }
};
