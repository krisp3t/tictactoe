"use strict";

// App constants
const WIN_COMBINATIONS = [
	[0, 1, 2], // horizontal
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6], // vertical
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8], // diagonal
	[2, 4, 6],
];
Object.freeze(WIN_COMBINATIONS);
const game = {
	crossTurn: "cross",
	currentLang: "en",
	player1: {
		name: "",
		color: "",
	},
	player2: {
		name: "",
		color: "",
	},
};
// CSS classes
const CROSS_CLASS = "cross";
const CIRCLE_CLASS = "circle";
// HTML elements
const setup = document.getElementById("setup");
const setupForm = document.getElementById("setupForm");

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const boardContainer = document.querySelector(".board-container");

const gameEnd = document.getElementById("gameEnd");
const gameEndText = document.querySelector("[data-game-end-text]");
const restartButton = document.getElementById("restartButton");

// Game strings
const text = {
	setup: {
		currentLang: {
			en: "Language",
			de: "Sprache",
			sl: "Jezik",
			hr: "Jezik",
			sr: "Језик",
		},
		player: {
			en: "Player",
			de: "Spieler",
			sl: "Igralec",
			hr: "Igrač",
			sr: "Играч",
		},
		submitButton: {
			en: "Start game",
			de: "Spiel beginnen",
			sl: "Začni igro",
			hr: "Započni igru",
			sr: "Започни игру",
		},
	},
	gameEnd: {
		win: {
			en: `${game.crossTurn ? "❌" : "⭕"} wins!`,
			de: `${game.crossTurn ? "❌" : "⭕"} gewinnt!`,
			sl: `${game.crossTurn ? "❌" : "⭕"} je zmagal!`,
			hr: `${game.crossTurn ? "❌" : "⭕"} je pobijedio!`,
			sr: `${game.crossTurn ? "❌" : "⭕"} је победио!`,
		},
		draw: {
			en: "It's a draw!",
			de: "Es steht unentschieden!",
			sl: "Neodločeno je!",
			hr: "Neriješeno je!",
			sr: "Нерешено је!",
		},
		restart: {
			en: "New game",
			de: "Neues Spiel",
			sl: "Nova igra",
			hr: "Nova igra",
			sr: "Нова игра",
		},
	},
};

// At load
stringSetup();
setupForm.addEventListener("submit", (e) => {
	console.log("i"); //test
	e.preventDefault();
	// [game.currentLang, game.player1.name, game.player2.name] = [
	// 	setupForm.querySelector(#)
	// ];
	setup.classList.remove("show");
	startGame();
});
setupForm
	.querySelector("select#currentLang")
	.addEventListener("change", () =>
		stringSetup(setupForm.querySelector("select#currentLang").value)
	);
restartButton.addEventListener("click", startGame);

// String setup
function stringSetup(lang = game.currentLang) {
	restartButton.innerHTML = text["gameEnd"]["restart"][lang];
	setupForm.querySelector('label[for="currentLang"]').innerHTML =
		text["setup"]["currentLang"][lang];
	setupForm.querySelector(
		'label[for="player1"]'
	).innerHTML = `${text["setup"]["player"][lang]} 1`;
	setupForm.querySelector(
		'label[for="player2"]'
	).innerHTML = `${text["setup"]["player"][lang]} 2`;
	setupForm.querySelector("#submitButton").innerHTML =
		text["setup"]["submitButton"][lang];
}

// SVG
function passSvg(currentClass) {
	return `<svg class="draw">
	<use href="#${currentClass}"></use>
	</svg>`;
}

function startGame() {
	game.crossTurn = true;
	cellElements.forEach((cell) => {
		cell.classList.remove(CROSS_CLASS);
		cell.classList.remove(CIRCLE_CLASS);
		cell.innerHTML = "";
		cell.removeEventListener("click", handleClick);
		cell.addEventListener("click", handleClick, { once: true });
	});
	setHover();
	gameEnd.classList.remove("show");
	boardContainer.classList.remove("blur");
}

function setHover() {
	board.classList.remove(CROSS_CLASS);
	board.classList.remove(CIRCLE_CLASS);
	board.classList.add(game.crossTurn ? CROSS_CLASS : CIRCLE_CLASS);
}

function handleClick(e) {
	const cell = e.currentTarget; // clicked cell
	const currentClass = game.crossTurn ? CROSS_CLASS : CIRCLE_CLASS;
	drawCell(cell, currentClass);

	if (checkWin(currentClass)) {
		endGame();
	} else if (checkDraw()) {
		endGame(true);
	} else {
		switchTurns();
		setHover();
	}
}

function drawCell(cell, currentClass) {
	cell.classList.add(currentClass);
	cell.insertAdjacentHTML("afterbegin", passSvg(currentClass));
}

function switchTurns() {
	game.crossTurn = !game.crossTurn;
}

function checkWin(currentClass) {
	return WIN_COMBINATIONS.some((combination) => {
		// at least 1 of the combinations
		return combination.every((index) => {
			return cellElements[index].classList.contains(currentClass);
		});
	});
}

function checkDraw() {
	return [...cellElements].every((cell) => {
		// NodeList to Array
		return (
			cell.classList.contains(CROSS_CLASS) ||
			cell.classList.contains(CIRCLE_CLASS)
		);
	});
}

function endGame(draw = false) {
	gameEnd.classList.add("show");
	boardContainer.classList.add("blur");
	gameEndText.innerHTML =
		text["gameEnd"][draw ? "draw" : "win"][game.currentLang];
}
