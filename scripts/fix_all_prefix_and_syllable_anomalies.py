# -*- coding: utf-8 -*-
import json
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

# Common prefix rules
# 1. un- at start of word -> 'อัน-' (e.g. unhappy, unable, unless, until, uncertain, unfair, etc.)
#    EXCEPT uni- (uniform, union, unique, unite, university, universe, unisex) -> 'ยู-นิ-' or 'ยู-ไน-'
# 2. in- at start of word -> 'อิน-' (e.g. interact, involve, inside, income, instead, infect, invent)
# 3. im- at start of word -> 'อิม-' (e.g. impact, import, improve, impress, immediate, immigrant)
# 4. under- -> 'อัน-เดอร์-' (e.g. understand, underground, undertake, underline, underwear)

prefix_fixed = 0

for item in vocab:
    w = item['word'].lower().strip()
    th = item.get('thai_pronunciation', '')

    # Check uni- words
    if w.startswith('uni'):
        if w in ['uniform', 'uniformly']:
            item['thai_pronunciation'] = 'ยู-นิ-ฟอร์ม'
            prefix_fixed += 1
        elif w in ['union']:
            item['thai_pronunciation'] = 'ยู-เนียน'
            prefix_fixed += 1
        elif w in ['unique']:
            item['thai_pronunciation'] = 'ยู-นีค'
            prefix_fixed += 1
        elif w in ['unite', 'united']:
            item['thai_pronunciation'] = 'ยู-ไนท์' if w == 'unite' else 'ยู-ไน-เท็ด'
            prefix_fixed += 1
        elif w in ['unity']:
            item['thai_pronunciation'] = 'ยู-นิ-ที'
            prefix_fixed += 1
        elif w in ['universal']:
            item['thai_pronunciation'] = 'ยู-นิ-เวอร์-แซล'
            prefix_fixed += 1
        elif w in ['universe']:
            item['thai_pronunciation'] = 'ยู-นิ-เวิร์ส'
            prefix_fixed += 1
        elif w in ['university']:
            item['thai_pronunciation'] = 'ยู-นิ-เวอร์-ซิ-ที'
            prefix_fixed += 1
        elif w in ['unilateral']:
            item['thai_pronunciation'] = 'ยู-นิ-แลต-เทอ-รัล'
            prefix_fixed += 1
        elif w in ['unison']:
            item['thai_pronunciation'] = 'ยู-นิ-เซิน'
            prefix_fixed += 1

    # Check under- words
    elif w.startswith('under'):
        if w in ['understand', 'understanding']:
            item['thai_pronunciation'] = 'อัน-เดอร์-สแตนด์' if w == 'understand' else 'อัน-เดอร์-สแตน-ดิง'
            prefix_fixed += 1
        elif w in ['underground']:
            item['thai_pronunciation'] = 'อัน-เดอร์-เกรานด์'
            prefix_fixed += 1
        elif w in ['underestimate']:
            item['thai_pronunciation'] = 'อัน-เดอร์-เอส-ติ-เมท'
            prefix_fixed += 1
        elif w in ['undergo']:
            item['thai_pronunciation'] = 'อัน-เดอร์-โก'
            prefix_fixed += 1
        elif w in ['undergraduate']:
            item['thai_pronunciation'] = 'อัน-เดอร์-แกรด-จู-เอท'
            prefix_fixed += 1
        elif w in ['underlie', 'underlying']:
            item['thai_pronunciation'] = 'อัน-เดอร์-ลาย' if w == 'underlie' else 'อัน-เดอร์-ลาย-อิง'
            prefix_fixed += 1
        elif w in ['undermine']:
            item['thai_pronunciation'] = 'อัน-เดอร์-มายน์'
            prefix_fixed += 1
        elif w in ['undertake', 'undertaking']:
            item['thai_pronunciation'] = 'อัน-เดอร์-เทค' if w == 'undertake' else 'อัน-เดอร์-เทค-คิง'
            prefix_fixed += 1
        elif w in ['underwear']:
            item['thai_pronunciation'] = 'อัน-เดอร์-แวร์'
            prefix_fixed += 1
        elif w in ['underwrite']:
            item['thai_pronunciation'] = 'อัน-เดอร์-ไรต์'
            prefix_fixed += 1

    # Check other un- words
    elif w.startswith('un') and th.startswith('นั-'):
        # replace leading 'นั-' with 'อัน-'
        item['thai_pronunciation'] = 'อัน-' + th[3:]
        prefix_fixed += 1

    # Check in- words
    elif w.startswith('in') and th.startswith('นิ-'):
        item['thai_pronunciation'] = 'อิน-' + th[3:]
        prefix_fixed += 1

    # Check im- words
    elif w.startswith('im') and th.startswith('มิ-'):
        item['thai_pronunciation'] = 'อิม-' + th[3:]
        prefix_fixed += 1

