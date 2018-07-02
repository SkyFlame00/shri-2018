document.addEventListener('DOMContentLoaded', () => {

  // Текущий активный элемент (календарь, тултип)
  let activeElement = {
    id: null,
    action: null
  }

  // Объект хранит информацию о том, можно ли вызывать конкретный элемент.
  // Сделано с целью, чтобы не образовывались баги слишком частыми вызовами.
  let canInvoke = {
    calendarWindow: true, // Окно "мобильного" календаря
    calendarBtn: true, // Переход на предыдущий / следующий месяц
    dCalendarWindow: true,
    dCalendarBtn: true,
    filledArea: true,
    roomsNamesNotifiers: true,
    cmCalendarWindow: true,
    cmCalendarBtn: true
  };

  $('body').click(event => {

    if (activeElement.id) {
      activeElement.action();

      activeElement.id = null;
      activeElement.action = null;
    }

  });

  // Календарь (общее: мобильная и десктопная версии)

  let today = new Date();

  // Календарь (мобильная версия)
  let data = {month: today.getMonth(), year: today.getFullYear()};

  // Появление главного окна календаря (мобильная версия)
  $('#bar-date-text').click(event => {

    // Здесь идет обработка возможности вызова окна календаря. Во всех других похожих элементах
    // идет подобная обработка
    if (!canInvoke.calendarWindow) return; // Если нельзя вызвать, ничего не делаем (выходим из функции). Если можно, идем дальше

    canInvoke.calendarWindow = false; // Теперь пока что нельзя повторно вызвать код данного обработчика

    if (activeElement.id) { // Смотрим на активный элемент, если таковой имеется
      if (activeElement.id !== $(event.target).attr('id')) { // Если не кликнули по кнопке #bar-date-text
        activeElement.action(); // Вызываем действие, которое сопровождает деактивацию элемента (например, скрытие с анимацией)

        activeElement.id = null; // Теперь нет активного элемента, идем дальше по обработчику
        activeElement.action = null;
      } else { // Если кликнули, то сворачиваем окно
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;

        setTimeout(() => { // Возвращаем возможность вызова через 410 мс
          canInvoke.calendarWindow = true;
        }, 410);

        return;
      }
    }

    $('#calendar-window').fadeToggle(400, () => {
      canInvoke.calendarWindow = true;
    });

    activeElement.id = $(event.target).attr('id'); // Теперь окно календаря активно, делаем запись
    activeElement.action = () => {
      $('#calendar-window').fadeToggle(400);
    };

    // Останавливаем передачу события click выше по DOM-дереву, чтобы событие
    // для body не сработало в данном случае
    event.stopPropagation();
  });

  $('#calendar-window').click(event => {
    // Останаливаем переход к body
    event.stopPropagation();
  });

  // Календарь (мобильная версия): кнопка "На месяц назад"
  $('#calendar-prev-btn').click(event => {

    if (canInvoke.calendarBtn) { // Если можно вызввать, вызываем действие

      canInvoke.calendarBtn = false;
      let currentMonth = data.month;
      let currentYear = data.year;

      data = { // берем пред. месяц
        month: (new Date(currentYear, currentMonth - 1)).getMonth(),
        year: (new Date(currentYear, currentMonth - 1)).getFullYear()
      };

      makeNewCalendar(data);
      changeCalendarBtnsDate(data);

      setTimeout(() => { // Через 810 мс возможен повторный вызов. 400 на скрытие старого текста с месяцем и годом, 400 на появление нового текста и 10 - на всякий случай
        canInvoke.calendarBtn = true;
      }, 810);

    }
  });

  // Календарь (мобильная версия): кнопка "На месяц вперед"
  $('#calendar-next-btn').click(event => {

    if (canInvoke.calendarBtn) { // То же самое

      canInvoke.calendarBtn = false;
      let currentMonth = data.month;
      let currentYear = data.year;

      data = {
        month: (new Date(currentYear, currentMonth + 1)).getMonth(),
        year: (new Date(currentYear, currentMonth + 1)).getFullYear()
      };

      makeNewCalendar(data);
      changeCalendarBtnsDate(data);

      setTimeout(() => {
        canInvoke.calendarBtn = true;
      }, 810);

    }
  });

  // Календарь (десктопная версия)

  let data_3months = [
    {
      month: today.getMonth(),
      year: today.getFullYear()
    },
    {
      month: (new Date(today.getFullYear(), today.getMonth() + 1)).getMonth(),
      year: (new Date(today.getFullYear(), today.getMonth() + 1)).getFullYear()
    },
    {
      month: (new Date(today.getFullYear(), today.getMonth() + 2)).getMonth(),
      year: (new Date(today.getFullYear(), today.getMonth() + 2)).getFullYear()
    }
  ];

  // Инициализируем календарь
  for (let i = 0; i < 3; i++) {
    let calendar = makeCalendar(data_3months[i].month, data_3months[i].year, i, false, 'd');
    document.getElementById('d-calendar-window-body').appendChild(calendar);
  }

  // Появление главного окна календаря (десктопная версия)
  $('#d-bar-date-text').click(event => {

    if (!canInvoke.dCalendarWindow) return; // Далее блок аналогичный тому, что был выше в моб. версии

    canInvoke.dCalendarWindow = false;

    if (activeElement.id) {
      if (activeElement.id !== $(event.target).attr('id')) {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;
      } else {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;

        setTimeout(() => {
          canInvoke.dCalendarWindow = true;
        }, 410);

        return;
      }
    }

    $('#d-calendar-window').fadeToggle(400, () => {
      canInvoke.dCalendarWindow = true;
    });

    // При абсолютном позиционировании не получается вычислять длину автоматически,
    // календари переводятся на новую строку (поскольку три сразу вместе на одной "строке"
    // превышают ширину родительского элемента). Вычисляем "вручную"
    let width = $('#d-calendar-1').outerWidth();

    $('#d-calendar-window-body').css({'width': width*3 + 40 + 1 + 'px'});

    activeElement.id = $(event.target).attr('id');
    activeElement.action = () => {
      $('#d-calendar-window').fadeToggle(400);

      let width = $('#calendar-1').outerWidth();

      $('#d-calendar-window-body').css({'width': width*3 + 40 + 1 + 'px'});
    };

    // Останавливаем передачу события click выше по DOM-дереву
    event.stopPropagation();

  });

  // Останавливаем передачу события click выше по DOM-дереву
  $('#d-calendar-window').click(event => {
    event.stopPropagation();
  });

  // Календарь (десктопная версия): кнопка "На три месяца назад"
  $('#d-calendar-prev-btn').click(event => {

    if (canInvoke.dCalendarBtn) { // Аналогичный код, только теперь генерируется 3 календаря
      canInvoke.dCalendarBtn = false;
      currentMonth = data_3months[0].month;
      currentYear = data_3months[0].year;

      data_3months = [
        {
          month: (new Date(currentYear, currentMonth - 3)).getMonth(),
          year: (new Date(currentYear, currentMonth - 3)).getFullYear()
        },
        {
          month: (new Date(currentYear, currentMonth - 2)).getMonth(),
          year: (new Date(currentYear, currentMonth - 2)).getFullYear()
        },
        {
          month: (new Date(currentYear, currentMonth - 1)).getMonth(),
          year: (new Date(currentYear, currentMonth - 1)).getFullYear()
        }
      ];

      makeThreeNewCalendars(data_3months, canInvoke);
    }
  });

  // Календарь (десктопная версия): кнопка "На три месяца вперед"
  $('#d-calendar-next-btn').click(event => { // Аналогично

    if (canInvoke.dCalendarBtn) {
      canInvoke.dCalendarBtn = false;
      currentMonth = data_3months[0].month;
      currentYear = data_3months[0].year;

      data_3months = [
        {
          month: (new Date(currentYear, currentMonth + 3)).getMonth(),
          year: (new Date(currentYear, currentMonth + 3)).getFullYear()
        },
        {
          month: (new Date(currentYear, currentMonth + 4)).getMonth(),
          year: (new Date(currentYear, currentMonth + 4)).getFullYear()
        },
        {
          month: (new Date(currentYear, currentMonth + 5)).getMonth(),
          year: (new Date(currentYear, currentMonth + 5)).getFullYear()
        }
      ];

      makeThreeNewCalendars(data_3months, canInvoke);
    }
  });

  // Календарь при создании/редактировании встречи
  let data_cm = {month: today.getMonth(), year: today.getFullYear()};

  // Появление главного окна календаря (create meeting)
  $('#input-calendar-picker').click(event => {

    if (!canInvoke.cmCalendarWindow) return;

    canInvoke.cmCalendarWindow = false;

    if (activeElement.id) {
      if (activeElement.id !== $(event.target).attr('id')) {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;
      } else {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;

        setTimeout(() => {
          canInvoke.cmCalendarWindow = true;
        }, 410);

        return;
      }
    }

    $('#cm-calendar-window').fadeToggle(400, () => {
      canInvoke.cmCalendarWindow = true;
    });

    activeElement.id = $(event.target).attr('id');
    activeElement.action = () => {
      $('#cm-calendar-window').fadeToggle(400);
    };

    // Останавливаем передачу события click выше по DOM-дереву
    event.stopPropagation();
  });

  $('#cm-calendar-window').click(event => {
    // Останавливаем передачу события click выше по DOM-дереву
    event.stopPropagation();
  });

  // Календарь (create meeting): кнопка "На месяц назад"
  $('#cm-calendar-prev-btn').click(event => {

    if (canInvoke.cmCalendarBtn) {

      canInvoke.cmCalendarBtn = false;
      let currentMonth = data_cm.month;
      let currentYear = data_cm.year;

      data_cm = {
        month: (new Date(currentYear, currentMonth - 1)).getMonth(),
        year: (new Date(currentYear, currentMonth - 1)).getFullYear()
      };

      makeNewCalendar_cm(data_cm);
      changeCalendarBtnsDate_cm(data_cm);

      setTimeout(() => {
        canInvoke.cmCalendarBtn = true;
      }, 810);

      initializeCalendarInputs_cm();
    }
  });

  // Календарь (create meeting): кнопка "На месяц вперед"
  $('#cm-calendar-next-btn').click(event => {

    if (canInvoke.cmCalendarBtn) {

      canInvoke.cmCalendarBtn = false;
      let currentMonth = data_cm.month;
      let currentYear = data_cm.year;

      data_cm = {
        month: (new Date(currentYear, currentMonth + 1)).getMonth(),
        year: (new Date(currentYear, currentMonth + 1)).getFullYear()
      };

      makeNewCalendar_cm(data_cm);
      changeCalendarBtnsDate_cm(data_cm);

      setTimeout(() => {
        canInvoke.cmCalendarBtn = true;
      }, 810);

      initializeCalendarInputs_cm();
    }
  });

  // Обработка занятых и свободных областей
  $('.filled-area').click(event => {

    // Если произошел клик по декоративному треугольнику, то ничего не делаем,
    // т.к. он является частью тултипа, а не filled-area
    if ($(event.target).hasClass('tooltip-triangle')) {
      event.stopPropagation();
      return;
    }

    if (!canInvoke.filledArea) { // Ограничиваем вызов заполненной области по аналогии с календарем
      // Останавливаем передачу события click выше по DOM-дереву
      event.stopPropagation();
      return;
    } else {
      canInvoke.filledArea = false;
      setTimeout(() => { // После разворачивания тултипа даем возможности свернуть его через 500мс
        canInvoke.filledArea = true;
      }, 500);
    }

    let id = $(event.target).attr('id');

    if (activeElement.id !== null && activeElement.action !== null) {
      if (id === activeElement.id) {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;

        return;
      } else {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;
      }
    }

    $(event.target).toggleClass('filled-area-clicked');
    $(event.target).children('.tooltip').fadeToggle(400);
    $(event.target).children('.tooltip-triangle').fadeToggle(400);

    // Объявляем переменные, необходимые для дальнейшей работы
    let width = document.getElementById('m-wrapper').clientWidth,
        height = document.getElementById('m-wrapper').clientHeight,
        diffBetweenWrapperAndDocumentWidth = (document.documentElement.clientWidth - $('#m-wrapper').outerWidth())/2;
    let mTopHeight = $('#m-top').outerHeight();
    let filledAreaHeight = $(event.target).outerHeight(),
        filledAreaOffsetTop = ($(event.target).offset().top - window.pageYOffset);
    let tooltipId = $(event.target).children('.tooltip').attr('id'),
        tooltip = document.getElementById(tooltipId),
        tooltipHeight = $(tooltip).outerHeight(),
        tooltipOffsetLeft = ($(tooltip).offset().left - window.pageXOffset), // Работает для разрешений, меньших 1280 пикс.
        tooltipOffsetLeft_for1280 = $(tooltip).offset().left - diffBetweenWrapperAndDocumentWidth; // Работает для разрешений, равных и больших 1280 пикс.
    let triangleId = $(event.target).children('.tooltip-triangle').attr('id');
        triangle = document.getElementById(triangleId),
        triangleWidth = parseInt(triangle.offsetWidth, 10),
        triangleHeight = parseInt(triangle.offsetHeight, 10),
        triangleOffsetLeft = ($(triangle).offset().left - window.pageXOffset), // Аналогично с треугольником
        triangleOffsetLeft_for1280 = $(triangle).offset().left - diffBetweenWrapperAndDocumentWidth;

    // "Переворачиваем" тултип, если снизу нет места
    if (filledAreaOffsetTop - mTopHeight >
        height + mTopHeight - filledAreaOffsetTop - filledAreaHeight) {

      $(triangle).css({
        'bottom': 'auto',
        'top': '0px',
        'transform': 'rotate(180deg)'
      });

      $(tooltip).css({
        'top': -tooltipHeight + 'px'
      });

    }

    // Есть два случая, когда нужно перемещать тултипы при дисплее устройства больше 1280 пикс. и, соответственно, меньше
    // Это сделано в силу того, что в одном случае контент растянут на весь экран (меньше 1280) и тогда методы отслеживания позиции
    // тултипа будут одни, а при другом случае контент будет растянут только на 1280 пикс.
    if (document.documentElement.clientWidth >= 1280) {
      // Если тултип за пределами экрана СЛЕВА, перемещаем его так, чтобы он оказался весь на экране
      if (tooltipOffsetLeft_for1280 < 0) {
        let left = parseInt(tooltip.style.left, 10);
        let dest = -tooltipOffsetLeft_for1280;

        $(tooltip).css({'left': left + dest});
      }

      if (triangleOffsetLeft_for1280 < triangleWidth + 12) { // 9 - "толщина треугольника", 12 - желаемый минимальный отступ от края экрана (для красоты)
        let left = parseInt(triangle.style.left, 10);
        let dest = -triangleOffsetLeft_for1280;

        $(triangle).css({'left': left + dest + 12});
      }

      // Если тултип за пределами экрана СПРАВА (то же самое)
      if (tooltipOffsetLeft_for1280 + $(tooltip).outerWidth() >= width) {
        //console.log(tooltipOffsetLeft, $(tooltip).offset().left);
        let tooltipWidth = parseInt(tooltip.offsetWidth, 10);
        let left = parseInt(tooltip.style.left, 10);
        let rest = width - tooltipOffsetLeft_for1280;

        $(tooltip).css({'left': left - (tooltipWidth - rest)});
      }

      if (triangleOffsetLeft_for1280 + parseInt($(triangle).outerWidth()) >= width - 12) {
        let left = parseInt(triangle.style.left, 10);
        let difference = triangleOffsetLeft_for1280 - width;

        $(triangle).css({'left': left - difference - triangleWidth - 12});
      }
    } else {
      // Если тултип за пределами экрана СЛЕВА
      if (tooltipOffsetLeft < 0) {
        let left = parseInt(tooltip.style.left, 10);
        let dest = -tooltipOffsetLeft;

        $(tooltip).css({'left': left + dest});
      }

      if (triangleOffsetLeft < triangleWidth + 12) { // 9 - "толщина треугольника", 12 - желаемый минимальный отступ от края экрана (для красоты)
        let left = parseInt(triangle.style.left, 10);
        let dest = -triangleOffsetLeft;

        $(triangle).css({'left': left + dest + 12});
      }

      // Если тултип за пределами экрана СПРАВА
      if (tooltipOffsetLeft + $(tooltip).outerWidth() >= width) {
        //console.log(tooltipOffsetLeft, $(tooltip).offset().left);
        let tooltipWidth = parseInt(tooltip.offsetWidth, 10);
        let left = parseInt(tooltip.style.left, 10);
        let rest = width - tooltipOffsetLeft;

        $(tooltip).css({'left': left - (tooltipWidth - rest)});
      }

      if (triangleOffsetLeft + parseInt($(triangle).outerWidth()) >= width - 12) {
        let left = parseInt(triangle.style.left, 10);
        let difference = triangleOffsetLeft - width;

        $(triangle).css({'left': left - difference - triangleWidth - 12});
      }
    }

    // Необходимые процедуры после отображения тултипа на экране
    activeElement.id = id;
    activeElement.action = () => {
      let me = activeElement;
      $('#' + me.id).toggleClass('filled-area-clicked');
      $('#' + me.id).children('.tooltip').fadeToggle(400);
      $('#' + me.id).children('.tooltip-triangle').fadeToggle(400, makeTooltipAsBefore.bind(me, me.id));
    };

    // Останавливаем передачу события click выше по DOM-дереву
    event.stopPropagation();

  });

  $('.tooltip').click(event => {
    // Останавливаем передачу события click выше по DOM-дереву
    event.stopPropagation();
  });

  // Появление вспомогательных сообщений о названиях комнат при прокрутке
  // блока контента на 182 пикселя
  $('#m-wrapper').scroll(event => {

    if (document.documentElement.clientWidth < 1280 && document.documentElement.clientWidth >= 1024) {
      if (-$('#m-content').offset().left >= 245 && canInvoke.roomsNamesNotifiers) {
        canInvoke.roomsNamesNotifiers = false;
        $('.room-name-notifier').fadeToggle(200);
      }

      if (-$('#m-content').offset().left < 245 && !canInvoke.roomsNamesNotifiers) {
        canInvoke.roomsNamesNotifiers = true;
        $('.room-name-notifier').fadeToggle(200);
      }

    } else {
      if (-$('#m-content').offset().left >= 181 && canInvoke.roomsNamesNotifiers) {
        canInvoke.roomsNamesNotifiers = false;
        $('.room-name-notifier').fadeToggle(200);
      }

      if (-$('#m-content').offset().left < 181 && !canInvoke.roomsNamesNotifiers) {
        canInvoke.roomsNamesNotifiers = true;
        $('.room-name-notifier').fadeToggle(200);
      }
    }

  });

  // Подсвечиваем название комнаты при наведении на свободную область
  $('.empty-area').hover(

    event => {

      if ($(event.target).attr('class') === 'add-event-btn') {
        let id = $(event.target).parent().parent().parent().attr('id');
        let num = parseInt(id.replace(/\D+/g,""));
        $('#room-' + num + ' .info .name').addClass('room-name-active');
      } else {
        let id = $(event.target).parent().parent().attr('id');
        let num = parseInt(id.replace(/\D+/g,""));
        $('#room-' + num + ' .info .name').addClass('room-name-active');
      }
    },
    event => {
      if ($(event.target).attr('class') === 'add-event-btn') {
        let id = $(event.target).parent().parent().parent().attr('id');
        let num = parseInt(id.replace(/\D+/g,""));
        $('#room-' + num + ' .info .name').removeClass('room-name-active');
      } else {
        let id = $(event.target).parent().parent().attr('id');
        let num = parseInt(id.replace(/\D+/g,""));
        $('#room-' + num + ' .info .name').removeClass('room-name-active');
      }
    }

  );

  // При клике на кнопку добавления встречи на свободном слоте "углубляем" подсветку
  $('.add-event-btn').click(event => {

    if (activeElement.id) {
      if (activeElement.id === $(event.target).parent().parent().parent().attr('id')) {
        event.stopPropagation();
        return;
      } else {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;
      }
    }

    let id = $(event.target).parent().parent().parent().attr('id');
    let num = parseInt(id.replace(/\D+/g,""));
    $('#room-' + num + ' .info .name').toggleClass('room-name-clicked');

    activeElement.id = id;
    activeElement.action = () => {
      $('#' + activeElement.id + ' .info .name').removeClass('room-name-clicked');
    };

    event.stopPropagation();
  });

  // В окне создания встречи добавляем в текстовое поле выбранную дату
  $('#cm-calendar-window').on('click', '.cm-calendar-day', event => {

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

  // Далее идет обработка выпадающего спика участников
  $('#input-participants-list').click(event => {
    event.stopPropagation();
  });

  // Скрипт, реализующий выпадающее меню (с возможностью поиска участников по набранным символам), имеет особенность,
  // которая связана с тем, что при малейших изменениях этот скрипт заново рендерит список всех участников, так что
  // обратиться по id к ним не получится, эти элементы каждый раз новые и на них не навесить обработчики
  $('#input-participants-list').mousedown(event => {

    if (activeElement.id) {
      if (activeElement.id === $(event.target).attr('id')) {
        event.stopPropagation();
        return;
      } else {
        activeElement.action();

        activeElement.id = null;
        activeElement.action = null;
      }
    }

    // Если выпадающий список невидим, делаем его видимым и сопровождаем соответствующими сменами классов
    if ($('.participants-list-wrapper').hasClass('participants-list-wrapper-displayedNone')) {
      $('.participants-list-wrapper').removeClass('participants-list-wrapper-displayedNone')
    }

    $('.participants-list-wrapper').addClass('participants-list-wrapper-displayed');
    $('#participants-input-action-wrapper').fadeIn(200);
    $('#participants-input-eraser').fadeOut(200, () => {
      $('#participants-input-hidelist').fadeIn(200);
      $('#participants-input-hidelist').css({'transform': 'rotate(90deg)'});
      $('#participants-input-hidelist').addClass('participants-listshown');
    });

    $('#input-participants-list').addClass('input-participants-list-active');

    let arr = $('.participant-li'), counter = 0;

    for (let i = 0; i < arr.length; i++) {
      if ($(arr[i]).css('display') === 'none') {
        counter++;
      }
    }

    // Если выбраны все участники, то показываем специальный блок с текстом "Список пуст"
    if (counter === 10) {
      $('#participants-list-empty').css({'display': 'block'});
    }
    else {
      $('#participants-list-empty').css({'display': 'none'});
    }

    // Привязываем действия, которые необходимо выполнить (исчезновение списка) при деактивации
    activeElement.id = $(event.target).attr('id');
    activeElement.action = () => {
      $('.participants-list-wrapper').fadeOut(200, () => {
        $('.participants-list-wrapper').removeClass('participants-list-wrapper-displayed');
        $('.participants-list-wrapper').addClass('participants-list-wrapper-displayedNone');
      });

      $('#input-participants-list').removeClass('input-participants-list-active');

      if ($('#participants-input-hidelist').hasClass('participants-listshown')) {
        $('#participants-input-hidelist').css({'transform': 'rotate(-90deg)'});
        $(event.target).removeClass('participants-listshown');
      }

      if (document.getElementById('input-participants-list').value !== '') {
        $('#participants-input-hidelist').fadeOut(200, () => {
          $('#participants-input-eraser').fadeIn(200);
        });
      } else {
        $('#participants-input-action-wrapper').fadeOut(200);

      }
      event.stopPropagation();
    };

    event.stopPropagation();
  });

  // Клик по стрелке внутри текстового поля для сворачивания/разворачивания списка
  $('#participants-input-hidelist').click(event => {

    if ($(event.target).hasClass('participants-listshown')) {
      $(event.target).css({'transform': 'rotate(-90deg)'});
      $('.participants-list-wrapper').removeClass('participants-list-wrapper-displayed');
      $('.participants-list-wrapper').addClass('participants-list-wrapper-displayedNone');

      $(event.target).removeClass('participants-listshown');
    } else {
      $(event.target).css({'transform': 'rotate(90deg)'});
      $('.participants-list-wrapper').removeClass('participants-list-wrapper-displayedNone');
      $('.participants-list-wrapper').addClass('participants-list-wrapper-displayed');
      $('.participants-list-wrapper').fadeIn(200);
      $(event.target).addClass('participants-listshown');
    }

    event.stopPropagation();
  });

  $('#participants-input-eraser').mousedown(event => { event.stopPropagation(); });

  // Кликаем на крестик - очищаем текстовое поле
  $('#participants-input-eraser').click(event => {
    document.getElementById('input-participants-list').value = '';
    $(event.target).css({'display': 'none'});

    event.stopPropagation();
  });

  $('#participants-input-action-wrapper').click(event => {event.stopPropagation();});
  $('#participants-input-action-wrapper').mousedown(event => {$('#input-participants-list').mousedown();});

  let selectedParticipants = [];

  let myChoices = {
    me: [
      ['Лекс Лютер', '7 этаж', 1],
      ['Томас Андерсон', '2 этаж', 2],
      ['Дарт Вейдер', '1 этаж', 3],
      ['Кларк Кент', '2 этаж', 4],
      ['Люк Скайуокер', '4 этаж', 5],
      ['Принцесса Лея', '6 этаж', 6],
      ['Хан Соло', '3 этаж', 7],
      ['Падме', '1 этаж', 8],
      ['Владимир Путин', '7 этаж', 9],
      ['Дональд Трамп', '4 этаж', 10],
      ['Борис Ельцин', '2 этаж', 11],
      ['Барак Обама', '4 этаж', 12]
    ]
  };

  // Скрипт помещает список на самый верх, я его перемещаю к самому текстовому полю,
  // потому что иначе он будет криво отображаться (перекрывать все остальные элементы и быть фиксированным при прокрутке)
  setTimeout(() => {
    $('#input-participants-list').after($('.participants-list-wrapper'));
  }, 100);

  $('#input-participants-list').focusin(event => {
    // Скрипт auto-complete динамически обновляет содержимое элемента с классом 'participants-list-wrapper', поэтому
    // нам также необходимо отслеживать эти изменения при появлении выпадающего списка: выбранные элементы (участники) удаляются из него
    // Решение с таймером плохое, но другого выхода я не нашел, скрипт меняет структуру DOM и обработчики тут уже не навесить
    // (либо я не догадался, как это делать)

    setTimeout(() => {
      for (let i = 0; i < selectedParticipants.length; i++) {
        $('.participants-list-wrapper').children('#' + selectedParticipants[i]).remove();
      }

      if (selectedParticipants.length >= 10) {
        $('.participants-list-wrapper').append('<div class="participants-list-empty">Список пуст</div>');
      }
    }, 20);
  });

  // То же самое, что и при фокусе, но только при изменении содержимого текстового поля
  $('#input-participants-list').on('input', event => {
    //console.log('here')
    setTimeout(() => {
      for (let i = 0; i < selectedParticipants.length; i++) {
      //  console.log('yeee')
        $('.participants-list-wrapper').children('#' + selectedParticipants[i]).remove();
      }

      if (selectedParticipants.length >= 10) {
        $('.participants-list-wrapper').empty();
        $('.participants-list-wrapper').append('<div class="participants-list-empty">Список пуст</div>');
      }
    }, 300);
  });

  // Создаем экземпляр этого скрипта с выпадающим списком. Сделано по документации
  let autocomplete = new autoComplete({
    menuClass: 'participants-list-wrapper',
    selector: '#input-participants-list',
    minChars: 0,
    source: function(term, suggest){
        term = term.toLowerCase();
        var choices = myChoices.me;
        var suggestions = [];
        for (i=0;i<choices.length;i++)
            if (~(choices[i][0]+' '+choices[i][1]).toLowerCase().indexOf(term)) suggestions.push(choices[i]);
        suggest(suggestions);
    },
    renderItem: function (item, search){
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
        let html = `
        <div class="participant-li autocomplete-suggestion" id="participant-${item[2]}">
          <div class="participant-avatar"></div>
          <div class="participant-text">
            <span class="participant-name">${item[0].replace(re, '<span class="participant-found">$1</span>')}</span>
            <span class="participant-item-separator">·</span>
            <span class="participant-place">${item[1]}</span>
          </div>
        </div>`;
        return html;
    },
    onSelect: function(event, term, item) {
      let id = $(item).attr('id');
      let name = $('#' + id + ' .participant-name').text();
      let html = `
      <div class="participant-selected clearfix" id="${id}-selected">
        <div class="participant-selected-avatar"></div>
        <div class="participant-selected-text">${name}</div>
        <input type="button" class="participant-selected-delete" />
      </div>`;

      selectedParticipants.push(id);

      $('#participants-selected').append(html);
      //$('#').blur();
      setTimeout(()=>{document.getElementById('input-participants-list').blur();}, 100);

      activeElement.action();

      activeElement.id = null;
      activeElement.action = null;

      event.stopPropagation();
    }
  });

  // При клике на крестик у блока с выбранным участником удаляется этот блок,
  // его ID удаляется из массива (выше) selectedParticipants и он "появляется" теперь в списке
  $('#participants-selected').on('click', '.participant-selected-delete', event => {
    let parentId = $(event.target).parent().attr('id');
    let id = parentId.split('-')[0] + '-' + parentId.split('-')[1];

    selectedParticipants.splice(selectedParticipants.indexOf(id), 1)
    $(event.target).parent().remove();
  });

  // Рекомендованные переговорки
  $('.recommended-meetingrooms').on('click', '.recommended-meetingroom', event => {
    if ($(event.target).hasClass('recommended-meetingroom')) {
      let meetingRooms = $('.recommended-meetingroom');

      for (let i = 0; i < meetingRooms.length; i++) {
        if (meetingRooms[i] === event.target) {
          $(event.target).addClass('recommended-meetingroom-selected');
          $(event.target).children('.recommended-meetingroom-close').fadeIn(400);
          continue;
        }

        $(meetingRooms[i]).fadeOut(200);
      }
    }

    $('#cm-submit-btn').addClass('cm-submit-btn-active')

    event.stopPropagation();
  });

  // Нажатие на кнопку "Отменить выбор переговорки"
  $('.recommended-meetingrooms').on('click', '.recommended-meetingroom-close', event => {
    let meetingRooms = $('.recommended-meetingroom');

    $(event.target).parent().removeClass('recommended-meetingroom-selected');
    $(event.target).fadeOut(200);

    for (let i = 0; i < meetingRooms.length; i++) {
      $(meetingRooms[i]).fadeIn(200);
    }

    $('#cm-submit-btn').removeClass('cm-submit-btn-active')

    event.stopPropagation();
  });

  // Кнопка "Создать встречу"
  $('#cm-submit-btn').click(event => {
    if (!$(event.target).hasClass('cm-submit-btn-active')) {
      event.preventDefault();
      return;
    }

  });

  // Кнопка "Добавить встречу" в шапке
  $('#h-createMeeting-btn').click(event => {
    $('#create-meeting-window').fadeToggle(400);
    $('#h-createMeeting-btn').fadeToggle(400);

    $('html').css({'overflow': 'hidden'});
  });

  // Кнопка "Отмена" в окне создания встречи
  $('#cm-submit-cancel').click(event => {
    $('#create-meeting-window').fadeToggle(400);
    $('#h-createMeeting-btn').fadeToggle(400);

    $('html').css({'overflow': 'auto'});
  });

});
