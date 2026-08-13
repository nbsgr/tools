var coderunTools = require('../index.js');
var path = require('path');

async function testWriteFile() {
  var targetPath = path.join(__dirname, 'test_output', 'sample_write.txt');
  console.log('--- Testing writeFile (Success) ---');
  var resSuccess = await coderunTools.writeFile({
    path: targetPath,
    content: 'Hello from writeFile tool test!'
  });
  console.log(JSON.stringify(resSuccess, null, 2));

  console.log('\n--- Testing writeFile (Error) ---');
  var resError = await coderunTools.writeFile({ path: '' });
  console.log(JSON.stringify(resError, null, 2));
}

testWriteFile();
