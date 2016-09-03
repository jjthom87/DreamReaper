$(document).ready(function(){
	$('#homePage').show();
	$('#loginUser').show();
	$('#createUser').hide();
	$('#userHome').hide();

	$('#create').on('click', function(){
		$('#homePage').hide();
		$('#loginUser').hide();
		$('#userHome').hide();
		$('#createUser').show();
	});

	
});