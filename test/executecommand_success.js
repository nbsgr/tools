import coderunTools from '../index.js';

async function testExecuteCommandSuccess() {
  var result = await coderunTools.executeCommand({ command: 'node -v' });
  console.log(JSON.stringify(result, null, 2));
}

testExecuteCommandSuccess();
