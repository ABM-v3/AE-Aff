import axios from 'axios';
import crypto from 'crypto';

export async function generateAffiliateLink(productUrl) {
  const params = {
    appKey: process.env.ALI_APP_KEY,
    signMethod: 'sha256',
    format: 'json',
    v: '2.0',
    method: 'aliexpress.affiliate.link.generate',
    timestamp: new Date().toISOString(),
    pid: process.env.ALI_PID,
    targetUrl: productUrl
  };

  // Sort parameters alphabetically by key
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  // Create the sign string
  let signStr = process.env.ALI_APP_SECRET;
  for (let key in sortedParams) {
    signStr += key + sortedParams[key];
  }
  signStr += process.env.ALI_APP_SECRET;

  // Hash with SHA-256
  const sign = crypto.createHash('sha256').update(signStr).digest('hex').toUpperCase();
  params.sign = sign;

  try {
    console.log('Making request to AliExpress API with params:', params); // Add logging

    const response = await axios.get('https://openapi.aliexpress.com/rest', { params });

    console.log('AliExpress response:', response.data); // Add logging

    if (response.data.errorResponse) {
      throw new Error(response.data.errorResponse.subMsg || 'Unknown error from AliExpress');
    }

    return response.data.result.promotionLink; // Return affiliate link
  } catch (error) {
    console.error('Error generating affiliate link:', error.message); // Log any error
    throw error;
  }
}
