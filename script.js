let minValue, maxValue, gameRun, answerPhrase, phraseRandom, answerNumber, orderNumber, err;
let minus = false;

const orderNumberField = document.querySelector('#orderNumberField');
const answerField = document.querySelector('#answerField');
const btnRetry = document.querySelector('#btnRetry');
const btnOver = document.querySelector('#btnOver');
const btnLess = document.querySelector('#btnLess');
const btnEqual = document.querySelector('#btnEqual');
const orderText = document.querySelector('#orderText');
const btnStart = document.querySelector('#btnStart');
const inputMin = document.querySelector('.inputMin');
const inputMax = document.querySelector('.inputMax');
const phrase = document.querySelector('.Phrase');
const phraseCollapse = document.querySelector('#hidePhrase');


function cllpsPhrase () { //сворачивание уведомлений
  return new bootstrap.Collapse('#hidePhrase');
}

//задаем текстовую запись ответа
function Hundred (a) { //сотни (аргумент - ответ)
  let hundredText;
  let ansHundred = Math.floor(a / 100); //вычисляем сотни
  hundredText = [
      '',
      'сто ',
      'двести ',
      'триста ',
      'четыреста ',
      'пятьсот ',
      'шестьсот ',
      'семьсот ',
      'восемьсот ',
      'девятьсот '
  ];
  return hundredText[ansHundred];
}

function Unit (a) { //единицы (аргумент - ответ)
  let unitText;
  let ansUnit = a - (Math.floor(a / 10) * 10); //вычисляем единицы
  unitText = [
      '',
      'один',
      'два',
      'три',
      'четыре',
      'пять',
      'шесть',
      'семь',
      'восемь',
      'девять',
  ];
  return unitText[ansUnit];
}

function Ten (a) { //десятки (аргумент - ответ)
  let tenText;
  let ansTen = (a - Math.floor(a / 100) * 100 - (a - Math.floor(a / 10) * 10)) / 10; //вычисляем десятки
  tenText = [
      '',
      '',
      'двадцать ',
      'тридцать ',
      'сорок ',
      'пятьдесят ',
      'шестьдесят ',
      'семьдесят ',
      'восемьдесят ',
      'девяносто ',
  ];  
  return tenText[ansTen];
}

function Answer (a) { //формирование числового или текстового ответа
  let answerText = Hundred(a) + Ten(a) + Unit(a);
  //текст для чисел 10-19
  if ((a - Math.floor(a / 100) * 100 - (a - Math.floor(a / 10) * 10)) / 10 === 1) { //вычисляем десятки
    tenText = [
        'десять',
        'одиннадцать',
        'двенадцать',
        'тринадцать',
        'четырнадцать',
        'пятнадцать',
        'шестьнадцать',
        'семнадцать',
        'восемнадцать',
        'девятнадцать'
    ];
    answerText = Hundred(a) + tenText[a - (Math.floor(a / 10) * 10)];
  }

  answerText = minus ? ('минус ' + answerText) : answerText; //текст для ответа со знаком "-"

  let b = minus ? -a : a; //число в ответе со знаком "-"

  if (answerText.length > 20) { //проверка длины строки текстового ответа
    return b;
  } else if ((answerText == '') || (answerText == ' ') || (answerText == '  ')) { //число в ответе "0"
    return b;
  } else {
    return answerText;
  }
}

//функции кнопок
btnStart.onclick = function Start () { //кнопка "Начать игру"
  //ввод значений
  (inputMin.value === '') ? (gameRun = false) : (minValue = parseInt(inputMin.value));
  (inputMax.value === '') ? (gameRun = false) : (maxValue = parseInt(inputMax.value));
  //проверка диапазона -999..999
  minValue = (minValue < -999) ? (minValue = -999) : minValue;
  maxValue = (maxValue > 999) ? (maxValue = 999) : maxValue;

  if (isNaN(minValue) || isNaN(maxValue)) { //проверка ввода текста
    err = true;
    phrase.innerText = `Вы ввели не число, будут присвоены значения по умолчанию (0; 100)`;
    minValue = 0;
    maxValue = 100;
  }

  answerNumber = Math.floor((minValue + maxValue) / 2); //находим середину
  orderNumber = 1; //номер вопроса

  if (answerNumber < 0) { //проверка отрицательного числа
    answerNumber = Math.abs(answerNumber);
    minus = true;
  }

  gameRun = true;
  orderNumberField.innerText = orderNumber;
  answerField.innerText = `Вы загадали число ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?`;
}

