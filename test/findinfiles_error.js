import coderunTools from '../index.js';

async function testFindInFilesError() {
  var result = await coderunTools.findInFiles({ query: '' });
  console.log(JSON.stringify(result, null, 2));
}

testFindInFilesError();
