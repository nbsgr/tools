import coderunTools from '../index.js';

async function testSearchFilesError() {
  var result = await coderunTools.searchFiles({ pattern: 'NON_EXISTENT_PATTERN_XYZ_999' });
  console.log(JSON.stringify(result, null, 2));
}

testSearchFilesError();
