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
    description: {
      type: 'string',
      defaultsTo: "Busy doing something"
    },
  	dayOfWeek: {
  		type: 'integer'
  	},
  	startDT: {
  		type: 'datetime'
  	},
  	endDT: {
  		type: 'datetime'
  	}
  }
};

