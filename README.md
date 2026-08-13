# 🛠️ coderun-tools

Standalone, multi-provider AI Agent tools library built in pure JavaScript (ES Modules, `"type": "module"`).

Designed for frictionless integration into any AI agent framework (OpenAI, Anthropic, Gemini, Ollama, VS Code extensions, or Node.js backends) with zero re-architecting.

---

## 🚀 Key Features

- **Standardized Return Payload**: Every tool call resolves to `{ toolName, args, output }`.
- **ES Modules (`"type": "module"`)**: Clean `import` / `export` API.
- **Dual Terminal Execution Engine**:
  - **Self-Executing Mode**: Executes shell commands synchronously with live 300ms stream flushing.
  - **Interactive Mode (`isInteractive: true`)**: Spawns long-running background processes (servers, interactive REPLs) immediately (15-30ms response) with PID tracking, live 300ms stream callbacks (`onData`), and stdin control (`terminalInput`).
- **Plan Task Tracking**: Standardized task lifecycle (`TODO` ➜ `WIP` ➜ `DONE`).

---

## 📦 Installation

To install `coderun-tools` in your project:

```bash
npm install coderun-tools
```

Or for local development:
```bash
npm install ./path/to/coderun-tools
```

---

## 💻 How to Import and Use

### 1. In ES Modules (`"type": "module"` or `.mjs` files)

```javascript
// Default import:
import coderunTools from 'coderun-tools';

// Or named imports:
import { 
  readFile, 
  writeFile, 
  executeCommand, 
  createPlan, 
  updatePlan, 
  getDefinitions, 
  executeTool 
} from 'coderun-tools';

// Example 1: Direct tool execution
const res = await coderunTools.readFile({ path: 'package.json' });
console.log(res);
// Returns: { toolName: 'readFile', args: { path: 'package.json' }, output: { success: true, content: '...' } }

// Example 2: Generic LLM tool dispatcher
const toolsSchema = getDefinitions(); // Pass this array to OpenAI / Anthropic / Ollama tool parameters
const toolCallResult = await executeTool('read_file', { path: 'package.json' });
```

### 2. In CommonJS (`require` projects)

```javascript
// Use dynamic import() inside async functions:
const coderunTools = (await import('coderun-tools')).default;
const { readFile, executeCommand } = await import('coderun-tools');

const res = await readFile({ path: 'package.json' });
```

---

## 📚 Complete Tool Reference (Success & Failure Outputs)

### 📄 1. `readFile`
Reads the full contents of a file.

#### Usage:
```javascript
import coderunTools from 'coderun-tools';
var result = await coderunTools.readFile({ path: 'package.json' });
```

#### ✅ Success Output:
```json
{
  "toolName": "readFile",
  "args": {
    "path": "package.json"
  },
  "output": {
    "success": true,
    "content": "{\n  \"name\": \"coderun-tools\",\n  \"version\": \"1.0.0\"\n}\n",
    "file_path": "package.json",
    "bytes": 443
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "readFile",
  "args": {
    "path": "non_existent_file.txt"
  },
  "output": {
    "success": false,
    "error": "ENOENT: no such file or directory, open 'D:\\project\\non_existent_file.txt'",
    "content": "Read file 'non_existent_file.txt' failed: ENOENT: no such file or directory, open 'D:\\project\\non_existent_file.txt'"
  }
}
```

---

### ✍️ 2. `writeFile`
Creates a file or overwrites an existing file, creating missing parent directories recursively.

#### Usage:
```javascript
var result = await coderunTools.writeFile({
  path: 'src/app.js',
  content: 'console.log("Hello CodeRun!");'
});
```

#### ✅ Success Output:
```json
{
  "toolName": "writeFile",
  "args": {
    "path": "src/app.js",
    "content": "console.log(\"Hello CodeRun!\");"
  },
  "output": {
    "success": true,
    "content": "Wrote file 'src/app.js' successfully",
    "file_path": "src/app.js",
    "bytes": 31
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "writeFile",
  "args": {
    "path": "",
    "content": "some text"
  },
  "output": {
    "success": false,
    "error": "File path is required",
    "content": "Wrote file failed: File path is required"
  }
}
```

