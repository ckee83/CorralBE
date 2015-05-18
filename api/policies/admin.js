module.exports = function(req, res, ok){
	if (req.session.user && req.session.user.admin){
		return ok();
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
		res.redirect('/session/new');
	}
}