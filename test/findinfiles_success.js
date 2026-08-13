import coderunTools from '../index.js';

async function testFindInFilesSuccess() {
  var result = await coderunTools.findInFiles({ query: 'formatResponse' });
  console.log(JSON.stringify(result, null, 2));
}

testFindInFilesSuccess();
