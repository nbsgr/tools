import coderunTools from '../index.js';

async function testGetFileInfoError() {
  var result = await coderunTools.getFileInfo({ path: 'non_existent_file_abc.txt' });
  console.log(JSON.stringify(result, null, 2));
}

testGetFileInfoError();
