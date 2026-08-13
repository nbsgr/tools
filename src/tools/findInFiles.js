// findInFiles.js — Searches file contents for text query (ESM)
import fs from 'fs';
import path from 'path';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'find_in_files',
    description: 'Search for text query inside all project files.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Text string or keyword to search for'
        },
        path: {
          type: 'string',
          description: 'Directory path to search within'
        }
      },
      required: ['query']
    }
  }
};

function searchInDirectory(dir, query, matches) {
  try {
    var items = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.name === 'node_modules' || item.name === '.git' || item.name === 'dist' || item.name === 'build') continue;
      var fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        searchInDirectory(fullPath, query, matches);
      } else if (item.isFile()) {
        try {
          var content = fs.readFileSync(fullPath, 'utf8');
          var lines = content.split(/\r?\n/);
          for (var li = 0; li < lines.length; li++) {
            if (lines[li].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              matches.push({
                file: fullPath,
                line: li + 1,
                text: lines[li].trim()
              });
              if (matches.length >= 100) return;
            }
          }
        } catch (_) {}
      }
    }
  } catch (_) {}
}

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var query = args ? (args.query || '') : '';
  var searchDir = resolvePath((args && args.path) ? args.path : workspace, workspace);

  return new Promise(function(resolve) {
    if (!query) {
      resolve({
        success: false,
        error: 'Search query is required',
        content: 'Find in files failed: Search query is required'
      });
      return;
    }

    var matches = [];
    searchInDirectory(searchDir, query, matches);

    var formattedLines = [];
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      var relFile = path.relative(workspace, m.file);
      formattedLines.push(relFile + ':' + m.line + ': ' + m.text);
    }

    resolve({
      success: true,
      content: formattedLines.length ? formattedLines.join('\n') : "No matches found for '" + query + "'",
      matches: matches
    });
  });
}

export function findInFiles(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('findInFiles', args, output);
  });
}
