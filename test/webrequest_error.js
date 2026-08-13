import coderunTools from '../index.js';

async function testWebRequestError() {
  var result = await coderunTools.webRequest({ url: 'https://invalid.domain.that.does.not.exist.xyz123' });
  console.log(JSON.stringify(result, null, 2));
}

testWebRequestError();
