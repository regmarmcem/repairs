import * as config from '../config';

export function resolveImageUrl(imageData, width) {
  return `${config.remoteServerURL}/public${imageData.base64_data.url}`
}
