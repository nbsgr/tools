// listSymbols.js — Extracts function and class symbol definitions from a code file (ESM)
import fs from 'fs';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'list_symbols',
    description: 'Extract code symbols (functions, classes, variables) from a file.',
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
        content: 'List symbols failed: File path is required'
      });
      return;
    }

    fs.readFile(filePath, 'utf8', function(err, content) {
      if (err) {
        resolve({
          success: false,
          error: err.message,
          content: "List symbols in '" + (args.path || filePath) + "' failed: " + err.message
        });
        return;
      }

      var lines = content.split(/\r?\n/);
      var symbols = [];

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var funcMatch = line.match(/function\s+([A-Za-z0-9_$]+)/) || line.match(/var\s+([A-Za-z0-9_$]+)\s*=\s*function/);
        if (funcMatch) {
          symbols.push({ name: funcMatch[1], kind: 'function', line: i + 1 });
        }
        var classMatch = line.match(/class\s+([A-Za-z0-9_$]+)/);
        if (classMatch) {
          symbols.push({ name: classMatch[1], kind: 'class', line: i + 1 });
        }
      }

      var formatted = [];
      for (var s = 0; s < symbols.length; s++) {
        var sym = symbols[s];
        formatted.push((sym.kind === 'function' ? 'ƒ ' : '⚙ ') + sym.name + ' (line ' + sym.line + ')');
      }

      resolve({
        success: true,
        content: formatted.length ? formatted.join('\n') : 'No symbols found in file',
        symbols: symbols
      });
    });
  });
}

export function listSymbols(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('listSymbols', args, output);
  });
}
