import coderunTools from '../index.js';

async function testListDirectorySuccess() {
  var result = await coderunTools.listDirectory({ path: 'test' });
  console.log(JSON.stringify(result, null, 2));
}

testListDirectorySuccess();
