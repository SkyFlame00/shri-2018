// Функция создания календаря. Параметр type: в приложении имеется 3 вида календарей: десктопный, мобильный и тот,
// который появляется при создании встречи. Для десктопного и для создания встречи необходимо определить префикс,
// передаваемый в type (cm=createMeeting или d=desktop);
function makeCalendar(month, year, id, displayNone, type = null) {
  let calendar = document.createElement('table');
  let dayFirst = (new Date(year, month, 1)).getDay();
  let daysNum = (new Date(year, month + 1, 0)).getDate();
  let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  let today = new Date();

  calendar.innerHTML = `
    <thead>
      <tr>
        <td colspan="7"></td>
      </tr>
      <tr>
        <td>Пн</td>
        <td>Вт</td>
        <td>Ср</td>
        <td>Чт</td>
        <td>Пт</td>
        <td>Сб</td>
        <td>Вс</td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>`;

    let thead = calendar.querySelector('thead'), tbody = calendar.querySelector('tbody');
      thead.querySelector('tr:first-child').querySelector('td').innerHTML = months[month] + ' ' + year;
    let currentTr = tbody.firstElementChild;
    let currentDay = dayFirst;
    if (currentDay == 0) currentDay = 7;
    let trNum = 1;

    for (let i = 1; i <= daysNum; i++) {
    	if (currentDay > 7) {
        let tr = document.createElement('tr');
        tr.innerHTML = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
      	tbody.appendChild(tr);
        currentTr = tbody.lastElementChild;
        currentDay = 1;

        trNum++;
      }

      if (today.getFullYear() == year  &&
          today.getMonth()    == month &&
          today.getDate()     == i) {

        if (type) {
          //console.log(type)
          currentTr.querySelector('td:nth-child(' + currentDay + ')').innerHTML = '<input class="' + type + '-calendar-day" type="button" value="' + i + '">';
        } else {

          currentTr.querySelector('td:nth-child(' + currentDay + ')').innerHTML = '<input type="button" value="' + i + '">';
        }

        currentTr.querySelector('td:nth-child(' + currentDay + ') input').classList.add('calendar-today');

      } else {

        if (type) {
          //console.log(type)
          currentTr.querySelector('td:nth-child(' + currentDay + ')').innerHTML = '<input class="' + type + '-calendar-day" type="button" value="' + i + '">';
        } else {

          currentTr.querySelector('td:nth-child(' + currentDay + ')').innerHTML = '<input type="button" value="' + i + '">';
        }

      }

      currentDay++;
    }

    calendar.classList.add('calendar');

    if (typeof(id) === 'number') {
      calendar.classList.add('d-calendar-' + (id + 1));
      calendar.id = 'd-calendar-' + (id + 1);
    } else {
      calendar.id = 'calendar';
    }

    if (type === 'cm') {
      calendar.id = 'cm-calendar';
    }

    if (displayNone === true) calendar.style.display = 'none';

    for (let i = 1; i <= trNum; i++) {
      let currentTr = tbody.children[i - 1];

      for (j = 1; j <= 7; j++) {
        if (currentTr.children[j - 1].innerHTML === '') {
          currentTr.children[j - 1].classList.add('calendar-day-excluded');
        }
      }
    }

    return calendar;
}

// Функция рендеринга календаря в окне создания встречи (cm=createMeeting)
// Принимает параметр data со свойствами month и year
function makeNewCalendar_cm(data) {
  let height = $('#cm-calendar-window-body').outerHeight();

  $('#cm-calendar-window-body').css({'height': height + 'px'});

  $('#cm-calendar').fadeOut(400, () => {
    $('#cm-calendar').remove();

    let calendar = makeCalendar(data.month, data.year, null, true, 'cm');

    $('#cm-calendar-window-body').append(calendar);

    $('#cm-calendar-window-body').css({'height': 'auto'});

    $('#cm-calendar').fadeIn(400);
  });
}

// Кнопки, содержащие название месяца и год, также необходимо динамически менять. Для этого была
// написана данная функция
function changeCalendarBtnsDate_cm(data) {
  let height = $('#cm-calendar-btns').innerHeight();
  let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  let prevDateMonth = new Date(data.year, data.month - 1).getMonth();
  let prevDateYear = new Date(data.year, data.month - 1).getFullYear();
  let nextDateMonth = new Date(data.year, data.month + 1).getMonth();
  let nextDateYear = new Date(data.year, data.month + 1).getFullYear();

  $('.cm-calendar-btn').css({'color': 'transparent'});

  setTimeout(() => {
    $('#cm-calendar-prev-btn').text(months[prevDateMonth] + ' ' + prevDateYear);
    $('#cm-calendar-next-btn').text(months[nextDateMonth] + ' ' + nextDateYear);
    $('.cm-calendar-btn').css({'color': 'black'});
  }, 400);
}

