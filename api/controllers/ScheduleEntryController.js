/**
 * ScheduleEntryController
 *
 * @description :: Server-side logic for managing scheduleentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res, next){
		var tempTime = req.param('startTime').split(':');
		var startDT = new Date(1970,0,4+parseInt(req.param('dayOfWeek')),tempTime[0],tempTime[1],0);
		var duration = (req.param('durHours')*3600*1000)+(req.param('durMinutes')*60000);
		if (duration>0){
			var endDT = new Date(startDT.getTime()+duration);
			var entry = {
				scheduleID: req.param('schID'),
				summary: req.param('summary'),
				location: '',
				description: req.param('description'),
				dayOfWeek: req.param('dayOfWeek'),
				start: {
					dateTime: startDT,
					timeZone: ''
				},
				end: {
					dateTime: endDT,
					timeZone: ''
				},
				recurrence: [],
				reminders: {}
			};
			ScheduleEntry.create(entry,function(err, newEntry){
				if (err)
					return next(err);
				if (!newEntry)
					return next();
				res.redirect('/schedule/index/'+req.params.id);
			});
		}
		else {
			req.session.flash = {
				err: [
						{
							name: 'entryTime',
							message: 'Time interval of an event cannot be zero'
						}
				]
			};
			res.redirect('/schedule/index/'+req.params.id);
		}
	},
	delete: function(req, res, next){
		ScheduleEntry.destroy(req.param('entryID'),function(err){
			res.redirect('/schedule/index/'+req.params.id);
		});
	}
};

