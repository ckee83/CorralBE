/**
* Friends.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  autoPK: true,
  
  attributes: {
  	friender: {
  		model: 'user'
  	},
  	friendee: {
  		model: 'user'
  	},
  	status: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	favoree: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	favorer: {
  		type: 'boolean',
  		defaultsTo: false
  	}
  }
};

