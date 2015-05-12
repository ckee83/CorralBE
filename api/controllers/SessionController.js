/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res){
		res.view('session/new');
	},
	'create': function(req, res, next){
		if (!req.param('email') || !req.param('pw')){
			req.session.flash = {
				err: [
					{
						name: 'emailPwRequired',
						message: 'Email and Password are required.'
					}
				]
			};
			res.redirect('/session/new');
			return;
		}
		User.findOne({email:req.param('email')}).exec(function(err,user){
			if (err)
				next(err);
			if (!user){
				req.session.flash = {
					err: [
						{
							name: 'emailNotFound',
							message: 'Invalid Email'
						}
					]
				};
				res.redirect('/session/new');
				return;
			}
			require('bcrypt').compare(req.param('pw'), user.encryptedPW, function(err, valid){
				if (err)
					next(err);
				if (!valid){
					req.session.flash = {
						err: [
							{
								name: 'passwordInvalid',
								message: 'Invalid Password'
							}
						]
					};
					res.redirect('/session/new');
					return;
				}
				req.session.authenticated=true;
				req.session.user = user;
				res.redirect('/user/show/'+user.id);
			});
		});
	},
	signout: function(req,res,next){
		req.session.destroy();
		res.redirect('/session/new');
	}
};

