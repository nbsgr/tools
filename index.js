// index.js — Main library entry point for coderun-tools (ESM)
import {
  getDefinitions,
  executeTool,
  toolNames,
  getToolNames,
  getOpenAiAgentsDefinitions,
  getGeminiAdkDefinitions,
  getLangchainDefinitions
} from './src/toolRegistry.js';
import { readFile } from './src/tools/readFile.js';
import { writeFile } from './src/tools/writeFile.js';
import { editFile } from './src/tools/editFile.js';
import { patchFile } from './src/tools/patchFile.js';
import { deleteFile } from './src/tools/deleteFile.js';
import { createFolder } from './src/tools/createFolder.js';
import { deleteFolder } from './src/tools/deleteFolder.js';
import { listDirectory } from './src/tools/listDirectory.js';
import { getFileInfo } from './src/tools/getFileInfo.js';
import { searchFiles } from './src/tools/searchFiles.js';
import { findInFiles } from './src/tools/findInFiles.js';
import { listSymbols } from './src/tools/listSymbols.js';
import { executeCommand, runTerminal } from './src/tools/executeCommand.js';
import { terminalInput } from './src/tools/terminalInput.js';
import { stopTerminal } from './src/tools/stopTerminal.js';
import { createPlan } from './src/tools/createPlan.js';
import { updatePlan } from './src/tools/updatePlan.js';
import { getCurrentDatetime } from './src/tools/getCurrentDatetime.js';
import { webRequest } from './src/tools/webRequest.js';

export {
  getDefinitions,
  executeTool,
  toolNames,
  getToolNames,
  getOpenAiAgentsDefinitions,
  getGeminiAdkDefinitions,
  getLangchainDefinitions,
  readFile,
  writeFile,
  editFile,
  patchFile,
  deleteFile,
  createFolder,
  deleteFolder,
  listDirectory,
  getFileInfo,
  searchFiles,
  findInFiles,
  listSymbols,
  executeCommand,
  runTerminal,
  terminalInput,
  stopTerminal,
  createPlan,
  updatePlan,
  getCurrentDatetime,
  webRequest
};

var coderunTools = {
  getDefinitions: getDefinitions,
  executeTool: executeTool,
  toolNames: toolNames,
  getToolNames: getToolNames,
  getOpenAiAgentsDefinitions: getOpenAiAgentsDefinitions,
  getGeminiAdkDefinitions: getGeminiAdkDefinitions,
  getLangchainDefinitions: getLangchainDefinitions,
  readFile: readFile,
  writeFile: writeFile,
  editFile: editFile,
  patchFile: patchFile,
  deleteFile: deleteFile,
  createFolder: createFolder,
  deleteFolder: deleteFolder,
  listDirectory: listDirectory,
  getFileInfo: getFileInfo,
  searchFiles: searchFiles,
  findInFiles: findInFiles,
  listSymbols: listSymbols,
  executeCommand: executeCommand,
  runTerminal: runTerminal,
  terminalInput: terminalInput,
  stopTerminal: stopTerminal,
  createPlan: createPlan,
  updatePlan: updatePlan,
  getCurrentDatetime: getCurrentDatetime,
  webRequest: webRequest
};

export default coderunTools;
