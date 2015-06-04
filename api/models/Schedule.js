/**
* Schedule.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoPK: true,
  schema: true,

  attributes: {
  	userID: {
  		model: 'user'
  	},
  	title: {
  		type: 'string',
  		defaultsTo: 'My Schedule',
  		required: true
  	},
  	isDefault: {
  		type: 'boolean',
  		defaultsTo: false,
  		required: true
  	},
  	entries: {
  		collection: 'scheduleentry',
  		via: 'scheduleID'
  	}
  }
};

