/* global CodeMirror window document $ Set */
/* eslint-disable no-implicit-globals */

// CodeMirror
var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    theme: 'pastel-on-dark',
    lineWrapping: true
});

// CodeMirror theme selector
var input = document.getElementById('select-theme');

var font_data = {};
var filters = {
    'style': false,
    'rendering': false,
    'liga': false,
    'author': 'all',
    'name': ''
};

function selectTheme() {
    var theme = 'monokai';

    if (input.selectedIndex > -1) {
        theme = input.options[input.selectedIndex].innerHTML;
    }
    editor.setOption('theme', theme);
    document.cookie = 'theme=' + theme + ';max-age=172800';
}

// ProgrammingFonts font selector
function selectFont() {
    var font = window.location.hash.substring(1);

    if (font === '') {
        font = 'input';
        $('footer .subtitle').text('Test drive all the free programming fonts!');
    } else {
        $('footer .subtitle').html('Test drive <a rel="external" href="' + font_data[font].website + '">' + font_data[font].name + '!</a>');
    }

    if (font_data[font].rendering === 'bitmap') {
        $('.CodeMirror').addClass('no-smooth');
    } else {
        $('.CodeMirror').removeClass('no-smooth');
    }

    if (font === 'input') {
        $('pre').css({ fontFamily: 'Input Mono, monospace' });
        $('textarea').css({ fontFamily: 'Input Mono, monospace' });
        $('.CodeMirror').css({ fontFamily: 'Input Mono, monospace' });
    } else {
        $('pre').css({ fontFamily: font + ', monospace' });
        $('textarea').css({ fontFamily: font + ', monospace' });
        $('.CodeMirror').css({ fontFamily: font + ', monospace' });
    }
    $('#select-font [data-alias]').removeClass('active');
    $('#select-font [data-alias=\'' + font + '\']').addClass('active');

    document.cookie = 'font=' + font + ';max-age=172800';
}

window.onhashchange = selectFont;

function setSize() {
    var size = $('#size').val();

    $('.CodeMirror').css({ fontSize: size + 'px' });
    document.cookie = 'size=' + size + ';max-age=172800';
}
function setSpacing() {
    var spacing = $('#spacing').val();

    $('.CodeMirror').css({ lineHeight: spacing });
    document.cookie = 'spacing=' + spacing + ';max-age=172800';
}
function selectLanguage() {
    var lang = $('#select-language').val();

    editor.setOption('mode', lang.toLowerCase());
    document.cookie = 'language=' + lang + ';max-age=172800';
}
function setCounter(amount) {
    if (amount === 1) {
        $('h1 a:first-child').text(amount + ' Programming Font');
    } else {
        $('h1 a:first-child').text(amount + ' Programming Fonts');
    }
}

function applyFilters() {
    var count = 0;
    switch (filters.style) {
    case 'sans':
        $('[data-group="style"] [value="sans"]').addClass('selected');
        $('[data-group="style"] [value="serif"]').removeClass('selected');
        break;
    case 'serif':
        $('[data-group="style"] [value="sans"]').removeClass('selected');
        $('[data-group="style"] [value="serif"]').addClass('selected');
        break;
    default:
        $('[data-group="style"] [value="sans"]').removeClass('selected');
        $('[data-group="style"] [value="serif"]').removeClass('selected');
    }

    switch (filters.rendering) {
    case 'vector':
        $('[data-group="rendering"] [value="vector"]').addClass('selected');
        $('[data-group="rendering"] [value="bitmap"]').removeClass('selected');
        break;
    case 'bitmap':
        $('[data-group="rendering"] [value="vector"]').removeClass('selected');
        $('[data-group="rendering"] [value="bitmap"]').addClass('selected');
        break;
    default:
        $('[data-group="rendering"] [value="vector"]').removeClass('selected');
        $('[data-group="rendering"] [value="bitmap"]').removeClass('selected');
    }

    switch (filters.liga) {
    case 'yes':
        $('[data-group="liga"] [value="yes"]').addClass('selected');
        $('[data-group="liga"] [value="no"]').removeClass('selected');
        break;
    case 'no':
        $('[data-group="liga"] [value="yes"]').removeClass('selected');
        $('[data-group="liga"] [value="no"]').addClass('selected');
        break;
    default:
        $('[data-group="liga"] [value="yes"]').removeClass('selected');
        $('[data-group="liga"] [value="no"]').removeClass('selected');
    }

    $('.entry[data-alias]').each(function(iteration, element) {
        var data = font_data[$(element).data().alias];
        if (
            (!filters.style || data.style === filters.style) &&
            (!filters.rendering || data.rendering === filters.rendering) &&
            (!filters.liga || data.ligatures === false && filters.liga === 'no' || data.ligatures === true && filters.liga === 'yes') &&
            (filters.author === 'all' || data.author === filters.author) &&
            (!filters.name || data.name.toLowerCase().indexOf(filters.name) > -1)
        ) {
            $(element).removeClass('filtered-out');
            count++;
        } else {
            $(element).addClass('filtered-out');
        }
    });

    setCounter(count);
}