---

### ✏️ 3. `editFile`
Replaces a specific text block (`oldText`) with new text (`newText`).

#### Usage:
```javascript
var result = await coderunTools.editFile({
  path: 'src/app.js',
  oldText: 'Hello CodeRun!',
  newText: 'Hello CodeRun World!'
});
```

#### ✅ Success Output:
```json
{
  "toolName": "editFile",
  "args": {
    "path": "src/app.js",
    "oldText": "Hello CodeRun!",
    "newText": "Hello CodeRun World!"
  },
  "output": {
    "success": true,
    "content": "Patched file 'src/app.js' successfully",
    "file_path": "src/app.js",
    "bytes": 37
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "editFile",
  "args": {
    "path": "src/app.js",
    "oldText": "NON_EXISTENT_TEXT",
    "newText": "replacement"
  },
  "output": {
    "success": false,
    "error": "Target oldText not found in file",
    "content": "Edit file 'src/app.js' failed: Target oldText not found in file"
  }
}
```

---

### 🩹 4. `patchFile`
Applies multiple search-and-replace patch blocks to a file in sequence.

#### Usage:
```javascript
var result = await coderunTools.patchFile({
  path: 'src/config.js',
  patches: [
    { oldText: '3000', newText: '8080' },
    { oldText: 'localhost', newText: '0.0.0.0' }
  ]
});
```

#### ✅ Success Output:
```json
{
  "toolName": "patchFile",
  "args": {
    "path": "src/config.js",
    "patches": [
      { "oldText": "3000", "newText": "8080" },
      { "oldText": "localhost", "newText": "0.0.0.0" }
    ]
  },
  "output": {
    "success": true,
    "content": "Patched file 'src/config.js' successfully",
    "file_path": "src/config.js",
    "appliedPatches": 2
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "patchFile",
  "args": {
    "path": "src/config.js",
    "patches": [
      { "oldText": "MISSING_TARGET", "newText": "value" }
    ]
  },
  "output": {
    "success": false,
    "error": "Patch block #1 target oldText not found",
    "content": "Patch file 'src/config.js' failed: Patch block #1 target oldText not found"
  }
}
```

---

### 🗑️ 5. `deleteFile`
Deletes a single file permanently.

#### Usage:
```javascript
var result = await coderunTools.deleteFile({ path: 'scratch.tmp' });
```

#### ✅ Success Output:
```json
{
  "toolName": "deleteFile",
  "args": {
    "path": "scratch.tmp"
  },
  "output": {
    "success": true,
    "content": "Deleted file 'scratch.tmp' successfully",
    "file_path": "scratch.tmp"
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "deleteFile",
  "args": {
    "path": "non_existent.tmp"
  },
  "output": {
    "success": false,
    "error": "ENOENT: no such file or directory, unlink 'D:\\project\\non_existent.tmp'",
    "content": "Deleted file 'non_existent.tmp' failed: ENOENT: no such file or directory, unlink 'D:\\project\\non_existent.tmp'"
  }
}
```

---

### 📁 6. `createFolder`
Creates a directory and any missing parent directories recursively.

#### Usage:
```javascript
var result = await coderunTools.createFolder({ path: 'src/utils/logs' });
```

#### ✅ Success Output:
```json
{
  "toolName": "createFolder",
  "args": {
    "path": "src/utils/logs"
  },
  "output": {
    "success": true,
    "content": "Created folder 'src/utils/logs' successfully",
    "folder_path": "src/utils/logs"
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "createFolder",
  "args": {
    "path": ""
  },
  "output": {
    "success": false,
    "error": "Folder path is required",
    "content": "Create folder failed: Folder path is required"
  }
}
```

---

### 📂 7. `listDirectory`
Lists files and subdirectories inside a folder.

#### Usage:
```javascript
var result = await coderunTools.listDirectory({ path: 'src' });
```

