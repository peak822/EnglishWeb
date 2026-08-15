# -*- coding: utf-8 -*-
import json
import re

with open('src/data/vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

with open('src/data/stories.json', 'r', encoding='utf-8') as f:
    stories = json.load(f)

with open('src/data/sentences.json', 'r', encoding='utf-8') as f:
    sentences = json.load(f)

print(f"Loaded {len(vocab)} vocabulary items, {len(stories)} stories, {len(sentences)} sentences.")

# Comprehensive analysis
latin_in_thai = []
truncated_thai = []
suspicious_ipa = []
pos_mismatches = []
thai_spelling_mistakes = []
verb_as_noun = []
adj_as_noun = []

# Common Thai spelling error patterns in translated words
THAI_TYPOS = [
    (r'พิจาณา', 'พิจารณา'),
    (r'ปราถนา', 'ปรารถนา'),
    (r'ประสพการณ์', 'ประสบการณ์'),
    (r'อนุญาติ', 'อนุญาต'),
    (r'สังเกตุ', 'สังเกต'),
    (r'โอกาศ', 'โอกาส'),
    (r'รสชาด', 'รสชาติ'),
    (r'กระเพรา', 'กะเพรา'),
    (r'ปะผุ', 'ปะผุ'),
]

for item in vocab:
    w = item.get('word', '').strip()
    thai = item.get('thai_pronunciation', '').strip()
    ipa = item.get('ipa', '').strip()
    m = item.get('meaning', '').strip()
    t = item.get('type', '').strip()
    lvl = item.get('level', '').strip()
    i = item.get('id')

    # 1. Latin / IPA character leaks
    if re.search(r'[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]', thai):
        latin_in_thai.append({
            'id': i, 'word': w, 'thai': thai, 'ipa': ipa, 'type': t, 'level': lvl, 'meaning': m
        })

    # 2. Truncated / Single-letter Thai pronunciations
    if len(thai) < 2 or thai in ['แอก', 'แอ'] or (thai == 'อะ' and w.lower() not in ['a', 'uh', 'ah']):
        truncated_thai.append({
            'id': i, 'word': w, 'thai': thai, 'ipa': ipa, 'type': t, 'level': lvl, 'meaning': m
        })

    # 3. Suspicious IPAs
    if ipa in ['null', 'undefined', ''] or (ipa == w and w.lower() not in ['a', 'i']) or len(ipa) <= 1:
        suspicious_ipa.append({
            'id': i, 'word': w, 'ipa': ipa, 'thai': thai, 'type': t, 'level': lvl, 'meaning': m
        })

    # 4. Thai spelling typos in meaning
    for typo, correction in THAI_TYPOS:
        if re.search(typo, m):
            thai_spelling_mistakes.append({
                'id': i, 'word': w, 'meaning': m, 'typo': typo, 'correction': correction
            })

    # 5. POS Mismatches
    if t == 'adj.' and re.search(r'(al|ion|ment|ance|ence|ity)$', w.lower()):
        if w.lower() in ['denial', 'appraisal', 'dismissal', 'disposal', 'proposal', 'refusal', 'survival', 'trial', 'withdrawal', 'arrival', 'approval', 'portrayal', 'rebuttal', 'rehearsal', 'removal', 'retrieval', 'reversal', 'revival']:
            pos_mismatches.append({
                'id': i, 'word': w, 'current_type': t, 'correct_type': 'n.', 'meaning': m
            })
    elif t == 'v.' and w.lower() in ['expertise']:
        pos_mismatches.append({
            'id': i, 'word': w, 'current_type': t, 'correct_type': 'n.', 'meaning': m
        })

    # 6. Adjective translated as pure noun
    if t == 'adj.' and m.startswith('การ') and not any(k in m for k in ['ที่', 'ซึ่ง', 'เกี่ยวกับ']):
        adj_as_noun.append({
            'id': i, 'word': w, 'meaning': m
        })

    # 7. Verb translated as pure noun
    if t == 'v.' and (m.startswith('ความ') or (m.startswith('การ') and ',' not in m and '/' not in m)):
        verb_as_noun.append({
            'id': i, 'word': w, 'meaning': m
        })

print(f"\n1. Latin/IPA characters in Thai pronunciation: {len(latin_in_thai)}")
print(f"2. Truncated / Single-letter Thai pronunciations: {len(truncated_thai)}")
print(f"3. Suspicious / Null IPAs: {len(suspicious_ipa)}")
print(f"4. Thai spelling mistakes in meaning: {len(thai_spelling_mistakes)}")
print(f"5. Critical POS Tag mismatches (e.g. noun tagged as adj): {len(pos_mismatches)}")
print(f"6. Adjectives with pure noun definitions: {len(adj_as_noun)}")
print(f"7. Verbs with pure noun definitions: {len(verb_as_noun)}")

report_full = {
    'summary': {
        'total_vocab': len(vocab),
        'latin_in_thai_count': len(latin_in_thai),
        'truncated_thai_count': len(truncated_thai),
        'suspicious_ipa_count': len(suspicious_ipa),
        'thai_spelling_mistakes_count': len(thai_spelling_mistakes),
        'pos_mismatches_count': len(pos_mismatches),
        'adj_as_noun_count': len(adj_as_noun),
        'verb_as_noun_count': len(verb_as_noun)
    },
    'latin_in_thai': latin_in_thai,
    'truncated_thai': truncated_thai,
    'suspicious_ipa': suspicious_ipa,
    'thai_spelling_mistakes': thai_spelling_mistakes,
    'pos_mismatches': pos_mismatches,
    'adj_as_noun': adj_as_noun,
    'verb_as_noun': verb_as_noun
}

with open('scripts/deep_scan_report.json', 'w', encoding='utf-8') as out:
    json.dump(report_full, out, ensure_ascii=False, indent=2)

print("\nSaved full deep scan report to scripts/deep_scan_report.json")
