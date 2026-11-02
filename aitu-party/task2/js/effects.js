$(function () {
  var CARD_W = 280;
  var CARD_MS = 320;
  var MOVE_MS = 700;
  var SLIDE_MS = 700;
  var current = null;
  var FACT_NAMES = { phone: 'a phone', glasses: 'glasses', bag: 'a bag', cup: 'a cup', crumbs: 'cake crumbs' };

  function joinList(a) {
    if (a.length < 2) { return a.join(''); }
    return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function rect($el) {
    var o = $el.offset();
    return { left: o.left, top: o.top, width: $el.outerWidth(), height: $el.outerHeight() };
  }

  function buildCard($g) {
    var things = ($g.attr('data-things') || '').split(' ').filter(Boolean);
    var words = $.map(things, function (t) { return FACT_NAMES[t]; });
    var $room = $g.closest('.room');
    var pos = $g.prevAll('.guest').length + 1;
    var isAitu = $g.attr('data-aitu') === 'yes';

    var $card = $('<div class="info-card"></div>');
    var $body = $('<div class="card-body"></div>').appendTo($card);
    var $head = $('<div class="card-head"></div>').appendTo($body);
    $('<img alt="">').attr('src', $g.find('img').attr('src')).appendTo($head);
    var $title = $('<div></div>').appendTo($head);
    $('<h3></h3>').text($g.attr('data-name')).appendTo($title);
    $('<span class="card-tag"></span>').text(isAitu ? 'AITU STUDENT' : 'GUEST').appendTo($title);

    var facts = [
      'Came at ' + $g.attr('data-time'),
      isAitu ? 'AITU student' : 'Not an AITU student',
      words.length ? 'Has ' + joinList(words) : 'Came with nothing',
      'Wears ' + $g.attr('data-color'),
      'Stands ' + ordinal(pos) + ' in the ' + $room.attr('data-name').toLowerCase()
    ];
    var $ul = $('<ul class="facts"></ul>').appendTo($body);
    $.each(facts, function (i, f) { $('<li></li>').text(f).appendTo($ul); });

    var $moves = $('<div class="moves"></div>').appendTo($body);
    $('.room').not($room).each(function () {
      var $r = $(this);
      $('<button type="button" class="move-btn"></button>')
        .attr('data-to', $r.attr('data-room'))
        .text('Move to the ' + $r.attr('data-name').toLowerCase())
        .appendTo($moves);
    });
    return $card;
  }

  function closeCard() {
    if (!current) { return; }
    var c = current;
    current = null;
    c.$card.stop(true);
    c.$card.find('.card-body').stop(true).animate({ opacity: 0 }, 120);
    var $av = c.$guest.find('.ring');
    if ($av.length && $.contains(document.documentElement, c.$guest[0])) {
      var a = rect($av);
      c.$card.css('height', c.$card.height());
      c.$card.animate({ left: a.left, top: a.top, width: a.width, height: a.height }, {
        duration: CARD_MS,
        complete: function () { c.$card.remove(); }
      });
    } else {
      c.$card.fadeOut(160, function () { $(this).remove(); });
    }
  }

  function openCard($g) {
    var same = current && current.$guest[0] === $g[0];
    closeCard();
    if (same || $g.hasClass('moving')) { return; }

    var $card = buildCard($g).css({ left: -9999, top: 0, width: CARD_W }).appendTo('body');
    var H = $card.outerHeight();
    var a = rect($g.find('.ring'));
    var $w = $(window);
    var L = a.left + a.width / 2 - CARD_W / 2;
    var T = a.top + a.height / 2 - H / 2;
    L = Math.max($w.scrollLeft() + 8, Math.min(L, $w.scrollLeft() + $w.width() - CARD_W - 8));
    T = Math.max($w.scrollTop() + 8, Math.min(T, $w.scrollTop() + $w.height() - H - 8));

    var $body = $card.find('.card-body').css('opacity', 0);
    $card.css({ left: a.left, top: a.top, width: a.width, height: a.height });
    current = { $guest: $g, $card: $card };

    $card.animate({ left: L, top: T, width: CARD_W, height: H }, {
      duration: CARD_MS,
      complete: function () { $card.css('height', 'auto'); }
    });
    $body.delay(120).animate({ opacity: 1 }, 200);
  }

  function moveInArray(name, toId) {
    var found = null;
    $.each(PARTY.rooms, function (i, r) {
      $.each(r.guests, function (j, x) {
        if (x.name === name) { found = r.guests.splice(j, 1)[0]; return false; }
      });
      if (found) { return false; }
    });
    if (!found) { return; }
    $.each(PARTY.rooms, function (i, r) {
      if (r.id === toId) { r.guests.push(found); return false; }
    });
  }

  function moveGuest($g, toId) {
    var $toRoom = $('#room-' + toId);
    if (!$g.length || !$toRoom.length || $g.hasClass('moving')) { return; }
    if ($g.closest('.room').attr('data-room') === toId) { return; }

    moveInArray($g.attr('data-name'), toId);

    var $dest = $toRoom.find('.guests');
    var cw = $g.outerWidth();
    var ch = $g.outerHeight();
    var ml = parseFloat($g.css('marginLeft'));
    var mr = parseFloat($g.css('marginRight'));
    var from = $g.offset();

    $g.stop('slide', true);

    var $fly = $g.clone()
      .removeAttr('id')
      .removeClass('guest found')
      .addClass('fly')
      .css({ position: 'absolute', left: from.left, top: from.top, width: cw, margin: 0 })
      .appendTo('body');

    var $gap = $('<div class="gap"></div>').css({ width: cw + ml + mr, height: ch }).insertBefore($g);

    var orders = $dest.children('.guest').map(function () { return +$(this).attr('data-order'); }).get();
    var newOrder = Math.max.apply(null, orders.concat(0)) + 1;

    $g.addClass('moving')
      .attr({ 'data-room': toId, 'data-order': newOrder })
      .css({ visibility: 'hidden', overflow: 'hidden', width: 0, marginLeft: 0, marginRight: 0, left: 0, top: 0 })
      .appendTo($dest);

    var pending = 2;
    function done() {
      pending -= 1;
      if (pending > 0) { return; }
      $fly.remove();
      $g.removeClass('moving').css({ visibility: '', overflow: '', width: '', marginLeft: '', marginRight: '' });
    }

    $gap.animate({ width: 0 }, {
      duration: MOVE_MS, queue: false,
      complete: function () { $gap.remove(); }
    });

    $g.animate({ width: cw, marginLeft: ml, marginRight: mr }, {
      duration: MOVE_MS, queue: false, complete: done
    });

    $({ t: 0 }).animate({ t: 1 }, {
      duration: MOVE_MS,
      step: function (now) {
        if (!$fly[0].isConnected) { return; }
        var to = $g.offset();
        $fly.css({
          left: from.left + (to.left - from.left) * now,
          top: from.top + (to.top - from.top) * now
        });
      },
      complete: done
    });
  }

  function sortRoom($room, $btn) {
    var sorted = !$room.data('sorted');
    $room.data('sorted', sorted);
    $btn.toggleClass('on', sorted);

    var $list = $room.find('.guests');
    var $gs = $list.children('.guest');
    $gs.stop('slide', true);

    $gs.each(function () { $(this).data('from', $(this).offset()); });
    $gs.css({ left: 0, top: 0 });

    var key = sorted ? 'data-min' : 'data-order';
    var arr = $gs.get().sort(function (a, b) {
      return a.getAttribute(key) - b.getAttribute(key);
    });
    $.each(arr, function (i, el) { $list.append(el); });

    $gs.each(function () {
      var $g = $(this);
      var f = $g.data('from');
      var t = $g.offset();
      $g.css({ left: f.left - t.left, top: f.top - t.top })
        .animate({ left: 0, top: 0 }, { duration: SLIDE_MS, queue: 'slide' })
        .dequeue('slide');
    });
  }

  $(document).on('house:built', function () {
    $('.room-tools').each(function () {
      $('<button type="button" class="sort-btn">Sort by time</button>').appendTo(this);
    });
  });

  $('#house').on('click', '.guest', function () {
    openCard($(this));
  });

  $('#house').on('click', '.sort-btn', function () {
    sortRoom($(this).closest('.room'), $(this));
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.info-card, .guest').length) { closeCard(); }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') { closeCard(); }
  });

  $(document).on('click', '.info-card .move-btn', function () {
    if (!current) { return; }
    var $g = current.$guest;
    var to = $(this).attr('data-to');
    closeCard();
    moveGuest($g, to);
  });
});
