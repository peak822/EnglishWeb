# -*- coding: utf-8 -*-
"""
Deterministic, High-Accuracy IPA-to-Thai Phonetic Transcriber (Version 2)
Converts authentic IPA (Oxford/CMU) into natural, syllable-accurate Thai transliterations.
"""

import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Consonant Mappings for Onset and Coda
ONSET_MAP = {
    'p': 'พ', 'b': 'บ', 't': 'ท', 'd': 'ด', 'k': 'ค', 'ɡ': 'ก', 'g': 'ก',
    'tʃ': 'ช', 'ʧ': 'ช', 'ch': 'ช', 'dʒ': 'จ', 'ʤ': 'จ', 'j': 'ย',
    'f': 'ฟ', 'v': 'ว', 'θ': 'ธ', 'ð': 'ด', 's': 'ซ', 'z': 'ซ',
    'ʃ': 'ช', 'sh': 'ช', 'ʒ': 'จ', 'zh': 'จ', 'h': 'ฮ',
    'm': 'ม', 'n': 'น', 'ŋ': 'ง', 'l': 'ล', 'ɫ': 'ล', 'r': 'ร', 'ɹ': 'ร',
    'w': 'ว', 'hw': 'ว'
}

CLUSTER_ONSETS = {
    'pl': 'พล', 'pɫ': 'พล', 'bl': 'บล', 'bɫ': 'บล', 'kl': 'คล', 'kɫ': 'คล',
    'ɡl': 'กล', 'gl': 'กล', 'ɡɫ': 'กล', 'gɫ': 'กล',
    'fl': 'ฟล', 'fɫ': 'ฟล', 'pr': 'พร', 'pɹ': 'พร', 'br': 'บร', 'bɹ': 'บร',
    'tr': 'ทร', 'tɹ': 'ทร', 'dr': 'ดร', 'dɹ': 'ดร', 'kr': 'คร', 'kɹ': 'คร',
    'ɡr': 'กร', 'gr': 'กร', 'ɡɹ': 'กร', 'gɹ': 'กร', 'fr': 'ฟร', 'fɹ': 'ฟร',
    'θr': 'ธร', 'θɹ': 'ธร', 'ʃr': 'ชร', 'ʃɹ': 'ชร',
    'sk': 'สค', 'sp': 'สป', 'st': 'สต', 'sm': 'สม', 'sn': 'สน',
    'sl': 'สล', 'sɫ': 'สล', 'sw': 'สว',
    'skr': 'สคร', 'skɹ': 'สคร', 'spr': 'สปร', 'spɹ': 'สปร',
    'str': 'สตร', 'stɹ': 'สตร', 'skw': 'สคว',
    'kw': 'คว', 'ɡw': 'กว', 'gw': 'กว', 'tw': 'ทว', 'dw': 'ดว'
}

CODA_MAP = {
    'p': 'พ', 'b': 'บ', 't': 'ท', 'd': 'ด', 'k': 'ค', 'ɡ': 'ก', 'g': 'ก',
    'tʃ': 'ช', 'ʧ': 'ช', 'dʒ': 'จ', 'ʤ': 'จ', 'f': 'ฟ', 'v': 'ฟว์',
    'θ': 'ธ', 'ð': 'ด', 's': 'ส์', 'z': 'ส์', 'ʃ': 'ช', 'ʒ': 'จ์',
    'm': 'ม', 'n': 'น', 'ŋ': 'ง', 'l': 'ล', 'ɫ': 'ล', 'r': 'ร์', 'ɹ': 'ร์'
}

