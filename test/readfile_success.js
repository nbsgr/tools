import coderunTools from '../index.js';

async function testReadFileSuccess() {
  var result = await coderunTools.readFile({ path: 'package.json' });
  console.log(JSON.stringify(result, null, 2));
}

testReadFileSuccess();
