$(document).ready(function() {
		
	$('#submitLogin').on('submit', function(){
		$.ajax({
			type: "POST",
			url: "/users/login",
			dataType: "json",
			data: {
				email: $('#email').val(),
				password: $('#password').val()
			},
			success: function(data){
				if(data === 'Correct'){
					window.location.href = '/homepage';
				}
			}
		});
	});
	return false;
});