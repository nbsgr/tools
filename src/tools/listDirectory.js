// listDirectory.js — Lists files and folders in a directory (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'list_directory',
    description: 'List the files and subdirectories inside a directory.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative or absolute directory path to list (defaults to workspace root)'
        }
      }
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var reqPath = args ? (args.path || '') : '';
  var folderPath = resolvePath(reqPath, workspace);

  return new Promise(function(resolve) {
    fs.readdir(folderPath, { withFileTypes: true }, function(err, items) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "Listed directory '" + (reqPath || '.') + "' failed: " + err.message
        });
        return;
      }

      var resultList = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        resultList.push({
          name: item.name,
          type: item.isDirectory() ? 'directory' : (item.isFile() ? 'file' : 'other')
        });
      }

      var summaryLines = [];
      for (var j = 0; j < resultList.length; j++) {
        var it = resultList[j];
        summaryLines.push((it.type === 'directory' ? '📁 ' : '📄 ') + it.name);
      }

      resolve({
        success: true,
        content: summaryLines.join('\n') || 'Directory is empty',
        folder_path: reqPath || '.',
        items: resultList
      });
    });
  });
}

export function listDirectory(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('listDirectory', args, output);
  });
}
