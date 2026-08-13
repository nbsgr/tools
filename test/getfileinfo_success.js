import coderunTools from '../index.js';

async function testGetFileInfoSuccess() {
  var result = await coderunTools.getFileInfo({ path: 'package.json' });
  console.log(JSON.stringify(result, null, 2));
}

testGetFileInfoSuccess();
