// writeFile.js — Writes content to a file (creates directories if missing) (ESM)
import fs from 'fs';
import path from 'path';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'write_file',
    description: 'Create a new file or overwrite an existing file with content.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute file path to write'
        },
        content: {
          type: 'string',
          description: 'Text content to write into the file'
        }
      },
      required: ['path', 'content']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var filePath = resolvePath(args ? args.path : '', workspace);
  var content = args ? (args.content || '') : '';

  return new Promise(function(resolve) {
    if (!filePath) {
      resolve({
        success: false,
        error: 'File path is required',
        content: 'Wrote file failed: File path is required'
      });
      return;
    }

    var dirName = path.dirname(filePath);
    fs.mkdir(dirName, { recursive: true }, function(mkdirErr) {
      if (mkdirErr) {
        resolve({
          success: false,
          error: mkdirErr.message,
          content: "Wrote file '" + (args.path || filePath) + "' failed: " + mkdirErr.message
        });
        return;
      }

      fs.writeFile(filePath, content, 'utf8', function(writeErr) {
        if (writeErr) {
          resolve({
            success: false,
            error: writeErr.message,
            content: "Wrote file '" + (args.path || filePath) + "' failed: " + writeErr.message
          });
          return;
        }

        resolve({
          success: true,
          content: "Wrote file '" + (args.path || filePath) + "' successfully",
          file_path: args.path || filePath,
          bytes: Buffer.byteLength(content, 'utf8')
        });
      });
    });
  });
}

export function writeFile(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('writeFile', args, output);
  });
}
