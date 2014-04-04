<?php // $Id$

/**
 * @file
 * 
 * Allow configuration changes for alerts.
 */

/**
 * Form builder for the user alerts settings form.
 *
 * @ingroup forms
 */

function user_alert_admin_settings() {		
	$form = array();

	$form['user_alert_label'] = array(
		'#title' => 'User alert label',
		'#type' => 'textfield',
		'#description' => t('The label next to every user alert message.'),
		'#default_value' =>	variable_get('user_alert_label', 'User Alert'),
	);
	
	$form['user_alert_timelimit'] = array(
		'#title' => 'User alert timelimit',
		'#type' => 'select',
	    '#options' => array(
			0 => 'Never', 
			900 => '15 Minutes',
			1800 => '30 Minutes',
			2700 => '45 Minutes',
			3600 => '1 hour', 
			10800 => '3 hours', 
			21600 => '6 hours',
			32400 => '9 hours',
			43200 => '12 hours',
			86400 => '24 hours'
			),
		'#description' => t('You can automatically unpublish alerts after a given time period. "Never" will leave them up forever, until the user closes it.'),
		'#default_value' =>	variable_get('user_alert_timelimit', 0),
	);

	return system_settings_form($form);	
}