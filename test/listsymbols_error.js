import coderunTools from '../index.js';

async function testListSymbolsError() {
  var result = await coderunTools.listSymbols({ path: 'non_existent_symbols_file.js' });
  console.log(JSON.stringify(result, null, 2));
}

testListSymbolsError();
