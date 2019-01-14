// CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: 'monokai',
  lineWrapping: true,
});

// parcel inlines the fonts
import fonts from './fonts.json';

const fontTemplate = document.getElementById('font-template');

// Create list
for (const font of fonts) {
  const clone = document.importNode(fontTemplate.content, true);
  const button = clone.querySelector('button');
  if (font.alias == 'input mono') {
    button.classList.add('active');
  }
  button.setAttribute('data-value', font.alias);
  button.onclick = selectFont.bind(null, font.alias);
  clone.querySelector('.name').textContent = font.name;

  const extras = [
    font.style,
    font.ligatures && 'ligatures',
    font.rendering == 'bitmap' ? 'bitmap' : null,
  ]
    .filter(value => !!value)
    .join(', ');

  clone.querySelector('.details').textContent = `${font.author} (${
    font.year
  }) - ${extras}`;
  clone.querySelector('.website').href = font.website;
  document.getElementById('select-font').appendChild(clone);
}

const mirrorElement = document.querySelector('.CodeMirror');
// Set the defaults
mirrorElement.style.fontSize = '16px';
mirrorElement.style.lineHeight = 1.4;

// Set size
document.getElementById('size').onchange = ({ target: { value } }) => {
  mirrorElement.style.fontSize = value + 'px';
};

function selectFont(font) {
  document.querySelector('pre').style.fontFamily = `${font}, monospace`;
  document.querySelector('textarea').style.fontFamily = `${font}, monospace`;
  mirrorElement.style.fontFamily = `${font}, monospace`;
  document
    .querySelector('#select-font button.active')
    .classList.remove('active');
  document
    .querySelector(`#select-font button[data-value='${font}']`)
    .classList.add('active');
}

// Select theme
document.getElementById('select-theme').onchange = ({ target: { value } }) => {
  editor.setOption('theme', value);
};

// Set spacing
document.getElementById('spacing').onchange = ({ target: { value } }) => {
  mirrorElement.style.lineHeight = value;
};

// Set antialiasing
document.getElementById('aliasing').onchange = () => {
  mirrorElement.classList.toggle('no-smooth');
};

// Set Language
document.getElementById('select-language').onchange = ({
  target: { value },
}) => {
  editor.setOption('mode', value.toLowerCase());
};

document.getElementById('theme-next').onclick = () => {
  const nextElement = document.querySelector('#select-font button.active')
    .parentNode.nextElementSibling;
  if (nextElement) nextElement.querySelector('button').onclick();
};

document.getElementById('theme-previous').onclick = () => {
  const previousElement = document.querySelector('#select-font button.active')
    .parentNode.previousElementSibling;
  if (previousElement != fontTemplate)
    previousElement.querySelector('button').onclick();
};
