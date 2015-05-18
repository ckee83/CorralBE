module.exports = function(req, res, ok){
	if (req.session.user && req.session.user.admin){
		return ok();
	}
	else if (!req.session.authenticated){
		req.session.flash = {
			err: [
					{
						name: 'loginRequired',
						message: 'You must sign in first'
					}
			]
		};
	}
	else {
		req.session.flash = {
			err: [
				{
					name: 'AdminRestrict',
					message: 'Your account does not have sufficient privileges'
				}
			]
		}
	}
	res.redirect('/session/new');
}