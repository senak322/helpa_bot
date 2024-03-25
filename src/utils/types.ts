import { Context } from "telegraf";

export interface MySessionContext extends Context {
    session?: {
      state?: string;
      
    } | null
    message: any
  }