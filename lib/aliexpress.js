// File: lib/aliexpress.js

import crypto from 'crypto';
import axios from 'axios';

export async function generateAffiliateLink(url) {
  const gateway = 'https://api-sg.aliexpress.com/sync';
  const method = 'aliexpress.affiliate.link.generate';
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const format = 'json';
  const v = '1.0';
  const sign_method = 'sha256';

  const params = {
    app_key: process.env.ALI_APP_KEY,
    method,
    timestamp,
    format,
    v,
    sign_method,
    pid: process.env.ALI_PID,
    promotion_link_type: '1',
    source_values: url
  };

  const sign = createSignature(params, process.env.ALI_APP_SECRET);
  const requestParams = new URLSearchParams({ ...params, sign });

  const response = await axios.post(gateway, requestParams);
  const result = response.data.aliexpress_affiliate_link_generate_response;

  if (result && result.resp_result && result.resp_result.result && result.resp_result.result.promotion_links.length > 0) {
    return result.resp_result.result.promotion_links[0].promotion_link;
  }

  throw new Error('Invalid API response');
}

function createSignature(params, appSecret) {
  const sortedKeys = Object.keys(params).sort();
  const baseString = sortedKeys.map(key => `${key}${params[key]}`).join('');
  const signString = `${appSecret}${baseString}${appSecret}`;
  return crypto.createHash('sha256').update(signString).digest('hex').toUpperCase();
}
