import coderunTools from '../index.js';

async function testDeleteFolderError() {
  var result = await coderunTools.deleteFolder({ path: '' });
  console.log(JSON.stringify(result, null, 2));
}

testDeleteFolderError();
