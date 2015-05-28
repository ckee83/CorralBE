/**
 * ScheduleEntryController
 *
 * @description :: Server-side logic for managing scheduleentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res, next){
		var tempTime = req.param('startTime').split(':');
		var startDT = new Date();
		startDT.setHours(tempTime[0]);
		startDT.setMinutes(tempTime[1]);
		startDT.setSeconds(0);
		var endDT = new Date(startDT.getTime() +(req.param('duration')*60000));
		var entry = {
			scheduleID: req.param('schID'),
			description: req.param('description'),
			dayOfWeek: req.param('dayOfWeek'),
			startDT: startDT,
			endDT: endDT
		}
		ScheduleEntry.create(entry,function(err, newEntry){
			if (err)
				return next(err);
			if (!newEntry)
				return next();
			res.redirect('/schedule/index/'+req.params.id);
		});
	},
	delete: function(req, res, next){
		console.log(req.param('schID'));
		ScheduleEntry.destroy({scheduleID: req.param('schID')},function(err){
			if (err)
				res.next(err);
			res.redirect('/schedule/index/'+req.params.id);
		})
	}
};

