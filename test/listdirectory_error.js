import coderunTools from '../index.js';

async function testListDirectoryError() {
  var result = await coderunTools.listDirectory({ path: 'non_existent_folder_xyz' });
  console.log(JSON.stringify(result, null, 2));
}

testListDirectoryError();
