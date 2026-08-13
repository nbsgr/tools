import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testEditFileError() {
  var targetPath = path.join(__dirname, 'scratch_edit_sample.txt');
  var result = await coderunTools.editFile({
    path: targetPath,
    oldText: 'NON_EXISTENT_TEXT_BLOCK',
    newText: 'replacement_text'
  });
  console.log(JSON.stringify(result, null, 2));
}

testEditFileError();
