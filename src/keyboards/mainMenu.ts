import { Markup } from 'telegraf';

export const mainMenu = Markup.keyboard([
  ["💸 Новый обмен", "📚 История заказов"],
  // [`🇷🇺/🇬🇧/🇨🇳/🇺🇦 Выбрать язык`],
  ["❓ FAQ", "🆘 Поддержка"],
]).resize();