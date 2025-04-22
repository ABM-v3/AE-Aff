// File: api/webhook.js

import { Telegraf } from 'telegraf';
import { generateAffiliateLink } from '../lib/aliexpress.js';
import dotenv from 'dotenv';

dotenv.config(); // Only needed for local development

const bot = new Telegraf(process.env.BOT_TOKEN);

// Regex to match AliExpress product URLs
const aliExpressRegex = /https?:\/\/(?:www\.)?aliexpress\.com\/item\/[^ \n]+/gi;

bot.on('text', async (ctx) => {
  const matches = ctx.message.text.match(aliExpressRegex);
  if (!matches) return;

  for (const url of matches) {
    try {
      const affiliateLink = await generateAffiliateLink(url);
      await ctx.reply(`🔗 Here is your affiliate link:\n${affiliateLink}`);
    } catch (error) {
      console.error('Affiliate link generation failed:', error.message);
      await ctx.reply('❌ Failed to generate affiliate link. Please try again later.');
    }
  }
});

// Required for Vercel serverless function
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
    } catch (err) {
      console.error('Telegram update error:', err.message);
    }
    return res.status(200).send('OK');
  }

  return res.status(405).send('Method Not Allowed');
}

export default async function handler(req, res) {
  // Expects POST request
}
