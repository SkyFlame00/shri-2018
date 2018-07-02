document.addEventListener('DOMContentLoaded', () => {

  let roomNamesHTML = $('.room .info .name'), roomNames = [];

  for (let i = 0; i < roomNamesHTML.length; i++) {
    roomNames[i] = roomNamesHTML[i].innerHTML;
  }

  $(window).resize(() => {
    adjustLines();
    adjustDesktopSidebar();

    curDocWidth = document.documentElement.clientWidth;

    if (curDocWidth >= 1024) {
      trimRoomNames(roomNames, 20)
    } else {
      trimRoomNames(roomNames, 12)
    }
  });

  // Прикрепляем серую линию, играющую роль border
  let isSticked = false;

  $(window).scroll(event => {
    if (document.documentElement.scrollTop >= 71 && !isSticked) {
      isSticked = true;
      $('#desktop-gray-strip').css({
        'position': 'sticky',
        'top': '45px'
      });
    } else if (document.documentElement.scrollTop < 71 && isSticked) {
      isSticked = false;
      $('#desktop-gray-strip').css({
        'position': 'absolute',
        'top': '116px'
      });
    }
  });

  dResizeContent();
  initializeCalendar();
  initializeCalendar_cm();
  currentTimeStrip();
  makeGrid();
  createRoomsNamesNotifiers(); // Вызываем обязательно до обрезания текста функцией trimRoomNames

  if (document.documentElement.clientWidth >= 1024) {
    // Устанавливаем высоту белого блока ниже от элементов с информацией о комнатах
    let roomsTimelineHeight = (parseInt($('.rooms').outerHeight(), 10) + parseInt($('.timeline').outerHeight(), 10)) + 'px';

    $('#sidebar-end').css({
      'top': roomsTimelineHeight,
      'height': `calc(100% - ${roomsTimelineHeight}`
    });

    dResizeContent();
    adjustLines();
    trimRoomNames(roomNames, 20)
  } else {
    mResizeContent();
    trimRoomNames(roomNames, 12)
  }

  // Тестовые пустые зоны
  makeEmptyArea('room-2', 6, 200);
  makeEmptyArea('room-3', 0, 22);
  makeEmptyArea('room-4', 46, 210);
  GenerateAddEventBtns();

  // Тестовые заполненные зоны
  makeFilledArea('room-1', 1, 0, 70);
  makeFilledArea('room-2', 2, 450, 950);
  makeFilledArea('room-9', 3, 350, 510);
  makeFilledArea('room-3', 4, 850, 900);

  // Тестовая информация
  data1 = {
    header: 'Рассуждения о высоком',
    body: '14 декабря, 15:00—17:00  ·  Жёлтый дом',
    author: 'Дарт Вейдер',
    others: 'и 12 участников'
  }

  data2 = {
    header: 'Мой день рождения',
    body: '30 января, 12:00—17:00  ·  Прачечная',
    author: 'Антон Тихонов',
    others: 'и 0 участников'
  }

  data3 = {
    header: 'Что-то еще',
    body: '31 декабря, 15:00—17:00  ·  Белорусский ликер',
    author: 'Бла-бла-бла',
    others: 'и 30 участников'
  }

  data4 = {
    header: 'Sample text',
    body: '2 февраля, 15:00—17:00  ·  Жёлтый дом',
    author: 'Люк Скайуокер',
    others: 'и 5 участников'
  }

  // Тестовые тултипы
  makeTooltip(1, 1, data1);
  makeTooltip(2, 2, data2);
  makeTooltip(3, 3, data3);
  makeTooltip(4, 4, data4);

  $('#input-date-wrapper .input-action-wrapper').css({'display': 'block'});
});
