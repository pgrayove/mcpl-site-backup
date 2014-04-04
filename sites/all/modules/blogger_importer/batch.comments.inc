<?php
// $Id$

/**
 * batch to create nodes from imported Blogger posts
 */


/**
 * #submit hook from trigger button
 */
function blogger_importer_trigger_comments_batch($form, &$form_state) {
  $results = blogger_importer_results();
  
    if (empty($results)) {
      drupal_set_message(t("There is no imported Blogger data yet. Run the Process XML batch to populate the data."), 'error');
      drupal_goto('admin/content/blogger_importer');
      return '';    // probably unnecessary
    }
  
  // make sure user is allowed to create these nodes
  $node_type = variable_get('blogger_importer_node_type', '');
    if (empty($node_type)) {
      drupal_set_message(t("No node type set for importing."), 'error');
      return;
    }
  
  // make sure the node type allows for anonymous comments w/o fullcontact info
  // (can be '_MAY_NOT' or '_MAY_CONTACT' but not '_MAYNOT_CONTACT')
  if (variable_get('comment_anonymous_'. $node_type, COMMENT_ANONYMOUS_MAYNOT_CONTACT) == COMMENT_ANONYMOUS_MAYNOT_CONTACT) {
    drupal_set_message(t("The content type %node_type does not allow for anonymous comments without contact info. Please !link to import comments.",
        array('%node_type' => $node_type, '!link' => l('correct this', 'admin/content/node-type/' . $node_type) )
        ), 'error');
    return;
  }

  // run the batch
  // pass all entries (not just 'posts')
  blogger_importer_batch_comments($results);
}



/**
 * batch caller
 * @param $results cached imported entries
 */
function blogger_importer_batch_comments($results) {
  $batch = array(
    'operations' => array(
      array('blogger_importer_batch_comments_process', array($results)),    // should run until it's finished
      ),
    'finished' => 'blogger_importer_batch_comments_finished',
    'title' => t('Creating comments from Blogger comments'),
    'init_message' => t('Beginning comment import from Blogger comments'),
    'progress_message' => t('Importing comments...'),
    'error_message' => t('Blogger import has encountered an error.'),
    'file' => drupal_get_path('module', 'blogger_importer') . '/batch.comments.inc',
  );
  
  batch_set($batch);

  // redirect when done
  batch_process('admin/content/blogger_importer/results');
}




/**
 * Batch Operation Callback for Comment Import
 *
 * @param $initial_entries all initial entries to populate the sandbox and results (all types)
 * @param $context persistent batch info
 */
function blogger_importer_batch_comments_process($initial_entries, &$context) {
  // dsm("Comments!");
  // dsm("Context in comments batch:"); dsm($context);
  
  // initialize the sandbox
  if (!isset($context['sandbox']['progress'])) {
    $context['sandbox']['progress'] = 0;    // should persist

    // pass back ALL entries as results, (new comment info will be added)
    $context['results'] = $initial_entries;

    // keep 'comment' entries in the sandbox until they're all processed
    $context['sandbox']['comments'] = $initial_entries['comment'];
  }

  $results = &$context['results'];
  $comments = &$context['sandbox']['comments'];
  
  // dsm("comments in sandbox:"); dsm($comments);
  
  // track original # of entries (needed for progress bar)
  if (! isset($context['sandbox']['max'])) $context['sandbox']['max'] = count($comments);
  
  // dsm("progress saved: " . $context['sandbox']['progress']);
  // dsm("results so far: "); dsm($results);
  
  $limit = variable_get('blogger_importer_limit', 10);    // same limit as xml import

  // message while batch is running
  $context['message'] = t('Processed @count out of @total comments, @remaining remaining (@limit at a time).', 
      array('@count' => $context['sandbox']['progress'],
            '@remaining' => count($comments), 
            '@total' => $context['sandbox']['max'], 
            '@limit' => $limit,
          ));

  $entry_count = 0;     // in this run

  // loop thru all the remaining entries
  foreach($comments as $id => $comment) {
    
    $entry_count++;
    
    // is there already a comment id logged for this comment?
    if (isset($comment['cid']) && !empty($comment['cid'])) {
      if ($saved_comment = _comment_load($comment['cid']) ) {
        
        drupal_set_message(t("Comment %title is already saved as #@cid (!link), not duplicating. (Clear the cached entries to reset.)",
            array(
              '%title' => $comment['title'],
              '@cid' => $comment['cid'],
              '!link' => '@todo finish porting', //l($node->title, 'node/' . $node->cid, array('attributes' => array('target' => '_blank'))),
            )), 
            'warning'
          );

        // remove from results (same as if created)
        unset($comments[ $comment['id'] ]);
      }
      else {    // cid saved but comment doesn't exist!
        drupal_set_message(t("Comment %title already has cid @cid logged, but unable to load comment. Creating again.",
            array(
              '%title' => $comment['title'],
              '@cid' => $comment['cid'],
            ) ), 'warning' );

        unset($comment['cid']);   // so it's created fresh
      }
    }
    
    // if comment does not yet exist
    if (! isset($comment['cid']) || empty($comment['cid'])) {
      
      // need a nid to save a comment (attached to node)
      $comment_post_title = _blogger_importer_comment_post($comment['id'], $results, 'title');
      $comment_nid = _blogger_importer_comment_post($comment['id'], $results, 'nid');
      // dsm("comment nid: $comment_nid");

      if (empty($comment_nid) || !is_numeric($comment_nid)) {
        drupal_set_message(t("No node saved for post %post_title, can't save comment %comment_title",
          array('%post_title' => $comment_post_title, '%comment_title' => $comment['title']) ), 'error');
      }
      else {    // need to save a comment, and node exists to do so

        $comment_values = array(     // form values for comment_form
          'comment' => html_entity_decode($comment['value']),   // need to unescape html
          'subject' => html_entity_decode($comment['title']),
          'nid' => $comment_nid,
          'timestamp' => empty($comment['date']) ? NULL: strtotime($comment['date']),
          'name' => isset($comment['author_name']) ? $comment['author_name'] : '',
          'mail' => isset($comment['author_email']) ? $comment['author_email'] : '',
          'homepage' => isset($comment['author_uri']) ? $comment['author_uri'] : '',
          'format' => variable_get('blogger_importer_format', FILTER_FORMAT_DEFAULT),    // ok to use same?
        );

        // @todo define a comment alter hook here similar to node above?

        $cid = _blogger_importer_create_comment($comment_values);
        // dsm("cid: $cid");

        // created?
        if (is_numeric($cid)) {
          drupal_set_message(t("Saved comment #@cid: %title for node @nid", 
            array('@cid' => $cid, '%title' => $comment['title'], '@nid' => $comment_nid) ), 
            'status');

          // save nid in the results
          $context['results']['comment'][ $comment['id'] ]['cid'] = $cid;
          // dsm("cid {$cid} saved back in the results: " . $context['results']['comment'][ $comment['id'] ]['cid']);
          
          // make sure the node is set to allow/show comments
          $comment_node_setting = variable_get('blogger_importer_comment_per_node', COMMENT_NODE_READ_WRITE);
          db_query("UPDATE {node} set comment = %d WHERE nid = %d", $comment_node_setting, $comment_nid);
          
        }
        else {
          drupal_set_message(t("No cid found for new comment - unable to save %title", 
              array('%title' => $comment['title'])), 'error');
          // [keeps going even if error]
        }

      } // nid check for comment
      
    }   // comment already saved
    

    // remove comment from sandbox (even if error or nothing done)
    unset($comments[ $comment['id'] ]);
    
    if ($entry_count >= $limit) {
      // drupal_set_message( t("Stopped at @limit entries to avoid timeout.", array('@limit' => $limit)), 'status');
      break;
    }
    
  } // comment loop


  // Update our progress information.

  $context['sandbox']['progress'] = $context['sandbox']['max'] - count($comments);
    if (count($comments) == 0) $context['sandbox']['progress'] = $context['sandbox']['max'];  // [not sure if necessary]
  
  $context['finished'] = $context['sandbox']['progress'] / $context['sandbox']['max'];
    if ($context['finished'] > 1) $context['finished'] = 1;   // just in case

  // in case progress calculations aren't right...
  if ($context['finished'] == 1 && count($comments) > 0) {
    drupal_set_message(t("Import ended prematurely! Still @size left to go but finished.", 
        array('@size' => count($comments)) ), 'error');
    $context['success'] = FALSE;
  }
  if ($context['finished'] != 1 && count($comments) == 0
    ||  $context['sandbox']['progress'] > $context['sandbox']['max']) {
    drupal_set_message(t("Import should have ended! 0 left to go but batch still going."), 'error');
    $context['success'] = FALSE;
    $context['finished'] = 1;
  }  

}   // comment batch process





