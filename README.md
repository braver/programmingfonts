Programming Fonts
================

Test drive programming fonts [online in your browser](https://www.programmingfonts.org/). The interactive counter part of the [Tumblr Blog](https://programmingfonts.tumblr.com).

ProgrammingFonts.org makes it easier to find monospaced fonts. All fonts in one place, with proper credits towards the creators. It's not a download portal, we don't track anything, it's strictly by nerds and designers for nerds and designers.

💬 Join the conversation, or recommend new fonts, on our [Discord server](https://discord.gg/feUp7rVs4Q)!

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
- The license needs to allow serving in a website, or an agreement with the font creators needs to be made. If available we add a license file along with the font files.
- Running `make` checks the json and builds the stylesheet. 

## Notable omissions

### Commercially licensed fonts

We've been able to license some commercial fonts for programmingfonts.org, but there are simply too many out there... including:
 
- Andale: https://learn.microsoft.com/en-us/typography/font-list/andale-mono
- Aperçu: https://www.colophon-foundry.org/typefaces/apercu
- Berkeley Mono: https://berkeleygraphics.com/typefaces/berkeley-mono/
- Consolas: https://learn.microsoft.com/en-us/typography/font-list/consolas
- Courier (New): https://learn.microsoft.com/en-us/typography/font-list/courier-new
- Dank Mono: https://philpl.gumroad.com/l/dank-mono
- Lucida Console: https://learn.microsoft.com/en-us/typography/font-list/lucida-console
- Menlo: https://en.wikipedia.org/wiki/Menlo_(typeface)
- Monaco: https://en.wikipedia.org/wiki/Monaco_(typeface)
- MonoLisa: https://www.monolisa.dev
- Native: https://fortfoundry.com/fonts/native
- Operator: https://www.typography.com/fonts/operator/overview
- PragmataPro: https://fsd.it/shop/fonts/pragmatapro/
- San Francisco Mono: https://developer.apple.com/fonts/

### Curious "Free" Fonts

To date we've been unable to find a reliable source of information or downloads for these fonts, although we know they're out there:

- Cruft
- Espresso Mono

### Bitmap FON files

Some bitmap fonts are only available in (Windows) FON files. Sometimes conversions to TTF are available, but they don't always work. Sadly we can't include these on the website:

- Dina: https://www.dcmembers.com/jibsen/download/61/
- Triskweline: http://www.netalive.org/tinkering/triskweline/

### Still to be added

- Ricty Diminished: https://github.com/edihbrandon/RictyDiminished (combines Inconsolata for Latin script with M+ for others)
- Sarasa-Gothic: https://github.com/be5invis/Sarasa-Gothic A CJK programming font based on Iosevka and Source Han Sans.
- P8: https://github.com/juanitogan/p8-programming-fonts


## Limitations

There are sometimes near infinite variations of certain fonts. Take for instance the variable weights and all the options of a configurable font like [Commit Mono](https://commitmono.com). Certain fonts also come with dozens of (OpenType) variations to change shapes of characters, zero styles, ligatures, etc. We hint at these possibilities in programmingfonts.org, but for details you really need to explore the websites of these fonts.

Therefore:

- We only include the basic 4 styles of any font to ensure correct rendering in the preview, but don't let you explore all the weights and variation. 
- Open type alternatives for zero style, and other options (e.g. all the different variations possible with [Input Mono](https://input.fontbureau.com)) are not exposed.
- Character set coverage and other valuable information, e.g. if a font has true italics, is not exposed. If you have specific use cases, known candidates for wide character set coverage include Noto, DejaVu and GNU Unifont, whereas M+ covers most CJK sets.
