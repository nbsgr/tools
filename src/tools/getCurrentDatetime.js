// getCurrentDatetime.js — Returns current system ISO datetime string (ESM)
import { formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'get_current_datetime',
    description: 'Get current system date and time in ISO format.',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
};

export function handler(args, options) {
  options = options || {};
  return new Promise(function(resolve) {
    var nowIso = new Date().toISOString();
    resolve({
      success: true,
      content: nowIso,
      datetime: nowIso
    });
  });
}

export function getCurrentDatetime(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('getCurrentDatetime', args, output);
  });
}
