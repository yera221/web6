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
    jump($set);
    showResult(c, $set);
  });
});
