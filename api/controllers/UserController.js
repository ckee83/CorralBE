/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help      a  :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res){
		res.view();
	},
	create: function(req, res, next){
		var param = req.params.all();
		param.firstName=capFirstLetter(param.firstName);
		param.lastName=capFirstLetter(param.lastName);
		param.mood="I'm new to Corral!";
		param.availability={
			status: 0,
			endDT: new Date()
		};
		// Uncomment the code below before starting the app to make an administrator account
		// Don't forget to re-comment it after you're done
		// param.admin=true;
		User.create(param, function userCreated(err,user){
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err.invalidAttributes
				};

				return res.redirect('/user/new');
			}
			req.session.authenticated=true;
			req.session.user = user;
			res.redirect('/user/show/'+user.id);
		});
	},
	show: function(req, res, next){
		var userID = req.params.id;
		User.findOne(userID,function(err,user){
			if (err)
				return next(err);
			if (!user)
				return next();
			res.view({
				user: user
			});
		});
	},
	edit: function(req, res, next){
		User.findOne(req.params.id,function(err,user){
			if (err)
				next(err);
			if (!user)
				next();
			res.view({
				user: user
			});
		});
	},
	update: function(req, res, next){
		var param = req.params.all();
		param.firstName=capFirstLetter(param.firstName);
		param.lastName=capFirstLetter(param.lastName);
		if (param.admin==1)
			param.admin=true;
		else
			param.admin=false;
		User.update(req.params.id,param).exec(function(err){
			if (err)
				res.redirect('/user/edit/'+req.params.id);
			res.redirect('/user/show/'+req.params.id);
		});
	},
	delete: function(req, res, next){
		User.destroy(req.params.id).exec(function(err){
			if (err)
				res.next(err);
			res.redirect('/user/index');
		});
	},
	index: function(req, res, next){
		User.find(function(err, users){
			if (err)
				return next(err);
			res.view({
				users: users
			});
		})
	},
	'setAvailability': function(req, res, next){
		var userID = req.params.id;
		var status = req.param('status');
		var mins = req.param('mins');
		var endDT = new Date();
		endDT = new Date(endDT.getTime()+mins*60000);

		User.update(userID, {availability:{status: status, endDT: endDT}}, function(err, user){
			if (err)
				return next(err);
			if (!user)
				return next();
			res.redirect('/user/show/'+userID);

		});
	},
	'getAvailableFriends': function(req, res, next){
		var userID = req.params.id;
		var availFriends = [];
		var checkDT;
		if (req.param('now')=='false'){
			var date = req.param('availDate').split('-');
			var time = req.param('availTime').split(':');
			checkDT = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
		}
		else 
			checkDT = new Date();
		async.waterfall([
			function(cb){
				// Find all friends linked to the user
				// Pass the list of friends to the next function
				Friends.find([{friender: userID}, {friendee: userID}], function(err, relations){
					var friends = [];
					for (var i=0; i<relations.length; i++){
						var curRelation=relations[i];
						if (curRelation.friender!=userID)
							friends.push(curRelation.friender);
						else
							friends.push(curRelation.friendee);
					}
					cb(null,friends);
				});
			},
			function(friends, cb){
				// With the list of friends, get each of their default schedules
				// If the friend is in free mode, ignore the schedule
				// Create a list of friends that are free
				User.find(friends).exec(function(err, friendsList){
					cb(null, friendsList);
				});
			},
			function(friendsList, cb){
				for (var i=0; i<friendsList.length; i++){
					var curFriend = friendsList[i];
					var avail = friendsList[i].availability;
					// Timed Free Mode
					if (avail.status==-2 || (avail.status==-1 && checkDT<=new Date(avail.endDT))){
						availFriends.push(friendsList[i]);
					}
					// Timed Invisible Mode
					else if (avail.status==2 || (avail.status==1 && checkDT<=new Date(avail.endDT))){
						//Don't add friend to list. They are invisible.
					}
					// Schedule Mode
					// Need to sync reading the entries and adding appropriate friends to list
					else {
						Schedule.findOne({userID: friendsList[i].id, isDefault: true}).populate('entries').exec(function(err, sch){
							if (!sch)
								availFriends.push(curFriend);
							else {
								var entries = sch.entries;
								var baseCheckDT = getDTtoBase(checkDT);
								var isFree=true;
								for (var i=0; i<entries.length; i++){
									var startDT = new Date(entries[i].start.dateTime);
									var endDT = new Date(entries[i].end.dateTime);
									if (baseCheckDT.getDay()==entries[i].dayOfWeek 
										&& startDT<=baseCheckDT && baseCheckDT<=endDT)
										isFree=false;
								}
								if (isFree){
									availFriends.push(curFriend);
								}
							}
						});
					}
				}
				cb(null, availFriends);
			}
		],function(err, result){
			console.log(result);
		});
	}
};

function capFirstLetter(word){
	return word.charAt(0).toUpperCase()+word.slice(1);
}

// Note: date and time should be passed directly from inputs
function isBusy(user, date, time){
	var date = date.split('-');
	var time = time.split(':');
	var checkDT = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
	var dayOfWeek = user.schedule[checkDT.getDay()];
	for (var item in dayOfWeek){
		var sDT = new Date(item.startTime);
		var eDT = new Date(item.endTime)
		if (sDT <= checkDT && checkDT <= eDT)
			return true;
	}
	return false;
}

function getDTtoBase(datetime){
	datetime.setDate(4+datetime.getDay());
	datetime.setFullYear(1970);
	datetime.setMonth(0);
	return datetime;
}