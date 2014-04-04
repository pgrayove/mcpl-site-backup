// $Id:

function user_alert_close() {
	$.ajax({
	   type: "GET",
	   url: Drupal.settings.basePath + Drupal.settings.user_alert.url_prefix + "admin/user-alert/close-message",
	   success: function(){
			$('div#user-alert').fadeOut('slow');
	   }
	 });
}