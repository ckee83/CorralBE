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
			title: req.param('title')
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
					entries[i].start.dateTime = new Date(entries[i].start.dateTime);
					entries[i].end.dateTime = new Date(entries[i].end.dateTime);
					var durationMins = (entries[i].end.dateTime-entries[i].start.dateTime)/60000;
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
					entries[i].startTime = formatAMPM(entries[i].start.dateTime);
					if ((entries[i].start.dateTime.getDay()+1)%7==entries[i].end.dateTime.getDay()){
						var tstartDT = new Date(entries[i].start.dateTime.getFullYear(), entries[i].start.dateTime.getMonth(), entries[i].start.dateTime.getDate()+1,0,0,0,0);
						var tendDT = new Date(entries[i].end.dateTime);
						var partTwo={
							id: entries[i].id,
							summary: entries[i].summary,
							location: entries[i].location,
							start: {
								dateTime: tstartDT
							},
							end: {
								dateTime: tendDT
							},
							description: entries[i].description,
							dayOfWeek: (entries[i].dayOfWeek+1)%7,
							color: entries[i].color,
							startTime: formatAMPM(tstartDT),
							endTime: formatAMPM(tendDT),
							recurrence: entries[i].recurrence,
							reminders: entries[i].reminders
						};
						entries.push(partTwo);
						entries[i].endTime=formatAMPM(tstartDT),
						entries[i].duration=Math.round((partTwo.start.dateTime-entries[i].start.dateTime)/60000);
					}
					else {
						entries[i].duration = Math.round(durationMins);
						entries[i].endTime = formatAMPM(entries[i].end.dateTime);
					}
				}
				entries.sort(function(a,b){
					if (a.start.dateTime<b.start.dateTime)
						return -1;
					else if (a.start.dateTime>b.start.dateTime)
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

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}