// Эта функция добавляет в текстовое поле #cm-input-date, которое находится во всплывающем окне создания встречи, дату
function initializeCalendarInputs_cm() {
  $('#cm-calendar-window-body .cm-calendar-day').click(event => {

    let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    let day = $(event.target).attr('value');
    let monthYear = $('#cm-calendar thead tr:first-child td:first-child').text();
    let [ month, year ] = monthYear.split(' ');

    switch (month) {
      case 'Январь':
        month = 'января'
        break;
      case 'Февраль':
        month = 'февраля'
        break;
      case 'Март':
        month = 'марта'
        break;
      case 'Апрель':
        month = 'апреля'
        break;
      case 'Май':
        month = 'мая'
        break;
      case 'Июнь':
        month = 'июня'
        break;
      case 'Июль':
        month = 'июля'
        break;
      case 'Август':
        month = 'августа'
        break;
      case 'Сентябрь':
        month = 'сентября'
        break;
      case 'Октябрь':
        month = 'октября'
        break;
      case 'Ноябрь':
        month = 'ноября'
        break;
      case 'Декабрь':
        month = 'декабря'
        break;
    }

    let consolidation = day + ' ' + month + ', ' + year;

    $('#cm-input-date').val(consolidation);

    activeElement.action();

    activeElement.id = null;
    activeElement.action = null;

    event.stopPropagation();

  });
}

// Инициализация мобильного календаря
function initializeCalendar() {
  let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  let today = new Date();
  let data =
    {
      month: today.getMonth(),
      year: today.getFullYear()
    };

  let calendar = makeCalendar(data.month, data.year, null, false, 'm');
      calendar.id = 'calendar';

  let prevMonthMonth = (new Date(data.year, data.month - 1)).getMonth();
      prevMonthMonth = months[prevMonthMonth];
  let prevMonthYear = (new Date(data.year, data.month - 1)).getFullYear();

  let nextMonthMonth = (new Date(data.year, data.month + 1)).getMonth();
      nextMonthMonth = months[nextMonthMonth];
  let nextMonthYear = (new Date(data.year, data.month + 1)).getFullYear();

  $('#calendar-prev-btn').append(`${prevMonthMonth} ${prevMonthYear}`);
  $('#calendar-next-btn').append(`${nextMonthMonth} ${nextMonthYear}`);
  $('#calendar-window-body').append(calendar);

  setTimeout(() => {
    $('#calendar-window').css({'display': 'none'});
  }, 10);
}

// Инициализация календаря в окне создания встречи
function initializeCalendar_cm() {
  let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  let today = new Date();
  let data =
    {
      month: today.getMonth(),
      year: today.getFullYear()
    };

  let calendar = makeCalendar(data.month, data.year, null, false, 'cm');
      calendar.id = 'cm-calendar';

  let prevMonthMonth = (new Date(data.year, data.month - 1)).getMonth();
      prevMonthMonth = months[prevMonthMonth];
  let prevMonthYear = (new Date(data.year, data.month - 1)).getFullYear();

  let nextMonthMonth = (new Date(data.year, data.month + 1)).getMonth();
      nextMonthMonth = months[nextMonthMonth];
  let nextMonthYear = (new Date(data.year, data.month + 1)).getFullYear();

  $('#cm-calendar-prev-btn').append(`${prevMonthMonth} ${prevMonthYear}`);
  $('#cm-calendar-next-btn').append(`${nextMonthMonth} ${nextMonthYear}`);
  $('#cm-calendar-window-body').append(calendar);

  setTimeout(() => {
    $('#cm-calendar-window').css({'display': 'none'});
  }, 10);
}

