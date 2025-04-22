import crypto from 'crypto';
import axios from 'axios';

const API_URL = 'https://api-sg.aliexpress.com/sync';

export async function generateAffiliateLink(url) {
  const params = {
    method: 'aliexpress.affiliate.link.generate',
    app_key: process.env.ALI_APP_KEY,
    sign_method: 'sha256',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    format: 'json',
    v: '2.0',
    promotion_link_type: 'product',
    source_values: url,
    tracking_id: process.env.ALI_PID,
  };

  const sign = createSignature(params, process.env.ALI_APP_SECRET);
  const fullParams = { ...params, sign };

  const { data } = await axios.get(API_URL, { params: fullParams });

console.log('AliExpress API Raw Response:', JSON.stringify(data, null, 2)); // 👈 Add this

// Optional: also return it for debugging
if (!data?.resp_result?.result?.promotion_links?.[0]?.promotion_link) {
  throw new Error(`No promotion link returned.\nFull response:\n${JSON.stringify(data, null, 2)}`);
}


  return promo;
}

function createSignature(params, secret) {
  const sorted = Object.keys(params).sort().map((key) => `${key}${params[key]}`).join('');
  const base = secret + sorted + secret;
  return crypto.createHash('sha256').update(base).digest('hex').toUpperCase();
}
