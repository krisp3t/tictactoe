// Import SVG
function requireAll(r) {
	r.keys().forEach(r);
}
requireAll(require.context("./assets/", true, /\.svg$/)); // eslint-disable-line

import "./vendor.scss";
import { Dropdown } from "bootstrap"; // eslint-disable-line
