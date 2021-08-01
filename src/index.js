import "normalize.css";
import "./main.scss";
import "./app/app.js";

// Import SVG
function requireAll(r) {
	r.keys().forEach(r);
}

requireAll(require.context("./assets/", true, /\.svg$/)); // eslint-disable-line
