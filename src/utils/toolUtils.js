// toolUtils.js — Helper utilities for tool execution and response formatting (ESM)
import path from 'path';

// Resolve path relative to workspace folder or CWD
export function resolvePath(targetPath, workspaceFolder) {
  if (!targetPath) return '';
  if (path.isAbsolute(targetPath)) return targetPath;
  var root = workspaceFolder || process.cwd();
  return path.resolve(root, targetPath);
}

// Wrap tool result in standard object: { toolName, args, output }
export function formatResponse(toolName, args, output) {
  return {
    toolName: toolName,
    args: args || {},
    output: output || {}
  };
}
