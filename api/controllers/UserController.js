/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help      a  :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res){
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
