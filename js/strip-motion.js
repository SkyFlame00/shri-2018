document.addEventListener('DOMContentLoaded', () => {

  let today = new Date(); // Тестовое значение: по идее текущий день приходит с сервера
  let requestedDay = new Date(); // Тестовое значение. Запрошенный пользователем день (выбранный через календарь)

  let today_start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0); // для теста 0, в реальности - 8
  let today_end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24); // для теста 0, в реальности - 23

  let lineNum = 16, wholeDist = (15)*65 + lineNum, step;
  // За час полоска должна пройти ровно 66 пикселей

  let stripHeader = $('#current-time-strip-header'),
      stripSmall = $('#current-time-strip-smallpart'),
      stripBig = $('#current-time-strip-bigpart');

  // Не реализована ситуация, когда пользователь находится на странице с днем, который еще
  // не наступил. В ситуации, когда этот день наступает, а страница в браузере с данным днем не была обновлена,
  // то не обновляются сетка, синяя линия и, соответственно, ничего не происходит, хотя отсчет дня
  // уже должен бы был пойти. Реализовать я собирался это так: чуть выше стоял был блок if,
  // где сравнивалась текущая дата на сервере и дата, выбранная пользователем. Если
  // дата, выбранная пользователем, больше даты сервера, то назначается setInterval,
  // который с периодичностью раз в минуту проверяет, не наступило ли 8 часов того дня,
  // на котором пользователь находится.

  // Если запрошенный день совпадает с текущим (в т.ч. по часам: между 8 и 23), рендерим синюю линию и
  // работаем с ней
  // Для теста сделаем проверку всегда равной true
  if (today_start <= requestedDay && requestedDay >= requestedDay) {

    let exactMs = today.getTime() + performance.now();
    let msPassed = exactMs - today_start.getTime();
    msPassed = 0; // тестовое значение, начинаем с 8 часов

    let minutesPassed = msPassed/1000/60;

    let minutesPassedRounded = Math.floor(minutesPassed); // Округляем в меньшую сторону

    let toGoImmediately = Math.floor(minutesPassedRounded/10) + minutesPassedRounded;

    let stripHeader_left = parseInt($(stripHeader).css('left'), 10);
    let strip_left = parseInt($(stripSmall).css('left'), 10);

    // Немедленно (после загрузки страницы) переносим полоску к текущему моменту времени
    $(stripHeader).css({'left': stripHeader_left + toGoImmediately});
    $(stripSmall).css({'left': strip_left + toGoImmediately});
    $(stripBig).css({'left': strip_left + toGoImmediately});

    // Далее для наглядности линия перемещается каждую секунду, а не каждую минуту. Для получения
    // реальной ситуации в комментариях пишется, что нужно сделать ("Еще умножить на 60", например)
    // msRemainedToTheNextStep - количество секунд до наступления новой минуты (после загрузки страницы, сделано для точности)
    let msRemainedToTheNextStep = (1 - (minutesPassed - minutesPassedRounded))*1000; // Еще умножить на 60
    let completedHours = Math.floor(minutesPassed/60);

    let minutesPassedWithinTheLastHour = minutesPassedRounded - completedHours*60;

    for (let i = 8; i <= completedHours + 8; i++) { // Делаем серым цветом уже пройденные часы
      $('#hour-' + i).css({'color': '#858E98'});
    }

    let rooms = $('.room'), roomsEmptyAreas = [];

    // Устанавливаем таймаут, который сработает один раз через количество оставшихся секунд до наступления новой минуты
    setTimeout(() => {
      // Похоже, что браузер обрубает цифры после запятой, очень точные вычисления сделать не получилось,
      // поэтому я решил каждые 10 секунд сдвигать линию не на 1 пиксель, а на 2
      if (minutesPassedWithinTheLastHour === 9 || minutesPassedWithinTheLastHour === 19 ||
          minutesPassedWithinTheLastHour === 29 || minutesPassedWithinTheLastHour === 39 ||
          minutesPassedWithinTheLastHour === 49 || minutesPassedWithinTheLastHour === 59) {
        step = 2;
      } else {
        step = 1;
      }

      minutesPassedWithinTheLastHour++;

      // Если прошел час, то сбрасываем переменную minutesPassedWithinTheLastHour,
      // красим в серый цвет наступивший час
      if (minutesPassedWithinTheLastHour === 60) {
        completedHours++;
        minutesPassedWithinTheLastHour = 0;
        $('#hour-' + (completedHours + 8)).css({'color': '#858E98'});
      }

      // Сдвигаем линию
      stripHeader_left = parseInt($(stripHeader).css('left'), 10);
      strip_left = parseInt($(stripSmall).css('left'), 10);
      $(stripHeader).css({'left': stripHeader_left + step});
      $(stripSmall).css({'left': strip_left + step});
      $(stripBig).css({'left': strip_left + step});

      // Меняем время в хедере линии
      if (minutesPassedWithinTheLastHour.toString().length === 1) {
        $(stripHeader).text((completedHours + 8) + ':0' + minutesPassedWithinTheLastHour);
      } else {
        $(stripHeader).text((completedHours + 8) + ':' + minutesPassedWithinTheLastHour);
      }

      // Уменьшаем пустые зоны, если таковые имеются по мере прохождения линии
      // Декларация функции располагается в самом низу файла
      refreshEmptyAreas(rooms, roomsEmptyAreas);

      // Теперь каждую минуту (в данном случае - каждую секунду) перемещаем линию
      let timer = setInterval(() => {
        // Каждые 10 секунд прибавляем 2 пикселя
        if (minutesPassedWithinTheLastHour === 9 || minutesPassedWithinTheLastHour === 19 ||
            minutesPassedWithinTheLastHour === 29 || minutesPassedWithinTheLastHour === 39 ||
            minutesPassedWithinTheLastHour === 49 || minutesPassedWithinTheLastHour === 59) {
          step = 2;
        } else {
          step = 1;
        }

        minutesPassedWithinTheLastHour++;

        if (minutesPassedWithinTheLastHour === 60) {
          completedHours++;
          minutesPassedWithinTheLastHour = 0;
          total = 0;
          $('#hour-' + (completedHours + 8)).css({'color': '#858E98'});

          if ((completedHours + 8) === 23) { // Если наступает 23 часа, то убираем синюю линию через 1 секунду
            clearInterval(timer);
            setTimeout(() => {
              step = 1;
              stripHeader_left = parseInt($(stripHeader).css('left'), 10);
              strip_left = parseInt($(stripSmall).css('left'), 10);
              $(stripHeader).css({'left': stripHeader_left + step});
              $(stripSmall).css({'left': strip_left + step});
              $(stripBig).css({'left': strip_left + step});

              if (minutesPassedWithinTheLastHour.toString().length === 1) {
                $(stripHeader).text((completedHours + 8) + ':0' + minutesPassedWithinTheLastHour);
              } else {
                $(stripHeader).text((completedHours + 8) + ':' + minutesPassedWithinTheLastHour);
              }

              $(stripHeader).fadeOut(200);
              $(stripSmall).fadeOut(200);
              $(stripBig).fadeOut(200);
            }, 1000); //Изменить на 60000

          }
        }

        stripHeader_left = parseInt($(stripHeader).css('left'), 10);
        strip_left = parseInt($(stripSmall).css('left'), 10);
        $(stripHeader).css({'left': stripHeader_left + step});
        $(stripSmall).css({'left': strip_left + step});
        $(stripBig).css({'left': strip_left + step});

        if (minutesPassedWithinTheLastHour.toString().length === 1) {
          $(stripHeader).text((completedHours + 8) + ':0' + minutesPassedWithinTheLastHour);
        } else {
          $(stripHeader).text((completedHours + 8) + ':' + minutesPassedWithinTheLastHour);
        }

        refreshEmptyAreas(rooms, roomsEmptyAreas);
      }, 1000) // Исправить на 60000
    }, msRemainedToTheNextStep); // Как раз то количество оставшихся секунд до первоначального наступления новой минуты после загрузки веб-страницы
  }
});

