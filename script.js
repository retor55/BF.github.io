//Подтягивание элементов из HTML
const endGameDialog = document.querySelector(".end-game"); // Выбор элемента диалога окончания игры
const score = document.querySelector(".score"); // Выбор элемента для отображения счета
const btn_restart = document.querySelector(".restart"); // Выбор кнопки перезапуска игры
const canvas = document.querySelector("#game"); // Выбор элемента холста игры
const ctx = canvas.getContext("2d"); // Получение контекста рисования на холсте

//Классы
class Bird {
  constructor() {
    this.start_x = 50; // Начальная координата X птицы
    this.start_y = 50; // Начальная координата Y птицы
    this.x = this.start_x; // Текущая координата X птицы
    this.y = this.start_y; // Текущая координата Y птицы
    this.width = 50; // Ширина птицы
    this.height = 50; // Высота птицы
    this.speed = 0; // Скорость птицы
    this.acceleration = 0.4; // Ускорение птицы при падении
    this.image = new Image(); // Создание нового объекта изображения для птицы
    this.image.src = "bird.png"; // Установка пути к изображению птицы
    this.jump_force = -9; // Сила прыжка птицы
    this.point = 0; // Очки птицы (количество пройденных труб)
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  gravity() {
    this.speed += this.acceleration; // Увеличиваем скорость падения птицы на величину ускорения
    this.y += this.speed; // Изменяем вертикальную координату птицы на основе её скорости
  }

  jump() {
    document.addEventListener("keydown", (event) => {
      // Добавляем обработчик события нажатия клавиши
      if (event.code == "Space") {
        // Проверяем, если нажата клавиша "Space"
        this.speed = this.jump_force; // Устанавливаем скорость птицы в силу прыжка
      }
    });
  }
}

class Pipe {
  constructor(x) {
    let interval = 200; //Интервал между трубами
    let min_h = 50; // Минимальная высота трубы (и верхней и нижней)
    let max_random_h = canvas.height - min_h - min_h - interval; // Размер верхней трубы

    let speed = -1.5; //Скорость движения труб
    let width = 50; // Ширина труб
    this.fly = false; // Пролетела ли труба до левого края экрана (нужно для подсчета баллов)

    this.top_pipe = {
      // Объект верхняя труба со свойствами:
      start_x: x, //стартовая координата x
      x: x, // фактическая координата x
      y: 0, // фактическая координата y
      width: width, //ширина
      height: min_h + Math.round(Math.random() * max_random_h), // высота
      speed: speed, // скорость
    };

    this.bottom_pipe = {
      // Объект нижняя труба со свойствами:
      start_x: x, //стартовая координата x
      x: x, // фактическая координата x
      y: this.top_pipe.height + interval, //фактическая координата y
      width: width, //ширина
      height: canvas.height - this.top_pipe.height - interval, // высота
      speed: speed, // скорость
    };
  }

  draw() {
    ctx.fillStyle = "#333"; //цвет рисования труб
    ctx.fillRect(
      //рисуем верхнюю трубу
      this.top_pipe.x, // координата x
      this.top_pipe.y, // координата y
      this.top_pipe.width, // ширина
      this.top_pipe.height // высота
    );

    ctx.fillRect(
      // рисуем нижнюю трубу
      this.bottom_pipe.x, // координата x
      this.bottom_pipe.y, // координата y
      this.bottom_pipe.width, // ширина
      this.bottom_pipe.height // высота
    );
  }

  move() {
    this.top_pipe.x += this.top_pipe.speed; // первая пара труб делает шаг влево
    this.bottom_pipe.x += this.bottom_pipe.speed; // вторая пара труб делает шаг влево

    if (this.top_pipe.x < -this.top_pipe.width) {
      // если пара труб полностью ушла за левую часть экрана
      this.top_pipe.x = canvas.width; //перемещаем верхную трубу за правую часть экрана
      this.bottom_pipe.x = canvas.width; //перемещаем нижнюю трубу за правую часть экрана
      //строки кода ниже написаны, чтобы промежуток между труб появлялся в случайном месте, поэтому дублируем код из конструктора
      let interval = 200;
      let min_h = 50;
      let max_random_h = canvas.height - min_h - min_h - interval;

      this.top_pipe.height = min_h + Math.round(Math.random() * max_random_h);
      this.bottom_pipe.y = this.top_pipe.height + interval;
      this.bottom_pipe.height = canvas.height - this.top_pipe.height - interval;
      this.fly = false; //после перемещения трубы за правую часть экрана ставим пометку, что до левого края еще не долетела
    }
  }
}

//Функции
function isCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
function endGame() {
  endGameDialog.classList.add("end-game__open");
  score.innerHTML = bird.point;
}
function isRightOf(rectA, rectB) {
  return rectA.x > rectB.x + rectB.width;
}
btn_restart.addEventListener("click", function () {
  endGameDialog.classList.remove("end-game__open");
  bird.x = bird.start_x;
  bird.y = bird.start_y;
  bird.speed = 0;
  bird.point = 0;
  pipe_one.top_pipe.x = first_x;
  pipe_one.bottom_pipe.x = first_x;
  pipe_two.top_pipe.x = first_x + (canvas.width + pipe_one.top_pipe.width) / 2;
  pipe_two.bottom_pipe.x =
    first_x + (canvas.width + pipe_one.top_pipe.width) / 2;
  loop();
});
//Создание объектов
const bird = new Bird(); //Создали птицу
let first_x = canvas.width / 2; //координата X первой пары труб
let pipe_one = new Pipe(first_x); // создали первую пару труб
let pipe_two = new Pipe(first_x + (canvas.width + pipe_one.top_pipe.width) / 2); //Создали вторую пару труб

// Игровой цикл
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.draw();
  bird.gravity();
  bird.jump();
  pipe_one.draw(); //отрисовали первую пару труб
  pipe_two.draw(); //отрисовали вторую пару труб (они находятся в самом начале игры за игровым полем)
  pipe_one.move(); //двигаем первую трубу
  pipe_two.move(); //двигаем вторую трубу

  if (isCollision(bird, pipe_one.top_pipe)) {
    endGame();
    return;
  }
  if (isCollision(bird, pipe_one.bottom_pipe)) {
    endGame();
    return;
  }

  if (isCollision(bird, pipe_two.top_pipe)) {
    endGame();
    return;
  }
  if (isCollision(bird, pipe_two.bottom_pipe)) {
    endGame();
    return;
  }

  if (bird.y < 0 || bird.y + bird.width > canvas.height) {
    endGame();
    return;
  }

  if (isRightOf(bird, pipe_one.top_pipe) && pipe_one.fly == false) {
    //если пролетели первую пару труб
    pipe_one.fly = true; // ставим пометку первой паре, что пролетели трубу
    bird.point++; //прибавляем балл
    console.log(bird.point); // выводим очки в консоль
  }

  if (isRightOf(bird, pipe_two.top_pipe) && pipe_two.fly == false) {
    //если пролетели вторую пару труб
    pipe_two.fly = true; // ставим пометку второй паре, что пролетели трубу
    bird.point++;
    console.log(bird.point);
  }

  requestAnimationFrame(loop);
}

loop();
