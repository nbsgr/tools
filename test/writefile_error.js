import coderunTools from '../index.js';

async function testWriteFileError() {
  var result = await coderunTools.writeFile({ path: '', content: 'some text' });
  console.log(JSON.stringify(result, null, 2));
}

testWriteFileError();
