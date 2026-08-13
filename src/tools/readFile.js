// readFile.js — Reads full content of a file (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'read_file',
    description: 'Read the full contents of a file in the workspace.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute file path to read'
        }
      },
      required: ['path']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var filePath = resolvePath(args ? args.path : '', workspace);

  return new Promise(function(resolve) {
    if (!filePath) {
      resolve({
        success: false,
        error: 'File path is required',
        content: 'Read file failed: File path is required'
      });
      return;
    }

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Read file '" + (args.path || filePath) + "' failed: " + err.message
        });
        return;
      }

      resolve({
        success: true,
        content: data,
        file_path: args.path || filePath,
        bytes: Buffer.byteLength(data, 'utf8')
      });
    });
  });
}

export function readFile(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('readFile', args, output);
  });
}
