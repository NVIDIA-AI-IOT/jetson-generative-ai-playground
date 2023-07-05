(function ($) {
  'use strict';

  // data background
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')'
    });
  });

  // collapse
  $('.collapse').on('shown.bs.collapse', function () {
    $(this).parent().find('.ti-plus').removeClass('ti-plus').addClass('ti-minus');
  }).on('hidden.bs.collapse', function () {
    $(this).parent().find('.ti-minus').removeClass('ti-minus').addClass('ti-plus');
  });

  // match height
  $('.match-height').matchHeight({
    byRow: true,
    property: 'height',
    target: null,
    remove: false
  });
  
})(jQuery);