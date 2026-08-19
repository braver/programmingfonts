import json
from collections import namedtuple
from os import path

from fontTools.ttLib import TTFont

'''
Measure CJK coverage: how much of each East Asian writing system a font
actually covers. See fonts-schema.json for the shape this writes, and the
README for where the numbers come from.

Requires:
fonttools - https://github.com/fonttools/fonttools
brotli (for woff files) - https://github.com/google/brotli

Both are already in requirements.txt; this module adds no new dependency.
Run cjk_verify.py to re-derive the byte ranges below from Unicode's own data.
'''


'''
Each tier is one national standard, enumerated by decoding the byte ranges that
standard defines with the matching stdlib codec, and keeping the ideographs.

expected: the character count the standard specifies. It is checked when the
sets are built, so a codec change in a future Python release fails loudly
instead of silently shifting every percentage on the site. These same numbers
are the maximums in fonts-schema.json; change one and you must change both.

irg: the source tag Unicode itself uses for the same standard in Unihan
(UAX #38, https://www.unicode.org/reports/tr38/). cjk_verify.py checks these
sets against that data, so nothing here rests on trusting this comment.

Han tiers are split into level 1 (everyday text) and level 2 (names, place
names, classical text): a font with all of level 1 and none of level 2 is
perfectly usable for reading, and a single number would hide that.
'''
Tier = namedtuple('Tier', 'key name codec highs lows expected irg')

EUC_LOW = [(0xA1, 0xFE)]
BIG5_LOW = [(0x40, 0x7E), (0xA1, 0xFE)]

TIERS = [
    Tier('gb2312-1',  'GB/T 2312-1980 level 1', 'gb2312', [(0xB0, 0xD7)], EUC_LOW,  3755, 'G0'),
    Tier('gb2312-2',  'GB/T 2312-1980 level 2', 'gb2312', [(0xD8, 0xF7)], EUC_LOW,  3008, 'G0'),
    Tier('big5-1',    'Big5 common',            'big5',   [(0xA4, 0xC6)], BIG5_LOW, 5401, 'T1'),
    Tier('big5-2',    'Big5 less common',       'big5',   [(0xC9, 0xF9)], BIG5_LOW, 7652, 'T2'),
    Tier('jis0208-1', 'JIS X 0208 level 1',     'euc_jp', [(0xB0, 0xCF)], EUC_LOW,  2965, 'J0'),
    Tier('jis0208-2', 'JIS X 0208 level 2',     'euc_jp', [(0xD0, 0xF4)], EUC_LOW,  3390, 'J0'),
    Tier('hanja',     'KS X 1001:2004 hanja',   'euc_kr', [(0xCA, 0xFD)], EUC_LOW,  4888, 'K0'),
]

'''
Syllabaries and Hangul are complete blocks rather than a selection out of a
larger standard, so the Unicode block IS the practical set: every one of these
is reachable from a keyboard.

Hiragana and katakana stay separate because fonts really do ship one without
the other -- Cartograph has all 90 katakana and no hiragana -- and averaging
the two hides exactly that.
'''
Block = namedtuple('Block', 'key name ranges')

BLOCKS = [
    Block('hangul',   'modern Hangul syllables', [(0xAC00, 0xD7A3)]),
    Block('hiragana', 'Hiragana',                [(0x3041, 0x3096)]),
    Block('katakana', 'Katakana',                [(0x30A1, 0x30FA)]),
]


def is_ideograph(cp):
    '''
    Han ranges the legacy codecs above can produce: unified, Ext A,
    compatibility and Ext B. Ext C and later are deliberately absent -- no
    legacy codec encodes them.
    '''
    return (0x3400 <= cp <= 0x4DBF or 0x4E00 <= cp <= 0x9FFF
            or 0xF900 <= cp <= 0xFAFF or 0x20000 <= cp <= 0x2A6DF)