print(f"Fixed {prefix_fixed} inverted prefix words.")

# Additional specific corrections
SPECIFIC_FIXES = {
    'tract': ('แทร็กต์', 'trækt'),
    'transact': ('แตรน-แซกต์', 'trænˈzækt'),
    'unacceptable': ('อัน-แอ็ก-เซ็พ-เทอะ-เบิล', 'ˌʌn.əkˈsep.tə.bəl'),
    'uncomfortable': ('อัน-คัมฟ-เทอะ-เบิล', 'ʌnˈkʌmf.tə.bəl'),
    'unconscious': ('อัน-คอน-เชิส', 'ʌnˈkɒn.ʃəs'),
    'uncover': ('อัน-คัฟ-เวอร์', 'ʌnˈkʌv.ər'),
    'unemployment': ('อัน-เอ็ม-พลอย-เมินท์', 'ˌʌn.ɪmˈplɔɪ.mənt'),
    'unexpected': ('อัน-เอ็ก-สเปก-ทิด', 'ˌʌn.ɪkˈspek.tɪd'),
    'unfortunate': ('อัน-ฟอร์-ชู-เนท', 'ʌnˈfɔː.tʃə.nət'),
    'unfortunately': ('อัน-ฟอร์-ชู-เนท-ลี', 'ʌnˈfɔː.tʃə.nət.li'),
    'unhappy': ('อัน-แฮป-ปี', 'ʌnˈhæp.i'),
    'unknown': ('อัน-โนน', 'ʌnˈnoʊn'),
    'unless': ('อัน-เลส', 'ənˈles'),
    'unlike': ('อัน-ไลค์', 'ʌnˈlaɪk'),
    'unlikely': ('อัน-ไลก์-ลี', 'ʌnˈlaɪk.li'),
    'unnecessary': ('อัน-เนส-เซส-เซอ-รี', 'ʌnˈnes.ə.ser.i'),
    'unpleasant': ('อัน-เพลส-เซินต์', 'ʌnˈplez.ənt'),
    'until': ('อัน-ทิล', 'ənˈtɪl'),
    'unusual': ('อัน-ยู-ชวล', 'ʌnˈjuː.ʒu.əl'),
    'unveil': ('อัน-เวล', 'ʌnˈveɪl'),
    'disagree': ('ดิส-เออะ-กรี', 'ˌdɪs.əˈɡriː'),
    'disagreement': ('ดิส-เออะ-กรี-เมินท์', 'ˌdɪs.əˈɡriː.mənt'),
    'interact': ('อิน-เทอร์-แอกต์', 'ˌɪn.təˈrækt'),
    'interaction': ('อิน-เทอร์-แอก-ชัน', 'ˌɪn.təˈræk.ʃən'),
    'interactive': ('อิน-เทอร์-แอก-ทิฟ', 'ˌɪn.təˈræk.tɪv'),
    'reactionary': ('รี-แอก-ชัน-เนอ-รี', 'riˈæk.ʃən.ər.i'),
    'radioactive': ('เร-ดิ-โอ-แอก-ทิฟ', 'ˌreɪ.di.oʊˈæk.tɪv'),
    'belt': ('เบลต์', 'bɛlt'),
    'bend': ('เบนด์', 'bɛnd'),
    'bent': ('เบนต์', 'bɛnt'),
    'blend': ('เบลนด์', 'blɛnd'),
    'trend': ('เทรนด์', 'trɛnd'),
}

for item in vocab:
    w = item['word'].lower().strip()
    if w in SPECIFIC_FIXES:
        item['thai_pronunciation'], item['ipa'] = SPECIFIC_FIXES[w]

with open('src/data/vocabulary.json', 'w', encoding='utf-8') as f:
    json.dump(vocab, f, ensure_ascii=False, indent=2)

print("Saved updated src/data/vocabulary.json with all prefix and syllable fixes.")
