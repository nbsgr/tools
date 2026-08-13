// getFileInfo.js — Returns metadata for a file or directory (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'get_file_info',
    description: 'Get metadata (size, created/modified date, type) for a file or folder.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute file path'
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
        content: 'Get file info failed: File path is required'
      });
      return;
    }

    fs.stat(filePath, function(err, stats) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Got file info for '" + (args.path || filePath) + "' failed: " + err.message
        });
        return;
      }

      var info = {
        file_path: args.path || filePath,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        created: stats.birthtime,
        modified: stats.mtime
      };

      resolve({
        success: true,
        content: "Type: " + (info.isDirectory ? "directory" : "file") + ", Size: " + info.size + " bytes, Modified: " + info.modified,
        info: info
      });
    });
  });
}

export function getFileInfo(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('getFileInfo', args, output);
  });
}