#### ✅ Success Output:
```json
{
  "toolName": "listDirectory",
  "args": {
    "path": "src"
  },
  "output": {
    "success": true,
    "content": "📄 app.js\n📁 tools\n📄 index.js",
    "folder_path": "src",
    "items": [
      { "name": "app.js", "type": "file" },
      { "name": "tools", "type": "directory" },
      { "name": "index.js", "type": "file" }
    ]
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "listDirectory",
  "args": {
    "path": "non_existent_dir"
  },
  "output": {
    "success": false,
    "error": "ENOENT: no such file or directory, scandir 'D:\\project\\non_existent_dir'",
    "content": "Listed directory 'non_existent_dir' failed: ENOENT: no such file or directory, scandir 'D:\\project\\non_existent_dir'"
  }
}
```

---

### ℹ️ 8. `getFileInfo`
Gets metadata (size, timestamps, entry type) for a file or directory.

#### Usage:
```javascript
var result = await coderunTools.getFileInfo({ path: 'package.json' });
```

#### ✅ Success Output:
```json
{
  "toolName": "getFileInfo",
  "args": {
    "path": "package.json"
  },
  "output": {
    "success": true,
    "content": "Type: file, Size: 443 bytes, Modified: Thu Aug 13 2026 17:00:00 GMT+0530",
    "info": {
      "file_path": "package.json",
      "size": 443,
      "isDirectory": false,
      "isFile": true,
      "created": "2026-08-13T11:00:00.000Z",
      "modified": "2026-08-13T11:00:00.000Z"
    }
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "getFileInfo",
  "args": {
    "path": "missing.json"
  },
  "output": {
    "success": false,
    "error": "ENOENT: no such file or directory, stat 'D:\\project\\missing.json'",
    "content": "Got file info for 'missing.json' failed: ENOENT: no such file or directory, stat 'D:\\project\\missing.json'"
  }
}
```

---

### 🗑️ 9. `deleteFolder`
Deletes a directory and all of its contents recursively.

#### Usage:
```javascript
var result = await coderunTools.deleteFolder({ path: 'dist' });
```

#### ✅ Success Output:
```json
{
  "toolName": "deleteFolder",
  "args": {
    "path": "dist"
  },
  "output": {
    "success": true,
    "content": "Deleted folder 'dist' successfully",
    "folder_path": "dist"
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "deleteFolder",
  "args": {
    "path": ""
  },
  "output": {
    "success": false,
    "error": "Folder path is required",
    "content": "Delete folder failed: Folder path is required"
  }
}
```

---

### 🔍 10. `searchFiles`
Recursively finds file paths matching a filename or extension pattern.

#### Usage:
```javascript
var result = await coderunTools.searchFiles({ pattern: 'readFile' });
```

#### ✅ Success Output:
```json
{
  "toolName": "searchFiles",
  "args": {
    "pattern": "readFile"
  },
  "output": {
    "success": true,
    "content": "src\\tools\\readFile.js\ntest\\readfile_success.js",
    "matches": [
      "src\\tools\\readFile.js",
      "test\\readfile_success.js"
    ]
  }
}
```

#### 🔴 Failure Output (No Matches):
```json
{
  "toolName": "searchFiles",
  "args": {
    "pattern": "NON_EXISTENT_PATTERN"
  },
  "output": {
    "success": true,
    "content": "No files matching 'NON_EXISTENT_PATTERN' found",
    "matches": []
  }
}
```

---

### 🔎 11. `findInFiles`
Searches for text content inside workspace files.

#### Usage:
```javascript
var result = await coderunTools.findInFiles({ query: 'formatResponse' });
```

#### ✅ Success Output:
```json
{
  "toolName": "findInFiles",
  "args": {
    "query": "formatResponse"
  },
  "output": {
    "success": true,
    "content": "src\\toolRegistry.js:74: return formatResponse(toolName, args, {\nsrc\\tools\\readFile.js:60: return formatResponse('readFile', args, output);",
    "matches": [
      {
        "file": "D:\\project\\src\\toolRegistry.js",
        "line": 74,
        "text": "return formatResponse(toolName, args, {"
      }
    ]
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "findInFiles",
  "args": {
    "query": ""
  },
  "output": {
    "success": false,
    "error": "Search query is required",
    "content": "Find in files failed: Search query is required"
  }
}
```

