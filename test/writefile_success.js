import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testWriteFileSuccess() {
  var targetPath = path.join(__dirname, 'scratch_write_sample.txt');
  var result = await coderunTools.writeFile({
    path: targetPath,
    content: 'Hello World from writeFile success test!'
  });
  console.log(JSON.stringify(result, null, 2));
}

testWriteFileSuccess();
