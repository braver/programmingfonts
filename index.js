/* global CodeMirror window document $ */
/* eslint-disable no-implicit-globals */

// CodeMirror
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	styleActiveLine: true,
	matchBrackets: true,
	theme: "pastel-on-dark",
	lineWrapping: true
});

// CodeMirror theme selector
var input = document.getElementById("select-theme");

function selectTheme() {
	var theme = "monokai";

	if (input.selectedIndex > -1) {
		theme = input.options[input.selectedIndex].innerHTML;
	}
	editor.setOption("theme", theme);
	document.cookie = "theme=" + theme + ";max-age=172800";
}

// ProgrammingFonts font selector
function selectFont() {
	var font = window.location.hash.substring(1);

	if (font === "") {
		font = "input";
	}

	if (font === "input") {
		$("pre").css({ fontFamily: "Input Mono, monospace" });
		$("textarea").css({ fontFamily: "Input Mono, monospace" });
		$(".CodeMirror").css({ fontFamily: "Input Mono, monospace" });
	} else {
		$("pre").css({ fontFamily: font + ", monospace" });
		$("textarea").css({ fontFamily: font + ", monospace" });
		$(".CodeMirror").css({ fontFamily: font + ", monospace" });
	}
	$("#select-font a[data-value]").removeClass("active");
	$("#select-font a[data-value='" + font + "']").addClass("active");

	document.cookie = "font=" + font + ";max-age=172800";
}

window.onhashchange = selectFont;

function setSize() {
	var size = $("#size").val();

	$(".CodeMirror").css({ fontSize: size + "px" });
	document.cookie = "size=" + size + ";max-age=172800";
}
function setSpacing() {
	var spacing = $("#spacing").val();

	$(".CodeMirror").css({ lineHeight: spacing });
	document.cookie = "spacing=" + spacing + ";max-age=172800";
}
function setAntialiasing() {
	if ($("#aliasing").is(":checked")) {
		$(".CodeMirror").removeClass("no-smooth");
		document.cookie = "antialiasing=smooth;max-age=172800";
	} else {
		$(".CodeMirror").addClass("no-smooth");
		document.cookie = "antialiasing=no-smooth;max-age=172800";
	}
}
function selectLanguage() {
	var lang = $("#select-language").val();

	editor.setOption("mode", lang.toLowerCase());
	document.cookie = "language=" + lang + ";max-age=172800";
}

function renderSelectList() {
	$("#select-font").empty();

	var icon = '<svg class="octicon" viewBox="0 0 12 14" version="1.1" width="12" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>';

	var favoritesMap = {};
	try {
		var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
		favoritesMap = favorites.reduce(function(acc, alias) {
			acc[alias] = true;
			return acc;
		}, {});
	} catch (err) {
		console.error('could not render favorites', err);
	}

	$.getJSON("fonts.json", function(data) {
		data.sort(function(a, b) {
			if (favoritesMap[a.alias] && !favoritesMap[b.alias]) return -1;
			if (!favoritesMap[a.alias] && favoritesMap[b.alias]) return 1;
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			return 0;
		});
		$.each(data, function(k, v) {
			var liga_info = "";
			var render_info = "";

			if (v.ligatures) {
				liga_info = ", ligatures";
			}
			if (v.rendering === "bitmap") {
				render_info = ", bitmap";
			}
			$("#select-font").append(
				"<div class='entry'>" +
				"<a href='#" + v.alias + "' data-value=\"" + v.alias + "\">" +
					"<a class='favoritelink' onclick=\"toggleFavorite('" + v.alias + "')\"> <span>" +
					(favoritesMap[v.alias] ? "♥︎" :  "♡") + "</span></a>" +
					"<span class='name'>" + v.name + "</span>" +
					"<span class='details'>" + v.author + " (" + v.year + ") — " + v.style + render_info + liga_info + "</span>" +
				"</a>" +
				"<a class='website' href='" + v.website + "' rel=external> <span>Info & Download</span>" + icon + "</a></div>"
			);
		});
		selectFont();
	});
}

function toggleFavorite(alias) {
	try {
		var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
		if (favorites.indexOf(alias) > -1) {
			favorites = favorites.filter(function(v) {
				return v !== alias;
			})
		} else {
			favorites.push(alias);
		}
		localStorage.setItem('favorites', JSON.stringify(Array.from(new Set(favorites))));
	} catch (err) {
		console.error('could not save favorite', err);
	}
	renderSelectList();
}

$(document).ready(function() {
	var cookieValueSpacing = document.cookie.replace(/(?:(?:^|.*;\s*)spacing\s*=\s*([^;]*).*$)|^.*$/, "$1");
	var cookieValueSize = document.cookie.replace(/(?:(?:^|.*;\s*)size\s*=\s*([^;]*).*$)|^.*$/, "$1");
	var cookieValueAntialiasing = document.cookie.replace(/(?:(?:^|.*;\s*)antialiasing\s*=\s*([^;]*).*$)|^.*$/, "$1");
	var cookieValueTheme = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*=\s*([^;]*).*$)|^.*$/, "$1");
	var cookieValueLanguage = document.cookie.replace(/(?:(?:^|.*;\s*)language\s*=\s*([^;]*).*$)|^.*$/, "$1");

	if (cookieValueSpacing !== "") {
		$("#spacing").val(cookieValueSpacing);
	}
	if (cookieValueSize !== "") {
		$("#size").val(cookieValueSize);
	}
	if (cookieValueAntialiasing === "smooth") {
		$("#aliasing").prop("checked", true);
	} else if (cookieValueAntialiasing === "no-smooth") {
		$("#aliasing").prop("checked", false);
	}
	if (cookieValueTheme !== "") {
		$("#select-theme").val(cookieValueTheme);
	}
	if (cookieValueLanguage !== "") {
		$("#select-language").val(cookieValueLanguage);
	}

	selectTheme();
	setSize();
	setSpacing();
	setAntialiasing();
	selectLanguage();
	renderSelectList();

	$("#theme-next").click(function() {
		$("#select-theme :selected").next().prop("selected", true);
		selectTheme();
	});

	$("#theme-previous").click(function() {
		$("#select-theme :selected").prev().prop("selected", true);
		selectTheme();
	});
});
