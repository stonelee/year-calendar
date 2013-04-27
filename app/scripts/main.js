/* global moment */
'use strict';

$(function() {

  function getDates(year, month) {
    function getValue(num) {
      return currentMonth.clone().date(num).format('YYYY-MM-DD');
    }

    var currentMonth = moment().year(year).month(month - 1);
    //这个月总天数
    var realDatesNum = currentMonth.daysInMonth();
    //第一天星期几(1..7)
    var dayOfFirst = currentMonth.clone().date(1).day();
    if (dayOfFirst === 0) {
      dayOfFirst = 7;
    }

    var dates = [];
    var i, j, lastDate;
    var week = [];
    //first week
    for (i = 0; i < dayOfFirst - 1; i++) {
      week.push({});
    }
    for (i = 1; i < 9 - dayOfFirst; i++) {
      week.push({
        label: i,
        value: getValue(i)
      });
      lastDate = i;
    }
    dates.push(week);

    //whole week in the month
    var wholeDayNum = Math.floor((realDatesNum - lastDate) / 7);
    for (i = 0; i < wholeDayNum; i++) {
      week = [];
      for (j = 0; j < 7; j++) {
        lastDate += 1;
        week.push({
          label: lastDate,
          value: getValue(lastDate)
        });
      }
      dates.push(week);
    }

    //last week
    week = [];
    var leftDatesNum = realDatesNum - lastDate;
    for (i = 0; i < leftDatesNum; i++) {
      lastDate += 1;
      week.push({
        label: lastDate,
        value: getValue(lastDate)
      });
    }
    if (i > 0) {
      for (j = 0; j < 7 - i; j++) {
        week.push({});
      }
    }
    dates.push(week);
    return dates;
  }

  function createCalendar(year) {
    $('#currentYear').text(year);

    $('#container').empty();
    for (var i = 1; i < 13; i++) {
      var data = {
        month: i,
        days: ['一', '二', '三', '四', '五', '六', '日'],
        dates: getDates(year, i)
      };
      var calendar = Handlebars.compile($('#calendar').html())(data);
      $('<li>').appendTo('#container').append(calendar);
    }
  }

  function setSpecDates(dates) {
    for (var i = 0; i < dates.length; i++) {
      $('[data-value=' + dates[i] + ']').addClass('spec');
    }
  }

  function delegateBtn() {
    function showBtn($td, btnShow, btnHide) {
      var pos = $td.position();
      $('#btn').css({
        top: pos.top + 3,
        left: pos.left + 1
      }).show();
      $(btnShow).data('value', $td.attr('data-value')).show();
      $(btnHide).hide();
    }

    $('#container td[data-value]').mouseover(function() {
      var $td = $(this);
      if ($td.hasClass('spec')) {
        showBtn($td, '#btnNo', '#btnYes');
      } else {
        showBtn($td, '#btnYes', '#btnNo');
      }
    });
    $('#container').mouseover(function(e) {
      if (e.target.tagName === 'UL') {
        $('#btn').hide();
      }
    });
  }

  function progressBtn() {
    var btnTop = 4,
      btnLeft = 3;
    $('#btnYes,#btnNo').mousedown(function() {
      $(this).css({
        top: btnTop + 1,
        left: btnLeft + 1
      });
    }).mouseup(function() {
      var $btn = $(this);
      $btn.css({
        top: btnTop,
        left: btnLeft
      });

      var value = $btn.data('value');
      if ($btn.attr('id') === 'btnYes') {
        console.log('yes ' + value);
        $('td[data-value=' + value + ']').addClass('spec');
      } else {
        console.log('no ' + value);
        $('td[data-value=' + value + ']').removeClass('spec');
      }
      $('#btn').hide();
    });
  }

  function changeYear(year) {
    createCalendar(year);
    setSpecDates(['2013-04-29', '2013-04-30', '2013-05-01']);
    delegateBtn();
  }

  var currentYear = moment().year();
  changeYear(currentYear);
  progressBtn();

  $('#lastYear').click(function() {
    changeYear(--currentYear);
  });
  $('#nextYear').click(function() {
    changeYear(++currentYear);
  });



});
