// toolRegistry.js — Central registration and resolution map for all tools (ESM)
import { formatResponse } from './utils/toolUtils.js';

import * as readFileModule from './tools/readFile.js';
import * as writeFileModule from './tools/writeFile.js';
import * as editFileModule from './tools/editFile.js';
import * as patchFileModule from './tools/patchFile.js';
import * as deleteFileModule from './tools/deleteFile.js';
import * as createFolderModule from './tools/createFolder.js';
import * as deleteFolderModule from './tools/deleteFolder.js';
import * as listDirectoryModule from './tools/listDirectory.js';
import * as getFileInfoModule from './tools/getFileInfo.js';
import * as searchFilesModule from './tools/searchFiles.js';
import * as findInFilesModule from './tools/findInFiles.js';
import * as listSymbolsModule from './tools/listSymbols.js';
import * as executeCommandModule from './tools/executeCommand.js';
import * as terminalInputModule from './tools/terminalInput.js';
import * as stopTerminalModule from './tools/stopTerminal.js';
import * as createPlanModule from './tools/createPlan.js';
import * as updatePlanModule from './tools/updatePlan.js';
import * as getCurrentDatetimeModule from './tools/getCurrentDatetime.js';
import * as webRequestModule from './tools/webRequest.js';

var registry = {};

function registerTool(name, moduleObj) {
  registry[name] = moduleObj;
  if (moduleObj.definition && moduleObj.definition.function && moduleObj.definition.function.name) {
    var fnName = moduleObj.definition.function.name;
    registry[fnName] = moduleObj;
  }
}

registerTool('readFile', readFileModule);
registerTool('read_file', readFileModule);

registerTool('writeFile', writeFileModule);
registerTool('write_file', writeFileModule);

registerTool('editFile', editFileModule);
registerTool('edit_file', editFileModule);

registerTool('patchFile', patchFileModule);
registerTool('patch_file', patchFileModule);

registerTool('deleteFile', deleteFileModule);
registerTool('delete_file', deleteFileModule);

registerTool('createFolder', createFolderModule);
registerTool('create_folder', createFolderModule);

registerTool('deleteFolder', deleteFolderModule);
registerTool('delete_folder', deleteFolderModule);

registerTool('listDirectory', listDirectoryModule);
registerTool('list_directory', listDirectoryModule);

registerTool('getFileInfo', getFileInfoModule);
registerTool('get_file_info', getFileInfoModule);

registerTool('searchFiles', searchFilesModule);
registerTool('search_files', searchFilesModule);

registerTool('findInFiles', findInFilesModule);
registerTool('find_in_files', findInFilesModule);

registerTool('listSymbols', listSymbolsModule);
registerTool('list_symbols', listSymbolsModule);

registerTool('executeCommand', executeCommandModule);
registerTool('run_terminal', executeCommandModule);
registerTool('runTerminal', executeCommandModule);
registerTool('execute_command', executeCommandModule);
registerTool('bash', executeCommandModule);

registerTool('terminalInput', terminalInputModule);
registerTool('terminal_input', terminalInputModule);

registerTool('stopTerminal', stopTerminalModule);
registerTool('stop_terminal', stopTerminalModule);

registerTool('createPlan', createPlanModule);
registerTool('create_plan', createPlanModule);

registerTool('updatePlan', updatePlanModule);
registerTool('update_plan', updatePlanModule);

registerTool('getCurrentDatetime', getCurrentDatetimeModule);
registerTool('get_current_datetime', getCurrentDatetimeModule);

registerTool('webRequest', webRequestModule);
registerTool('web_request', webRequestModule);

export function getDefinitions() {
  var defs = [];
  var seen = {};
  var keys = Object.keys(registry);

  for (var i = 0; i < keys.length; i++) {
    var mod = registry[keys[i]];
    if (mod && mod.definition && !seen[mod.definition.function.name]) {
      seen[mod.definition.function.name] = true;
      defs.push(mod.definition);
    }
  }

  return defs;
}

export function executeTool(toolName, args, options) {
  var targetModule = registry[toolName];
  if (!targetModule || typeof targetModule.handler !== 'function') {
    return Promise.resolve(formatResponse(toolName, args, {
      success: false,
      error: "Unknown tool '" + toolName + "'",
      content: "Unknown tool execution requested: " + toolName
    }));
  }

  return targetModule.handler(args, options).then(function(output) {
    return formatResponse(toolName, args, output);
  });
}

export {
  registry
};
