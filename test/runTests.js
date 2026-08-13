// runTests.js — ESM test suite for coderun-tools package
import coderunTools, { getDefinitions, executeTool } from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Running Unit Tests for coderun-tools (ESM)...');
  console.log('====================================================\n');

  var passed = 0;
  var failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  ✅ PASS: ' + message);
      passed++;
    } else {
      console.log('  ❌ FAIL: ' + message);
      failed++;
    }
  }

  // Test 1: getDefinitions
  console.log('--- Test 1: getDefinitions ---');
  var defs = getDefinitions();
  assert(Array.isArray(defs) && defs.length >= 15, 'Returns array of tool definitions (found ' + defs.length + ')');

  // Test 2: executeTool (getCurrentDatetime)
  console.log('\n--- Test 2: executeTool (getCurrentDatetime) ---');
  var timeRes = await executeTool('getCurrentDatetime', {});
  assert(timeRes.toolName === 'getCurrentDatetime', 'Returns correct toolName');
  assert(timeRes.output.success === true, 'Returns output.success = true');
  assert(typeof timeRes.output.content === 'string', 'Returns output.content ISO string');

  // Test 3: writeFile tool function
  console.log('\n--- Test 3: writeFile ---');
  var testFilePath = path.join(__dirname, 'test_output', 'sample.txt');
  var writeRes = await coderunTools.writeFile({
    path: testFilePath,
    content: 'Hello World from coderun-tools ESM test!'
  });
  assert(writeRes.toolName === 'writeFile', 'Returns toolName = writeFile');
  assert(writeRes.output.success === true, 'writeFile output.success = true');

  // Test 4: readFile tool function
  console.log('\n--- Test 4: readFile ---');
  var readRes = await coderunTools.readFile({ path: testFilePath });
  assert(readRes.toolName === 'readFile', 'Returns toolName = readFile');
  assert(readRes.output.success === true, 'readFile output.success = true');
  assert(readRes.output.content === 'Hello World from coderun-tools ESM test!', 'readFile returns correct file content');

  // Test 5: editFile tool function
  console.log('\n--- Test 5: editFile ---');
  var editRes = await coderunTools.editFile({
    path: testFilePath,
    oldText: 'World',
    newText: 'CodeRun'
  });
  assert(editRes.toolName === 'editFile', 'Returns toolName = editFile');
  assert(editRes.output.success === true, 'editFile output.success = true');

  // Test 6: searchFiles
  console.log('\n--- Test 6: searchFiles ---');
  var searchRes = await coderunTools.searchFiles({ pattern: 'package.json' });
  assert(searchRes.toolName === 'searchFiles', 'Returns toolName = searchFiles');
  assert(searchRes.output.success === true, 'searchFiles output.success = true');

  // Test 7: createPlan and updatePlan
  console.log('\n--- Test 7: createPlan & updatePlan ---');
  var planRes = await coderunTools.createPlan({
    title: 'Test Plan',
    tasks: ['Task 1', 'Task 2']
  });
  assert(planRes.toolName === 'createPlan', 'createPlan returns toolName');
  assert(planRes.output.tasks.length === 2, 'createPlan returns task array');

  var updateRes = await coderunTools.updatePlan({ taskId: 1, status: 'DONE' });
  assert(updateRes.toolName === 'updatePlan', 'updatePlan returns toolName');
  assert(updateRes.output.status === 'DONE', 'updatePlan sets status = DONE');

  // Test 8: deleteFile
  console.log('\n--- Test 8: deleteFile ---');
  var delRes = await coderunTools.deleteFile({ path: testFilePath });
  assert(delRes.toolName === 'deleteFile', 'Returns toolName = deleteFile');
  assert(delRes.output.success === true, 'deleteFile output.success = true');

  // Test 9: executeCommand
  console.log('\n--- Test 9: executeCommand (self-executing) ---');
  var cmdRes = await coderunTools.executeCommand({ command: 'node -v' });
  assert(cmdRes.toolName === 'executeCommand', 'Returns toolName = executeCommand');
  assert(cmdRes.output.success === true, 'executeCommand output.success = true');
  assert(cmdRes.output.stdout.indexOf('v') !== -1, 'executeCommand returns node version in stdout');

  console.log('\n====================================================');
  console.log('📊 Test Summary: ' + passed + ' Passed, ' + failed + ' Failed');
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
