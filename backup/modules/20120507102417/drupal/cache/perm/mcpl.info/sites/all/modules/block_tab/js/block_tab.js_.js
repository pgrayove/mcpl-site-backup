// $Id: block_tab.js,v 1.2 2009/11/17 16:43:51 itarato Exp $


Drupal.behaviors.BlockTab = function() {
  $('.block_tab-block').hide();
  $('.block_tab-block:first').show();

  $('.block_tab-title').click(function() {
    var region = $(this).parent().attr('region');
    var id  = $(this).attr('id').replace(/block_tab-title-/, '', 'gi');

    $('[region="' + region + '"] .block_tab-block').hide();
    $('[region="' + region + '"] .block_tab-title').removeClass('active');

    $('[region="' + region + '"] #block_tab-block-' + id).fadeIn('fast');
    $(this).addClass('active');
  });
}
