<?php
// $Id$ 

/*!
 * Dynamic display block module template: gradient-green50p - content template
 * Copyright (c) 2008 - 2009 P. Blaauw All rights reserved.
 * Version 1.0 (06-DEC-2009)
 * Licenced under GPL license
 * http://www.gnu.org/licenses/gpl.html
 */

/**
 * @file
 * Dynamic display block module template: gradient-green50p - content template
 *
 * Available variables:
 * - $origin: From which module comes the block.
 * - $delta: Block number of the block.
 *
 * - $custom_template: template name
 * - $output_type: type of content
 *
 * - $slider_items: array with slidecontent
 * - $slide_text_position of the text in the slider (top | right | bottom | left)
 * - $slide_direction: direction of the text in the slider (horizontal | vertical )
 * - 
 * - $pager_content: Themed pager content
 * - $pager_position: position of the pager (top | bottom)
 *
 * notes: don't change the ID names, they are used by the jQuery script.
 */
// add Cascading style sheet
drupal_add_css($directory .'/custom/modules/ddblock/'.$custom_template. '/ddblock-cycle-'.$custom_template. '.css', 'template', 'all', FALSE);

?>
<!-- dynamic display block slideshow -->
<div id="ddblock-<?php print $delta ?>" class="ddblock-cycle-<?php print $custom_template ?> clear-block">
 <div class="container clear-block border">
  <div class="image-box-white-grey-white-10">
   <div class="image-box-corner-wrapper">
    <div class="image-box-top-side"><div class="left"></div><div class="right"></div></div>
     <div class="image-box-left-side">
      <div class="image-box-right-side">
       <div class="container-inner clear-block border">
        <?php if ($pager_position == "top") : ?>
        <!-- custom pager image - text --> 
         <?php print $pager_content ?>
        <?php endif; ?>
        <!-- slider content -->
        <div class="slider clear-block border">
         <div class="slider-inner clear-block border">
          <?php if ($output_type == 'view_fields') : ?>
           <?php foreach ($slider_items as $slider_item): ?>
            <div class="slide clear-block border">
             <div class="slide-inner clear-block border">
              <div class="corners">
               <?php print $slider_item['slide_image']; ?>
               <div class="tl"></div>
               <div class="tr"></div>
               <div class="bl"></div>
               <div class="br"></div>
              </div>                   
              <div class="slide-text slide-text-<?php print $slide_direction ?> slide-text-<?php print $slide_text_position ?> clear-block border">
               <div class="slide-text-inner clear-block border">
                <div class="slide-title slide-title-<?php print $slide_direction ?> clear-block border">
                 <div class="slide-title-inner clear-block border">
                  <h2><?php print $slider_item['slide_title'] ?></h2>
                 </div> <!-- slide-title-inner-->
                </div>  <!-- slide-title-->
                <div class="slide-body-<?php print $slide_direction ?> clear-block border">
                 <div class="slide-body-inner clear-block border">
                  <p><?php print $slider_item['slide_text'] ?></p>
                 </div> <!-- slide-body-inner-->
                </div>  <!-- slide-body-->
                <div class="slide-read-more slide-read-more-<?php print $slide_direction ?> clear-block border">
				         <p><?php print $slider_item['slide_read_more'] ?></p>
				        </div><!-- slide-read-more-->
               </div> <!-- slide-text-inner-->
              </div>  <!-- slide-text-->
             </div> <!-- slide-inner-->
            </div>  <!-- slide-->
           <?php endforeach; ?>
          <?php endif; ?>
         </div> <!-- slider-inner-->
        </div>  <!-- slider-->
       <?php if ($pager_position == "bottom") : ?>
       <!-- custom pager image - text --> 
        <?php print $pager_content ?>
       <?php endif; ?>
       </div> <!-- container-inner-->
      </div> <!--image-box-right-side-->
     </div> <!--image-box-left-side-->
    <div class="image-box-bottom-side"><div class="left"></div><div class="right"></div></div>
   </div> <!--image-box-corner-wrapper-->
  </div> <!--image-box-white-greyshadow-white-10-->
 </div> <!--container-->      
</div> <!--  template -->