// Функция создания сетки: создаются линии .line и помещаются в конец элемента #m-content,
// а также элементы шкалы (часы) .hour, которые помещаются в таймлайн (.timeline)
function makeGrid(theStep = 65) {
  let roomInfoWidth = $('.room .info').outerWidth();
  let step = theStep, initialMarginLeft = 52,
      left = 0;
  let hWrapperHeight = $('.h-wrapper').outerHeight();
  let content = document.getElementById('m-content');
  let timeline = document.getElementById('timeline');

  let rooms = document.querySelectorAll('.room');

  for (let i = 8; i <= 23; i++) { // от 8 до 23 часов
    let gridLine = document.createElement('div'),
        hour = document.createElement('div');

    gridLine.className = 'line';
    gridLine.id = 'line-' + i;
    hour.className = 'hour';
    hour.id = 'hour-' + i;

    content.appendChild(gridLine);
    timeline.appendChild(hour);

    if (i == 8) {
      hour.innerHTML = i + ':00';
    } else {
      hour.innerHTML = i;
      left += step;
    }

    $(gridLine).css({'left': left + 'px'});

    $(hour).css({
      'left': left - hour.offsetWidth/2
    });

    left += 1;
  }

  let contentHeight = $('.rooms').outerHeight() + $('.timeline').outerHeight();
  let contentClientHeight = document.getElementById('m-content').clientHeight;

  if (contentHeight <= contentClientHeight) {
    $('.line').css({
      'height': (contentClientHeight - 32) + 'px'
    });

    $('.current-time-strip-bigpart').css({
      'height': (contentClientHeight - 33) + 'px' // 33, а не 32, потому что нужно для перекрытия нижней границы m-content'а smallpart'ом
    });
  } else {
    $('.line').css({
      'height': (contentHeight - 32) + 'px'
    });

    $('.current-time-strip-bigpart').css({
      'height': (contentHeight - 32) + 'px'
    });
  }
}

function stylizeContent(theStep = 65) {
  let roomInfoWidth = $('.room .info').outerWidth(), initialMarginLeft = 52,
      marginRightAtTheEnd = 52, lineNum = 16,
      width = (16-1)*theStep + roomInfoWidth + initialMarginLeft + marginRightAtTheEnd + lineNum;

  $('.m-content').css({'width': width});
}

// Функция создания нового календаря в мобильной версии
function makeNewCalendar(data) {
  let height = $('#calendar-window-body').outerHeight();

  $('#calendar-window-body').css({'height': height + 'px'});

  $('#calendar').fadeOut(400, () => {
    $('#calendar').remove();

    let calendar = makeCalendar(data.month, data.year, null, true, 'm');
    $('#calendar-window-body').append(calendar);

    $('#calendar-window-body').css({'height': 'auto'});

    $('#calendar').fadeIn(400);
  });
}

// Функция смены месяца и года в кнопках мобильного календаря
function changeCalendarBtnsDate(data) {
  let height = $('#calendar-btns').innerHeight();
  let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  let prevDateMonth = new Date(data.year, data.month - 1).getMonth();
  let prevDateYear = new Date(data.year, data.month - 1).getFullYear();
  let nextDateMonth = new Date(data.year, data.month + 1).getMonth();
  let nextDateYear = new Date(data.year, data.month + 1).getFullYear();

  $('.calendar-btn').css({'color': 'transparent'});

  setTimeout(() => {
    $('#calendar-prev-btn').text(months[prevDateMonth] + ' ' + prevDateYear);
    $('#calendar-next-btn').text(months[nextDateMonth] + ' ' + nextDateYear);
    $('.calendar-btn').css({'color': 'black'});
  }, 400);
}

// Рендеринг линии текущего времени
function currentTimeStrip() {
  let currentTimeStripBlock = document.createElement('div');
  let header = document.createElement('div');
  let currentTimeStripSmallpart = document.createElement('div');
  let currentTimeStripBigpart = document.createElement('div');
  let timeline = $('.timeline');
  currentTimeStripSmallpart.id = 'current-time-strip-smallpart';
  currentTimeStripBigpart.id = 'current-time-strip-bigpart';

  header.className = 'current-time-strip-header';
  header.innerHTML = '8:00';
  header.id = 'current-time-strip-header';
  $('.timeline').append(header);

  currentTimeStripSmallpart.className = 'current-time-strip-smallpart';
  currentTimeStripBigpart.className = 'current-time-strip-bigpart';
  $('.timeline').append(currentTimeStripSmallpart);
  $('#m-content').append(currentTimeStripBigpart);
}

