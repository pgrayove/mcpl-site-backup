<?php
// $Id$

/**
 * batch to create nodes from imported Blogger posts
 */
 
/**
 * #submit hook from trigger button
 */
function blogger_importer_trigger_nodes_batch($form, &$form_state) {
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
    if (! user_access('create ' . $node_type . ' content')) {
      drupal_set_message(t("User does not have permission to create @type nodes.", array('@type' => $node_type)), 'error');
      return;
      // (should this be in #validate hook instead?)
    }
    
  $input_format = variable_get('blogger_importer_format', '');
    if (empty($input_format) || ! filter_access($input_format)) {
      $format_info = filter_formats($input_format);
      drupal_set_message(t("User does not have permission to use the input format @format, or no format is set.",
          array('@format' => $format_info->name)), 'error');
      return;
    }
  
  // make sure the node type allows for anonymous comments w/o fullcontact info
  // (can be '_MAY_NOT' or '_MAY_CONTACT' but not '_MAYNOT_CONTACT')
  if ($import_comments && variable_get('comment_anonymous_'. $node_type, COMMENT_ANONYMOUS_MAYNOT_CONTACT) == COMMENT_ANONYMOUS_MAYNOT_CONTACT) {
    drupal_set_message(t("The content type %node_type does not allow for anonymous comments without contact info. Please !link to import comments.",
        array('%node_type' => $node_type, '!link' => l('correct this', 'admin/content/node-type/' . $node_type) )
        ), 'error');
    return;
  }

  // run the batch
  // pass all entries (not just 'posts')
  blogger_importer_batch_nodes($results, $import_comments);
}


// -- see blogger_importer.batch.inc for batch function notes --


/**
 * batch caller
 * @param $results cached imported entries
 */
function blogger_importer_batch_nodes($results, $import_comments) {
  $batch = array(
    'operations' => array(
      array('blogger_importer_batch_nodes_process', array($results)),    // should run until it's finished
      ),
    'finished' => 'blogger_importer_batch_nodes_finished',
    'title' => t('Creating nodes from Blogger posts'),
    'init_message' => t('Beginning node import from Blogger posts'),
    'progress_message' => t('Importing posts...'),
    'error_message' => t('Blogger import has encountered an error.'),
    'file' => drupal_get_path('module', 'blogger_importer') . '/batch.nodes.inc',
  );
  
  batch_set($batch);

  // redirect when done
  batch_process('admin/content/blogger_importer/results');
}


/**
 * Batch Operation Callback for Node Import
 *
 * @param $initial_entries all initial entries to populate the sandbox and results (all types)
 * @param $context persistent batch info
 */
