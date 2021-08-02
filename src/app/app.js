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
	crossTurn: true,
	crossPlayer: "player1",
	currentLang: "en",
	player1: {
		name: "Player 1",
		color: "red",
	},
	player2: {
		name: "Player 2",
		color: "blue",
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
const player1Colors = document.querySelectorAll(
	".color-row svg[player='player1']"
);
const player2Colors = document.querySelectorAll(
	".color-row svg[player='player2']"
);
const startGameButton = document.getElementById("startGameButton");

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

// Setup game form
function setupGame() {
	// Event listeners
	player1Colors.forEach((color) => {
		color.addEventListener("click", (e) => {
			updateWarning();
			setPlayerColor("player1", e);
		});
	});
	player2Colors.forEach((color) => {
		color.addEventListener("click", (e) => {
			updateWarning();
			setPlayerColor("player2", e);
		});
	});
	startGameButton.addEventListener("click", (e) => {
		e.preventDefault(); // prevent refresh
		const inputData = Object.fromEntries(new FormData(setupForm));
		[game.player1.name, game.player2.name] = [
			inputData.player1,
			inputData.player2,
		];
		setupContainer.classList.remove("show");
		startGame();
	});
	// Defaults
	setupForm
		.querySelector("svg[color='red'][player='player1']")
		.dispatchEvent(new MouseEvent("click"));
	setupForm
		.querySelector("svg[color='blue'][player='player2']")
		.dispatchEvent(new MouseEvent("click"));

	function updateWarning(warning = false) {
		setupForm.querySelector("[warning-text]").innerHTML = warning
			? "The colors shouldn't match!"
			: "";
	}

	function setPlayerColor(player, e) {
		const opponent = player === "player1" ? "player2" : "player1";
		const row = player === "player1" ? player1Colors : player2Colors;
		if (game[opponent]["color"] !== e.currentTarget.getAttribute("color")) {
			updateWarning();
			game.setColor(player, e.currentTarget.getAttribute("color"));
			row.forEach((color) => color.classList.remove("selected"));
			e.currentTarget.classList.add("selected");
		} else {
			updateWarning(true);
		}
	}
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
	// Insert CSS for coloring SVGs based on player choice and cross/circle
	insertStylesheet(
		`.board .cell.cross svg {fill:${
			game.crossPlayer === "player1"
				? game.player1.color
				: game.player2.color
		}}", 0`
	);
	insertStylesheet(
		`.board .cell.circle svg {fill:${
			game.crossPlayer === "player1"
				? game.player2.color
				: game.player1.color
		}}", 0`
	);
}

function insertStylesheet(css) {
	const style = document.createElement("style");
	style.innerHTML = css;
	document.head.appendChild(style);
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