function renderSelectList() {
    var icon = '<svg class="octicon" viewBox="0 0 12 14" version="1.1" width="12" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>';
    var pinIcon = '<svg class="octicon octicon-pin" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 0 0 .86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 0 0-.86.34z"></path></svg>';
    var favoritesMap = {};
    var favorites = [];

    $('#select-font').empty();

    try {
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesMap = favorites.reduce(function(acc, alias) {
            acc[alias] = true;
            return acc;
        }, {});
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('could not render favorites', err);
    }

    $.getJSON('fonts.json', function(data) {
        var fonts = [];
        var authors = [];
        font_data = data;

        $.each(font_data, function(k, v) {
            var font_props = v;
            font_props.alias = k;
            fonts.push(v);
            if (authors.indexOf(v.author) < 0) {
                authors.push(v.author);
            }
        });

        authors.sort();

        $.each(authors, function(iteration, author) {
            $('#authors-list .other').append(
                '<option>' + author + '</option>'
            );
        });

        fonts.sort(function(a, b) {
            if (favoritesMap[a.alias] && !favoritesMap[b.alias]) {return -1;}
            if (!favoritesMap[a.alias] && favoritesMap[b.alias]) {return 1;}
            if (a.name.toLowerCase() < b.name.toLowerCase()) {return -1;}
            if (a.name.toLowerCase() > b.name.toLowerCase()) {return 1;}
            return 0;
        });

        $.each(fonts, function(k, v) {
            var liga_info = '';
            var render_info = '';

            if (v.ligatures) {
                liga_info = ', ligatures';
            }
            if (v.rendering === 'bitmap') {
                render_info = ', bitmap';
            }
            $('#select-font').append(
                '<div class="entry" data-alias="' + v.alias + '">' +
                '<a href="#' + v.alias + '">' +
                    '<span class="name">' + v.name + '</span>' +
                    '<span class="details">' + v.author + ' (' + v.year + ') — ' + v.style + render_info + liga_info + '</span>' +
                '</a>' +
                '<a class="favoritelink' + (favoritesMap[v.alias] ? ' pinned' : '') + '" onclick="toggleFavorite(\'' + v.alias + '\')">' +
                    pinIcon +
                '</a>' +
                '<a class="website" href="' + v.website + '" rel="external"> <span>Info & Download</span>' + icon + '</a></div>'
            );
        });
        selectFont();
        applyFilters();
    });
}

// eslint-disable-next-line no-unused-vars
function toggleFavorite(alias) {
    var favorites = [];
    try {
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.indexOf(alias) > -1) {
            favorites = favorites.filter(function(v) {
                return v !== alias;
            });
        } else {
            favorites.push(alias);
        }
        localStorage.setItem('favorites', JSON.stringify(Array.from(new Set(favorites))));
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('could not save favorite', err);
    }
    renderSelectList();
    return false;
}

function nextFont() {
    var activeEntry = document.querySelector('.entry.active');
    var next = activeEntry.nextSibling;
    if (next && next.matches('.entry')) {
        next.querySelector('a').click();
        next.scrollIntoView();
    }
}

function previousFont() {
    var activeEntry = document.querySelector('.entry.active');
    var next = activeEntry.previousSibling;
    if (next && next.matches('.entry')) {
        next.querySelector('a').click();
        next.scrollIntoView();
    }
}

function increaseFontSize() {
    var sizeEl = document.getElementById('size');
    sizeEl.value = Number(sizeEl.value) + 1;
    sizeEl.onchange();
}

function decreaseFontSize() {
    var sizeEl = document.getElementById('size');
    sizeEl.value = Number(sizeEl.value) - 1;
    sizeEl.onchange();
}

function toggleFilter(filter, group) {
    function toggleValue(name, value) {
        if (filters[name] === value) {
            filters[name] = false;
        } else {
            filters[name] = value;
        }
    }

    if (group === 'style') {
        toggleValue('style', filter);
    } else if (group === 'rendering') {
        toggleValue('rendering', filter);
    } else if (group === 'liga') {
        toggleValue('liga', filter);
    }

    applyFilters();
}

$(document).ready(function() {
    var cookieValueSpacing = document.cookie.replace(/(?:(?:^|.*;\s*)spacing\s*=\s*([^;]*).*$)|^.*$/, '$1');
    var cookieValueSize = document.cookie.replace(/(?:(?:^|.*;\s*)size\s*=\s*([^;]*).*$)|^.*$/, '$1');
    var cookieValueTheme = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*=\s*([^;]*).*$)|^.*$/, '$1');
    var cookieValueLanguage = document.cookie.replace(/(?:(?:^|.*;\s*)language\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (cookieValueSpacing !== '') {
        $('#spacing').val(cookieValueSpacing);
    }
    if (cookieValueSize !== '') {
        $('#size').val(cookieValueSize);
    }
    if (cookieValueTheme !== '') {
        $('#select-theme').val(cookieValueTheme);
    }
    if (cookieValueLanguage !== '') {
        $('#select-language').val(cookieValueLanguage);
    }

    renderSelectList();
    selectTheme();
    setSize();
    setSpacing();
    selectLanguage();

    $('#theme-next').click(function() {
        $('#select-theme :selected').next().prop('selected', true);
        selectTheme();
    });

    $('#theme-previous').click(function() {
        $('#select-theme :selected').prev().prop('selected', true);
        selectTheme();
    });

    $('#filters button').on('click', function(event) {
        var button = $(this);
        var button_group = button.parent().data().group;
        event.preventDefault();
        event.stopPropagation();
        toggleFilter(button.val(), button_group);
    });
    $('#authors-list').on('change', function() {
        filters.author = $(this).val();
        applyFilters();
    });
    $('#name-search').on('keyup', function() {
        filters.name = $(this).val().toLowerCase();
        applyFilters();
    });

    $('body').on('keydown', function(event) {
        if (
            event.target === document.querySelector('.select-list')
            && ! event.ctrlKey
            && ! event.altKey
            && ! event.metaKey
            && ! event.shiftKey
        ) {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                event.stopPropagation();
                previousFont();
                return;
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                event.stopPropagation();
                nextFont();
                return;
            }
        }

        if (event.ctrlKey || event.metaKey) {
            if (event.key === '-') {
                event.preventDefault();
                event.stopPropagation();
                decreaseFontSize();

            } else if (event.key === '=') {
                event.preventDefault();
                event.stopPropagation();
                increaseFontSize();

            }
        }
    });
});
