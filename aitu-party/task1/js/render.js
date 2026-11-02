var ICONS = { phone: '📱', glasses: '👓', bag: '🎒', cup: '☕', crumbs: '🍰' };
var THING_NAMES = { phone: 'phone', glasses: 'glasses', bag: 'bag', cup: 'cup', crumbs: 'cake crumbs' };

function toMin(t) {
  var p = t.split(':');
  return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
}

function avatarUrl(name) {
  return 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + encodeURIComponent(name);
}

function makeGuest(g, roomId, order) {
  var $g = $('<div></div>')
    .addClass('guest color-' + g.color)
    .addClass(g.aitu ? 'aitu' : 'outsider')
    .attr({
      'id': 'g-' + g.name.toLowerCase(),
      'data-name': g.name,
      'data-color': g.color,
      'data-time': g.time,
      'data-min': toMin(g.time),
      'data-aitu': g.aitu ? 'yes' : 'no',
      'data-things': g.things.join(' '),
      'data-room': roomId,
      'data-order': order
    });
  $.each(g.things, function (i, t) { $g.addClass('has-' + t); });
  var $in = $('<div class="inner"></div>').appendTo($g);
  if (g.aitu) { $('<span class="badge" title="AITU student">AITU</span>').appendTo($in); }
  var $ring = $('<div class="ring"></div>').appendTo($in);
  $('<img alt="">').attr('src', avatarUrl(g.name)).appendTo($ring);
  $('<div class="name"></div>').text(g.name).appendTo($in);
  $('<div class="time"></div>').text('⏱ ' + g.time).appendTo($in);
  var $things = $('<div class="things"></div>').appendTo($in);
  $.each(g.things, function (i, t) {
    $('<span class="thing"></span>').addClass('thing-' + t).attr('title', THING_NAMES[t]).text(ICONS[t]).appendTo($things);
  });
  return $g;
}

function buildHouse() {
  $('.fly').remove();
  var $house = $('#house').empty();
  $.each([2, 1], function (i, floor) {
    var $floor = $('<section class="floor"></section>').attr('id', 'floor-' + floor).appendTo($house);
    $('<div class="floor-label"></div>').text('FLOOR ' + floor).appendTo($floor);
    var $rooms = $('<div class="rooms"></div>').appendTo($floor);
    $.each(PARTY.rooms, function (j, r) {
      if (r.floor !== floor) { return; }
      var $room = $('<div class="room"></div>').attr({ 'id': 'room-' + r.id, 'data-name': r.name, 'data-room': r.id }).appendTo($rooms);
      var $head = $('<div class="room-head"></div>').appendTo($room);
      $('<h3></h3>').text(r.name).appendTo($head);
      $('<div class="room-tools"></div>').appendTo($head);
      var $list = $('<div class="guests"></div>').appendTo($room);
      $.each(r.guests, function (k, g) { makeGuest(g, r.id, k + 1).appendTo($list); });
    });
  });
  $(document).trigger('house:built');
}

function namesOf($set) {
  return $set.map(function () { return $(this).attr('data-name'); }).get();
}

function jump($set) {
  var $target = $set.is('.guest') ? $set.children('.inner') : $set;
  $target.animate({ top: -16 }, 160).animate({ top: 0 }, 160);
}

function showResult(c, $set) {
  var n = namesOf($set);
  var $r = $('#result').empty();
  $('<div class="q"></div>').text('Case ' + c.id + ': ' + c.title).appendTo($r);
  $('<div class="a"></div>').text(n.length ? n.length + ' found: ' + n.join(', ') : 'Nobody found').appendTo($r);
}