def transcribe_syllable(onset, vowel, coda, is_stressed=False):
    c = onset if onset else 'อ'
    # Clean combining marks
    c_clean = c.replace('ส', '') if (c.startswith('ส') and len(c) > 1 and not c.startswith('สว')) else c
    
    # 1. /iː/, /i/
    if vowel in ['iː', 'i']:
        if not coda: return f"{c}ี"
        if coda in ['p', 'b']: return f"{c}ีพ" if coda == 'p' else f"{c}ีบ"
        if coda in ['t', 'd']: return f"{c}ีท" if coda == 't' else f"{c}ีด"
        if coda in ['k', 'ɡ', 'g']: return f"{c}ีค" if coda == 'k' else f"{c}ีก"
        if coda in ['tʃ', 'ʧ']: return f"{c}ีช"
        if coda in ['dʒ', 'ʤ']: return f"{c}ีจ"
        if coda in ['f', 'v']: return f"{c}ีฟ" if coda == 'f' else f"{c}ีฟว์"
        if coda in ['θ', 'ð']: return f"{c}ีธ"
        if coda in ['s', 'z', 'st', 'zd']: return f"{c}ีสต์" if 't' in coda else f"{c}ีส์"
        if coda in ['ʃ', 'ʒ']: return f"{c}ีช"
        if coda in ['m']: return f"{c}ีม"
        if coda in ['n']: return f"{c}ีน"
        if coda in ['ŋ']: return f"{c}ีง"
        if coda in ['l', 'ɫ']: return f"{c}ีล"
        if coda in ['r', 'ɹ']: return f"{c}ียร์"
        return f"{c}ี{CODA_MAP.get(coda, '')}"

    # 2. /ɪ/
    if vowel in ['ɪ']:
        if not coda: return f"{c}ิ"
        if coda in ['p', 'b']: return f"{c}ิป" if coda == 'p' else f"{c}ิบ"
        if coda in ['t', 'd']: return f"{c}ิท" if coda == 't' else f"{c}ิด"
        if coda in ['k', 'ɡ', 'g']: return f"{c}ิก" if coda == 'k' else f"{c}ิ๊ก"
        if coda in ['tʃ', 'ʧ']: return f"{c}ิช"
        if coda in ['dʒ', 'ʤ']: return f"{c}ิจ"
        if coda in ['f', 'v']: return f"{c}ิฟ"
        if coda in ['θ', 'ð']: return f"{c}ิธ"
        if coda in ['s', 'z', 'st']: return f"{c}ิสต์" if 't' in coda else f"{c}ิส"
        if coda in ['ʃ', 'ʒ']: return f"{c}ิช"
        if coda in ['m']: return f"{c}ิม"
        if coda in ['n']: return f"{c}ิน"
        if coda in ['ŋ']: return f"{c}ิง"
        if coda in ['l', 'ɫ']: return f"{c}ิล"
        if coda in ['r', 'ɹ']: return f"{c}ิร์"
        return f"{c}ิ{CODA_MAP.get(coda, '')}"

    # 3. /e/, /ɛ/
    if vowel in ['e', 'ɛ']:
        if not coda: return f"เ{c}"
        if coda in ['p', 'b']: return f"เ{c}ป" if coda == 'p' else f"เ{c}บ"
        if coda in ['t', 'd']: return f"เ{c}็ด" if coda == 'd' else f"เ{c}็ท"
        if coda in ['k', 'ɡ', 'g']: return f"เ{c}็ก"
        if coda in ['tʃ', 'ʧ']: return f"เ{c}ช"
        if coda in ['dʒ', 'ʤ']: return f"เ{c}จ"
        if coda in ['f', 'v']: return f"เ{c}ฟ"
        if coda in ['θ', 'ð']: return f"เ{c}ธ"
        if coda in ['s', 'z', 'st']: return f"เ{c}สต์" if 't' in coda else f"เ{c}ส"
        if coda in ['ʃ', 'ʒ']: return f"เ{c}ช"
        if coda in ['m']: return f"เ{c}ม"
        if coda in ['n']: return f"เ{c}น"
        if coda in ['ŋ']: return f"เ{c}ง"
        if coda in ['l', 'ɫ']: return f"เ{c}ล"
        if coda in ['r', 'ɹ']: return f"เ{c}ร์"
        return f"เ{c}{CODA_MAP.get(coda, '')}"

    # 4. /æ/
    if vowel in ['æ']:
        if not coda: return f"แ{c}"
        if coda in ['p', 'b']: return f"แ{c}ป" if coda == 'p' else f"แ{c}บ"
        if coda in ['t', 'd']: return f"แ{c}ท" if coda == 't' else f"แ{c}ด"
        if coda in ['k', 'ɡ', 'g']: return f"แ{c}ก"
        if coda in ['tʃ', 'ʧ']: return f"แ{c}ช"
        if coda in ['dʒ', 'ʤ']: return f"แ{c}จ"
        if coda in ['f', 'v']: return f"แ{c}ฟ"
        if coda in ['θ', 'ð']: return f"แ{c}ธ"
        if coda in ['s', 'z', 'st']: return f"แ{c}สต์" if 't' in coda else f"แ{c}ส"
        if coda in ['ʃ', 'ʒ']: return f"แ{c}ช"
        if coda in ['m']: return f"แ{c}ม"
        if coda in ['n']: return f"แ{c}น"
        if coda in ['ŋ']: return f"แ{c}ง"
        if coda in ['l', 'ɫ']: return f"แ{c}ล"
        if coda in ['r', 'ɹ']: return f"แ{c}ร์"
        return f"แ{c}{CODA_MAP.get(coda, '')}"

    # 5. /ɑː/, /ɑ/, /aː/
    if vowel in ['ɑː', 'ɑ', 'aː', 'a']:
        if not coda: return f"{c}า"
        if coda in ['p', 'b']: return f"{c}าพ" if coda == 'p' else f"{c}าบ"
        if coda in ['t', 'd']: return f"{c}าท" if coda == 't' else f"{c}าด"
        if coda in ['k', 'ɡ', 'g']: return f"{c}าก"
        if coda in ['tʃ', 'ʧ']: return f"{c}าช"
        if coda in ['dʒ', 'ʤ']: return f"{c}าจ"
        if coda in ['f', 'v']: return f"{c}าฟ"
        if coda in ['θ', 'ð']: return f"{c}าธ"
        if coda in ['s', 'z', 'st']: return f"{c}าสต์" if 't' in coda else f"{c}าส"
        if coda in ['ʃ', 'ʒ']: return f"{c}าช"
        if coda in ['m']: return f"{c}าม"
        if coda in ['n']: return f"{c}าน"
        if coda in ['ŋ']: return f"{c}าง"
        if coda in ['l', 'ɫ']: return f"{c}าล"
        if coda in ['r', 'ɹ']: return f"{c}าร์"
        return f"{c}า{CODA_MAP.get(coda, '')}"

    # 6. /ɒ/, /ɔː/, /ɔ/
    if vowel in ['ɒ', 'ɔː', 'ɔ']:
        if not coda: return f"{c}อ"
        if coda in ['p', 'b']: return f"{c}็อป" if coda == 'p' else f"{c}็อบ"
        if coda in ['t', 'd']: return f"{c}็อต" if coda == 't' else f"{c}็อด"
        if coda in ['k', 'ɡ', 'g']: return f"{c}็อก"
        if coda in ['tʃ', 'ʧ']: return f"{c}อช"
        if coda in ['dʒ', 'ʤ']: return f"{c}อจ"
        if coda in ['f', 'v']: return f"{c}อฟ"
        if coda in ['θ', 'ð']: return f"{c}อธ"
        if coda in ['s', 'z', 'st']: return f"{c}อสต์" if 't' in coda else f"{c}อส"
        if coda in ['ʃ', 'ʒ']: return f"{c}อช"
        if coda in ['m']: return f"{c}อม"
        if coda in ['n']: return f"{c}อน"
        if coda in ['ŋ']: return f"{c}อง"
        if coda in ['l', 'ɫ']: return f"{c}อล"
        if coda in ['r', 'ɹ']: return f"{c}อร์"
        return f"{c}อ{CODA_MAP.get(coda, '')}"

    # 7. /ʌ/, /ə/
    if vowel in ['ʌ', 'ə']:
        if not coda: return f"{c}ะ"
        if coda in ['p', 'b']: return f"{c}ัพ" if coda == 'p' else f"{c}ับ"
        if coda in ['t', 'd']: return f"{c}ัท" if coda == 't' else f"{c}ัด"
        if coda in ['k', 'ɡ', 'g']: return f"{c}ัก"
        if coda in ['tʃ', 'ʧ']: return f"{c}ัช"
        if coda in ['dʒ', 'ʤ']: return f"{c}ัจ"
        if coda in ['f', 'v']: return f"{c}ัฟ" if coda == 'f' else f"{c}ัฟว์"
        if coda in ['θ', 'ð']: return f"{c}ัธ"
        if coda in ['s', 'z', 'st']: return f"{c}ัสต์" if 't' in coda else f"{c}ัส"
        if coda in ['ʃ', 'ʒ']: return f"{c}ัช"
        if coda in ['m']: return f"{c}ัม"
        if coda in ['n']: return f"{c}ัน"
        if coda in ['ŋ']: return f"{c}ัง"
        if coda in ['l', 'ɫ']: return f"{c}ัล"
        if coda in ['r', 'ɹ']: return f"{c}อร์"
        return f"{c}ั{CODA_MAP.get(coda, '')}"

    # 8. /uː/, /u/, /ʊ/
    if vowel in ['uː', 'u', 'ʊ']:
        if not coda: return f"{c}ู"
        if coda in ['p', 'b']: return f"{c}ูป" if coda == 'p' else f"{c}ูบ"
        if coda in ['t', 'd']: return f"{c}ูท" if coda == 't' else f"{c}ูด"
        if coda in ['k', 'ɡ', 'g']: return f"{c}ูก" if vowel == 'uː' else f"{c}ุก"
        if coda in ['tʃ', 'ʧ']: return f"{c}ูช"
        if coda in ['dʒ', 'ʤ']: return f"{c}ูจ"
        if coda in ['f', 'v']: return f"{c}ูฟ"
        if coda in ['θ', 'ð']: return f"{c}ูธ"
        if coda in ['s', 'z', 'st']: return f"{c}ูสต์" if 't' in coda else f"{c}ูส"
        if coda in ['ʃ', 'ʒ']: return f"{c}ูช"
        if coda in ['m']: return f"{c}ูม"
        if coda in ['n']: return f"{c}ูน"
        if coda in ['ŋ']: return f"{c}ูง"
        if coda in ['l', 'ɫ']: return f"{c}ูล"
        if coda in ['r', 'ɹ']: return f"{c}ูร์"
        return f"{c}ู{CODA_MAP.get(coda, '')}"

    # 9. /ɜː/, /ɜːr/, /ɝ/, /ər/
    if vowel in ['ɜː', 'ɜːr', 'ɝ', 'ər', 'ɚ', 'ɜr', 'ɜ']:
        if not coda or coda in ['r', 'ɹ']: return f"เ{c}อร์"
        return f"เ{c}ิร์{CODA_MAP.get(coda, '')}"

    # 10. /eɪ/
    if vowel in ['eɪ', 'ei']:
        if not coda: return f"เ{c}ย์"
        if coda in ['p', 'b']: return f"เ{c}ป" if coda == 'p' else f"เ{c}บ"
        if coda in ['t', 'd']: return f"เ{c}ท" if coda == 't' else f"เ{c}ด"
        if coda in ['k', 'ɡ', 'g']: return f"เ{c}ค" if coda == 'k' else f"เ{c}ก"
        if coda in ['tʃ', 'ʧ']: return f"เ{c}ช"
        if coda in ['dʒ', 'ʤ']: return f"เ{c}จ"
        if coda in ['f', 'v']: return f"เ{c}ฟ"
        if coda in ['θ', 'ð']: return f"เ{c}ธ"
        if coda in ['s', 'z', 'st']: return f"เ{c}สต์" if 't' in coda else f"เ{c}ส"
        if coda in ['ʃ', 'ʒ']: return f"เ{c}ช"
        if coda in ['m']: return f"เ{c}ม"
        if coda in ['n']: return f"เ{c}น"
        if coda in ['ŋ']: return f"เ{c}ง"
        if coda in ['l', 'ɫ']: return f"เ{c}ล"
        if coda in ['r', 'ɹ']: return f"เ{c}ร์"
        return f"เ{c}{CODA_MAP.get(coda, '')}"

    # 11. /aɪ/
    if vowel in ['aɪ', 'ai']:
        if not coda: return f"ไ{c}"
        if coda in ['p', 'b']: return f"ไ{c}ป์"
        if coda in ['t', 'd']: return f"ไ{c}ท์" if coda == 't' else f"ไ{c}ด์"
        if coda in ['k', 'ɡ', 'g']: return f"ไ{c}ค์"
        if coda in ['tʃ', 'ʧ']: return f"ไ{c}ช์"
        if coda in ['dʒ', 'ʤ']: return f"ไ{c}จ์"
        if coda in ['f', 'v']: return f"ไ{c}ฟ์"
        if coda in ['θ', 'ð']: return f"ไ{c}ธ์"
        if coda in ['s', 'z', 'st']: return f"ไ{c}สต์" if 't' in coda else f"ไ{c}ส์"
        if coda in ['ʃ', 'ʒ']: return f"ไ{c}ช์"
        if coda in ['m']: return f"ไ{c}ม์"
        if coda in ['n']: return f"ไ{c}น์"
        if coda in ['ŋ']: return f"ไ{c}ง์"
        if coda in ['l', 'ɫ']: return f"ไ{c}ล์"
        if coda in ['r', 'ɹ']: return f"ไ{c}ร์"
        return f"ไ{c}{CODA_MAP.get(coda, '')}"

    # 12. /ɔɪ/
    if vowel in ['ɔɪ', 'oi']:
        if not coda: return f"{c}อย"
        return f"{c}อย{CODA_MAP.get(coda, '')}"

    # 13. /aʊ/
    if vowel in ['aʊ', 'au']:
        if not coda: return f"เ{c}า"
        if coda in ['p', 'b']: return f"เ{c}าพ์"
        if coda in ['t', 'd']: return f"เ{c}าท์" if coda == 't' else f"เ{c}าด์"
        if coda in ['k', 'ɡ', 'g']: return f"เ{c}าค"
        if coda in ['s', 'z', 'st']: return f"เ{c}าสต์" if 't' in coda else f"เ{c}าส์"
        if coda in ['n']: return f"{c}าวน์" if c != 'อ' else f"เอาท์"
        if coda in ['m']: return f"{c}าวม์"
        if coda in ['l', 'ɫ']: return f"{c}าวล์"
        if coda in ['r', 'ɹ']: return f"เ{c}า-เออร์"
        return f"เ{c}า{CODA_MAP.get(coda, '')}"

    # 14. /oʊ/, /əʊ/
    if vowel in ['oʊ', 'əʊ', 'ou', 'o']:
        if not coda: return f"โ{c}"
        if coda in ['p', 'b']: return f"โ{c}ป" if coda == 'p' else f"โ{c}บ"
        if coda in ['t', 'd']: return f"โ{c}ท" if coda == 't' else f"โ{c}ด"
        if coda in ['k', 'ɡ', 'g']: return f"โ{c}ค"
        if coda in ['tʃ', 'ʧ']: return f"โ{c}ช"
        if coda in ['dʒ', 'ʤ']: return f"โ{c}จ"
        if coda in ['f', 'v']: return f"โ{c}ฟ"
        if coda in ['θ', 'ð']: return f"โ{c}ธ"
        if coda in ['s', 'z', 'st']: return f"โ{c}สต์" if 't' in coda else f"โ{c}ส"
        if coda in ['ʃ', 'ʒ']: return f"โ{c}ช"
        if coda in ['m']: return f"โ{c}ม"
        if coda in ['n']: return f"โ{c}น"
        if coda in ['ŋ']: return f"โ{c}ง"
        if coda in ['l', 'ɫ']: return f"โ{c}ล"
        if coda in ['r', 'ɹ']: return f"โ{c}ร์"
        return f"โ{c}{CODA_MAP.get(coda, '')}"

    # 15. /ɪə/, /ɪər/
    if vowel in ['ɪə', 'ɪər', 'iə']:
        return f"เ{c}ียร์"

    # 16. /eə/, /eər/, /ɛɹ/
    if vowel in ['eə', 'eər', 'ɛɹ', 'ɛr']:
        return f"แ{c}ร์"

    # 17. /ʊə/, /ʊər/
    if vowel in ['ʊə', 'ʊər']:
        return f"{c}ัวร์"

    return f"{c}ะ"

