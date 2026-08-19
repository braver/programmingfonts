import io
import re
import sys
import urllib.request
import zipfile
from collections import defaultdict

import cjk

'''
Check the character sets in cjk.py against Unicode's own data.

cjk.py builds each tier by decoding the byte ranges a national standard
defines. Those ranges are hardcoded, so this script proves they are right
rather than asking anyone to take them on faith: Unihan records, for every
ideograph, which national standards it came from (UAX #38 kIRG_*Source), and
those two independent routes should agree.

This is a one-off check, not part of the build -- it downloads ~8MB from
unicode.org. Nothing in the site depends on it.

    python3 cjk_verify.py                 # download the current Unihan
    python3 cjk_verify.py Unihan.zip      # or use a local copy

Last run against Unihan from UCD 17.0 (2025-08-18); see README for the result.
'''

UNIHAN_URL = 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip'

'''
How each comparison may legitimately differ:

identical            the two sets must match exactly
unihan_extra         everything we claim must be in Unihan, which may hold more
same_size            same number of characters, but not necessarily the same
                     code points
different_standards  not the same standard at all; report the overlap and
                     assert nothing
'''
EXPECTATIONS = ('identical', 'unihan_extra', 'same_size', 'different_standards')

# Which Unihan source tag corresponds to each tier, and whether the two are
# expected to be identical. Where they are not, the reason is recorded here and
# checked below, so an unexplained difference still shows up as a failure.
COMPARISONS = [
    {
        'tiers': ['gb2312-1', 'gb2312-2'],
        'tag': 'G0',
        'standard': 'GB/T 2312-1980',
        'expect': 'identical',
        'note': '',
    },
    {
        'tiers': ['jis0208-1', 'jis0208-2'],
        'tag': 'J0',
        'standard': 'JIS X 0208-1990',
        'expect': 'unihan_extra',
        'note': ('Unihan lists every ideograph in JIS X 0208 including the ones '
                 'outside the two kanji levels; our tiers are levels 1-2 only.'),
    },
    {
        'tiers': ['hanja'],
        'tag': 'K0',
        'standard': 'KS X 1001:2004',
        'expect': 'same_size',
        'note': ('Same count, but the two disagree on which compatibility code '
                 'point stands for a couple of hanja.'),
    },
    {
        'tiers': ['big5-1', 'big5-2'],
        'tag': 'T1+T2',
        'standard': 'Big5 vs CNS 11643',
        'expect': 'different_standards',
        'note': ('Unihan has no Big5 tag: T1/T2 are CNS 11643 planes 1-2, a '
                 'different (national) standard covering nearly the same '
                 'characters. Overlap is reported instead of equality.'),
    },
]


def load_unihan(source):
    '''{source tag: set of code points} from Unihan_IRGSources.txt.'''
    if source:
        raw = open(source, 'rb').read()
    else:
        print('downloading ' + UNIHAN_URL)
        raw = urllib.request.urlopen(UNIHAN_URL).read()
        print('  %d bytes' % len(raw))

    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        text = archive.read('Unihan_IRGSources.txt').decode('utf-8')

    tags = defaultdict(set)
    pattern = re.compile(r'^U\+([0-9A-F]+)\tkIRG_[A-Z]Source\t([A-Z0-9]+)-')
    for line in text.splitlines():
        found = pattern.match(line)
        if found:
            tags[found.group(2)].add(int(found.group(1), 16))
    return tags


def describe(points, limit=6):
    listed = sorted(points)[:limit]
    shown = ' '.join('U+%04X %s' % (cp, chr(cp)) for cp in listed)
    return shown + (' ...' if len(points) > limit else '')


def check(comparison, tags):
    ours = set()
    for tier in comparison['tiers']:
        ours |= cjk.SETS[tier]

    if comparison['tag'] == 'T1+T2':
        theirs = tags['T1'] | tags['T2']
    else:
        theirs = tags[comparison['tag']]

    print('')
    print('%s  (%s)' % (comparison['standard'], ' + '.join(comparison['tiers'])))
    print('  cjk.py:  %6d characters' % len(ours))
    print('  Unihan:  %6d characters   [%s]' % (len(theirs), comparison['tag']))

    only_ours = ours - theirs
    only_theirs = theirs - ours
    expect = comparison['expect']

    if expect == 'identical':
        passed = not only_ours and not only_theirs
    elif expect == 'unihan_extra':
        # every character we claim must be in Unihan; Unihan may hold more
        passed = not only_ours
    elif expect == 'same_size':
        passed = len(ours) == len(theirs)
    elif expect == 'different_standards':
        # no equality to assert between two standards, just report the overlap
        passed = True
    else:
        # never fall through to "passed": a typo here would silently disable
        # the very check this script exists to perform
        raise SystemExit(
            "unknown expect value '%s' for %s. Valid values: %s"
            % (expect, comparison['standard'], ', '.join(EXPECTATIONS))
        )

    if only_ours:
        print('  only in cjk.py: %d   %s' % (len(only_ours), describe(only_ours)))
    if only_theirs:
        print('  only in Unihan: %d   %s' % (len(only_theirs), describe(only_theirs)))
    if expect == 'different_standards':
        print('  in both:        %d' % len(ours & theirs))
    if comparison['note']:
        print('  expected: ' + comparison['note'])

    print('  => ' + ('OK' if passed else 'UNEXPECTED DIFFERENCE'))
    return passed


def main():
    tags = load_unihan(sys.argv[1] if len(sys.argv) > 1 else None)

    print('')
    print('Tier sizes built by cjk.py (already checked against each standard)')
    for key in cjk.KEYS:
        print('  %-26s %6d' % (cjk.NAMES[key], cjk.TOTALS[key]))

    results = [check(comparison, tags) for comparison in COMPARISONS]

    print('')
    if all(results):
        print('All comparisons matched expectations.')
        return 0
    print('Some comparison differed unexpectedly -- see above.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
