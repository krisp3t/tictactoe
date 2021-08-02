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
	setColor: function (player, color) {
		this[player]["color"] = color;
	},
};
// CSS classes
const CROSS_CLASS = "cross";
const CIRCLE_CLASS = "circle";
// HTML elements
const setupContainer = document.getElementById("setup");
const setupForm = document.getElementById("setupForm");
const player1Colors = document.querySelectorAll(".player1 svg.color");
const player2Colors = document.querySelectorAll(".player2 svg.color");

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
restartButton.addEventListener("click", startGame); // end game restart button
setupGame();

function setupGame() {
	player1Colors.forEach((color) => {
		color.addEventListener("click", (e) =>
			game.setColor("player1", e.currentTarget.getAttribute("color"))
		);
	});
	player2Colors.forEach((color) => {
		color.addEventListener("click", (e) =>
			game.setColor("player2", e.currentTarget.getAttribute("color"))
		);
	});
	setupForm.addEventListener("submit", (e) => {
		e.preventDefault(); // prevent refresh
		const inputData = Object.fromEntries(new FormData(setupForm));
		console.log(inputData); // test
		[game.player1.name, game.player2.name] = [
			inputData.player1,
			inputData.player2,
		];
		setupContainer.classList.remove("show");
		startGame();
	});
}

function stringSetup(lang = game.currentLang) {
	// restartButton.innerHTML = text["gameEnd"]["restart"][lang];
	// setupForm.querySelector('label[for="currentLang"]').innerHTML =
	// 	text["setup"]["currentLang"][lang];
	// setupForm.querySelector(
	// 	'label[for="player1"]'
	// ).innerHTML = `${text["setup"]["player"][lang]} 1`;
	// setupForm.querySelector(
	// 	'label[for="player2"]'
	// ).innerHTML = `${text["setup"]["player"][lang]} 2`;
	// setupForm.querySelector("#submitButton").innerHTML =
	// 	text["setup"]["submitButton"][lang];
}

// SVG
function passSvg(currentClass) {
	return `<svg class="draw">
	<use href="#${currentClass}"></use>
	</svg>`;
}

function startGame() {
	console.log(game); //test
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
