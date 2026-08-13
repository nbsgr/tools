import coderunTools from '../index.js';

async function testInteractiveCommand() {
  console.log('--- Step 1: Starting Interactive Process (Returns Immediately) ---');
  var startRes = await coderunTools.executeCommand({
    command: 'node',
    isInteractive: true
  });
  console.log(JSON.stringify(startRes, null, 2));

  var pid = startRes.output.processId;
  console.log('\n--- Step 2: Sending Input to Interactive Process (PID ' + pid + ') ---');
  var inputRes = await coderunTools.terminalInput({
    input: 'console.log("Hello from Interactive Mode!");\n',
    processId: pid
  });
  console.log(JSON.stringify(inputRes, null, 2));

  console.log('\n--- Step 3: Stopping Interactive Process (PID ' + pid + ') ---');
  var stopRes = await coderunTools.stopTerminal({
    processId: pid
  });
  console.log(JSON.stringify(stopRes, null, 2));
}

testInteractiveCommand();
