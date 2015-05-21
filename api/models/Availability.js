/**
* Availability.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoPK: true,
	attributes: {
		userID: {
			model: 'user'
		},
		status: {
			type: 'integer',
			defaultsTo: 0
		},
		endDT: {
			type: 'datetime',
			defaultsTo: new Date()
		}
	}
};

