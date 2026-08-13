// patchFile.js — Applies multiple patch blocks to a file (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'patch_file',
    description: 'Apply multiple search-and-replace patches to a single file.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute file path to patch'
        },
        patches: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              oldText: { type: 'string' },
              newText: { type: 'string' }
            },
            required: ['oldText', 'newText']
          },
          description: 'List of search and replace blocks'
        }
      },
      required: ['path', 'patches']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var filePath = resolvePath(args ? args.path : '', workspace);
  var patches = args ? (args.patches || []) : [];

  return new Promise(function(resolve) {
    if (!filePath) {
      resolve({
        success: false,
        error: 'File path is required',
        content: 'Patch file failed: File path is required'
      });
      return;
    }

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Patch file '" + (args.path || filePath) + "' failed: " + err.message
        });
        return;
      }

      var currentContent = data;
      for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        if (p && p.oldText && currentContent.indexOf(p.oldText) !== -1) {
          currentContent = currentContent.replace(p.oldText, p.newText || '');
        } else {
          resolve({
            success: false,
            error: 'Patch block #' + (i + 1) + ' target oldText not found',
            content: "Patch file '" + (args.path || filePath) + "' failed: Patch block #" + (i + 1) + " target oldText not found"
          });
          return;
        }
      }

      fs.writeFile(filePath, currentContent, 'utf8', function(writeErr) {
        if (writeErr) {
          resolve({
            success: false,
            error: writeErr.message,
            content: "Patch file '" + (args.path || filePath) + "' failed: " + writeErr.message
          });
          return;
        }

        resolve({
          success: true,
          content: "Patched file '" + (args.path || filePath) + "' successfully",
          file_path: args.path || filePath,
          appliedPatches: patches.length
        });
      });
    });
  });
}

export function patchFile(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('patchFile', args, output);
  });
}
