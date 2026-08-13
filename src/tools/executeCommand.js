// executeCommand.js — Live terminal execution with 300ms streaming interval (ESM)
import { spawn } from 'child_process';
import { resolvePath, formatResponse } from '../utils/toolUtils.js';

var _activeProcesses = {};

export var definition = {
  type: 'function',
  function: {
    name: 'run_terminal',
    description: 'Execute a terminal shell command with live 300ms streaming (supports self-executing and interactive background processes).',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Shell command line string to execute'
        },
        cwd: {
          type: 'string',
          description: 'Working directory path (optional)'
        },
        isInteractive: {
          type: 'boolean',
          description: 'Set true for long-running/interactive processes (e.g. servers, dev watchers)'
        }
      },
      required: ['command']
    }
  }
};

export function getActiveProcess(processId) {
  if (processId && _activeProcesses[processId]) {
    return _activeProcesses[processId];
  }
  var keys = Object.keys(_activeProcesses);
  if (keys.length > 0) {
    return _activeProcesses[keys[keys.length - 1]];
  }
  return null;
}

export function removeActiveProcess(pid) {
  if (_activeProcesses[pid]) {
    var proc = _activeProcesses[pid];
    if (proc.flushTimer) {
      clearInterval(proc.flushTimer);
    }
    delete _activeProcesses[pid];
  }
}

export function handler(args, options) {
  options = options || {};
  var workspace = options.workspaceFolder || process.cwd();
  var command = args ? (args.command || '') : '';
  var cwd = resolvePath((args && args.cwd) ? args.cwd : workspace, workspace);
  var isInteractive = args ? (args.isInteractive === true || options.isInteractive === true) : false;
  var onData = options.onData;

  return new Promise(function(resolve) {
    if (!command) {
      resolve({
        success: false,
        error: 'Command string is required',
        content: 'Command failed: Command string is required',
        command: '',
        exitCode: 1
      });
      return;
    }

    var startTime = Date.now();
    var isWin = process.platform === 'win32';
    var shell = isWin ? 'powershell.exe' : '/bin/bash';
    var shellArgs = isWin ? ['-NoProfile', '-Command', command] : ['-c', command];

    try {
      var child = spawn(shell, shellArgs, {
        cwd: cwd,
        env: process.env,
        windowsHide: true
      });
    } catch (spawnErr) {
      resolve({
        success: false,
        error: spawnErr.message,
        content: "Command '" + command + "' failed to start: " + spawnErr.message,
        command: command,
        exitCode: 1
      });
      return;
    }

    var pid = child.pid;
    var stdoutBuf = '';
    var stderrBuf = '';
    var pendingStreamBuf = '';

    // Set up 300ms stream flushing interval for immediate response
    var flushTimer = setInterval(function() {
      if (pendingStreamBuf.length > 0) {
        if (typeof onData === 'function') {
          onData({
            type: 'terminal_stream',
            data: pendingStreamBuf,
            pid: pid,
            command: command
          });
        }
        pendingStreamBuf = '';
      }
    }, 300);

    // Handle stdout data chunks
    if (child.stdout) {
      child.stdout.on('data', function(chunk) {
        var str = chunk.toString();
        stdoutBuf += str;
        pendingStreamBuf += str;
        if (typeof onData === 'function') {
          onData({ type: 'stdout', data: str, pid: pid, command: command });
        }
      });
    }

    // Handle stderr data chunks
    if (child.stderr) {
      child.stderr.on('data', function(chunk) {
        var str = chunk.toString();
        stderrBuf += str;
        pendingStreamBuf += str;
        if (typeof onData === 'function') {
          onData({ type: 'stderr', data: str, pid: pid, command: command });
        }
      });
    }

    // INTERACTIVE / BACKGROUND COMMAND MODE
    if (isInteractive) {
      _activeProcesses[pid] = {
        pid: pid,
        command: command,
        child: child,
        cwd: cwd,
        startedAt: startTime,
        flushTimer: flushTimer
      };

      child.on('close', function(code) {
        clearInterval(flushTimer);
        removeActiveProcess(pid);
        if (typeof onData === 'function') {
          onData({ type: 'exit', code: code, pid: pid, command: command });
        }
      });

      // Immediate response returned for interactive mode
      resolve({
        success: true,
        content: "Command '" + command + "' started in interactive mode (PID " + pid + ").",
        command: command,
        processId: pid,
        isInteractive: true,
        stdout: '',
        stderr: '',
        output: "Interactive process PID " + pid + " running in background with 300ms live stream.",
        exitCode: 0,
        durationMs: Date.now() - startTime
      });
      return;
    }

    // SELF-EXECUTING COMMAND MODE
    var timeoutMs = options.timeout || 60000;
    var timer = setTimeout(function() {
      clearInterval(flushTimer);
      try {
        child.kill();
      } catch (_) {}
      resolve({
        success: false,
        error: 'Command timed out after ' + (timeoutMs / 1000) + ' seconds',
        content: "Command '" + command + "' failed: timed out after " + (timeoutMs / 1000) + 's',
        command: command,
        stdout: stdoutBuf,
        stderr: stderrBuf,
        output: (stdoutBuf + '\n' + stderrBuf).trim(),
        exitCode: -1,
        durationMs: Date.now() - startTime
      });
    }, timeoutMs);

    child.on('close', function(exitCode) {
      clearInterval(flushTimer);
      if (pendingStreamBuf.length > 0 && typeof onData === 'function') {
        onData({ type: 'terminal_stream', data: pendingStreamBuf, pid: pid, command: command });
        pendingStreamBuf = '';
      }

      var code = exitCode !== null ? exitCode : 0;
      var success = code === 0;
      var fullOutput = (stdoutBuf + (stderrBuf ? '\n' + stderrBuf : '')).trim();

      var summary = success ?
        ("Command '" + command + "' executed successfully (exit code " + code + ")") :
        ("Command '" + command + "' failed with exit code " + code + ": " + (fullOutput || 'Error'));

      resolve({
        success: success,
        content: summary,
        command: command,
        stdout: stdoutBuf,
        stderr: stderrBuf,
        output: fullOutput,
        exitCode: code,
        durationMs: Date.now() - startTime
      });
    });

    child.on('error', function(err) {
      clearInterval(flushTimer);
      resolve({
        success: false,
        error: err.message,
        content: "Command '" + command + "' failed: " + err.message,
        command: command,
        stdout: stdoutBuf,
        stderr: stderrBuf,
        output: (stdoutBuf + '\n' + stderrBuf).trim(),
        exitCode: 1,
        durationMs: Date.now() - startTime
      });
    });
  });
}

export function executeCommand(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('executeCommand', args, output);
  });
}

export function runTerminal(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('runTerminal', args, output);
  });
}
