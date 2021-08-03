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
		this.player1Turn = !this.player1Turn;
		removeStylesheet();
	}
	colorPlayers() {
		insertStylesheet(
			`.board .cell svg.cross {fill:${
				game.player1Turn ? game.player1.color : game.player2.color
			}}", 0`
		);
		insertStylesheet(
			`.board .cell svg.circle {fill:${
				game.player1Turn ? game.player2.color : game.player1.color
			}}", 0`
		);
	}
	colorScore() {
		const playerFirst = this.player1Turn ? "player1" : "player2";
		const playerSecond = this.player1Turn ? "player2" : "player1";
		scoreCross.innerHTML = `❌ <em>${this.getName(
			playerFirst
		)}:</em> ${this.getWins(playerFirst)} ${
			text["game"]["wins"][this.currentLang]
		}`;
		scoreCircle.innerHTML = `⭕ <em>${this.getName(
			playerSecond
		)}:</em> ${this.getWins(playerSecond)} ${
			text["game"]["wins"][this.currentLang]
		}`;
		removeClass(scoreCross, "color");
		removeClass(scoreCircle, "color");
		scoreCross.classList.add(`color-${this.getColor(playerFirst)}`);
		scoreCircle.classList.add(`color-${this.getColor(playerSecond)}`);

		function removeClass(node, prefix) {
			const regex = new RegExp("\\b" + prefix + "[^ ]*[ ]?\\b", "g");
			node.className = node.className.replace(regex, "");
			return node;
		}
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

const scoreCross = document.getElementById("scoreCross");
const scoreCircle = document.getElementById("scoreCircle");
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const boardContainer = document.querySelector(".board-container");

const gameEnd = document.getElementById("gameEnd");
const gameEndText = document.querySelector("[data-game-end-text]");
const restartButton = document.getElementById("restartButton");
// Game strings
const text = require("./text");

// At load
stringSetup();
restartButton.addEventListener("click", restartGame); // end game restart button
setupGame();

// Setup game form
function setupGame() {
	// Language picker
	currentLang.querySelectorAll("a.dropdown-item").forEach((item) => {
		item.addEventListener("click", (e) => {
			game.currentLang = e.target.getAttribute("value");
			stringSetup();
		});
	});
	// Player colors
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
	// Default player colors
	setupForm
		.querySelector("svg[color='red'][player='player1']")
		.dispatchEvent(new MouseEvent("click"));
	setupForm
		.querySelector("svg[color='blue'][player='player2']")
		.dispatchEvent(new MouseEvent("click"));
	// Start game button
	startGameButton.addEventListener("click", (e) => {
		e.preventDefault(); // prevent refresh
		const inputData = Object.fromEntries(new FormData(setupForm));
		game.setName(
			"player1",
			inputData.player1 !== ""
				? inputData.player1
				: `${text["setup"]["player"][game.getCurrentLang()]} 1`
		);
		game.setName(
			"player2",
			inputData.player2 !== ""
				? inputData.player2
				: `${text["setup"]["player"][game.getCurrentLang()]} 2`
		);
		setupContainer.classList.remove("show");
		document.getElementById("scorebar").classList.add("show");

		startGame();
	});

	// Warning if colors match
	function updateWarning(display = false) {
		setupForm.querySelector("[warning-text]").innerHTML = display
			? text["setup"]["warning"][game.getCurrentLang()]
			: "";
	}
	// Set player color
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

function stringSetup() {
	const lang = game.getCurrentLang();

	// Setup form
	setupForm.querySelector(
		"#currentLangSelect"
	).innerHTML = `${text["setup"]["currentLang"][lang]}`;
	setupForm.querySelector(
		"span#player1"
	).innerHTML = `${text["setup"]["player"][lang]} 1`;
	setupForm
		.querySelector("input[name='player1']")
		.setAttribute("placeholder", text["setup"]["name"][lang]);
	setupForm.querySelector(
		"span#player2"
	).innerHTML = `${text["setup"]["player"][lang]} 2`;
	setupForm
		.querySelector("input[name='player2']")
		.setAttribute("placeholder", text["setup"]["name"][lang]);
	setupForm.querySelector("#startGameButton").innerHTML =
		text["setup"]["startGameButton"][lang];

	// Game end
	restartButton.innerHTML = text["gameEnd"]["restartButton"][lang];
}

function startGame() {
	console.log(game); // test
	game.colorPlayers();
	game.colorScore();
	cellElements.forEach((cell) => {
		cell.setAttribute("mark", "");
		cell.innerHTML = "";
		cell.removeEventListener("click", handleClick);
		cell.addEventListener("click", handleClick, { once: true });
		cell.addEventListener("mouseenter", onHover);
		cell.addEventListener("mouseleave", offHover);
	});
	gameEnd.classList.remove("show");
	boardContainer.classList.remove("blur");
}

// Inject stylesheet for SVG coloring
function insertStylesheet(css) {
	const svgStyle = document.createElement("style");
	svgStyle.setAttribute("id", "svgStyle");
	svgStyle.innerHTML = css;
	document.head.appendChild(svgStyle);
}
function removeStylesheet() {
	document.head.removeChild(document.getElementById("svgStyle"));
}

function handleClick(e) {
	const cell = e.currentTarget; // clicked cell
	const currentClass = game.getCrossTurn() ? CROSS_CLASS : CIRCLE_CLASS;

	drawCell(cell, currentClass);

	if (checkWin(currentClass)) {
		const currentEmoji = game.getCrossTurn() ? "❌" : "⭕";
		gameEndText.innerHTML = `${currentEmoji} <em>${
			game.player1Turn ? game.getName("player1") : game.getName("player2")
		}</em> ${text["gameEnd"]["win"][game.getCurrentLang()]}!`;
		endGame();
		game[game.player1Turn ? "player1" : "player2"].wins++;
	} else if (checkDraw()) {
		gameEndText.innerHTML = `${
			text["gameEnd"]["draw"][game.getCurrentLang()]
		}`;
		endGame();
	} else {
		game.switchTurns();
	}
}

function onHover(e) {
	const cell = e.currentTarget;
	const currentClass = game.getCrossTurn() ? CROSS_CLASS : CIRCLE_CLASS;
	if (!cell.getAttribute("mark")) {
		drawCell(cell, currentClass, true);
	}
}
function offHover(e) {
	const cell = e.currentTarget;
	cell.querySelector("svg.hover").remove();
}

// Draw cell
function drawCell(cell, currentClass, hover = false) {
	if (!hover) {
		cell.setAttribute("mark", currentClass);
		cell.querySelector("svg.hover").remove();
	}
	cell.insertAdjacentHTML("afterbegin", passSvg(currentClass, hover));
}

// Draw SVG
function passSvg(currentClass, hover = false) {
	return `<svg class="draw ${currentClass} ${hover ? "hover" : ""}">
	<use href="#${currentClass}"></use>
	</svg>`;
}

function checkWin(currentClass) {
	return WIN_COMBINATIONS.some((combination) => {
		// at least 1 of the combinations
		return combination.every((index) => {
			return cellElements[index].getAttribute("mark") === currentClass;
		});
	});
}

function checkDraw() {
	return [...cellElements].every((cell) => {
		// NodeList to Array
		return cell.getAttribute("mark") !== "";
	});
}

function endGame() {
	gameEnd.classList.add("show");
	boardContainer.classList.add("blur");
}

function restartGame() {
	game.switchPlayers();
	removeStylesheet();
	startGame();
}
