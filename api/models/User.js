/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
  	firstName: {
  		type: 'string',
  		required: true
  	},
  	lastName: {
  		type: 'string',
  		required: true
  	},
  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},
    mood: {
      type: 'string'
    },
  	encryptedPW: {
  		type: 'string'
  	},
    admin: {
      type: 'boolean',
      defaultsTo: false
    },
    friends: {
      collection: 'friends',
      via: 'friender'
    },
    availability: {
      type: 'json',
      required: true
    },
    schedule: {
      collection: 'schedule',
      via: 'userID'
    }
  },
  beforeCreate: function(values, next){
    if (!values.pw || values.pw != values.pwConfirm)
      return next({err: ["Passwords don't match!"]});
    require('bcrypt').hash(values.pw, 10, function(err, ePW){
      if (err)
        return next(err);
      values.encryptedPW=ePW;
      next();
    });
  }
};

