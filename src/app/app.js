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
class Game {
	constructor() {
		this.crossTurn = true;
		this.player1Turn = true;
		this.currentLang = "en";
		this.player1 = {
			name: "Player 1",
			color: "red",
			wins: 0,
		};
		this.player2 = {
			name: "Player 2",
			color: "blue",
			wins: 0,
		};
	}
	setColor(player, color) {
		this[player]["color"] = color;
	}
	setName(player, name) {
		this[player]["name"] = name;
	}
	switchTurns() {
		this.player1Turn = !this.player1Turn;
		this.crossTurn = !this.crossTurn;
	}
	switchPlayers() {
		this.crossTurn = true;
		this.player1Turn = this.player1.wins + (this.player2.wins % 2) === 0;
		removeStylesheet();
	}
	colorPlayers() {
		insertStylesheet(
			`.board .cell.cross svg {fill:${
				game.player1Turn ? game.player1.color : game.player2.color
			}}", 0`
		);
		insertStylesheet(
			`.board .cell.circle svg {fill:${
				game.player1Turn ? game.player2.color : game.player1.color
			}}", 0`
		);
	}
	getPlayerTurn() {
		return this.player1Turn;
	}
	getCrossTurn() {
		return this.crossTurn;
	}
	getName(player) {
		return this[player]["name"];
	}
	getColor(player) {
		return this[player]["color"];
	}
	getWins(player) {
		return this[player]["wins"];
	}
	getCurrentLang() {
		return this.currentLang;
	}
}

export const game = new Game();
console.log(game);
// import text from "./text";

// CSS classes
const CROSS_CLASS = "cross";
const CIRCLE_CLASS = "circle";
// HTML elements
const setupContainer = document.getElementById("setup");
const setupForm = document.getElementById("setupForm");
const currentLang = document.getElementById("currentLang");
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

// At load
stringSetup();
restartButton.addEventListener("click", restartGame); // end game restart button
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
		game.setName(
			"player1",
			inputData.player1 !== "" ? inputData.player1 : "Player 1"
		);
		game.setName(
			"player2",
			inputData.player2 !== "" ? inputData.player2 : "Player 2"
		);
		setupContainer.classList.remove("show");
		console.log(document.getElementById("scorebar"));
		document.getElementById("scorebar").classList.add("show");
		document
			.getElementById("player1Score")
			.classList.add(`color-${game.getColor("player1")}`);
		document
			.getElementById("player2Score")
			.classList.add(`color-${game.getColor("player2")}`);
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
		if (game.getColor(opponent) !== e.currentTarget.getAttribute("color")) {
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
	game.colorPlayers();
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

function insertStylesheet(css) {
	const svgStyle = document.createElement("style");
	svgStyle.setAttribute("id", "svgStyle");
	svgStyle.innerHTML = css;
	document.head.appendChild(svgStyle);
}
function removeStylesheet() {
	document.head.removeChild(document.getElementById("svgStyle"));
}

function setHover() {
	// board.classList.remove(CROSS_CLASS);
	// board.classList.remove(CIRCLE_CLASS);
	// board.classList.add(game.crossTurn ? CROSS_CLASS : CIRCLE_CLASS);
}

function handleClick(e) {
	const cell = e.currentTarget; // clicked cell
	const currentClass = game.getCrossTurn() ? CROSS_CLASS : CIRCLE_CLASS;
	drawCell(cell, currentClass);

	if (checkWin(currentClass)) {
		endGame();
	} else if (checkDraw()) {
		endGame(true);
	} else {
		game.switchTurns();
		setHover();
	}
}

function drawCell(cell, currentClass) {
	cell.classList.add(currentClass);
	cell.insertAdjacentHTML("afterbegin", passSvg(currentClass));
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
	// gameEndText.innerHTML =  text["gameEnd"][draw ? "draw" : "win"][game.currentLang];
}

function restartGame() {
	game.switchPlayers();
	startGame();
}
