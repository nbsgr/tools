import coderunTools from '../index.js';

async function testWebRequestSuccess() {
  var result = await coderunTools.webRequest({ url: 'https://dummyjson.com/quotes/1' });
  console.log(JSON.stringify(result, null, 2));
}

testWebRequestSuccess();
