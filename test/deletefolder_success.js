import coderunTools from '../index.js';
import path from 'path';
import { fileURLToPath } from 'url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

async function testDeleteFolderSuccess() {
  var targetFolder = path.join(__dirname, 'scratch_folder_to_delete');
  await coderunTools.createFolder({ path: targetFolder });

  var result = await coderunTools.deleteFolder({ path: targetFolder });
  console.log(JSON.stringify(result, null, 2));
}

testDeleteFolderSuccess();
