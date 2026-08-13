import coderunTools from '../index.js';

async function testCreatePlanSuccess() {
  var result = await coderunTools.createPlan({
    title: 'Express Server Setup',
    tasks: [
      'Initialize package.json',
      'Install express and cors',
      'Create app.js server file',
      'Test server route'
    ]
  });
  console.log(JSON.stringify(result, null, 2));
}

testCreatePlanSuccess();
