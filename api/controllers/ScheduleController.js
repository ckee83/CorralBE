/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing schedules
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res, next){
		var sch = {
			userID: req.params.id,
			title: req.param('title'),
			dayOfWeek: req.param('weekOrMonth')
		};
		Schedule.create(sch,function(err, schedule){
			console.log(schedule);
		});
		res.redirect('/schedule/index/'+req.params.id);
	},
	index: function(req, res, next){
		Schedule.find({userID: req.params.id}, function(err, schedules){
			if (err)
				return next(err);
			for (var schedule in schedules){
				ScheduleEntry.find({scheduleID: schedule.id}, function(err, entries){
					for (var i=0; i<entries.length; i++){
						entries[i].startDT = new Date(entries[i].startDT);
						entries[i].endDT = new Date(entries[i].endDT);
						var durationMins = entries[i].endDT-entries[i].startDT;
						entries[i].duration = durationMins;
					}
					entries.sort(function(a,b){
						if (a.startDT<b.startDT)
							return -1;
						else if (a.startDT>b.startDT)
							return 1;
						else
							return 0;
					});
					schedule.entries = entries;
				});
			};
			res.view({
				schedules: schedules
			});
		})
	},
};

