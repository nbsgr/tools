import coderunTools from '../index.js';

async function testGetCurrentDatetimeSuccess() {
  var result = await coderunTools.getCurrentDatetime();
  console.log(JSON.stringify(result, null, 2));
}

testGetCurrentDatetimeSuccess();
