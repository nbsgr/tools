import coderunTools from '../index.js';

async function testInteractiveRunning() {
  console.log('--- Step 1: Starting Interactive Process (Stays Alive) ---');

  var options = {
    onData: function(evt) {
      console.log('⚡ [LIVE STREAM EVENT]', evt.type, '->', JSON.stringify(evt.data || evt));
    }
  };

  var startRes = await coderunTools.executeCommand({
    command: 'node',
    isInteractive: true
  }, options);

  console.log('\n--- Initial Response (Returned Immediately in Background) ---');
  console.log(JSON.stringify(startRes, null, 2));

  var pid = startRes.output.processId;

  console.log('\n--- Step 2: Sending Input 1 "console.log(100 + 200);" ---');
  await coderunTools.terminalInput({
    input: 'console.log(100 + 200);\n',
    processId: pid
  });

  await new Promise(r => setTimeout(r, 500));

  console.log('\n--- Step 3: Sending Input 2 "console.log(\\"Process is STILL running!\\");" ---');
  await coderunTools.terminalInput({
    input: 'console.log("Process is STILL running!");\n',
    processId: pid
  });

  await new Promise(r => setTimeout(r, 500));

  console.log('\n--- Step 4: Stopping Process (PID ' + pid + ') ---');
  await coderunTools.stopTerminal({ processId: pid });
}

testInteractiveRunning();
