// stopTerminal.js — Stops an active interactive terminal process (ESM)
import { getActiveProcess, removeActiveProcess } from './executeCommand.js';
import { formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'stop_terminal',
    description: 'Stop a running interactive process in the terminal.',
    parameters: {
      type: 'object',
      properties: {
        processId: {
          type: 'number',
          description: 'Target process PID to stop (optional)'
        }
      }
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var processId = args ? args.processId : null;

  return new Promise(function(resolve) {
    var activeObj = getActiveProcess(processId);
    if (!activeObj || !activeObj.child) {
      resolve({
        success: false,
        error: 'No active terminal process to stop',
        content: 'Stopped terminal failed: No active process'
      });
      return;
    }

    var pid = activeObj.pid;
    try {
      activeObj.child.kill();
      removeActiveProcess(pid);
      resolve({
        success: true,
        content: 'Stopped terminal successfully',
        processId: pid
      });
    } catch (err) {
      resolve({
        success: false,
        error: err.message,
        content: 'Stopped terminal failed: ' + err.message
      });
    }
  });
}

export function stopTerminal(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('stopTerminal', args, output);
  });
}
