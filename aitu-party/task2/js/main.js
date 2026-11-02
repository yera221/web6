$(function () {
  $.each(CASES, function (i, c) {
    var $b = $('<button type="button" class="case-btn"></button>').attr({ 'data-case': c.id, 'title': c.title });
    $('<b></b>').text(c.id).appendTo($b);
    $('<span></span>').text(c.title).appendTo($b);
    $b.appendTo('#cases');
  });

  buildHouse();

  $('#cases').on('click', '.case-btn', function () {
    var c = CASES[+$(this).attr('data-case') - 1];
    buildHouse();
    $('.case-btn').removeClass('active');
    $(this).addClass('active');

    var $set = c.run();
    $set.addClass('found');

    var $bright = $set.is('.room') ? $set.find('.guest') : $set;
    if (c.spot !== false) {
      $('.guest').not($bright).stop('fx', true).fadeTo(300, 0.2);
    }

    jump($set);
    showResult(c, $set);
  });

  $('#clear').on('click', function () {
    $('.found').removeClass('found');
    $('.guest').not('.leaving').stop('fx', true).fadeTo(300, 1);
    $('.case-btn').removeClass('active');
    $('#result').text('Everybody is bright again.');
  });
});
