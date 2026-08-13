import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testDeleteFileSuccess() {
  var targetPath = path.join(__dirname, 'scratch_delete_sample.txt');
  await coderunTools.writeFile({ path: targetPath, content: 'Temporary file to delete' });

  var result = await coderunTools.deleteFile({ path: targetPath });
  console.log(JSON.stringify(result, null, 2));
}

testDeleteFileSuccess();
