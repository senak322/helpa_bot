import { Context, MiddlewareFn } from "telegraf";
import { mainMenu } from "../keyboards/mainMenu";
import { config } from "../utils/config";
import { MySessionContext } from "../utils/types";

// interface MyContext extends Context {
//   session?: {
//     state?: string;
//   } | null;
//   message: any;
// }

export const backToMainMenu: MiddlewareFn<MySessionContext> = async (ctx, next) => {
  if ("text" in ctx.message && ctx.message.text === "📲 Главное меню") {
    ctx.session = {} as any;
    await ctx.reply(config.mainMessage, mainMenu);
  } else {
    return next();
  }
};
