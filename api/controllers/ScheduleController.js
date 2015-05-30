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
			res.redirect('/schedule/index/'+req.params.id);
		});
	},
	index: function(req, res, next){
		Schedule.find({userID: req.params.id}).populate('entries').exec(function(err, schedules){
			if (err)
				return next(err);
			for (var ind=0; ind<schedules.length; ind++){
				var entries = schedules[ind].entries;
				for (var i=0; i<entries.length; i++){
					entries[i].startDT = new Date(entries[i].startDT);
					entries[i].endDT = new Date(entries[i].endDT);
					var durationMins = (entries[i].endDT-entries[i].startDT)/60000;
					entries[i].duration = durationMins;
					var color = '';
					if (durationMins/60>6)
						color='success';
					else if (durationMins/60>4)
						color='info';
					else if (durationMins/60>2)
						color='warning';
					else
						color='danger';
					entries[i].color=color;
					var tHour=entries[i].startDT.getHours()%12==0?12:entries[i].startDT.getHours()%12;
					var tMins=('0'+entries[i].startDT.getMinutes()).slice(-2);
					var tAMPM;
					if (entries[i].startDT.getHours()+1<12)
						tAMPM='AM';
					else 
						tAMPM='PM';
					entries[i].startTime = tHour+':'+tMins+' '+tAMPM;
					tHour=entries[i].endDT.getHours()%12==0?12:entries[i].endDT.getHours()%12;
					tMins=('0'+entries[i].endDT.getMinutes()).slice(-2);
					tAMPM;
					if (entries[i].endDT.getHours()+1<12)
						tAMPM='AM';
					else 
						tAMPM='PM';
					entries[i].endTime = tHour+':'+tMins+' '+tAMPM;
				}
				entries.sort(function(a,b){
					if (a.startDT<b.startDT)
						return -1;
					else if (a.startDT>b.startDT)
						return 1;
					else
						return 0;
				});
				schedules[ind].entries=[[],[],[],[],[],[],[]];
				for (var i=0; i<entries.length; i++)
					schedules[ind].entries[entries[i].dayOfWeek].push(entries[i]);
			}
			res.view({
				schedules: schedules
			});
		});
	},
	delete: function(req, res, next){
		Schedule.destroy(req.param('schID'),function(err, schedules){
			ScheduleEntry.destroy({scheduleID: schedules[0].id},function(err,entries){
				res.redirect('/schedule/index/'+req.params.id);
			});
		});
	}
};

