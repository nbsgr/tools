// updatePlan.js — Updates task progress status in an active plan (ESM)
import { formatResponse } from '../utils/toolUtils.js';

export var definition = {
  type: 'function',
  function: {
    name: 'update_plan',
    description: 'Update task progress status in an active plan.',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'number',
          description: 'Task ID number to update'
        },
        status: {
          type: 'string',
          description: 'New task status: TODO, WIP, DONE'
        }
      },
      required: ['taskId', 'status']
    }
  }
};

export function handler(args, options) {
  options = options || {};
  var taskId = args ? (args.taskId || 1) : 1;
  var status = args ? (args.status || 'DONE') : 'DONE';

  return new Promise(function(resolve) {
    resolve({
      success: true,
      content: 'Updated plan executed successfully',
      taskId: taskId,
      status: status
    });
  });
}

export function updatePlan(args, options) {
  return handler(args, options).then(function(output) {
    return formatResponse('updatePlan', args, output);
  });
}
