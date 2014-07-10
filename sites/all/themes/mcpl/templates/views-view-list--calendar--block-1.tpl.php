<?php
/**
 * @file views-view-list.tpl.php
 * Default simple view template to display a list of rows.
 *
 * - $title : The title of this group of rows.  May be empty.
 * - $options['type'] will either be ul or ol.
 * @ingroup views_templates
 */
// Tag each list entry with an event_type_ tag
foreach($view->result as $vi => $vd):
	$lst = taxonomy_node_get_terms_by_vocabulary(node_load($vd->nid), 2);
	foreach($lst as $tid => $tdata):
		$classes[$vi] .= " " . "event_type_" . $tid;
	endforeach;
endforeach;
?>
<div class="item-list">
  <?php if (!empty($title)) : ?>
    <h3><?php print $title; ?></h3>
  <?php endif; ?>
  <<?php print $options['type']; ?>>
    <?php foreach ($rows as $id => $row): ?>
      <li class="<?php print $classes[$id]; ?>">
<?php print $row; ?></li>
    <?php endforeach; ?>
  </<?php print $options['type']; ?>>
</div>