---

### ⚙️ 12. `listSymbols`
Extracts function and class symbol definitions from a code file.

#### Usage:
```javascript
var result = await coderunTools.listSymbols({ path: 'src/toolRegistry.js' });
```

#### ✅ Success Output:
```json
{
  "toolName": "listSymbols",
  "args": {
    "path": "src/toolRegistry.js"
  },
  "output": {
    "success": true,
    "content": "ƒ registerTool (line 26)\nƒ getDefinitions (line 55)\nƒ executeTool (line 67)",
    "symbols": [
      { "name": "registerTool", "kind": "function", "line": 26 },
      { "name": "getDefinitions", "kind": "function", "line": 55 },
      { "name": "executeTool", "kind": "function", "line": 67 }
    ]
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "listSymbols",
  "args": {
    "path": "non_existent.js"
  },
  "output": {
    "success": false,
    "error": "ENOENT: no such file or directory, open 'D:\\project\\non_existent.js'",
    "content": "List symbols in 'non_existent.js' failed: ENOENT: no such file or directory, open 'D:\\project\\non_existent.js'"
  }
}
```

---

### 💻 13. `executeCommand` (Self-Executing Mode)
Executes a terminal command and returns stdout/stderr with live 300ms stream callbacks (`options.onData`).

#### Usage:
```javascript
var result = await coderunTools.executeCommand({ command: 'node -v' });
```

#### ✅ Success Output:
```json
{
  "toolName": "executeCommand",
  "args": {
    "command": "node -v"
  },
  "output": {
    "success": true,
    "content": "Command 'node -v' executed successfully (exit code 0)",
    "command": "node -v",
    "stdout": "v24.18.0\r\n",
    "stderr": "",
    "output": "v24.18.0",
    "exitCode": 0,
    "durationMs": 2531
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "executeCommand",
  "args": {
    "command": "invalid_command_xyz"
  },
  "output": {
    "success": false,
    "content": "Command 'invalid_command_xyz' failed with exit code 1: invalid_command_xyz : The term 'invalid_command_xyz' is not recognized...",
    "command": "invalid_command_xyz",
    "stdout": "",
    "stderr": "invalid_command_xyz : The term 'invalid_command_xyz' is not recognized...",
    "output": "invalid_command_xyz : The term 'invalid_command_xyz' is not recognized...",
    "exitCode": 1,
    "durationMs": 3015
  }
}
```

---

### ⚡ 14. `executeCommand` (Interactive Mode: `isInteractive: true`)
Spawns long-running or interactive background processes (dev servers, REPLs) and **returns immediately in 15-30ms** with process PID, live 300ms stream callbacks, and background execution.

#### Usage:
```javascript
var options = {
  onData: function(evt) {
    console.log('300ms Live Stream:', evt.data);
  }
};

var result = await coderunTools.executeCommand({
  command: 'node',
  isInteractive: true
}, options);
```

#### ✅ Success Output (Returned Immediately in 15-30ms):
```json
{
  "toolName": "executeCommand",
  "args": {
    "command": "node",
    "isInteractive": true
  },
  "output": {
    "success": true,
    "content": "Command 'node' started in interactive mode (PID 44716).",
    "command": "node",
    "processId": 44716,
    "isInteractive": true,
    "stdout": "",
    "stderr": "",
    "output": "Interactive process PID 44716 running in background with 300ms live stream.",
    "exitCode": 0,
    "durationMs": 17
  }
}
```

---

### ⌨️ 15. `terminalInput`
Sends keyboard input text into an active background interactive process's `stdin`.

#### Usage:
```javascript
var result = await coderunTools.terminalInput({
  input: 'console.log(10 + 20);\n',
  processId: 44716
});
```