/**
 * create a COMMENT given comment form values
 */
function _blogger_importer_create_comment($values) {
  if (! $nid = $values['nid']) {
    drupal_set_message(t("Missing nid for new comment %title", 
        array('%title' => $values['subject'])), 'error');
    return FALSE;
  }
  if (! $node = node_load($nid)) {
    drupal_set_message(t("Node #@nid for new comment %title does not exist", 
        array('@nid' => $nid, '%title' => $values['subject'])), 'error');
    return FALSE;
  }

  $values = array_merge(
    array(    // should have 'name', 'subject', 
      // 'subject' => '',
      // 'comment' => '',
      // 'op' => t('Post comment'),        // necessary?
      'status' => COMMENT_PUBLISHED,       // (=0, go figure)
    ), (array)$values);

  // dsm($values);

  $cid = comment_save($values);

  if (! $cid) {
    drupal_set_message(t("Unable to save comment %title to node #@nid", array('%title' => $values['subject'], '@nid' => $nid)));
  }
  
  return $cid;    // cid of FALSE on error
}



/**
 * Comments batch 'finished' callback
 */
function blogger_importer_batch_comments_finished($success, $results, $operations) {
  // dsm("results:"); dsm($results);
  
  // save the new results
  if (!empty($results)) blogger_importer_results($results);
  
  if ($success) {

    // count the number of posts in $results w/ 'cid' set!
    // note: this doesn't neces mean they were all created now -- includes comments previously created!
    
    $created_comment_count = 0;
    $list = '';

    foreach($results['comment'] as $comment) {
      if (is_numeric($comment['cid'])) {
        $created_comment_count++;

        $comment_title = _blogger_importer_post_title($comment);
        // dsm("title for " . htmlentities($post['title']) . ": " . htmlentities($post_title));

        $list .= '<li>' 
          . l($comment_title, 'node/' . $comment['nid'], array('fragment' => 'comment-' . $comment['cid']))
          . ' - ' . format_date($comment['date']) . '</li>';
      }
    }
    
    drupal_set_message( t('@count comments saved to their matching nodes (some may have existed prior):', 
        array('@count' => $created_comment_count ) ) );
    drupal_set_message( '<ul>' . $list . '</ul>' );

  }
  else {
    // An error occurred.
    // $operations contains the operations that remained unprocessed.
    $error_operation = reset($operations);
    $output = t('An error occurred while processing %error_operation with arguments: @arguments', 
        array(
          '%error_operation' => $error_operation[0],
          '@arguments' => print_r($error_operation[1], TRUE),
        ));
    
    drupal_set_message($output, 'error');
  }
  
  // batch gets redirected to results page (from batch_process() above)
}

