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
let crossTurn;
let currentLang = "sr";
// CSS classes
const CROSS_CLASS = "cross";
const CIRCLE_CLASS = "circle";
// HTML elements
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const boardContainer = document.querySelector(".board-container");
const gameEnd = document.getElementById("gameEnd");
const gameEndText = document.querySelector("[data-game-end-text]");
const restartButton = document.getElementById("restartButton");
// SVG
function passSvg(currentClass) {
	return `<svg class="mark">
	<use href="#${currentClass}"></use>
	</svg>`;
}
// Game strings
const text = {
	gameEnd: {
		win: {
			en: `${crossTurn ? "❌" : "⭕"} wins!`,
			de: `${crossTurn ? "❌" : "⭕"} gewinnt!`,
			sl: `${crossTurn ? "❌" : "⭕"} je zmagal!`,
			hr: `${crossTurn ? "❌" : "⭕"} je pobijedio!`,
			sr: `${crossTurn ? "❌" : "⭕"} је победио!`,
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
startGame();
restartButton.addEventListener("click", startGame);
restartButton.innerHTML = text.gameEnd["restart"][currentLang];

function startGame() {
	crossTurn = true;
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
	board.classList.add(crossTurn ? CROSS_CLASS : CIRCLE_CLASS);
}

function handleClick(e) {
	const cell = e.currentTarget; // clicked cell
	const currentClass = crossTurn ? CROSS_CLASS : CIRCLE_CLASS;
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
	crossTurn = !crossTurn;
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
	gameEndText.innerHTML = text.gameEnd[draw ? "draw" : "win"][currentLang];
}
