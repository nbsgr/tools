// searchFiles.js — Searches for file paths matching a pattern/query (ESM)
import fs from 'fs';
import path from 'path';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'search_files',
    description: 'Recursively search for files matching a pattern or name query.',
    parameters: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Filename or extension pattern to match (e.g. *.js, index)'
        },
        path: {
          type: 'string',
          description: 'Directory path to search within'
        }
      },
      required: ['pattern']
    }
  }
};

function walkDir(dir, pattern, matches) {
  try {
    var items = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.name === 'node_modules' || item.name === '.git') continue;
      var fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        walkDir(fullPath, pattern, matches);
      } else if (item.name.toLowerCase().indexOf(pattern.toLowerCase()) !== -1) {
        matches.push(fullPath);
      }
    }
  } catch (_) {}
}

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var pattern = args ? (args.pattern || '') : '';
  var cleanPattern = pattern.replace(/^\*+/, '').replace(/\*+$/, '');
  var searchDir = resolvePath((args && args.path) ? args.path : workspace, workspace);

  return new Promise(function(resolve) {
    var matches = [];
    walkDir(searchDir, cleanPattern, matches);

    var relMatches = [];
    for (var i = 0; i < matches.length; i++) {
      relMatches.push(path.relative(workspace, matches[i]));
    }

    resolve({
      success: true,
      content: relMatches.length ? relMatches.join('\n') : "No files matching '" + pattern + "' found",
      matches: relMatches
    });
  });
}

export function searchFiles(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('searchFiles', args, output);
  });
}
