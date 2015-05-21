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
		var endDt = req.param('endDT');
		var newRecord = {
			userID: userID,
			status: status,
			endDt: endDT
		}
		Availability.update({userID: userID},newRecord,function(err, avail){
			if (err)
				return next(err);
			res.redirect('/user/show/'+userID);
		});
	}
};

