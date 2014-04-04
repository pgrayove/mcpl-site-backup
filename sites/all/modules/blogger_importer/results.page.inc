<?php
// $Id$

/**
 * results page functions for Blogger Importer
 */
 
/**
 * callback after import batch is done, to view & handle results
 * results should be saved in *cache*
 *
 * also for viewing *individual* entries
 */
function blogger_importer_view_results($type = NULL, $id = NULL) {
  $output = '';
  
  // pull in status report
  $output .= drupal_render(blogger_importer_status_report());
    
  
  $results = blogger_importer_results();
  // dsm($results);
  
    if (empty($results)) {
      drupal_set_message(t("There is no imported Blogger data yet. Run the Process XML batch to populate the data."), 'error');
      drupal_goto('admin/content/blogger_importer');
      return '';    // probably unnecessary
    }
  
  
  // INDIVIDUAL VALUE??
  if (!is_null($type) && !is_null($id)) {
    // dsm("requesting $type : $id");
    if (isset($results[$type][$id])) {
      
      $entry = $results[$type][$id];
      
      $elem = array(
        '#type' => 'fieldset',
        '#title' => t('Entry @id (@type)', array('@id' => $id, '@type' => $type)),

        'item' => array(
          '#type' => 'markup',
          '#value' => '<h3>' . $entry['title'] . '</h3>'
              . '<strong>Date:</strong> ' . $entry['date'] . '<br/>'
              . '<br/><br/>'
              . $entry['value']
        ),
      );
      $output .= l('< Back to all entries', 'admin/content/blogger_importer/results')
            . '<br/>'
            . drupal_render($elem);
            
      return $output;
    }
    else {
      drupal_set_message( t('Entry @id (@type) not found.', array('@id' => $id, '@type' => $type)), 'error');
      // show the default page
    }
  }
  
  
  // MULTIPLE/ALL VALUES...
  
  // buttons to import nodes & comments (triggers batches)
  $output .= drupal_get_form('blogger_importer_create_nodes_form');
  $output .= drupal_get_form('blogger_importer_create_comments_form');
  
  // button to delete the cached data
  $output .= drupal_get_form('blogger_importer_delete_cache_form');     // defined in function of same name
    
  $output .= '<h2>Imported Blogger Entries</h2>';
  
  $anchors = array();
    foreach (array_keys($results) as $entry_type) {
      $anchors[] = '<a href="#entries_' . $entry_type . '">' . $entry_type . '</a>';
    }
  $output .= '<p><strong>Entry types:</strong> ' . implode(' | ', $anchors) . '</p>';
  
  // alter the entries for display
  foreach($results as $entry_type => $entries) {
    
    // table headers
    // (put keys to make array_keys possible for mapping to rows)
    $headers = array(
      'id' => t('ID'), 
      'title' => t('Title/Description'), 
      'value' => t('Value'), 
      'date' => t('Date')
    );
    
    // special columns
    if ($entry_type == 'post') {
      $headers['url'] = t('URL');
      $headers['nid'] = t('Nid');
    }
    if ($entry_type == 'comment') {
      $headers['post_id'] = t('Post ID');
      $headers['nid'] = t('nid');
      $headers['cid'] = t('cid');
      $headers['author'] = t('Author');
    }  
    
    
    // format rows for display
    $show_entries = $entries;
    foreach($show_entries as &$show_entry) {

      // link to full value page
      $show_entry['value'] = l( htmlentities( truncate_utf8($show_entry['value'], 50, FALSE, TRUE) ), 
            'admin/content/blogger_importer/result/' . $entry_type . '/' . $show_entry['id'],
            array('html' => TRUE)
          );
      
      // format date
      if (!empty($show_entry['date'])) $show_entry['date'] = format_date(strtotime($show_entry['date']), 'custom', 'r');
      
      // url (for posts) as link
      if (isset($show_entry['url']) && !empty($show_entry['url'])) {
        $show_entry['url'] = l($show_entry['url'], $show_entry['url'], array('absolute' => TRUE, 'attributes' => array('target' => '_blank')));
      }


      // extrapolate post info for comments
      if ($entry_type == 'comment') {
         
        // $show_entry['post_url'] = _blogger_importer_comment_post($show_entry['id'], $results, 'url');
        //   if (empty($show_entry['post_url'])) $show_entry['post_url'] = '';   // table filler
        //   else $show_entry['post_url'] = l($show_entry['post_url'], $show_entry['post_url'], array('absolute' => TRUE, 'attributes' => array('target' => '_blank')));        
        
        $show_entry['post_id'] = _blogger_importer_comment_post($show_entry['id'], $results, 'id');

        $show_entry['nid'] = _blogger_importer_comment_post($show_entry['id'], $results, 'nid');

        $show_entry['author'] = '';
          if (!empty($show_entry['author_name'])) {
            $show_entry['author'] = $show_entry['author_name'];

            if (!empty($show_entry['author_uri'])) $show_entry['author'] = l($show_entry['author'], $show_entry['author_uri'], array('absolute' => TRUE));
            // [ignore email for now]
          }
        
        if (is_numeric($show_entry['cid'])) {
          $show_entry['cid'] = l($show_entry['cid'], 'node/' . $show_entry['nid'], array('fragment' => 'comment-' . $show_entry['cid']));
        }
        
      } // comment

      // nid as link or filler space
      if (isset($show_entry['nid']) && !empty($show_entry['nid'])) {
        $show_entry['nid'] = l($show_entry['nid'], 'node/' . $show_entry['nid'], array('absolute' => TRUE, 'attributes' => array('target' => '_blank')));
      }
      
      // make sure all expected values are in every row
      // & sort in the right order!
      $sorted_entry = array();
      foreach(array_keys($headers) as $header) {
        if (array_key_exists($header, $show_entry)) {
          $sorted_entry[$header] = $show_entry[$header];
        }
        else {
          $sorted_entry[$header] = '';
        }
      }
      $show_entry = $sorted_entry;      // (fields not in headers get dropped)
    } // entries
    
    $table = theme('table', $headers, $show_entries);
    
    $fieldset = array(
      '#type' => 'fieldset',
      '#title' => t('@type entries', array('@type' => $entry_type)),
      '#collapsible' => TRUE,
      '#collapsed' => ! in_array($entry_type, array('post', 'comment')),      // expand the useful ones
      '#prefix' => '<a name="entries_'.$entry_type.'"></a>',    // anchor
      
      'table' => array(
        '#type' => 'markup',
        '#prefix' => '<h3>' . t('<strong>@type</strong> entries', array('@type' => $entry_type)) . '</h3>',
        '#value' => $table,
        '#description' => t('Click a value field to see the full entry.'),
      ),
    );
    
    $output .= drupal_render($fieldset);
  }
  
  return $output;
}
