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
		param.dateCreated=new Date();
		param.dateUpdated=new Date();
		User.create(param, function userCreated(err,user){
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err.invalidAttributes
				};

				return res.redirect('/user/new');
			}
			res.redirect('/user/show/'+user.id);
		});
	},
	show: function(req, res, next){
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
		param.dateUpdated=new Date();
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
	}
};

function capFirstLetter(word){
	return word.charAt(0).toUpperCase()+word.slice(1);
}