function blogger_importer_batch_nodes_process($initial_entries, &$context) {

  // initialize the sandbox
  if (!isset($context['sandbox']['progress'])) {
    // dsm("Initializing!");    
    $context['sandbox']['progress'] = 0;    // should persist

    // pass back ALL entries as results, (new node info will be added)
    $context['results'] = $initial_entries;
    // dsm("initial entries:"); dsm($initial_entries);

    // keep 'post' entries in the sandbox until they're all processed
    $context['sandbox']['posts'] = $initial_entries['post'];
  }
  
  $results = &$context['results'];
  $posts = &$context['sandbox']['posts'];
  
  // dsm("posts in sandbox:"); dsm($posts);
  
  // track original # of entries (needed for progress bar)
  if (! isset($context['sandbox']['max'])) $context['sandbox']['max'] = count($posts);
  
  // dsm($context);
  
  // dsm("progress saved: " . $context['sandbox']['progress']);
  // dsm("results so far: "); dsm($results);
  
  $limit = variable_get('blogger_importer_limit', 10);    // same limit as xml import

  // message while batch is running
  $context['message'] = t('Processed @count out of @total posts, @remaining remaining (@limit at a time).', 
      array('@count' => $context['sandbox']['progress'],
            '@remaining' => count($posts), 
            '@total' => $context['sandbox']['max'], 
            '@limit' => $limit,
          ));
  // drupal_set_message($context['message'], 'status');    // same msg in final output


  $entry_count = 0;     // in this run

  // loop thru all the remaining entries
  foreach($posts as $id => $post) {
    
    $entry_count++;
    // dsm("count in this run: $entry_count");
    
    // is there already a node logged for this post?
    if (isset($post['nid']) && !empty($post['nid'])) {
      if ($node = node_load($post['nid']) ) {
        drupal_set_message(t("Post %title is already saved to node #@nid (!link), not duplicating. (Clear the cached entries to reset.)",
            array(
              '%title' => _blogger_importer_post_title($post),
              '@nid' => $post['nid'],
              '!link' => l($node->title, 'node/' . $node->nid, array('attributes' => array('target' => '_blank'))),
            )), 
            'warning'
          );

        // remove from results (same as if created)
        unset($posts[ $post['id'] ]);
      }
      else {    // nid saved but node doesn't exist!
        drupal_set_message(t("Post %title already has nid @nid logged, but node does not exist. Creating again.",
            array(
              '%title' => _blogger_importer_post_title($post),
              '@nid' => $post['nid'],
            ) ), 'warning' );

        unset($post['nid']);   // so it's created fresh
      }
    }
    
    
    // if node does not yet exist
    if (! isset($post['nid']) || empty($post['nid'])) {
      // create a node!
      $node = new stdClass;

      $node->type = variable_get('blogger_importer_node_type', '');   // (validated before batch started)

      // use title, date if no title, or 'Untitled' if no date
      $node->title = _blogger_importer_post_title($post);     // html_entity_decode needed?

      $node->created = empty($post['date']) ? NULL: strtotime($post['date']);

      // html is escaped, need to unescape
      $node->body = html_entity_decode($post['value']);

      $node->format = variable_get('blogger_importer_format', '');    // (validated before batch started)

      // dsm($node);

      // DEFINE A HOOK FOR OTHER MODULES TO ADD/MODIFY THE NEW NODE CONTENTS OR OTHERWISE ACT ON THEM
      // invoke hook as HOOK_blogger_importer_node($op, &$node, $post)
      // - only $op implemented now is 'presave' but might want more later
      // - ignores return value
      // example usage: map the original URL of each post to a redirect handler
      module_invoke_all('blogger_importer_node', 'presave', $node, $post);

      // create/save the node
      node_save($node);

      if (is_numeric($node->nid)) {
        drupal_set_message(t("Saved node #@nid: !title from @post_id", 
          array(
            '@nid' => $node->nid, 
            '!title' => l($node->title, 'node/' . $node->nid),
            'post_id' => $post['id']) ), 
          'status');

        // save nid in the results
        $context['results']['post'][ $post['id'] ]['nid'] = $node->nid;
        // dsm("nid {$node->nid} saved back in the results:"); dsm($context['results']['post'][ $post['id'] ]);
      }
      else {
        drupal_set_message(t("No nid found for new post - unable to save %title", array('%title' => $post['title'])), 'error');
        // $context['success'] = FALSE;
        // $context['finished'] = 1;
        // return;      // should it completely stop...?
      }

      // remove processed post from sandbox (even if error)
      unset($posts[ $post['id'] ]);
      // dsm("removed post {$post['id']} from sandbox, count remaining: " . count($posts));
      
    }   // already exists
    
    
    if ($entry_count >= $limit) {
      // drupal_set_message( t("Stopped at @limit entries to avoid timeout.", array('@limit' => $limit)), 'status');
      break;
    }
    
  } // post loop
  

  // Update our progress information.

  $context['sandbox']['progress'] = $context['sandbox']['max'] - count($posts);

  // [not sure if necessary]
  if (count($posts) == 0) $context['sandbox']['progress'] = $context['sandbox']['max'];
  
  $context['finished'] = $context['sandbox']['progress'] / $context['sandbox']['max'];
    if ($context['finished'] > 1) $context['finished'] = 1;   // just in case

  // drupal_set_message( t('Processed @progress out of @total, finished @finished',
  //     array('@progress' => $context['sandbox']['progress'],
  //           '@total' => $context['sandbox']['max'],
  //           '@finished' => number_format( $context['finished'] * 100, 2 ) . '%',
  //       ) ) );


  // in case progress calculations aren't right...
  if ($context['finished'] == 1 && count($posts) > 0) {
    drupal_set_message(t("Import ended prematurely! Still @size left to go but finished.", 
        array('@size' => count($posts)) ), 'error');
    $context['success'] = FALSE;
  }
  if ($context['finished'] != 1 && count($posts) == 0
    ||  $context['sandbox']['progress'] > $context['sandbox']['max']) {
    drupal_set_message(t("Import should have ended! 0 left to go but batch still going."), 'error');
    $context['success'] = FALSE;
    $context['finished'] = 1;
  }
  
}   // node batch process



/**
 * Node batch 'finished' callback
 */
function blogger_importer_batch_nodes_finished($success, $results, $operations) {
  // dsm("results:"); dsm($results);
  
  // save the new results
  if (!empty($results)) blogger_importer_results($results);
  
  if ($success) {

    // count the number of posts in $results w/ 'nid' set!
    // note: this doesn't neces mean they were all created now -- includes nodes previously created!
    
    // $created_nids = array();    // make array of nid=>post_id (not necessary)
    $created_node_count = 0;
    $list = '';

    foreach($results['post'] as $post) {
      if (is_numeric($post['nid'])) {
        // $created_nids[ $post['nid'] ] = $post['id'];
        $created_node_count++;

        // -- this list is redundant, already message when created --
        // $post_title = _blogger_importer_post_title($post);
        // // dsm("title for " . htmlentities($post['title']) . ": " . htmlentities($post_title));
        // 
        // $list .= '<li>' . l($post_title, 'node/' . $post['nid']) . ' - ' . format_date($post['date']) . '</li>';
      }
    }
    
    drupal_set_message( t('@count posts saved as nodes (some may have existed prior):', 
        array('@count' => $created_node_count /*count($created_nids)*/ ) ) );
    // drupal_set_message( '<ul>' . $list . '</ul>' );

  }
  else {
    // An error occurred.
    // $operations contains the operations that remained unprocessed.
    $error_operation = reset($operations);
    $output = t('An error occurred while processing %error_operation with arguments: @arguments', 
        array(
          '%error_operation' => $error_operation[0], 
          '@arguments' => print_r($error_operation[1], TRUE)
      ));
    
    drupal_set_message($output, 'error');
  }
  
  // batch gets redirected to results page (from batch_process() above)
}

