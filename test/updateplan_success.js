import coderunTools from '../index.js';

async function testUpdatePlanSuccess() {
  var result = await coderunTools.updatePlan({
    taskId: 2,
    status: 'WIP'
  });
  console.log(JSON.stringify(result, null, 2));
}

testUpdatePlanSuccess();