// Функция, которая визуально уменьшает свободные промежутки по мере того, как движется синяя полоса
function refreshEmptyAreas(rooms, roomsEmptyAreas) {
  let stripBig = $('#current-time-strip-bigpart');

  for (let i = 0; i < rooms.length; i++) {
    if ($(rooms[i]).has('.empty-area')) {
      roomsEmptyAreas[i] = [];
      let id = $(rooms[i]).attr('id');
      let arr = $('#' + id + ' .empty-area');

      for (let j = 0; j < arr.length; j++) {
        roomsEmptyAreas[i][j] = arr[j];

        let stripOffsetLeft = $(stripBig).offset().left;
        let emptyAreaOffsetLeft = $(arr[j]).offset().left,
            emptyAreaWidth = $(arr[j]).outerWidth();

        if (stripOffsetLeft >= emptyAreaOffsetLeft + emptyAreaWidth - 15) {
          $(arr[j]).fadeOut(200);
          continue;
        }

        if ((stripOffsetLeft >= emptyAreaOffsetLeft) && (stripOffsetLeft < emptyAreaOffsetLeft + emptyAreaWidth )) {
          let resizing = stripOffsetLeft - emptyAreaOffsetLeft;
          let left = parseInt($(arr[j]).css('left'), 10);

          $(arr[j]).css({
            'width': emptyAreaWidth - resizing,
            'left': left + resizing
          });
        }
      }
    } else {
      roomsEmptyAreas[i] = null;
    }
  }
}
