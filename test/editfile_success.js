import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testEditFileSuccess() {
  var targetPath = path.join(__dirname, 'scratch_edit_sample.txt');
  await coderunTools.writeFile({ path: targetPath, content: 'const app = express();' });

  var result = await coderunTools.editFile({
    path: targetPath,
    oldText: 'express()',
    newText: 'express(); // initialized'
  });
  console.log(JSON.stringify(result, null, 2));
}

testEditFileSuccess();
