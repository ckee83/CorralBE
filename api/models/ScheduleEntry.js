/**
* ScheduleEntry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoPK: true,
  schema: true,

  attributes: {
  	scheduleID: {
  		model: 'schedule'
  	},
  	summary: {
  		type: 'string',
  		defaultsTo: 'Busy'
  	},
  	location: {
  		type: 'string',
  		defaultsTo: ''
  	},
    description: {
      	type: 'string',
      	defaultsTo: ''
    },
  	dayOfWeek: {
  		type: 'integer'
  	},
  	start: {
  		type: 'json',
  		required: true
  	},
  	end: {
  		type: 'json',
  		required: true
  	},
  	recurrence: {
  		type: 'array',
  		defaultsTo: []
  	},
  	attendees: {
  		type: 'array',
  		defaultsTo: []
  	},
  	reminders: {
  		type: 'json',
  		required: true
  	}
  }
};

