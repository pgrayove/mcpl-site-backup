<?php
// $Id: relevance.admin.inc,v 1.10 2009/04/25 18:36:17 fernao Exp $

// @file relevance.admin.inc


/**
 * Copyleft (C) 2008 by Cooperativa Laudelina Campos Melo.
 * Author(s): Fernao Lopes
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY. See the LICENSE.txt file for more details.
 *
 **/


function relevance_settings_form() {

  // vocabularies
  $vocs = taxonomy_get_vocabularies();
  $settings_voc = relevance_get_settings('voc');
  
  $form["relevance_voc"] = array(
    '#tree' => TRUE,
    '#type' => 'fieldset',
    '#title' => t('Vocabularies'),
    '#description' => t('Configuration for vocabularies. You should enable a vocabulary and then set a multiplier factor for it. Values: 1-9. <p><em>NOTE: When vocalubaries are enabled, the content is filtered by those content that has at least one of the terms. So, any content that has no term of an enabled vocalubary would not show any related link.</em></p>'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#theme' => 'relevance_settings_form',
  );
  
  foreach ($vocs as $vid => $voc) {
    $form['relevance_voc'][$vid]['name'] = array(
      '#type' => 'item',
      '#value' => $voc->name,
    );    
    $form["relevance_voc"][$vid]["enabled"] = array(
      '#type' => 'checkbox',
      '#default_value' => $settings_voc[$vid]['enabled'],
     );
    $form["relevance_voc"][$vid]["factor"] = array(
      '#type' => 'textfield',
      '#size' => 1,
      '#maxlength' => 3,
      '#default_value' => $settings_voc[$vid]['factor'],
    );
    next($settings_voc);
  }
  
  // stats
  $stats_enabled = _is_module_enabled('statistics');
  
  if ($stats_enabled) {

    $form["relevance_stat"] = array(
      '#type' => 'fieldset',
      '#title' => t('Statistics'),
      '#description' => t('Configuration for statistics.'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );
  
    $form["relevance_stat"]["relevance_stat_enabled"] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable statistics'),
      '#default_value' => variable_get('relevance_stat_enabled', FALSE),
    );

    $form["relevance_stat"]["relevance_stat_factor"] = array(
      '#type' => 'textfield',
      '#title' => t('Factor'),
      '#size' => 1,
      '#maxlength' => 1,
      '#default_value' => variable_get('relevance_stat_factor', FALSE),
    );
  } else {
    $form["relevance_stat"] = array(
      '#type' => 'fieldset',
      '#title' => t('Statistics'),
      '#description' => t('The module statistics is not enabled. If you want to use statistics for generating relevance, please !link.', array('!link' => l('enabled the module', 'admin/build/modules', array('fragment' => 'edit-status-statistics', 'html' => TRUE)))),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );
  }
  
  // dates 
  $settings_date = relevance_get_settings('date');
  $form["relevance_date"] = array(
    '#tree' => TRUE,
    '#type' => 'fieldset',
    '#title' => t('Dates'),
    '#description' => t('Configuration for periods. You should enable the granularity of it, by setting different periods of time and their importance, by the setting factor (1-9).'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#theme' => 'relevance_settings_form',
    );
  foreach ($settings_date as $period => $date) {
    $form['relevance_date'][$period]['name'] = array(
      '#type' => 'item',
      '#value' => $period,
    );    
    $form["relevance_date"][$period]["enabled"] = array(
      '#type' => 'checkbox',
      '#default_value' => $date["enabled"],
     );
    $form["relevance_date"][$period]["factor"] = array(
      '#type' => 'textfield',
      '#size' => 1,
      '#maxlength' => 1,
      '#default_value' => $date["factor"],
    );
  }
  
  // display
  $form["relevance_display"] = array(
    '#type' => 'fieldset',
    '#title' => t('Display options'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form["relevance_display"]["relevance_display_itens"] = array(
    '#type' => 'textfield',
    '#title' => t('Itens to display'),
    '#size' => 1,
    '#maxlength' => 2,
    '#description' => t('1 to 10'),
    '#default_value' => variable_get('relevance_display_itens', 5),
  );
  
  $form["relevance_display"]["relevance_display_score"] = array(
    '#type' => 'checkbox',
    '#title' => t('Display relevance score'),
    '#default_value' => variable_get('relevance_display_score', 5),
  );
  
  $form["relevance_display"]["relevance_display_timer"] = array(
    '#type' => 'checkbox',
    '#title' => t('Display a timer to check the performance of your relevance settings.'),
    '#default_value' => variable_get('relevance_display_timer', 0),
  );
  return system_settings_form($form);
}

/**
 * Form validator
 */
function relevance_settings_form_validate($form, $form_state) {

  $types = array('relevance_voc' => array(), 
		 'relevance_stat' => array(), 
		 'relevance_date' => array()
		 );

  $availableTypes = array_intersect_assoc($form_state['values'], $types);
  //  print_r($availableTypes);
  foreach ($availableTypes as $type => $confs) {
    foreach ($confs as $key => $conf) {
      if ($conf['enabled'] == true) {
        if ($conf['factor'] > 9 || $conf['factor'] < 1 || $conf['factor'] == '' || ! $conf['factor']) {
          form_set_error($type . "][$key][factor", t('Enter a value between 1 and 9'));
	}
      }
    }
  }
}

/**
 * Format the display of vocabularies as table
 */
function theme_relevance_settings_form($form_element) {
  $rows = array();
  foreach (element_children($form_element) as $key) {
    $row = array();
    if (is_array($form_element[$key]['name'])) {
      $row[] = drupal_render($form_element[$key]['name']);
      $row[] = drupal_render($form_element[$key]['enabled']);
      $row[] = drupal_render($form_element[$key]['factor']);
    }
    $rows[] = $row;
  }
  $header = array(t('Type'), t('Enabled'), t('Factor'));

  $output = theme('table', $header, $rows);
  $output .= drupal_render($form_element);
  return $output;
}
