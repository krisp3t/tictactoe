import game from "./app.js";
export const text = {
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
			en: `${game.getCrossTurn() ? "❌" : "⭕"} wins!`,
			de: `${game.getCrossTurn() ? "❌" : "⭕"} gewinnt!`,
			sl: `${game.getCrossTurn() ? "❌" : "⭕"} je zmagal!`,
			hr: `${game.getCrossTurn() ? "❌" : "⭕"} je pobijedio!`,
			sr: `${game.getCrossTurn() ? "❌" : "⭕"} је победио!`,
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
