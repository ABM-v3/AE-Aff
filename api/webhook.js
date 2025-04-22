import { Telegraf } from 'telegraf';
import { generateAffiliateLink } from '../lib/aliexpress.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

// AliExpress URL pattern
const aeRegex = /https?:\/\/(?:www\.)?aliexpress\.com\/item\/[\w\d]+\.html\S*/gi;

// Start command
bot.start((ctx) =>
  ctx.reply('👋 Welcome! Send me any AliExpress product link and I’ll turn it into an affiliate link.')
);

// Help command
bot.help((ctx) =>
  ctx.reply('💡 Just send an AliExpress product link like:\nhttps://www.aliexpress.com/item/1005006163023044.html')
);

// Handle messages
bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const match = message.match(aeRegex);

  if (!match) {
    return ctx.reply('❌ No AliExpress product link found in your message.');
  }

  const originalLink = match[0];

  try {
    const promoLink = await generateAffiliateLink(originalLink);
    ctx.reply(`✅ Here is your affiliate link:\n${promoLink}`);
  } catch (error) {
    console.error('Affiliate link error:', error);
    ctx.reply('❌ Failed to generate affiliate link. Please try again later.');
  }
});

// Vercel webhook handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error handling update');
  }
}
