import coderunTools from '../index.js';

async function testDeleteFileError() {
  var result = await coderunTools.deleteFile({ path: 'non_existent_file_to_delete.txt' });
  console.log(JSON.stringify(result, null, 2));
}

testDeleteFileError();
