/**
 * FriendsController
 *
 * @description :: Server-side logic for managing friends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res){
		res.view({
			adderID: req.params.id
		});
	},
	'create': function(req, res, next){
		var param = req.allParams();
		param.friender = req.params.id;
		User.findOne({email: param.email}, function friendExists(err, user){
			if (err)
				return next(err);
			else if (!user)
				return next();
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
				var temp = param.friendee;
				param.friendee = param.friender;
				param.friender = temp;
				Friends.create(param, function madeFriendship(err, friendship){
					if (err)
						console.log(err);
				});
			}
			res.redirect('friends/show/'+req.params.id);
		});
	},
	'show': function(req, res, next){
		User.find(req.params.id).populate('friends').exec(function(err, friendList){
			if (err)
				return next(err);
			if (friendList[0]){
				var friendArray = friendList[0].friends;
				res.view({
					friendList: friendArray
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
	'kill': function(req, res, next){
		Friends.destroy({});
		res.redirect('/user/index');
	}
};

