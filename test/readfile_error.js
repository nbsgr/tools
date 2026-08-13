import coderunTools from '../index.js';

async function testReadFileError() {
  var result = await coderunTools.readFile({ path: 'non_existent_file.txt' });
  console.log(JSON.stringify(result, null, 2));
}

testReadFileError();
