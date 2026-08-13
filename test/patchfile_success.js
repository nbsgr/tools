import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testPatchFileSuccess() {
  var targetPath = path.join(__dirname, 'scratch_patch_sample.txt');
  await coderunTools.writeFile({
    path: targetPath,
    content: 'const port = 3000;\nconst host = "localhost";'
  });

  var result = await coderunTools.patchFile({
    path: targetPath,
    patches: [
      { oldText: '3000', newText: '8080' },
      { oldText: 'localhost', newText: '0.0.0.0' }
    ]
  });
  console.log(JSON.stringify(result, null, 2));
}

testPatchFileSuccess();
