/**
 * AvailabilityController
 *
 * @description :: Server-side logic for managing availabilities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'setAvailability': function(req, res, next){
		var userID = req.params.id;
		var status = req.param('status');
		var mins = req.param('mins');
		var endDT = new Date();
		endDT = new Date(endDT.getTime()+mins*60000);

		// This code may be useful when allowing user input for events
		// var date = req.param('date').split('-');
		// var time = req.param('time').split(':');
		// var datetime = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);


		var newRecord = {
			userID: userID,
			status: status,
			endDT: endDT.toISOString()
		}
		Availability.update({userID: userID},newRecord,function(err, avail){
			if (err)
				return next(err);
			res.redirect('/user/show/'+userID);
		});
	}
};

