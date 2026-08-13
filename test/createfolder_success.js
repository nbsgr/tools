import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testCreateFolderSuccess() {
  var targetFolder = path.join(__dirname, 'scratch_sample_folder');
  var result = await coderunTools.createFolder({ path: targetFolder });
  console.log(JSON.stringify(result, null, 2));
}

testCreateFolderSuccess();
