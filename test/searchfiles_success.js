import coderunTools from '../index.js';

async function testSearchFilesSuccess() {
  var result = await coderunTools.searchFiles({ pattern: 'readFile' });
  console.log(JSON.stringify(result, null, 2));
}

testSearchFilesSuccess();
