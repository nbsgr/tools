// createFolder.js — Creates a directory recursively (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'create_folder',
    description: 'Create a new directory and any missing parent directories.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute directory path to create'
        }
      },
      required: ['path']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var folderPath = resolvePath(args ? args.path : '', workspace);

  return new Promise(function(resolve) {
    if (!folderPath) {
      resolve({
        success: false,
        error: 'Folder path is required',
        content: 'Create folder failed: Folder path is required'
      });
      return;
    }

    fs.mkdir(folderPath, { recursive: true }, function(err) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Created folder '" + (args.path || folderPath) + "' failed: " + err.message
        });
        return;
      }

      resolve({
        success: true,
        content: "Created folder '" + (args.path || folderPath) + "' successfully",
        folder_path: args.path || folderPath
      });
    });
  });
}

export function createFolder(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('createFolder', args, output);
  });
}
