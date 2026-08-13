import coderunTools from '../index.js';

async function testInteractiveStreaming() {
  console.log('--- Testing Interactive Command with 300ms Streaming ---');

  var options = {
    onData: function(evt) {
      console.log('⚡ [300ms INTERACTIVE STREAM]', evt.type, '->', JSON.stringify(evt.data || evt));
    }
  };

  var startRes = await coderunTools.executeCommand({
    command: 'node',
    isInteractive: true
  }, options);

  console.log('\n--- Initial Immediate Response ---');
  console.log(JSON.stringify(startRes, null, 2));

  var pid = startRes.output.processId;

  await new Promise(r => setTimeout(r, 400));
  console.log('\n--- Step 2: Sending Input "console.log(10 + 20);" ---');
  await coderunTools.terminalInput({
    input: 'console.log(10 + 20);\n',
    processId: pid
  });

  await new Promise(r => setTimeout(r, 600));

  console.log('\n--- Step 3: Stopping Process (PID ' + pid + ') ---');
  var stopRes = await coderunTools.stopTerminal({ processId: pid });
  console.log(JSON.stringify(stopRes, null, 2));
}

testInteractiveStreaming();
