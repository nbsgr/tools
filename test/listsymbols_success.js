import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testListSymbolsSuccess() {
  var targetPath = path.join(__dirname, '..', 'src', 'toolRegistry.js');
  var result = await coderunTools.listSymbols({ path: targetPath });
  console.log(JSON.stringify(result, null, 2));
}

testListSymbolsSuccess();