def decode_tier(codec, high_ranges, low_ranges):
    '''Every ideograph reachable in these byte ranges of a legacy codec.'''
    found = set()
    for high_start, high_end in high_ranges:
        for high in range(high_start, high_end + 1):
            for low_start, low_end in low_ranges:
                for low in range(low_start, low_end + 1):
                    try:
                        char = bytes((high, low)).decode(codec)
                    except UnicodeDecodeError:
                        continue
                    if len(char) == 1 and is_ideograph(ord(char)):
                        found.add(ord(char))
    return found


def expand_ranges(ranges):
    '''Every code point in a list of inclusive (first, last) pairs.'''
    found = set()
    for start, end in ranges:
        found.update(range(start, end + 1))
    return found


def build_sets():
    '''{key: set of code points}, each validated against its standard.'''
    sets = {}
    for tier in TIERS:
        chars = decode_tier(tier.codec, tier.highs, tier.lows)
        if len(chars) != tier.expected:
            raise SystemExit(
                '%s: the %s codec gives %d ideographs, the standard defines %d. '
                "Python's codec tables changed; check the byte ranges in cjk.py "
                'before trusting any coverage number.'
                % (tier.name, tier.codec, len(chars), tier.expected)
            )
        sets[tier.key] = chars
    for block in BLOCKS:
        sets[block.key] = expand_ranges(block.ranges)
    return sets


# the order tiers are reported in
KEYS = [tier.key for tier in TIERS] + [block.key for block in BLOCKS]

NAMES = dict([(tier.key, tier.name) for tier in TIERS]
             + [(block.key, block.name) for block in BLOCKS])

# How many characters each tier holds, so the front end can turn the counts
# this writes into percentages, the way lang_count already does for languages.
# These are also the maximums in fonts-schema.json -- keep the two in step.
TOTALS = dict([(tier.key, tier.expected) for tier in TIERS]
              + [(block.key, len(expand_ranges(block.ranges))) for block in BLOCKS])

SETS = build_sets()


def coverage(font_file):
    '''
    {tier key: how many of that tier's characters the font encodes}, leaving out
    tiers it has none of. Empty for a font with no CJK at all.

    Counts rather than percentages, to match how "languages" already stores its
    data: the totals live in the front end, so a filter threshold can be changed
    there without re-running this over every font.
    '''
    font = TTFont(font_file, lazy=True)
    try:
        # getBestCmap() returns None for a font with no Unicode cmap subtable
        encoded = set(font.getBestCmap() or {})
    finally:
        font.close()

    covered = {}
    for key in KEYS:
        count = len(encoded & SETS[key])
        if count:
            covered[key] = count
    return covered


def report(font_name, covered):
    '''Print one font's coverage, for running this file directly.'''
    print('')
    print('---------- ' + font_name + ' ----------')
    if not covered:
        print('no CJK coverage')
        return
    for key in KEYS:
        if key in covered:
            print('%-26s %6d / %-6d %5.1f%%'
                  % (NAMES[key], covered[key], TOTALS[key],
                     100 * covered[key] / TOTALS[key]))


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(prog='cjk')
    parser.add_argument('--name')
    parser.add_argument('--json', action='store_true',
                        help='print the fonts.json fragment instead of a report')
    args = parser.parse_args()

    with open('fonts.json', encoding='utf-8') as user_file:
        data = json.load(user_file)

    fragments = {}
    checked = 0
    for key in data:
        if args.name and key != args.name:
            continue

        # the same lookup info.py does; kept here so this file can be run alone
        font_file = None
        for ext in ['.ttf', '.otf', '.woff', '.woff2']:
            candidate = path.join('.', 'fonts', 'resources', key, key + ext)
            if path.isfile(candidate):
                font_file = candidate
                break

        if font_file is None:
            continue

        checked += 1
        covered = coverage(font_file)
        if covered:
            fragments[key] = {'cjk': covered}
        if not args.json:
            report(key, covered)

    # without this a typo in --name looks exactly like "this font has no CJK"
    if args.name and not checked:
        raise SystemExit(
            "no font file for '%s' under fonts/resources -- check the spelling "
            'against fonts.json, and that the font ships with this repo.'
            % args.name
        )

    if args.json:
        print(json.dumps(fragments, indent=4, ensure_ascii=False))
