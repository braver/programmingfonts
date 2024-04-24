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
- The license needs to allow serving in a website, or an agreement with the font creators needs to be made. If available we add a license file along with the font files.
- Running `make` checks the json and builds the stylesheet. 
- Run `python3 listing.py` to print an updated list of all the fonts, be sure to update this README with your addition.

## Notable omissions

A complete list of fonts in this project is all the way at the bottom of this README. However, some fonts are not included in the project:

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


## Limitations of this project

There are sometimes near infinite variations of certain fonts. Take for instance the variable weights and all the options of a configurable font like [Commit Mono](https://commitmono.com). Certain fonts also come with dozens of (OpenType) variations to change shapes of characters, zero styles, ligatures, etc. We hint at these possibilities in programmingfonts.org, but for details you really need to explore the websites of these fonts.

Therefore:

- We only include the basic 4 styles of any font to ensure correct rendering in the preview, but don't let you explore all the weights and variation. 
- Open type alternatives for zero style, and other options (e.g. all the different variations possible with [Input Mono](https://input.fontbureau.com)) are not exposed.
- Character set coverage and other valuable information, e.g. if a font has true italics, is not exposed. If you have specific use cases, known candidates for wide character set coverage include Noto, DejaVu and GNU Unifont, whereas M+ covers most CJK sets.


## All the fonts

- [Agave](https://github.com/agarick/agave) _MIT_ ([view](https://www.programmingfonts.org/#agave))
- [Anka/Coder](https://github.com/loafer-mka/anka-coder-fonts) _SIL OFL_ ([view](https://www.programmingfonts.org/#anka-coder))
- [Anonymous Pro](http://www.marksimonson.com/fonts/view/anonymous-pro) _SIL OFL_ ([view](https://www.programmingfonts.org/#anonymous-pro))
- [APL2741](http://apl385.com/fonts/index.htm) _public domain_ ([view](https://www.programmingfonts.org/#apl2741))
- [APL385](http://apl385.com/fonts/index.htm) _public domain_ ([view](https://www.programmingfonts.org/#apl385))
- [AudioLink Mono](https://audiolink.dev) _SIL OFL_ ([view](https://www.programmingfonts.org/#audio-link))
- [Aurulent Sans Mono](https://www.fontsquirrel.com/fonts/Aurulent-Sans-Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#aurulent))
- [Average Mono](http://openfontlibrary.org/en/font/average-mono) _GNU GPL_ ([view](https://www.programmingfonts.org/#average))
- [Azeret Mono](https://github.com/displaay/Azeret) _SIL OFL_ ([view](https://www.programmingfonts.org/#azeret))
- [B612 Mono](https://github.com/polarsys/b612) _SIL OFL_ ([view](https://www.programmingfonts.org/#b612-mono))
- [Bedstead](https://bjh21.me.uk/bedstead/) _public domain_ ([view](https://www.programmingfonts.org/#bedstead))
- [BigBlue Terminal](https://int10h.org/blog/2015/12/bigblue-terminal-oldschool-fixed-width-font/) _CC BY-SA 4.0_ ([view](https://www.programmingfonts.org/#bigblue-terminal))
- [Binchotan Sharp](https://rvklein.me/proj/binchotan/) _SIL OFL_ ([view](https://www.programmingfonts.org/#binchotan-sharp))
- [Bitstream Vera Sans Mono](http://www.fontsquirrel.com/fonts/Bitstream-Vera-Sans-Mono) _Bitstream Vera_ ([view](https://www.programmingfonts.org/#bitstream-vera))
- [Borg Sans Mono](https://github.com/marnen/borg-sans-mono) _Apache_ ([view](https://www.programmingfonts.org/#borg-sans-mono))
- [BPmono](http://www.fontsquirrel.com/fonts/BPmono) _CC BY-ND 3.0_ ([view](https://www.programmingfonts.org/#bpmono))
- [Bront DejaVu Sans Mono](https://github.com/chrismwendt/bront) _Bitstream Vera_ ([view](https://www.programmingfonts.org/#bront-dejavu))
- [Bront Ubuntu Mono](https://github.com/chrismwendt/bront) _none_ ([view](https://www.programmingfonts.org/#bront-ubuntu))
- [CamingoCode](http://www.janfromm.de/typefaces/camingomono/camingocode) _CC BY-ND 3.0_ ([view](https://www.programmingfonts.org/#camingocode))
- [Cartograph](https://connary.com/cartograph.html) _commercial_ ([view](https://www.programmingfonts.org/#cartograph))
- [Cascadia Code](https://github.com/microsoft/cascadia-code) _SIL OFL_ ([view](https://www.programmingfonts.org/#cascadia-code))
- [Chivo Mono](https://www.omnibus-type.com/variable-fonts/#chivo-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#chivo))
- [Computer Modern Unicode Typewriter](https://cm-unicode.sourceforge.io) _SIL OFL_ ([view](https://www.programmingfonts.org/#cm-unicode))
- [Code New Roman](https://fontlibrary.org/en/font/code-new-roman) _SIL OFL_ ([view](https://www.programmingfonts.org/#code-new-roman))
- [Comic Mono](https://dtinth.github.io/comic-mono-font/) _MIT_ ([view](https://www.programmingfonts.org/#comic-mono))
- [Comic Shanns](https://github.com/shannpersand/comic-shanns) _MIT_ ([view](https://www.programmingfonts.org/#comic-shanns))
- [Commit Mono](https://commitmono.com) _SIL OFL_ ([view](https://www.programmingfonts.org/#commit-mono))
- [Consolamono](http://openfontlibrary.org/en/font/consolamono) _SIL OFL_ ([view](https://www.programmingfonts.org/#consolamono))
- [Courier Prime](https://quoteunquoteapps.com/courierprime) _SIL OFL_ ([view](https://www.programmingfonts.org/#courier-prime))
- [Courier Prime Code](https://quoteunquoteapps.com/courierprime) _SIL OFL_ ([view](https://www.programmingfonts.org/#courier-prime-code))
- [Courier Prime Sans](https://quoteunquoteapps.com/courierprime) _SIL OFL_ ([view](https://www.programmingfonts.org/#courier-prime-sans))
- [Cousine](http://www.fontsquirrel.com/fonts/cousine) _Apache_ ([view](https://www.programmingfonts.org/#cousine))
- [Cozette](https://github.com/slavfox/Cozette) _MIT_ ([view](https://www.programmingfonts.org/#cozette))
- [Cutive Mono](http://www.google.com/fonts/specimen/Cutive+Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#cutive))
- [D2Coding](https://github.com/naver/d2codingfont) _SIL OFL_ ([view](https://www.programmingfonts.org/#d2coding))
- [DaddyTimeMono](https://github.com/BourgeoisBear/DaddyTimeMono) _SIL OFL_ ([view](https://www.programmingfonts.org/#daddytimemono))
- [DejaVu Mono](https://dejavu-fonts.github.io) _Bitstream Vera_ ([view](https://www.programmingfonts.org/#dejavu))
- [DM Mono](https://fonts.google.com/specimen/DM+Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#dm-mono))
- [Drafting* Mono](https://indestructibletype.com/Drafting/) _SIL OFL_ ([view](https://www.programmingfonts.org/#drafting))
- [Droid Sans](https://fonts.google.com/specimen/Droid+Sans) _Apache_ ([view](https://www.programmingfonts.org/#droid-sans))
- [Edlo](https://github.com/ehamiter/Edlo) _SIL OFL_ ([view](https://www.programmingfonts.org/#edlo))
- [Effects Eighty](http://openfontlibrary.org/en/font/effects-eighty) _SIL OFL_ ([view](https://www.programmingfonts.org/#effects-eighty))
- [Ellograph](https://connary.com/ellograph.html) _commercial_ ([view](https://www.programmingfonts.org/#ellograph))
- [Envy Code B](https://damieng.com/blog/2006/11/06/envy-code-b-font-available-in-ttf-format/) _none_ ([view](https://www.programmingfonts.org/#envy-code-b))
- [Envy Code R](https://damieng.com/blog/2008/05/26/envy-code-r-preview-7-coding-font-released) _SIL OFL_ ([view](https://www.programmingfonts.org/#envy-code-r))
- [Fairfax](http://www.kreativekorp.com/software/fonts/fairfax.shtml) _SIL OFL_ ([view](https://www.programmingfonts.org/#fairfax))
- [Fairfax HD](http://www.kreativekorp.com/software/fonts/fairfaxhd.shtml) _SIL OFL_ ([view](https://www.programmingfonts.org/#fairfax-hd))
- [Fairfax Hax HD](http://www.kreativekorp.com/software/fonts/fairfaxhd.shtml) _SIL OFL_ ([view](https://www.programmingfonts.org/#fairfax-hd-hax))
- [Fairfax Serif](http://www.kreativekorp.com/software/fonts/fairfax.shtml) _SIL OFL_ ([view](https://www.programmingfonts.org/#fairfax-serif))
- [Fantasque Sans Mono](https://github.com/belluzj/fantasque-sans) _SIL OFL_ ([view](https://www.programmingfonts.org/#fantasque-sans))
- [Fifteen](http://openfontlibrary.org/en/font/fifteen) _SIL OFL_ ([view](https://www.programmingfonts.org/#fifteen))
- [Fira Mono](https://github.com/mozilla/Fira) _SIL OFL_ ([view](https://www.programmingfonts.org/#fira))
- [Fira Code](https://github.com/tonsky/FiraCode) _SIL OFL_ ([view](https://www.programmingfonts.org/#firacode))
- [Fixedsys](https://web.archive.org/web/20160316105117/http://www.moviecorner.de/en/font-fixedsys-ttf/description) _GNU GPL_ ([view](https://www.programmingfonts.org/#fixedsys))
- [Fixedsys with Ligatures](https://github.com/kika/fixedsys) _public domain_ ([view](https://www.programmingfonts.org/#fixedsys-ligatures))
- [3270](https://github.com/rbanffy/3270font) __ ([view](https://www.programmingfonts.org/#font3270))
- [Fragment Mono](https://github.com/weiweihuanghuang/fragment-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#fragment-mono))
- [Generic Mono](http://luc.devroye.org/fonts-75172.html) _SIL OFL_ ([view](https://www.programmingfonts.org/#generic))
- [Geist](https://vercel.com/font/mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#geist))
- [Gintronic](https://markfromberg.com/projects/gintronic/) _commercial_ ([view](https://www.programmingfonts.org/#gintronic))
- [GNU Freefont](https://www.gnu.org/software/freefont/) _GNU GPL_ ([view](https://www.programmingfonts.org/#gnu-freefont))
- [Go Mono](https://blog.golang.org/go-fonts) _MIT_ ([view](https://www.programmingfonts.org/#go-mono))
- [Gohufont 11](https://font.gohu.org) _WTFPL_ ([view](https://www.programmingfonts.org/#gohufont-11))
- [Gohufont 14](https://font.gohu.org) _WTFPL_ ([view](https://www.programmingfonts.org/#gohufont-14))
- [Hack](https://github.com/chrissimpkins/Hack) _MIT_ ([view](https://www.programmingfonts.org/#hack))
- [Hasklig](https://github.com/i-tu/Hasklig) _SIL OFL_ ([view](https://www.programmingfonts.org/#hasklig))
- [Hermit](https://pcaro.es/p/hermit/) _SIL OFL_ ([view](https://www.programmingfonts.org/#hermit))
- [Heterodox Mono](https://github.com/hckiang/font-new-heterodox-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#heterodox-mono))
- [iA Writer Mono](https://ia.net/topics/a-typographic-christmas) _SIL OFL_ ([view](https://www.programmingfonts.org/#ia-writer-mono))
- [IBM VGA 9x16](https://int10h.org/oldschool-pc-fonts/fontlist/font?ibm_vga_9x16) _CC BY-SA 4.0_ ([view](https://www.programmingfonts.org/#ibm-vga))
- [Inconsolata](https://levien.com/type/myfonts/inconsolata.html) _SIL OFL_ ([view](https://www.programmingfonts.org/#inconsolata))
- [Inconsolata-g](http://leonardo-m.livejournal.com/77079.html) _SIL OFL_ ([view](https://www.programmingfonts.org/#inconsolata-g))
- [InconsolataGo](https://levien.com/type/myfonts/inconsolata.html) _SIL OFL_ ([view](https://www.programmingfonts.org/#inconsolata-go))
- [Inconsolata OTF](https://levien.com/type/myfonts/inconsolata.html) _SIL OFL_ ([view](https://www.programmingfonts.org/#inconsolata-otf))
- [Indicate Mono](https://jonastype.com/indicate-mono) _commercial_ ([view](https://www.programmingfonts.org/#indicate))
- [Input](http://input.fontbureau.com) _commercial_ ([view](https://www.programmingfonts.org/#input))
- [Intel One Mono](https://github.com/intel/intel-one-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#intel-one-mono))
- [Iosevka](http://be5invis.github.io/Iosevka/) _SIL OFL_ ([view](https://www.programmingfonts.org/#iosevka))
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) _SIL OFL_ ([view](https://www.programmingfonts.org/#jetbrainsmono))
- [JuliaMono](https://juliamono.netlify.app) _SIL OFL_ ([view](https://www.programmingfonts.org/#julia-mono))
- [Latin Modern Mono](http://www.gust.org.pl/gust/projects/e-foundry/latin-modern) _GUST font license_ ([view](https://www.programmingfonts.org/#latin-modern))
- [League Mono](https://www.tylerfinck.com/leaguemono/) _SIL OFL_ ([view](https://www.programmingfonts.org/#league))
- [Lekton](http://www.fontsquirrel.com/fonts/lekton) _SIL OFL_ ([view](https://www.programmingfonts.org/#lekton))
- [Liberation Mono](https://www.fontsquirrel.com/fonts/liberation-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#liberation))
- [Lilex](https://github.com/mishamyrt/Lilex) _SIL OFL_ ([view](https://www.programmingfonts.org/#lilex))
- [Lotion](https://font.nina.coffee) _SIL OFL_ ([view](https://www.programmingfonts.org/#lotion))
- [Luculent](http://eastfarthing.com/luculent/) _SIL OFL_ ([view](https://www.programmingfonts.org/#luculent))
- [Luxi Mono](http://www.fontsquirrel.com/fonts/Luxi-Mono) _Luxi License_ ([view](https://www.programmingfonts.org/#luxi))
- [Maple](https://github.com/subframe7536/maple-font) _SIL OFL_ ([view](https://www.programmingfonts.org/#maple))
- [Martian Mono](https://github.com/evilmartians/mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#martian-mono))
- [Mensch](https://robey.lag.net/2010/06/21/mensch-font.html) _Bitstream Vera_ ([view](https://www.programmingfonts.org/#mensch))
- [Meslo](https://github.com/andreberg/Meslo-Font) _Bitstream Vera_ ([view](https://www.programmingfonts.org/#meslo))
- [Monaspace Argon](https://monaspace.githubnext.com/) _SIL OFL_ ([view](https://www.programmingfonts.org/#monaspace-argon))
- [Monaspace Krypton](https://monaspace.githubnext.com/) _SIL OFL_ ([view](https://www.programmingfonts.org/#monaspace-krypton))
- [Monaspace Neon](https://monaspace.githubnext.com/) _SIL OFL_ ([view](https://www.programmingfonts.org/#monaspace-neon))
- [Monaspace Radon](https://monaspace.githubnext.com/) _SIL OFL_ ([view](https://www.programmingfonts.org/#monaspace-radon))
- [Monaspace Xenon](https://monaspace.githubnext.com/) _SIL OFL_ ([view](https://www.programmingfonts.org/#monaspace-xenon))
- [Monocraft](https://github.com/IdreesInc/Monocraft) _SIL OFL_ ([view](https://www.programmingfonts.org/#monocraft))
- [Monoflow](https://finaltype.de/en/projects/monoflow) _commercial_ ([view](https://www.programmingfonts.org/#monoflow))
- [Monofoki](https://github.com/datMaffin/monofoki) _SIL OFL_ ([view](https://www.programmingfonts.org/#monofoki))
- [Monofur](http://www.dafont.com/monofur.font) _freeware_ ([view](https://www.programmingfonts.org/#monofur))
- [Monoid](http://larsenwork.com/monoid/) _MIT_ ([view](https://www.programmingfonts.org/#monoid))
- [Mononoki](https://github.com/madmalik/mononoki) _SIL OFL_ ([view](https://www.programmingfonts.org/#mononoki))
- [M PLUS Code](https://mplusfonts.github.io) _SIL OFL_ ([view](https://www.programmingfonts.org/#mplus))
- [Nanum Gothic Coding](https://github.com/naver/nanumfont) _SIL OFL_ ([view](https://www.programmingfonts.org/#nanum-gothic-coding))
- [NotCourierSans](http://www.fontsquirrel.com/fonts/NotCourierSans) _GNU GPL_ ([view](https://www.programmingfonts.org/#notcouriersans))
- [Noto Mono](https://www.google.com/get/noto/) _SIL OFL_ ([view](https://www.programmingfonts.org/#noto))
- [Nova Mono](http://www.google.com/fonts/specimen/Nova+Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#nova))
- [Office Code Pro](https://github.com/nathco/Office-Code-Pro) _SIL OFL_ ([view](https://www.programmingfonts.org/#office-code-pro))
- [OpenDyslexic Mono](https://www.opendyslexic.org) _SIL OFL_ ([view](https://www.programmingfonts.org/#opendyslexic))
- [Overpass Mono](http://overpassfont.org) _SIL OFL_ ([view](https://www.programmingfonts.org/#overpass))
- [0xProto](https://github.com/0xType/0xProto) _SIL OFL_ ([view](https://www.programmingfonts.org/#oxproto))
- [Oxygen Mono](http://www.google.com/fonts/specimen/Oxygen+Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#oxygen))
- [IBM Plex Mono](https://github.com/IBM/plex) _SIL OFL_ ([view](https://www.programmingfonts.org/#plex-mono))
- [Press Start 2P](https://github.com/codeman38/PressStart2P) __ ([view](https://www.programmingfonts.org/#press-start-2p))
- [Profont](http://tobiasjung.name/profont/) _MIT_ ([view](https://www.programmingfonts.org/#profont))
- [Proggy Clean](https://github.com/bluescan/proggyfonts/) _MIT_ ([view](https://www.programmingfonts.org/#proggy-clean))
- [Proggy Vector](https://github.com/bluescan/proggyfonts/) _MIT_ ([view](https://www.programmingfonts.org/#proggy-vector))
- [PT Mono](https://www.paratype.com/fonts/pt/pt-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#pt))
- [Quinze](http://openfontlibrary.org/en/font/fifteen) _SIL OFL_ ([view](https://www.programmingfonts.org/#quinze))
- [Recursive](https://www.recursive.design) _SIL OFL_ ([view](https://www.programmingfonts.org/#recursive-mono-linear))
- [Reddit Sans Mono](https://redditsans.s-ings.com) _SIL OFL_ ([view](https://www.programmingfonts.org/#reddit-sans))
- [Red Hat Mono](https://www.redhat.com/en/about/brand/standards/typography) _SIL OFL_ ([view](https://www.programmingfonts.org/#redhat))
- [Roboto Mono](https://www.google.com/fonts/specimen/Roboto+Mono) _Apache_ ([view](https://www.programmingfonts.org/#roboto))
- [saxMono](http://www.fontsquirrel.com/fonts/saxMono) _freeware_ ([view](https://www.programmingfonts.org/#sax))
- [Scientifica](https://github.com/nerdypepper/scientifica) _SIL OFL_ ([view](https://www.programmingfonts.org/#scientifica))
- [Serious Sans](https://kabeech.github.io/serious-sans/) _MIT_ ([view](https://www.programmingfonts.org/#serious-sans))
- [Share Tech Mono](http://www.google.com/fonts/specimen/Share+Tech+Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#share-tech))
- [SK Modernist Mono](https://seankanedesign.gumroad.com/l/sk-modernist) _commercial_ ([view](https://www.programmingfonts.org/#sk-modernist))
- [Sometype Mono](http://monospacedfont.com/) _SIL OFL_ ([view](https://www.programmingfonts.org/#sometype-mono))
- [Sono](https://etceteratype.co/sono) _SIL OFL_ ([view](https://www.programmingfonts.org/#sono))
- [Source Code Pro](https://github.com/adobe-fonts/source-code-pro) _SIL OFL_ ([view](https://www.programmingfonts.org/#source-code-pro))
- [Space Mono](https://fonts.google.com/specimen/Space+Mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#space))
- [Spleen](https://www.cambus.net/spleen-monospaced-bitmap-fonts/) _BSD-2-Clause_ ([view](https://www.programmingfonts.org/#spleen))
- [Sudo](https://www.kutilek.de/sudo-font/) _SIL OFL_ ([view](https://www.programmingfonts.org/#sudo))
- [Terminus (TTF)](https://files.ax86.net/terminus-ttf) _SIL OFL_ ([view](https://www.programmingfonts.org/#terminus))
- [TeX Gyre Cursor](http://www.gust.org.pl/projects/e-foundry/tex-gyre) _GUST font license_ ([view](https://www.programmingfonts.org/#tex-gyre-cursor))
- [Twilio Sans Mono](https://github.com/twilio/twilio-sans-mono) _SIL OFL_ ([view](https://www.programmingfonts.org/#twilio-sans-mono))
- [Ubuntu Mono](http://font.ubuntu.com) _Ubuntu Font Licence_ ([view](https://www.programmingfonts.org/#ubuntu))
- [GNU Unifont](http://www.unifoundry.com/unifont.html) _GNU GPL_ ([view](https://www.programmingfonts.org/#unifont))
- [UnifontEX](https://github.com/stgiga/UnifontEX) _GNU GPL_ ([view](https://www.programmingfonts.org/#unifontex))
- [Verily Serif Mono](https://www.fontsquirrel.com/fonts/Verily-Serif-Mono) _Bitstream Vera_ ([view](https://www.programmingfonts.org/#verily))
- [Victor Mono](https://rubjo.github.io/victor-mono/) _MIT_ ([view](https://www.programmingfonts.org/#victor-mono))
- [VT323](https://fedoraproject.org/wiki/VT323_Fonts) _SIL OFL_ ([view](https://www.programmingfonts.org/#vt323))
