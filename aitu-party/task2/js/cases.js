var CASES = [
  { id: 1, title: 'Who is in the hall?',
    run: function () { return $('#room-hall .guest'); } },

  { id: 2, title: 'Who is dressed in yellow or purple?',
    run: function () { return $('.guest.color-yellow, .guest.color-purple'); } },

  { id: 3, title: 'Which AITU students are upstairs?',
    run: function () { return $('#floor-2 .guest.aitu'); } },

  { id: 4, title: 'Who has glasses or a bag?',
    run: function () { return $('.guest[data-things~="glasses"], .guest[data-things~="bag"]'); } },

  { id: 5, title: 'Who came with nothing at all?',
    run: function () { return $('.guest[data-things=""]'); } },

  { id: 6, title: 'Who has a phone but no bag?',
    run: function () { return $('.guest.has-phone').not('.has-bag'); } },

  { id: 7, title: 'Who arrived between 20:30 and 21:00, both included?',
    run: function () {
      return $('.guest').filter(function () {
        var m = +$(this).attr('data-min');
        return m >= 1230 && m <= 1260;
      });
    } },

  { id: 8, title: 'Who arrived after 21:00 and is not an AITU student?',
    run: function () {
      return $('.guest.outsider').filter(function () { return +$(this).attr('data-min') > 1260; });
    } },

  { id: 9, title: 'Who stands right next to Askar?',
    run: function () { return $('#g-askar').prev().add('#g-askar + .guest'); } },

  { id: 10, title: 'Who stands last in each room?',
    run: function () { return $('.guests .guest:last-child'); } },

  { id: 11, title: 'Who stands third in each room?',
    run: function () { return $('.guests .guest:nth-child(3)'); } },

  { id: 12, title: 'Who stands after Timur in his room?',
    run: function () { return $('#g-timur').nextAll('.guest'); } },

  { id: 13, title: 'Who stands right before someone in black?',
    run: function () { return $('.guest.color-black').prev('.guest'); } },

  { id: 14, title: 'In which room is Aruzhan?',
    run: function () { return $('#g-aruzhan').closest('.room'); } },

  { id: 15, title: 'Which rooms have fewer than 6 guests?',
    run: function () { return $('.room:not(:has(.guest:nth-child(6)))'); } },

  { id: 16, title: 'In which rooms does somebody have a cup, but nobody wears glasses?',
    run: function () { return $('.room:has(.has-cup):not(:has(.has-glasses))'); } },

  { id: 17, title: 'Who came first to each room?',
    run: function () {
      return $('.room').map(function () {
        return $(this).find('.guest').toArray().sort(function (a, b) {
          return $(a).attr('data-min') - $(b).attr('data-min');
        })[0];
      });
    } },

  { id: 18, title: 'Miras (AITU, blue) comes at 21:20 with his phone and stands between Askar and Inkar.',
    run: function () { return makeGuest(NEWCOMER, 'living', 99).hide().insertAfter('#g-askar').fadeIn(800); } },

  { id: 19, title: 'Natasha says goodbye and goes home.',
    spot: false,
    run: function () {
      return $('#g-natasha').addClass('leaving').delay(340).fadeOut(700, function () { $(this).remove(); });
    } },

  { id: 20, title: 'Who took the cake?',
    run: function () {
      return $('#floor-1 .guest.has-crumbs').not('.has-cup').filter(function () {
        var m = +$(this).attr('data-min');
        return m > 1260 && m < 1290;
      }).filter(function () {
        return $(this).prev().add($(this).next()).filter('.aitu').length > 0;
      });
    } }
];