VOWEL_PAT = r'(iː|i|ɪ|eɪ|ei|e|ɛ|æ|ɑː|ɑ|aː|a|ɒ|ɔː|ɔ|ʌ|ə|uː|u|ʊ|ɜːr|ɜː|ɝ|ər|ɚ|ɜr|ɜ|aɪ|ai|ɔɪ|oi|aʊ|au|oʊ|əʊ|ou|o|ɪər|ɪə|iə|eər|eə|ɛɹ|ɛr|ʊər|ʊə)'

def parse_ipa_to_thai(ipa_str):
    if not ipa_str: return ""
    clean_ipa = ipa_str.strip().strip('/').replace('ˈ', 'ˈ').replace('ˌ', 'ˌ')
    raw_syllables = re.split(r'[.\s]+', clean_ipa)
    
    result_syllables = []
    for raw in raw_syllables:
        vowels_found = re.findall(VOWEL_PAT, raw)
        if len(vowels_found) <= 1:
            m = re.search(r'([ˈˌ])?([^' + VOWEL_PAT + r']*)' + VOWEL_PAT + r'([^' + VOWEL_PAT + r']*)', raw)
            if m:
                stress, onset_raw, vowel, coda_raw = m.groups()
                onset_clean = re.sub(r'[ˈˌ]', '', onset_raw).strip()
                coda_clean = re.sub(r'[ˈˌ]', '', coda_raw).strip() if coda_raw else ''
                
                onset_th = CLUSTER_ONSETS.get(onset_clean, ONSET_MAP.get(onset_clean, ''))
                if not onset_th and onset_clean:
                    onset_th = "".join([ONSET_MAP.get(ch, '') for ch in onset_clean])
                if not onset_th:
                    onset_th = 'อ'
                
                th_syl = transcribe_syllable(onset_th, vowel, coda_clean, bool(stress))
                result_syllables.append(th_syl)
            else:
                if 'l' in raw or 'ɫ' in raw:
                    result_syllables.append('เทิล' if 't' in raw else 'เกิล' if 'k' in raw else 'เบิล' if 'b' in raw else 'เดิล' if 'd' in raw else 'เพิล' if 'p' in raw else 'เซิล' if 's' in raw else 'เลิล')
                elif 'n' in raw or 'm' in raw:
                    result_syllables.append('เทิน' if 't' in raw else 'เกิน' if 'k' in raw else 'เบิน' if 'b' in raw else 'เดน' if 'd' in raw else 'เพิน' if 'p' in raw else 'เซิน' if 's' in raw else 'เนิน')
        else:
            sub_matches = list(re.finditer(VOWEL_PAT, raw))
            last_idx = 0
            for i, vm in enumerate(sub_matches):
                v_start, v_end = vm.span()
                vowel = vm.group(0)
                onset_chunk = raw[last_idx:v_start].replace('ˈ', '').replace('ˌ', '')
                
                if i + 1 < len(sub_matches):
                    next_v_start = sub_matches[i + 1].start()
                    between = raw[v_end:next_v_start].replace('ˈ', '').replace('ˌ', '')
                    if len(between) <= 1:
                        coda_chunk = ''
                        last_idx = v_end
                    else:
                        coda_chunk = between[0]
                        last_idx = v_end + 1
                else:
                    coda_chunk = raw[v_end:].replace('ˈ', '').replace('ˌ', '')
                    last_idx = len(raw)
                
                onset_th = CLUSTER_ONSETS.get(onset_chunk, ONSET_MAP.get(onset_chunk, ''))
                if not onset_th and onset_chunk:
                    onset_th = "".join([ONSET_MAP.get(ch, '') for ch in onset_chunk])
                if not onset_th:
                    onset_th = 'อ'
                
                th_syl = transcribe_syllable(onset_th, vowel, coda_chunk)
                result_syllables.append(th_syl)
                
    return "-".join([s for s in result_syllables if s])