// Подстраиваем линии при изменении высоты контента или дисплея
function adjustLines() {
  let contentHeight = $('.rooms').outerHeight() + $('.timeline').outerHeight();
  let contentClientHeight = document.getElementById('m-content').clientHeight;

  if (document.documentElement.clientWidth >= 1024) {
    if (contentHeight <= contentClientHeight) {
      $('.line').css({
        'height': (contentClientHeight - 46) + 'px'
      });

      $('.current-time-strip-bigpart').css({
        'height': (contentClientHeight - 46) + 'px'
      });
    } else {
      $('.line').css({
        'height': (contentHeight - 46) + 'px'
      });

      $('.current-time-strip-bigpart').css({
        'height': (contentHeight - 46) + 'px'
      });
    }
  } else {
    if (contentHeight <= contentClientHeight) {
      $('.line').css({
        'height': (contentClientHeight - 32) + 'px'
      });

      $('.current-time-strip-bigpart').css({
        'height': (contentClientHeight - 32) + 'px'
      });
    } else {
      $('.line').css({
        'height': (contentHeight - 32) + 'px'
      });

      $('.current-time-strip-bigpart').css({
        'height': (contentHeight - 32) + 'px'
      });
    }
  }

}

// Создание свободной зоны
function makeEmptyArea(roomId, start, end) {
  let theStep = 65;
  let roomInfoWidth = $('.room .info').outerWidth(), lineNum = 16;

  let emptyArea = document.createElement('div');
  emptyArea.classList.add('empty-area');
  $(emptyArea).css({
    'width': end - start,
    'left': start
  });
  $('#' + roomId + ' .room-timeline').append(emptyArea);
}

// Создание зоны с имеющимся событием
function makeFilledArea(roomId, filledAreaId, start, end) {
  let theStep = 65;
  let roomInfoWidth = $('.room .info').outerWidth(), lineNum = 16;

  let filledArea = document.createElement('div');
  filledArea.classList.add('filled-area');
  filledArea.id = 'filled-area-' + filledAreaId;

  $(filledArea).css({
    'width': end - start,
    'left': start
  });
  $('#' + roomId + ' .room-timeline').append(filledArea);
}

// Создание всплывающего окна с инфо. о встрече, которое появляется при клике на .filled-area
function makeTooltip(filledAreaId, id, data) {
  let filledArea = $('#filled-area-' + filledAreaId);
  let widthParent = $(filledArea).outerWidth();

  let tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.id = 'tooltip-' + id;

  let triangle = document.createElement('div');
      triangle.classList.add('tooltip-triangle');
      triangle.id = 'tooltip-triangle-' + id;
      triangleWidth = $(tooltip).outerWidth();

  // Контент тултипа
  let tooltipContent = `
    <div class="tooltip-content">
      <div class="tooltip-header">${data.header}</div>

      <div class="tooltip-body">${data.body}</div>

      <div class="tooltip-participants">
        <span class="avatar"></span><p>${data.author} <span class="tooltip-others">${data.others}</span></p>
      </div>
    </div>

    <input type="button" class="edit">`;

  $(tooltip).append(tooltipContent);
  $(filledArea).append(tooltip);
  $(filledArea).append(triangle);

  $(triangle).css({'left': (widthParent/2 - 9) + 'px'});

  if (document.documentElement.clientWidth > 360) {
    $(tooltip).css({'width': 360 + 'px'});
  } else {
    $(tooltip).css({'width': document.documentElement.clientWidth + 'px'});
  }

  let tooltipWidth = $(tooltip).outerWidth();

  if (widthParent < tooltipWidth) {
    $(tooltip).css({'left':  -((tooltipWidth - widthParent)/2) + 'px'});
  } else {
    $(tooltip).css({'left': (widthParent/2 - tooltipWidth/2) + 'px'});
  }

  $(tooltip).css({'display': 'none'});
  $(triangle).css({'display': 'none'});

}

// Функция, необходимая при показе/скрытии тултипов. Эта функция переносит тултип в
// "начальное" состояние, когда он центрируется относительно своего родительского элемента .filled-area
function makeTooltipAsBefore(filledAreaId) {
  let tooltip = $('#' + filledAreaId + ' .tooltip');
  let triangle = $('#' + filledAreaId + ' .tooltip-triangle');
  let widthParent = $('#' + filledAreaId).outerWidth();

  $(triangle).css({
    'left': (widthParent/2 - 9) + 'px',
    'top': 'auto',
    'bottom': '0px',
    'transform': 'initial'
  });

  $(tooltip).css({
    'top': '100%'
  });

  if (document.documentElement.clientWidth > 360) {
    $(tooltip).css({'width': 360 + 'px'});
  } else {
    $(tooltip).css({'width': document.documentElement.clientWidth + 'px'});
  }

  let tooltipWidth = $(tooltip).outerWidth();

  if (widthParent < tooltipWidth) {
    $(tooltip).css({'left':  -((tooltipWidth - widthParent)/2) + 'px'});
  } else {
    $(tooltip).css({'left': ((widthParent - tooltipWidth)/2) + 'px'});
  }
}

