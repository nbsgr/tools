var coderunTools = require('../index.js');

async function testReadFile() {
  console.log('--- Testing readFile (Success) ---');
  var resSuccess = await coderunTools.readFile({ path: 'package.json' });
  console.log(JSON.stringify(resSuccess, null, 2));

  console.log('\n--- Testing readFile (Error) ---');
  var resError = await coderunTools.readFile({ path: 'non_existent_file.txt' });
  console.log(JSON.stringify(resError, null, 2));
}

testReadFile();
