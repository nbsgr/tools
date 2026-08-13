// terminalInput.js — Sends input text to an active interactive terminal process (ESM)
import { getActiveProcess } from './executeCommand.js';
import { formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'terminal_input',
    description: 'Send keyboard text input to an active interactive terminal process.',
    parameters: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Text string to send into the process stdin'
        },
        processId: {
          type: 'number',
          description: 'Target process PID (optional)'
        }
      },
      required: ['input']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var inputStr = args ? (args.input || '') : '';
  var processId = args ? args.processId : null;

  return new Promise(function(resolve) {
    if (!inputStr) {
      resolve({
        success: false,
        error: 'Input string is required',
        content: 'Failed to send terminal input: Input string is required'
      });
      return;
    }

    var activeObj = getActiveProcess(processId);
    if (!activeObj || !activeObj.child || !activeObj.child.stdin) {
      resolve({
        success: false,
        error: 'No active interactive terminal process found',
        content: 'Failed to send terminal input: No active interactive process'
      });
      return;
    }

    try {
      var textToSend = inputStr.endsWith('\n') ? inputStr : (inputStr + '\n');
      activeObj.child.stdin.write(textToSend);
      resolve({
        success: true,
        content: 'Sent terminal input successfully',
        inputSent: inputStr,
        processId: activeObj.pid
      });
    } catch (err) {
      resolve({
        success: false,
        error: err.message,
        content: 'Failed to send terminal input: ' + err.message
      });
    }
  });
}

export function terminalInput(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('terminalInput', args, output);
  });
}