// Укорачивание названий комнат
function trimRoomNames(roomNames, a) {
  let arr = $('.room .info .name');
  let newRoomNames = roomNames.slice();

  for (let i = 0; i < arr.length; i++) {
    if (newRoomNames[i].length > a) {
      //roomNames[i].innerHTML.slice = ''.slice;
      newRoomNames[i] = newRoomNames[i].slice(0, a + 1);
      newRoomNames[i] += '...'

      arr[i].innerHTML = newRoomNames[i];
    } else {
      arr[i].innerHTML = newRoomNames[i];
    }
  }
}

// Всплывающие подсказки с названием комнаты на временной полосе в мобильной (но есть также и в десктопной) версии
function createRoomsNamesNotifiers() {
  let arr = $('.room');

  for (let i = 0; i < arr.length; i++) {
    let roomNameNotifierWrapper =  document.createElement('div'),
        roomNameNotifier = document.createElement('span');
        roomNameNotifierWrapper.classList.add('room-name-notifier-wrapper')
        roomNameNotifier.classList.add('room-name-notifier');
        roomId = i + 1;

    $(roomNameNotifier).css('display', 'none');

    if ($('#room-' + roomId).hasClass('room-blocked') ) {
      roomNameNotifier.classList.add('room-name-notifier-blocked');
    }

    let roomName = $('#room-' + roomId + ' .info .name').text();

    roomNameNotifier.innerHTML = roomName;
    $(roomNameNotifierWrapper).append(roomNameNotifier);
    $('#room-' + roomId).append(roomNameNotifierWrapper);
  }
}

// Меняем ширину элемента контента на моб. версии
function mResizeContent() {
  let roomInfoWidth = $('.room .info').outerWidth(), initialMarginLeft = 52,
      marginRightAtTheEnd = 52, lineNum = 16, theStep = 65,
      width = (16-1)*theStep + roomInfoWidth + initialMarginLeft + marginRightAtTheEnd + lineNum;

  $('.m-content').css({'width': width});
}

// Меняем ширину элемента контента на десктопной версии
function dResizeContent() {
  let roomInfoWidth = $('.room .info').outerWidth(), initialMarginLeft = 31,
      marginRightAtTheEnd = 13, lineNum = 16, theStep = 65,
      mContentWidth = (16-1)*theStep + roomInfoWidth + initialMarginLeft + marginRightAtTheEnd + lineNum;

  $('.m-content').css({'width': mContentWidth});
}

function GenerateAddEventBtns() {
  let mContent = document.getElementById('m-content')
  let arr = document.querySelectorAll('.empty-area');
  arr.slice = [].slice;
  let emptyAreas = arr.slice();

  for (let i = 0; i < emptyAreas.length; i++) {
    $(emptyAreas[i]).append(`<input class="add-event-btn" id="add-event-btn-${i + 1}" value="+" type="button">`)
  }
}

// Функция создания трех календарей зараз в десктопной версии
function makeThreeNewCalendars(data, canInvoke) {
  let width, height = document.getElementById('d-calendar-window-body').offsetHeight;
  $('#d-calendar-window-body').css({'height': height + 'px'});

  $('#d-calendar-1').fadeOut(400, () => { $('#d-calendar-1').remove(); });
  $('#d-calendar-2').fadeOut(400, () => { $('#d-calendar-2').remove(); });
  $('#d-calendar-3').fadeOut(400, () => {
    $('#d-calendar-3').remove();

    for (let i = 0; i < 3; i++) {
      let calendar = makeCalendar(data[i].month, data[i].year, i, true, 'd');
      document.getElementById('d-calendar-window-body').appendChild(calendar);
    }
    $('#d-calendar-window-body').css({'height': 'auto'});

    $('#d-calendar-1').fadeIn(400);
    $('#d-calendar-2').fadeIn(400);
    $('#d-calendar-3').fadeIn(400, () => {
      canInvoke.dCalendarBtn = true;
    });
  });
}

// desktopSidebar - белый блок снизу от названия комнат в декстопной версии
function adjustDesktopSidebar() {
  let roomsTimelineHeight = (parseInt($('.rooms').outerHeight(), 10) + parseInt($('.timeline').outerHeight(), 10)) + 'px';
  $('#sidebar-end').css({
    'top': roomsTimelineHeight,
    'height': `calc(100% - ${roomsTimelineHeight}`
  });
}
