var coderunTools = require('../index.js');

async function testStreaming() {
  console.log('--- Testing 300ms Streaming Execution ---');
  
  var streamChunks = [];
  var options = {
    onData: function(evt) {
      console.log('⚡ [300ms STREAM EVENT]', evt.type, '->', JSON.stringify(evt.data));
      streamChunks.push(evt.data);
    }
  };

  // Run command that prints output over time
  var cmdRes = await coderunTools.executeCommand({
    command: 'node -e "console.log(\'Line 1\'); setTimeout(() => console.log(\'Line 2\'), 400); setTimeout(() => console.log(\'Line 3\'), 800);"'
  }, options);

  console.log('\n--- Final Execution Result ---');
  console.log(JSON.stringify(cmdRes, null, 2));
}

testStreaming();
