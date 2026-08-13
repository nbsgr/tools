import coderunTools from '../index.js';

async function testCreateFolderError() {
  var result = await coderunTools.createFolder({ path: '' });
  console.log(JSON.stringify(result, null, 2));
}

testCreateFolderError();