function Retry () { //кнопка "Заново"
  cllpsPhrase();
  phrase.innerText = `Введите значения и нажмите "Начать игру!"`;
  Start();
}

function Over () { //кнопка "Больше"
  if (gameRun) {
    //debugger;
    if (err) {
      cllpsPhrase();
      err = false;
    }
    if ((minValue === maxValue) || (minValue > maxValue)) {
      phraseRandom = Math.round(Math.random() * 2);
      switch (phraseRandom) { //выбор рандомной фразы при неудачном угадывание
        case 0:
          answerPhrase = `Вы загадали неправильное число!\n\u{1F914}`;
          break;
        case 1:
          answerPhrase = `Я сдаюсь..\n\u{1F927}`;
          break;
        case 2:
          answerPhrase = 'Какое-то странное число...\n\u{1F925}';
          break;
      }
      answerField.innerText = answerPhrase;
      gameRun = false;
    } else { //следующая итерация
      minValue = answerNumber + 1; //увеличение нижнего порога до "середина + 1"
      answerNumber = Math.floor((minValue + maxValue) / 2); //новая середина

      if (answerNumber < 0) { //проверка отрицательного числа
        answerNumber = Math.abs(answerNumber);
        minus = true;
      }

      orderNumber++;
      orderNumberField.innerText = orderNumber;
      phraseRandom = Math.round(Math.random() * 2);
      switch (phraseRandom) { //выбор рандомной фразы при неудачном угадывание
        case 0:
          answerPhrase =
            `Вы загадали число ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?\n\u{1F914}`;
          break;
        case 1:
          answerPhrase =
            `Легко! Вы загадали ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?\n\u{1F928}`;
          break;
        case 2:
          answerPhrase =
            `Наверное, это число ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?\n\u{1F60E}`;
          break;
      }
      answerField.innerText = answerPhrase;
    }
  }
}

function Less () { //кнопка "Меньше"
  if (gameRun) {
    if (err) {
      cllpsPhrase();
      err = false;
    }
    if ((minValue === maxValue) || (minValue > maxValue)) {
      phraseRandom = Math.round(Math.random() * 2);
      switch (phraseRandom) { //выбор рандомной фразы при неудачном угадывание
        case 0:
          answerPhrase = `Вы загадали неправильное число!\n\u{1F914}`;
          break;
        case 1:
          answerPhrase = `Я сдаюсь..\n\u{1F927}`;
          break;
        case 2:
          answerPhrase = 'Какое-то странное число...\n\u{1F925}';
          break;
      }
      answerField.innerText = answerPhrase;
      gameRun = false;
    } else { //следующая итерация
      maxValue = answerNumber - 1; //уменьшение верхнего порога до "середина - 1"
      answerNumber = Math.floor((minValue + maxValue) / 2); //новая середина

      if (answerNumber < 0) { //проверка отрицательного числа
        answerNumber = Math.abs(answerNumber);
        minus = true;
      }

      orderNumber++;
      orderNumberField.innerText = orderNumber;
      phraseRandom = Math.round(Math.random() * 2);
      switch (phraseRandom) { //выбор рандомной фразы при неудачном угадывание
        case 0:
          answerPhrase =
            `Вы загадали число ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?\n\u{1F914}`;
          break;
        case 1:
          answerPhrase =
            `Легко! Вы загадали ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?\n\u{1F928}`;
          break;
        case 2:
          answerPhrase =
            `Наверное, это число ${Answer(answerNumber)}, (${(minus ? -answerNumber : answerNumber)})?\n\u{1F60E}`;
          break;
      }
      answerField.innerText = answerPhrase;
    }
  }
}

function Equal () { //кнопка "Верно"
  if (gameRun) {
    phraseRandom = Math.round(Math.random() * 2);
    switch (phraseRandom) { //выбор рандомной фразы при неудачном угадывание
      case 0:
        answerPhrase = `Я всегда угадываю\n\u{1F917}`;
        break;
      case 1:
        answerPhrase = `ХА! И снова угадал\n\u{1F913}`;
        break;
      case 2:
        answerPhrase = `Кто молодец? Я молодец!\n\u{1F60E}`;
        break;
    }
    answerField.innerText = answerPhrase;
    gameRun = false;
  }
}

btnRetry.addEventListener('click', Retry);
btnOver.addEventListener('click', Over);
btnLess.addEventListener('click', Less);
btnEqual.addEventListener('click', Equal);