// editFile.js — Replaces old text with new text in a file (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'edit_file',
    description: 'Replace a specific string block with new text in an existing file.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute file path to edit'
        },
        oldText: {
          type: 'string',
          description: 'Exact text substring to be replaced'
        },
        newText: {
          type: 'string',
          description: 'Replacement text'
        }
      },
      required: ['path', 'oldText', 'newText']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var filePath = resolvePath(args ? args.path : '', workspace);
  var oldText = args ? args.oldText : '';
  var newText = args ? args.newText : '';

  return new Promise(function(resolve) {
    if (!filePath) {
      resolve({
        success: false,
        error: 'File path is required',
        content: 'Edit file failed: File path is required'
      });
      return;
    }

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Edit file '" + (args.path || filePath) + "' failed: " + err.message
        });
        return;
      }

      if (data.indexOf(oldText) === -1) {
        resolve({
          success: false,
          error: 'Target oldText not found in file',
          content: "Edit file '" + (args.path || filePath) + "' failed: Target oldText not found in file"
        });
        return;
      }

      var updatedData = data.replace(oldText, newText);
      fs.writeFile(filePath, updatedData, 'utf8', function(writeErr) {
        if (writeErr) {
          resolve({
            success: false,
            error: writeErr.message,
            content: "Edit file '" + (args.path || filePath) + "' failed: " + writeErr.message
          });
          return;
        }

        resolve({
          success: true,
          content: "Patched file '" + (args.path || filePath) + "' successfully",
          file_path: args.path || filePath,
          bytes: Buffer.byteLength(updatedData, 'utf8')
        });
      });
    });
  });
}

export function editFile(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('editFile', args, output);
  });
}
