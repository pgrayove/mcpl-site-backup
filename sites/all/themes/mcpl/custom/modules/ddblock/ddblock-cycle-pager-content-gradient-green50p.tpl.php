<?php
// $Id$

/*!
  * Dynamic display block module template: gradient-green50p - pager template
  * Copyright (c) 2008 - 2009 P. Blaauw All rights reserved.
  * Version 1.0 (05-DEC-2009)
  */

/**
 * @file
 * Dynamic display block module template: gradient-green50p - pager template
 * - Custom pager with images and text
 *
 * Available variables:
 * - $delta: Block number of the block.
 * - $pager: Type of pager to add
 * - $pager_items: pager item array
 * - $pager_position: position of the slider (top | bottom)
 *
 * notes: don't change the ID names, they are used by the jQuery script.
 */
$number_of_items = 8;        // total number of items to show
$number_of_items_per_row = 8;  // number of items to show in a row
?>
<!-- custom pager with image and text. -->
<?php if ($pager_position == 'bottom'): ?>
 <div class="spacer-horizontal"><b></b></div>
<?php endif; ?>
<div id="ddblock-custom-pager-<?php print $delta ?>" class="<?php print $pager ?> <?php print $pager ?>-<?php print $pager_position ?> clear-block border">
 <div  class="<?php print $pager ?>-inner clear-block border">
  <?php if ($pager_items): ?>
   <?php $item_counter=0; ?>
   <?php foreach ($pager_items as $pager_item): ?>
    <div class="<?php print $pager ?>-item <?php print $pager ?>-item-<?php print $item_counter ?>">
     <div class="corners">
      <div class="<?php print $pager ?>-item-inner">
      <a href="#" title="navigate to topic" class="pager-link"><?php print $pager_item['image']; ?><?php print $pager_item['text']; ?></a>
      </div>
      <div class="tl"></div>
      <div class="tr"></div>
      <div class="bl"></div>
      <div class="br"></div>
     </div> <!-- /corners -->
    </div> <!-- /custom-pager-item -->
   <?php $item_counter++; if ($item_counter % $number_of_items_per_row == 0):?>
     <?php if ($item_counter <> $number_of_items): ?>
       <div class="spacer-horizontal"><b></b></div>
     <?php endif; ?>
    <?php else: ?>
     <div class="spacer-vertical"></div>
    <?php endif; ?>
   <?php endforeach; ?>
  <?php endif; ?>
 </div> <!-- /pager-inner-->
</div>  <!-- /pager-->
<?php if ($pager_position == 'top'): ?>
 <div class="spacer-horizontal"><b></b></div>
<?php endif; ?>