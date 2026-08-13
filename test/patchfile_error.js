import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testPatchFileError() {
  var targetPath = path.join(__dirname, 'scratch_patch_sample.txt');
  var result = await coderunTools.patchFile({
    path: targetPath,
    patches: [
      { oldText: 'MISSING_PATCH_TARGET', newText: 'new_val' }
    ]
  });
  console.log(JSON.stringify(result, null, 2));
}

testPatchFileError();
