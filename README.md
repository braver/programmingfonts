Programming Fonts
================

Test drive programming fonts [online in your browser](https://www.programmingfonts.org/). The interactive counter part of the [Tumblr Blog](https://programmingfonts.tumblr.com).

ProgrammingFonts.org makes it easier to find monospaced fonts. All fonts in one place, with proper credits towards the creators. It's not a download portal, we don't track anything, it's strictly by nerds and designers for nerds and designers.

## Buy me a coffee 

☕️👌🏻

This website is powered by coffee. No ads, no tracking, no monetization. We do have some costs for domain name. And coffee. Gallons of coffee.
Please feel free to make a little [donation via PayPal](https://paypal.me/koenlageveen) to keep this labour of love running. It's much appreciated!

## Project layout / contributing

- All information about the fonts is stored in [fonts.json](https://github.com/braver/programmingfonts/blob/gh-pages/fonts.json).
  - Which adheres to [a schema](https://github.com/braver/programmingfonts/blob/gh-pages/fonts-schema.json).
- Font files are stored in [fonts/resources](https://github.com/braver/programmingfonts/tree/gh-pages/fonts/resources).
  - We store only 4 variants (if available), in `.woff2` format (if available): regular, italic, bold, bold+italic
- All font files (and directories) are normalized to lowercase, without `-mono` unless it's really part of the name.
- The [fonts.less](https://github.com/braver/programmingfonts/blob/gh-pages/fonts/stylesheets/fonts.less) registers the variants for each font "alias" and is used to generate the stylesheets.
- The license needs to allow serving in a website, or an agreement with the font creators needs to be made. If available we add the license along with the font files.
- Running `npm install && npm run test` checks the json and builds the stylesheet. 

## Todo's

There are some limitations to the current approach. For instance, we only load the default set for each font. So, mostly:

- It' currently not possible to explore different weights (e.g. Source Code Pro Light). 
- Open type alternatives for zero style, and other options (e.g. all the different variations possible with [Input Mono](https://input.fontbureau.com)) are not exposed.
- I would be nice to include more commercial fonts. Creators need to eat too, and not all the best fonts are open source. However, it is not always possible to arrange a license for usage of the font in this website.
- Character set coverage and other valuable information, e.g. if a font has true italics, is not exposed.
- Background info on each font can usually be found in the blog (ongoing project: adding this to the `description` property for each font).
