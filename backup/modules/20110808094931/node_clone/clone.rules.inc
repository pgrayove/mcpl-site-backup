<?php
// $Id: clone.rules.inc,v 1.1.2.1 2011/07/15 19:06:47 placinta Exp $

/**
 * @file rules integration for the node_clone module
 */

/**
 * Implementation of hook_rules_event_info().
 * @ingroup rules
 */
function clone_rules_event_info() {
  return array(
    'clone_cloned_node' => array(
      'label' => t('Content has been cloned'),
      'module' => 'Node',
      'arguments' => rules_events_node_arguments(t('Cloned content'), t("Content's author"), TRUE),
    ),
  );
}
