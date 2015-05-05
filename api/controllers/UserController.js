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
		User.create(req.params.all(), function userCreated(err,user){
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
	}
};

