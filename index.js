// CodeMirror
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	styleActiveLine: true,
	matchBrackets: true,
	theme: "pastel-on-dark",
	lineWrapping: true
});

function applyColors() {
	$("body").css("color", $(".CodeMirror .cm-def").css("color"));
	$("body").css("background", $(".CodeMirror").css("background-color"));
}

// CodeMirror theme selector
var input = document.getElementById("select-theme");
function selectTheme() {
	var theme = input.options[input.selectedIndex].innerHTML;
	editor.setOption("theme", theme);
	applyColors();
}

var choice = document.location.search &&
	decodeURIComponent(document.location.search.slice(1));

if (choice) {
	input.value = choice;
	editor.setOption("theme", choice);
}

// ProgrammingFonts font selector
function selectFont() {
	var font = $("#select-font").val();

	if (font === "input") {
		$("pre").css({ fontFamily: "Input Mono, monospace" });
		$("textarea").css({ fontFamily: "Input Mono, monospace" });
		$(".CodeMirror").css({ fontFamily: "Input Mono, monospace" });
	} else {
		$("pre").css({ fontFamily: font + ", monospace" });
		$("textarea").css({ fontFamily: font + ", monospace" });
		$(".CodeMirror").css({ fontFamily: font + ", monospace" });
	}

	$("#font-info p").hide();
	$("." + font).show();
	document.cookie = "font=" + font;
	updateHash();
}

function setSize() {
	var size = $("#size").val();
	$(".CodeMirror").css({ fontSize: size + "px" });
	document.cookie = "size=" + size;
}
function setSpacing() {
	var spacing = $("#spacing").val();
	$(".CodeMirror").css({ lineHeight: spacing });
	document.cookie = "spacing=" + spacing;
}
function setAntialiasing() {
	if ($("#aliasing").is(":checked")) {
		$(".CodeMirror").removeClass("no-smooth");
		document.cookie = "antialiasing=smooth";
	} else {
		$(".CodeMirror").addClass("no-smooth");
		document.cookie = "antialiasing=no-smooth";
	}
}
function selectLanguage() {
	editor.setOption("mode", $("#select_language").val().toLowerCase());
}

function updateHash(){
	var newHash = '#' + $("#select-font").val();
	if(history.pushState) {
		history.pushState(null, null, newHash);
	}
	else {
		location.hash = newHash;
	}
}

$(document).ready(function(){
	selectTheme();
	applyColors();

	var cookieValueSpacing = document.cookie.replace(/(?:(?:^|.*;\s*)spacing\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	var cookieValueSize = document.cookie.replace(/(?:(?:^|.*;\s*)size\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	var cookieValueAntialiasing = document.cookie.replace(/(?:(?:^|.*;\s*)antialiasing\s*\=\s*([^;]*).*$)|^.*$/, "$1");

	if (cookieValueSpacing !== "") {
		$("#spacing").val(cookieValueSpacing);
	}
	if (cookieValueSize !== "") {
		$("#size").val(cookieValueSize);
	}
	if (cookieValueAntialiasing === "smooth") {
		$("#aliasing").prop('checked', true);
	} else if (cookieValueAntialiasing === "no-smooth") {
		$("#aliasing").prop('checked', false);
	}

	setSize();
	setSpacing();
	setAntialiasing();

	var font_aliases = [];
	$.getJSON("fonts.json", function(data) {

		$.each(data, function(k,v) {
			font_aliases.push(v.alias);
			$("#select-font").append("<option value=\"" + v.alias + "\">" + v.name + "</option>");

			if (typeof v.year === "undefined") {
				yearString = "";
			} else {
				yearString = " (" + v.year + ")";
			}

			$("#font-info").append(
				"<p class=\"" + v.alias + "\"> " +
				"<a href=\""+ v.website + "\" rel=\"external\">" + v.author + "</a>" + yearString +
				"</p>"
			);
		});

		var hash = window.location.hash.substring(1);
		if(hash){
			$("#select-font").val(hash);
		}
		else {
			$("#select-font").val('input'); // default to this awesome font
		}

		selectFont();
	});

	$("#next").click(function() {
		$("#select-font :selected").next().prop("selected", true);
		selectFont();
	});

	$("#previous").click(function() {
		$("#select-font :selected").prev().prop("selected", true);
		selectFont();
	});

	$("#theme-next").click(function() {
		$("#select-theme :selected").next().prop("selected", true);
		selectTheme();
	});

	$("#theme-previous").click(function() {
		$("#select-theme :selected").prev().prop("selected", true);
		selectTheme();
	});
});
