$(document).ready(function(){
	$('.validateRegForm').validate({
		rules: {
			firstName: {
				required: true
			},
			lastName: {
				required: true
			},
			email: {
				required: true,
				email: true
			},
			pw: {
				required: true,
				minlength: 6
			},
			pwConfirm: {
				minlength: 6,
				equalTo: '#pw'
			}
		},
		success: function(element){
			element.addClass('valid');
		}
	});
	$('.validateEditForm').validate({
		rules: {
			firstName: {
				required: true
			},
			lastName: {
				required: true
			},
			email: {
				required: true,
				email: true
			}
		},
		success: function(element){
			element.addClass('valid');
		}
	});
});