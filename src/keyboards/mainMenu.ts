import { Markup } from 'telegraf';

export const mainMenu = Markup.keyboard([
  ["💸 Купить HELPA", "📚 История заказов"],
  // [`🇷🇺/🇬🇧/🇨🇳/🇺🇦 Выбрать язык`],
  ["❓ FAQ", "🆘 Поддержка"],
]).resize();