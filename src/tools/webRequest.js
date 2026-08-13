// webRequest.js — Makes HTTP/HTTPS web requests using native fetch or http/https modules (ESM)
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'web_request',
    description: 'Fetch content from a URL via HTTP/HTTPS request.',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL to make HTTP request to'
        }
      },
      required: ['url']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var urlStr = args ? (args.url || '') : '';

  return new Promise(function(resolve) {
    if (!urlStr) {
      resolve({
        success: false,
        error: 'URL parameter is required',
        content: 'Web request failed: URL parameter is required'
      });
      return;
    }

    try {
      var parsedUrl = new URL(urlStr);
      var client = parsedUrl.protocol === 'https:' ? https : http;

      var req = client.get(urlStr, {
        headers: {
          'User-Agent': 'coderun-tools/1.0.0'
        }
      }, function(res) {
        var body = '';
        res.on('data', function(chunk) {
          body += chunk.toString();
        });
        res.on('end', function() {
          var isOk = res.statusCode >= 200 && res.statusCode < 300;
          resolve({
            success: isOk,
            content: body,
            statusCode: res.statusCode,
            url: urlStr
          });
        });
      });

      req.on('error', function(err) {
        resolve({
          success: false,
          error: err.message,
          content: 'Failed to fetch webpage content: ' + err.message
        });
      });
    } catch (parseErr) {
      resolve({
        success: false,
        error: parseErr.message,
        content: 'Invalid URL format: ' + parseErr.message
      });
    }
  });
}

export function webRequest(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('webRequest', args, output);
  });
}
