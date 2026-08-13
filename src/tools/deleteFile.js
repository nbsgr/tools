// deleteFile.js — Deletes a single file (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'delete_file',
    description: 'Permanently delete a file from the filesystem.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute file path to delete'
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
        content: 'Delete file failed: File path is required'
      });
      return;
    }

    fs.unlink(filePath, function(err) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Deleted file '" + (args.path || filePath) + "' failed: " + err.message
        });
        return;
      }

      resolve({
        success: true,
        content: "Deleted file '" + (args.path || filePath) + "' successfully",
        file_path: args.path || filePath
      });
    });
  });
}

export function deleteFile(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('deleteFile', args, output);
  });
}