#### ✅ Success Output:
```json
{
  "toolName": "terminalInput",
  "args": {
    "input": "console.log(10 + 20);\n",
    "processId": 44716
  },
  "output": {
    "success": true,
    "content": "Sent terminal input successfully",
    "inputSent": "console.log(10 + 20);\n",
    "processId": 44716
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "terminalInput",
  "args": {
    "input": "",
    "processId": 44716
  },
  "output": {
    "success": false,
    "error": "Input string is required",
    "content": "Failed to send terminal input: Input string is required"
  }
}
```

---

### 🛑 16. `stopTerminal`
Stops/kills a running background interactive process by PID.

#### Usage:
```javascript
var result = await coderunTools.stopTerminal({ processId: 44716 });
```

#### ✅ Success Output:
```json
{
  "toolName": "stopTerminal",
  "args": {
    "processId": 44716
  },
  "output": {
    "success": true,
    "content": "Stopped terminal successfully",
    "processId": 44716
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "stopTerminal",
  "args": {
    "processId": 999999
  },
  "output": {
    "success": false,
    "error": "No active terminal process to stop",
    "content": "Stopped terminal failed: No active process"
  }
}
```

---

### 📋 17. `createPlan`
Initializes a checklist plan of execution tasks (all initial tasks set to `"TODO"`).

#### Usage:
```javascript
var result = await coderunTools.createPlan({
  title: 'Express Server Setup',
  tasks: [
    'Initialize package.json',
    'Install express and cors',
    'Create app.js server file'
  ]
});
```

#### ✅ Success Output:
```json
{
  "toolName": "createPlan",
  "args": {
    "title": "Express Server Setup",
    "tasks": [
      "Initialize package.json",
      "Install express and cors",
      "Create app.js server file"
    ]
  },
  "output": {
    "success": true,
    "content": "Created plan successfully",
    "title": "Express Server Setup",
    "tasks": [
      { "id": 1, "text": "Initialize package.json", "status": "TODO" },
      { "id": 2, "text": "Install express and cors", "status": "TODO" },
      { "id": 3, "text": "Create app.js server file", "status": "TODO" }
    ]
  }
}
```

---

### 🔄 18. `updatePlan`
Updates a task's progress status (`TODO` ➜ `WIP` ➜ `DONE`).

#### Usage:
```javascript
var result = await coderunTools.updatePlan({
  taskId: 2,
  status: 'WIP'
});
```

#### ✅ Success Output:
```json
{
  "toolName": "updatePlan",
  "args": {
    "taskId": 2,
    "status": "WIP"
  },
  "output": {
    "success": true,
    "content": "Updated plan executed successfully",
    "taskId": 2,
    "status": "WIP"
  }
}
```

---

### ⏰ 19. `getCurrentDatetime`
Returns the current system ISO timestamp string.

#### Usage:
```javascript
var result = await coderunTools.getCurrentDatetime();
```

#### ✅ Success Output:
```json
{
  "toolName": "getCurrentDatetime",
  "args": {},
  "output": {
    "success": true,
    "content": "2026-08-13T12:19:57.200Z",
    "datetime": "2026-08-13T12:19:57.200Z"
  }
}
```

---

### 🌐 20. `webRequest`
Fetches HTTP/HTTPS web content.

#### Usage:
```javascript
var result = await coderunTools.webRequest({ url: 'https://dummyjson.com/quotes/1' });
```

#### ✅ Success Output:
```json
{
  "toolName": "webRequest",
  "args": {
    "url": "https://dummyjson.com/quotes/1"
  },
  "output": {
    "success": true,
    "content": "{\"id\":1,\"quote\":\"Your heart is the size of an ocean...\",\"author\":\"Rumi\"}",
    "statusCode": 200,
    "url": "https://dummyjson.com/quotes/1"
  }
}
```

#### 🔴 Failure Output:
```json
{
  "toolName": "webRequest",
  "args": {
    "url": "https://invalid.domain.xyz123"
  },
  "output": {
    "success": false,
    "error": "getaddrinfo ENOTFOUND invalid.domain.xyz123",
    "content": "Failed to fetch webpage content: getaddrinfo ENOTFOUND invalid.domain.xyz123"
  }
}
```

---

## 🧪 Testing

To run the automated ES Modules test suite:

```bash
npm test
```

License: MIT
