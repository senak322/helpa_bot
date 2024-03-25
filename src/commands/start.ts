import { Telegraf, Context } from 'telegraf';
// import { Document } from 'mongoose';
import { mainMenu } from "../keyboards/mainMenu";
import { config } from "../utils/config";
import { User } from "../models/User";

export const startCommand = (bot: Telegraf<Context>) => {
  bot.start(async (ctx) => {
    const userId = ctx.from.id;
    let user = await User.findOne({ userId: userId });

    if (!user) {
      user = new User({
        userId: userId,
        paidOrders: 0,
        unpaidOrders: [],
        isBlocked: false,
        // другие начальные настройки пользователя
      });
      await user.save();
    }
    ctx.reply(config.mainMessage, mainMenu);
  });
};