function closeElement(el) {
  el.classList.add("disabled");
  return null;
}

// * =================================================
// ? elements:
const board = document.querySelector(".board");
const intro = document.getElementById("intro");
const title = document.getElementById("game-title");
const greetBtn = document.getElementById("greet-btn");
const registrationForm = document.getElementById("registration-form");
const registrationFormBtn = document.getElementById("form-btn");
const closeBtn = document.getElementById("close-btn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const profile = document.getElementById("profile");
const test = document.getElementById("test");
const cover = document.getElementById("cover");
const menu = document.getElementById("menu");
const enemy = document.getElementById("enemy");
const gameBar = document.getElementById("game-bar");
const score = document.getElementById("current-score");
const userName = document.getElementById("user-name");
const currentLevel = document.getElementById("current-level");
const modalWindow = document.getElementById("modal-window");
const modalBtn = document.getElementById("modal-btn");
const modalContent = document.getElementById("modal-content");
// * =================================================
// ? store:
let coverIsDown = false;
// * =================================================
// ? presets:
const levels = [
  {
    target: 10,
    enemy: "skeleton",
    theme: [
      'url("./img/themes/lvl1/lvl1.jpg")',
      'url("./img/themes/lvl1/skeleton.png")',
    ],
  },
  {
    target: 20,
    enemy: "ghost",
    theme: [
      'url("./img/themes/lvl2/lvl2.jpg")',
      'url("./img/themes/lvl2/ghost.png")',
    ],
  },
  {
    target: 30,
    enemy: "witch",
    theme: [
      'url("./img/themes/lvl3/lvl3.jpg")',
      'url("./img/themes/lvl3/witch.png")',
    ],
  },
  {
    target: 45,
    enemy: "vampire",
    theme: [
      'url("./img/themes/lvl4/lvl4.jpg")',
      'url("./img/themes/lvl4/vampire.png")',
    ],
  },
  {
    target: 65,
    enemy: "death-knight",
    theme: [
      'url("./img/themes/lvl5/lvl5.jpg")',
      'url("./img/themes/lvl5/death_knight.png")',
    ],
  },
];

// * =================================================
// ? actions:
const coverActs = {
  screenUpdated: false,
  shift() {
    setTimeout(() => {
      cover.classList.add("down");
      setTimeout(() => {
        cover.classList.remove("down");
      }, 2000);
    }, 0);
  },
  down() {
    cover.classList.add("down");
    modalBtn.disabled = true;
    setTimeout(() => (modalBtn.disabled = false), 2000);
    coverIsDown = true;
  },
  up() {
    cover.classList.remove("down");
    coverIsDown = false;
  },
};

function checkIsTargetScoreReached(targetScore) {
  return score.textContent >= targetScore;
}

function updateBoardTheme(themePair) {
  board.style.background = themePair[0];
  enemy.style.background = themePair[1];
  board.style.backgroundRepeat = "no-repeat";
  board.style.backgroundSize = "cover";
  board.style.backgroundPosition = "center";
  enemy.style.backgroundRepeat = "no-repeat";
  enemy.style.backgroundSize = "cover";
  enemy.style.backgroundPosition = "center";
  return null;
}

function scoreUp() {
  score.textContent = +score.textContent + 1;
}

function showProgress(n) {
  modalWindow.classList.remove("disabled");
  modalContent.innerHTML = `<h2>Congratulations!</h2> <p>Now you can proceed to the next level ${n}.</p>`;
}
function closeModal() {
  modalWindow.classList.add("disabled");
}

function showProlog(n) {
  modalWindow.classList.remove("disabled");
  modalContent.innerHTML = `<h2>Congratulations!</h2> <p>You beaten all enemies. Your total score is ${n}</p>`;
  modalBtn.innerText = "Back to the menu";
  modalBtn.addEventListener(
    "click",
    () => {
      location.reload();
    },
    { once: true }
  );
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function setUser(name, email) {
  localStorage.setItem("user", JSON.stringify({ name, email }));
}
function renderStartOfGame() {
  userName.textContent = JSON.parse(localStorage.getItem("user")).name;
  menu.classList.add("disabled");
  title.classList.add("disabled");
  enemy.classList.remove("disabled");
  gameBar.classList.remove("disabled");
}
function startGame() {
  renderStartOfGame();
  let lvl = currentLevel.textContent;
  let targetScore = levels[lvl].target;
  currentLevel.textContent = +lvl + 1;
  updateBoardTheme(levels[lvl].theme);

  function enemyHandler(e) {
    scoreUp();
    let currentScore = +score.textContent;
    if (currentScore >= targetScore) {
      enemy.removeEventListener("click", enemyHandler);
      coverActs.down();
      if (+lvl + 2 > 5) {
        modalBtn.removeEventListener("click", modalBtnHandler);
        showProlog(currentScore);
        return null;
      }
      showProgress(+lvl + 2);
      return null;
    }
  }
  enemy.addEventListener("click", enemyHandler);
}
// * =================================================
// ? is it first time:
let firstTime = !localStorage.getItem("visited");
if (firstTime) {
  intro.classList.remove("disabled");
  localStorage.setItem("visited", true);
}
// * =================================================
// ? is profile created:
if (getUser()) {
  const user = getUser();
  profile.textContent = user.name;
  profile.classList.remove("disabled");
}

// * =================================================
// * Events:
// ? click on greet btn:
function greetBtnHandler(e) {
  intro.classList.add("disabled");
  registrationForm.classList.remove("disabled");
}
greetBtn.addEventListener("click", greetBtnHandler);
// * =================================================
// ? click on registration form btn:
function registrationFormBtnHandler(e) {
  setUser(nameInput.value, emailInput.value);
}
registrationFormBtn.addEventListener("click", registrationFormBtnHandler);
// * =================================================
// ? click on close btn:
// ? delegation:
// * --- close btns ---:
board.addEventListener("click", (e) => {
  const target = e.target;
  const classNames = Array.from(target.classList);
  if (classNames.includes("close")) {
    target.closest("[data-closeable]").classList.add("disabled");
  }
});
// * =================================================
// ? game menu:
menu.addEventListener("click", (e) => {
  const target = e.target;
  switch (target.getAttribute("id")) {
    case "start":
      if (!getUser()) {
        registrationForm.classList.remove("disabled");
        return null;
      }
      coverActs.shift();
      setTimeout(() => startGame(), 2000);
      break;
    default:
      console.log("Happens");
  }
});
// * =================================================
// ? click on modalBtn:
function modalBtnHandler(e) {
  startGame();
  coverActs.up();
  closeModal();
}
modalBtn.addEventListener("click", modalBtnHandler);
// * =================================================
