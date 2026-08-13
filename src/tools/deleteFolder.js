// deleteFolder.js — Deletes a directory recursively (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'delete_folder',
    description: 'Delete a directory and all of its contents recursively.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute directory path to delete'
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
        content: 'Delete folder failed: Folder path is required'
      });
      return;
    }

    fs.rm(folderPath, { recursive: true, force: true }, function(err) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Deleted folder '" + (args.path || folderPath) + "' failed: " + err.message
        });
        return;
      }

      resolve({
        success: true,
        content: "Deleted folder '" + (args.path || folderPath) + "' successfully",
        folder_path: args.path || folderPath
      });
    });
  });
}

export function deleteFolder(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('deleteFolder', args, output);
  });
}
