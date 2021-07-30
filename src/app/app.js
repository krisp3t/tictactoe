const cellElements = document.querySelectorAll("[data-cell]");
let crossTurn = true; // cross starts the game
const CROSS_CLASS = "cross"; // CSS classes
const CIRCLE_CLASS = "circle";

cellElements.forEach((cell) => {
	cell.addEventListener("click", handleClick, { once: true });
});

function handleClick(e) {
	const cell = e.currentTarget;
	const currentClass = crossTurn ? CROSS_CLASS : CIRCLE_CLASS;
	draw(cell, currentClass);
	switchTurns();
}

function draw(cell, currentClass) {
	cell.classList.add(currentClass);
}

function switchTurns() {
	crossTurn = !crossTurn;
}

function setHover() {}
