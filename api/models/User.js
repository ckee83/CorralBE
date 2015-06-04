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
    },
    getAvailability: function(){
      var avail = this.availability;
      if (avail.status==-2 || avail.status==2)
        return avail.status;
      else if (avail.status==-1 || avail.status==1){
        if (new Date()<new Date(avail.endDT))
          return avail.status;
      }
      return 0;
    },
    getTimeLeft: function(){
      var avail = this.availability;
      if (avail.status == -2 || avail.status == 2)
        return 0;
      var DT = new Date(avail.endDT);
      var diff = DT - new Date();
      if (diff<0)
        return 0;
      else
        return new Date(diff).getMinutes();
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

