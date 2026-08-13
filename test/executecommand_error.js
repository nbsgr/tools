import coderunTools from '../index.js';

async function testExecuteCommandError() {
  var result = await coderunTools.executeCommand({ command: 'invalid_command_xyz_123' });
  console.log(JSON.stringify(result, null, 2));
}

testExecuteCommandError();
