# AliExpress Affiliate Telegram Bot

This Telegram bot converts AliExpress product links into affiliate links using the AliExpress Portals Open Platform API.

## Features

- Detects and extracts AliExpress product URLs from messages.
- Converts them to affiliate links using `aliexpress.affiliate.link.generate`.
- Uses secure SHA256-based signature authentication.
- Replies to the user with the affiliate link.

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/aliexpress-affiliate-bot.git
cd aliexpress-affiliate-bot
npm install
