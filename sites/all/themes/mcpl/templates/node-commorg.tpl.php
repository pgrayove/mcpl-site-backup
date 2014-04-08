<?php
/**
 * @file
 * Theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: Node body or teaser depending on $teaser flag.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $terms: the themed list of taxonomy term links output from theme_links().
 * - $display_submitted: whether submission information should be displayed.
 * - $submitted: Themed submission information output from
 *   theme_node_submitted().
 * - $links: Themed links like "Read more", "Add new comment", etc. output
 *   from theme_links().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type, i.e., "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 *   The following applies only to viewers who are registered users:
 *   - node-by-viewer: Node is authored by the user currently viewing the page.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $build_mode: Build mode, e.g. 'full', 'teaser'...
 * - $teaser: Flag for the teaser state (shortcut for $build_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * The following variable is deprecated and will be removed in Drupal 7:
 * - $picture: This variable has been renamed $user_picture in Drupal 7.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see zen_preprocess()
 * @see zen_preprocess_node()
 * @see zen_process()
 */
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix">
  <?php print $user_picture; ?>

  <?php if (!$page && $title): ?>
    <h2 class="title"><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h2>
  <?php endif; ?>

  <?php if ($unpublished): ?>
    <div class="unpublished"><?php print t('Unpublished'); ?></div>
  <?php endif; ?>
  
  <div class="content">
  	 	<table id="commorg">
  	 		<?php if($node->field_url[0]['view']){ ?>
	  	 		<tr>
	  	 			<th>Website</th>
	  	 			<td><?php print "<a href='".$node->field_url[0]['view']."'>".$node->field_url[0]['view']."</a>"; ?></td>
	  	 		</tr>
	  	 	<?php } ?>
	  	 	<?php if($node->field_contact[0]['view']){ ?>
	  	 		<tr>
	  	 			<th>Contact</th>
	  	 			<td>
	  	 				<?php 
	  	 					print $node->field_contact[0]['view'].' '.$node->field_contact_last[0]['view'];
	  	 					if($node->field_contact_title[0]['view']){
	  	 						print ' ('.$node->field_contact_title[0]['view'].")"; 
	  	 					}
	  	 				?>
	  	 			</td>
	  	 		</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_phone[0]['view']){ ?>
  	 			<tr>
  	 				<th>Phone</th>
  	 				<td><?php print $node->field_phone[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_email[0]['view']){ ?>
  	 			<tr>
  	 				<th>Email</th>
  	 				<td><?php print $node->field_email[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_street[0]['view']){ ?>
  	 			<tr>
  	 				<th>Address</th>
  	 				<td>
  	 					<?php print $node->field_street[0]['view'];
	  	 					if($node->field_street_b[0]['view']){
	  	 						print "<br />\n";
	  	 						print $node->field_street_b[0]['view'];
	  	 					}
	  	 					if($node->field_city[0]['view']){
	  	 						print "<br />\n";
	  	 						print $node->field_city[0]['view'];
	  	 					}
	  	 					if($node->field_state[0]['view']){
	  	 						print ", ";
	  	 						print $node->field_state[0]['view'];
	  	 					}
	  	 					if($node->field_zip[0]['view']){
	  	 						print " ";
	  	 						print $node->field_zip[0]['view'];
	  	 					}
  	 					?>
  	 				</td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_hours[0]['view']){ ?>
  	 			<tr>
  	 				<th>Hours</th>
  	 				<td><?php print $node->field_hours[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->content['body']['#value']){ ?>
  	 			<tr>
  	 				<th>Description</th>
  	 				<td><?php print $node->content['body']['#value']; ?></td>
  	 			</tr>
  	 		<? } ?>
  	 		<?php if($node->field_contact2[0]['view']){ ?>
	  	 		<tr>
	  	 			<th>Additional Contact</th>
	  	 			<td>
	  	 				<?php 
	  	 					print $node->field_contact2[0]['view'].' '.$node->field_contact_last2[0]['view'];
	  	 					if($node->field_contact_title2[0]['view']){
	  	 						print ' ('.$node->field_contact_title2[0]['view'].")"; 
	  	 					}
	  	 				?>
	  	 			</td>
	  	 		</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_phone2[0]['view']){ ?>
  	 			<tr>
  	 				<th>Phone</th>
  	 				<td><?php print $node->field_phone2[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_email2[0]['view']){ ?>
  	 			<tr>
  	 				<th>Email</th>
  	 				<td><?php print $node->field_email2[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_street2[0]['view']){ ?>
  	 			<tr>
  	 				<th>Address</th>
  	 				<td>
  	 					<?php print $node->field_street2[0]['view'];
	  	 					if($node->field_street_b2[0]['view']){
	  	 						print "<br />\n";
	  	 						print $node->field_street_b2[0]['view'];
	  	 					}
	  	 					if($node->field_city2[0]['view']){
	  	 						print "<br />\n";
	  	 						print $node->field_city2[0]['view'];
	  	 					}
	  	 					if($node->field_state2[0]['view']){
	  	 						print ", ";
	  	 						print $node->field_state2[0]['view'];
	  	 					}
	  	 					if($node->field_zip2[0]['view']){
	  	 						print " ";
	  	 						print $node->field_zip2[0]['view'];
	  	 					}
  	 					?>
  	 				</td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_contact3[0]['view']){ ?>
	  	 		<tr>
	  	 			<th>Additional Contact</th>
	  	 			<td>
	  	 				<?php 
	  	 					print $node->field_contact3[0]['view'].' '.$node->field_contact_last3[0]['view'];
	  	 					if($node->field_contact_title3[0]['view']){
	  	 						print ' ('.$node->field_contact_title3[0]['view'].")"; 
	  	 					}
	  	 				?>
	  	 			</td>
	  	 		</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_phone3[0]['view']){ ?>
  	 			<tr>
  	 				<th>Phone</th>
  	 				<td><?php print $node->field_phone3[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_email3[0]['view']){ ?>
  	 			<tr>
  	 				<th>Email</th>
  	 				<td><?php print $node->field_email3[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_street3[0]['view']){ ?>
  	 			<tr>
  	 				<th>Address</th>
  	 				<td>
  	 					<?php print $node->field_street3[0]['view'];
	  	 					if($node->field_street_b3[0]['view']){
	  	 						print "<br />\n";
	  	 						print $node->field_street_b3[0]['view'];
	  	 					}
	  	 					if($node->field_city3[0]['view']){
	  	 						print "<br />\n";
	  	 						print $node->field_city3[0]['view'];
	  	 					}
	  	 					if($node->field_state3[0]['view']){
	  	 						print ", ";
	  	 						print $node->field_state3[0]['view'];
	  	 					}
	  	 					if($node->field_zip3[0]['view']){
	  	 						print " ";
	  	 						print $node->field_zip3[0]['view'];
	  	 					}
  	 					?>
  	 				</td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_language[0]['view']){ ?>
  	 			<tr>
  	 				<th>Language</th>
  	 				<td><?php print $node->field_language[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_commorg_year_established[0]['view']){ ?>
  	 			<tr>
  	 				<th>Year Established</th>
  	 				<td><?php print $node->field_commorg_year_established[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($node->field_commorg_incorporation[0]['view']){ ?>
  	 			<tr>
  	 				<th>Incorporation Status</th>
  	 				<td><?php print $node->field_commorg_incorporation[0]['view']; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 		<?php if($terms){ ?>
  	 			<tr>
  	 				<th>Subjects</th>
  	 				<td><?php print $terms; ?></td>
  	 			</tr>
  	 		<?php } ?>
  	 	</table>
  </div>

  <?php if ($display_submitted || $terms): ?>
    <div class="meta">
      <?php if ($display_submitted): ?>
        <span class="submitted">
          <?php print $submitted; ?>
        </span>
      <?php endif; ?>
    </div>
  <?php endif; ?>

  <?php print $links; ?>
  <?php
  	print "<ul class='print_links'>";
  	print "<li class='print_page'><a href='http://mcpl.info/print{$_SERVER['REQUEST_URI']}' title='Print this page' rel='nofollow'><img src='/sites/all/modules/print/icons/print_icon.gif' alt='Email this page' /></a></li>";
  	print "<li class='print_mail'><a href='/printmail{$_SERVER['REQUEST_URI']}' title='Send this page by email' rel='nofollow'><img src='/sites/all/modules/print/icons/mail_icon.gif' alt='Email this page' /></a></li>";
  	print "<li class='print_pdf'><a href='/printpdf{$_SERVER['REQUEST_URI']}' title='PDF version' rel='nofollow'><img src='/sites/all/modules/print/icons/pdf_icon.gif' alt='PDF version' /></a></li>";
  	print "</ul>";
  ?>
</div><!-- /.node -->
