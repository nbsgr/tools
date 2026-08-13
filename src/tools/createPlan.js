// createPlan.js — Initializes a checklist of tasks (ESM)
import { formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'create_plan',
    description: 'Initialize a checklist plan of execution tasks.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the plan'
        },
        tasks: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'List of task descriptions'
        }
      },
      required: ['title', 'tasks']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var title = args ? (args.title || 'Plan') : 'Plan';
  var tasks = args ? (args.tasks || []) : [];

  return new Promise(function(resolve) {
    var taskObjects = [];
    for (var i = 0; i < tasks.length; i++) {
      taskObjects.push({
        id: i + 1,
        text: tasks[i],
        status: 'TODO'
      });
    }

    resolve({
      success: true,
      content: 'Created plan successfully',
      title: title,
      tasks: taskObjects
    });
  });
}

export function createPlan(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('createPlan', args, output);
  });
}
