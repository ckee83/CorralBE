/**
 * FriendsController
 *
 * @description :: Server-side logic for managing friends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'create': function(req, res, next){
		var param = {};
		param.friender = req.params.id;
		User.findOne({email: req.allParams().email}, function friendExists(err, user){
			if (err)
				return next(err);
			else if (!user){
				console.log(err);
				return next();
			}
			param.friendee = user.id;
			if (param.friendee==param.friender){
				req.session.flash = {
					err: [
							{
								name: 'friendSelf',
								message: 'A user may not add his/her self'
							}
					]
				};
			}
			else {
				Friends.create(param, function madeFriendship(err, friendship){
					if (err)
						console.log(err);
				});
			}
			res.redirect('friends/show/'+req.params.id);
		});
	},
	'show': function(req, res, next){
		Friends.find([{friender: req.params.id}, {friendee: req.params.id}]).exec(function(err, friendList){
			if (err)
				return next(err);
			if (friendList){
				res.view({
					friendList: friendList
				});
			}
			else 
				res.view();
		});
	},
	'delete': function(req, res, next){
		Friends.destroy(req.param('delFID')).exec(function(err){
			if (err)
				return next(err);
			res.redirect('/friends/show/'+req.params.id);
		})
	},
	'favorite': function(req, res, next){
		Friends.findOne(req.param('favFID'),function foundIt(err, relation){
			if (err)
				return next(err);
			if (req.params.id==relation.friender)
				relation.favorer=!relation.favorer;
			else
				relation.favoree=!relation.favoree;
			Friends.update(req.param('favFID'),relation,function updated(err, newRelation){
				res.redirect('/friends/show/'+req.params.id);
			});
		});
	},
	'status': function(req, res, next){
		Friends.findOne(req.param('FID'),function foundIt(err, relation){
			if (err)
				return next(err);
			if (relation.friender==req.params.id){
				Friends.destroy(req.param('FID')).exec(function(err){
					res.redirect('/friends/show/'+req.params.id);
				});
			}
			else {
				relation.status=!relation.status;
				Friends.update(req.param('FID'),relation,function updated(err, newRelation){
					res.redirect('/friends/show/'+req.params.id);
				});
			}
		});
	}
};

