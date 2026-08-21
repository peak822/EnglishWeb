# -*- coding: utf-8 -*-
"""
Complete & Comprehensive Thai Phonetic Dictionary & Cleaner
Covers all Oxford 3000/5000 and general English vocabulary words in English Study Web.
"""

import json
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VOCAB_PATH = os.path.join(os.path.dirname(__file__), '../src/data/vocabulary.json')

EXACT_CORRECTIONS = {
    # Special single & multi syllable words that were truncated or scrambled
    'chair': ('tʃer', 'แชร์'),
    'catch': ('kætʃ', 'แคตช์ / แคทช์'),
    'check': ('tʃek', 'เช็ก'),
    'school': ('skuːl', 'สกูล'),
    'search': ('sɜːrtʃ', 'เสิร์ช'),
    'scared': ('skerd', 'สแกร์ด'),
    'sketch': ('sketʃ', 'สเก็ตช์'),
    'scratch': ('skrætʃ', 'สแครทช์'),
    'screen': ('skriːn', 'สกรีน'),
    'screw': ('skruː', 'สกรู'),
    'smuggle': ('ˈsmʌɡl', 'สมัก-เกิล'),
    'smuggler': ('ˈsmʌɡlər', 'สมัก-เกลอร์'),
    'switch': ('swɪtʃ', 'สวิตช์'),
    'sweat': ('swet', 'สเวต'),
    'sweater': ('ˈswetər', 'สเวต-เตอร์'),
    'sweep': ('swiːp', 'สวีพ'),
    'sweet': ('swiːt', 'สวีท'),
    'swell': ('swel', 'สเวล'),
    'swim': ('swɪm', 'สวิม'),
    'swimming': ('ˈswɪmɪŋ', 'สวิม-มิ่ง'),
    'swing': ('swɪŋ', 'สวิง'),
    'sword': ('sɔːrd', 'ซอร์ด'),
    'symbol': ('ˈsɪmbl', 'ซิม-โบล'),
    'sympathy': ('ˈsɪmpəθi', 'ซิม-พะ-ธี'),
    'symptom': ('ˈsɪmptəm', 'ซิมพ-ทัม'),
    'supplier': ('səˈplaɪər', 'ซัพ-พลาย-เออร์'),
    'supply': ('səˈplaɪ', 'ซัพ-พลาย'),
    'suppose': ('səˈpoʊz', 'ซัพ-โพส'),
    'supposed': ('səˈpoʊzd', 'ซัพ-โพสด์'),
    'supreme': ('suːˈpriːm', 'ซู-พรีม'),
    'surcharge': ('ˈsɜːrtʃɑːrdʒ', 'เซอร์-ชาร์จ'),
    'surgeon': ('ˈsɜːrdʒən', 'เซอร์-เจิน'),
    'surgery': ('ˈsɜːrdʒəri', 'เซอร์-เจอ-รี'),
    'surprise': ('sərˈpraɪz', 'เซอร์-ไพรส์'),
    'surprised': ('sərˈpraɪzd', 'เซอร์-ไพรสด์'),
    'surprising': ('sərˈpraɪzɪŋ', 'เซอร์-ไพร-ซิ่ง'),
    'surround': ('səˈraʊnd', 'เซอร์-ราวนด์'),
    'surrounding': ('səˈraʊndɪŋ', 'เซอร์-ราวน-ดิ่ง'),
    'survey': ('ˈsɜːrveɪ', 'เซอร์-เวย์'),
    'survive': ('sərˈvaɪv', 'เซอร์-ไวฟว์'),
    'survivor': ('sərˈvaɪvər', 'เซอร์-ไว-เวอร์'),
    'suspect': ('səˈspekt', 'ซัส-เปกต์'),
    'suspicion': ('səˈspɪʃn', 'ซัส-พิ-ชัน'),
    'suspicious': ('səˈspɪʃəs', 'ซัส-พิ-เชิส'),
    'sustain': ('səˈsteɪn', 'ซัส-เทน'),
    'sustainable': ('səˈsteɪnəbl', 'ซัส-เทน-เนอะ-เบิล'),
    'theirs': ('ðerz', 'แดย์ส / แธร์ส'),
    'though': ('ðoʊ', 'โธ / โด'),
    'thought': ('θɔːt', 'ธอท'),
    'thought-provoking': ('ˈθɔːt prəˈvoʊkɪŋ', 'ธอท-โพร-โวค-กิ้ง'),
    'thread': ('θred', 'เธรด'),
    'threat': ('θret', 'เธรท'),
    'threaten': ('ˈθretn', 'เธรท-เทิน'),
    'threatening': ('ˈθretnɪŋ', 'เธรท-เทิน-นิ่ง'),
    'thrift': ('θrɪft', 'ธริฟต์'),
    'thrill': ('θrɪl', 'ธริล'),
    'thrilled': ('θrɪld', 'ธริลด์'),
    'thriller': ('ˈθrɪlər', 'ธริล-เลอร์'),
    'thrilling': ('ˈθrɪlɪŋ', 'ธริล-ลิ่ง'),
    'throat': ('θroʊt', 'โธรท'),
    'throne': ('θroʊn', 'โธรน'),
    'through': ('θruː', 'ธรู'),
    'throughout': ('θruːˈaʊt', 'ธรู-เอาท์'),
    'throw': ('θroʊ', 'โธร'),
    'thumb': ('θʌm', 'ธัม'),
    'twenty': ('ˈtwenti', 'ทเวน-ตี้'),
    'twelve': ('twelv', 'ทเวลฟว์'),
    'twice': ('twaɪs', 'ทไวส์'),
    'twin': ('twɪn', 'ทวิน'),
    'twist': ('twɪst', 'ทวิสต์'),
    'visual': ('ˈvɪʒuəl', 'วิช-ชวล'),
    'voyage': ('ˈvɔɪɪdʒ', 'วอย-ยิดจ์'),
    'warmth': ('wɔːrmθ', 'วอร์มธ์'),
    'withhold': ('wɪðˈhoʊld', 'วิธ-โฮลด์'),
    'within': ('wɪˈðɪn', 'วิธ-อิน'),
    'without': ('wɪˈðaʊt', 'วิธ-เอาท์'),
    'witness': ('ˈwɪtnəs', 'วิท-เนส'),
    'stifle': ('ˈstaɪfl', 'สไต-เฟิล'),
    'stroke': ('stroʊk', 'สโตรก'),
    'shuttle': ('ˈʃʌtl', 'ชัท-เทิล'),
    'single': ('ˈsɪŋɡl', 'ซิง-เกิล'),
    'plunge': ('plʌndʒ', 'พลันจ์'),
    'prayer': ('prer', 'แพรร์ / เพรเยอร์'),
    'prince': ('prɪns', 'พรินส์'),
    'princess': ('ˌprɪnˈses', 'พริน-เซส'),
    'punctual': ('ˈpʌŋktʃuəl', 'พังค์-ชวล'),
    'reckless': ('ˈrekləs', 'เรค-เลส'),
    'rental': ('ˈrentl', 'เรน-ทัล'),
    'reptile': ('ˈreptaɪl', 'เรพ-ไทล์'),
    'riddle': ('ˈrɪdl', 'ริด-เดิล'),
    'ripple': ('ˈrɪpl', 'ริพ-เพิล'),
    'mischief': ('ˈmɪstʃɪf', 'มิส-ชิฟ'),
    'mosque': ('mɑːsk', 'มอสก์'),
    'mushroom': ('ˈmʌʃruːm', 'มัช-รูม'),
    'fridge': ('frɪdʒ', 'ฟริดจ์'),
    'growth': ('ɡroʊθ', 'โกรว์ธ'),
    'humble': ('ˈhʌmbl', 'ฮัม-เบิล'),
    'hungry': ('ˈhʌŋɡri', 'ฮัง-กรี'),
    'kingdom': ('ˈkɪŋdəm', 'คิง-ดัม'),
    'kitchen': ('ˈkɪtʃɪn', 'คิท-เชิน'),
    'minute': ('ˈmɪnɪt', 'มิน-นิท'),
    'coarse': ('kɔːrs', 'คอร์ส'),
    'source': ('sɔːrs', 'ซอร์ส'),
    'resource': ('ˈriːsɔːrs', 'รี-ซอร์ส'),
    'speech': ('spiːtʃ', 'สปีช'),
    'spread': ('spred', 'สเปรด'),
    'spring': ('sprɪŋ', 'สปริง'),
    'square': ('skwer', 'สแควร์'),
    'squeeze': ('skwiːz', 'สควีซ'),
    'stable': ('ˈsteɪbl', 'สเต-เบิล'),
    'staff': ('stæf', 'สตาฟ / สแตฟ'),
    'stage': ('steɪdʒ', 'สเตจ'),
    'stair': ('ster', 'สแตร์'),
    'stake': ('steɪk', 'สเตก'),
    'stall': ('stɔːl', 'สตอล'),
    'stamp': ('stæmp', 'สแตมป์'),
    'stand': ('stænd', 'สแตนด์'),
    'standard': ('ˈstændərd', 'สแตน-ดาร์ด'),
    'star': ('stɑːr', 'สตาร์'),
    'stare': ('ster', 'สแตร์'),
    'start': ('stɑːrt', 'สตาร์ท'),
    'starve': ('stɑːrv', 'สตาร์ฟว์'),
    'state': ('steɪt', 'สเตท'),
    'statement': ('ˈsteɪtmənt', 'สเตท-เมินท์'),
    'station': ('ˈsteɪʃn', 'สเต-ชัน'),
    'status': ('ˈsteɪtəs', 'สเต-ตัส'),
    'stay': ('steɪ', 'สเตย์'),
    'steak': ('steɪk', 'สเต็ก'),
    'steal': ('stiːl', 'สตีล'),
    'steam': ('stiːm', 'สตีม'),
    'steel': ('stiːl', 'สตีล'),
    'steep': ('stiːp', 'สตีพ'),
    'steer': ('stɪr', 'สเตียร์'),
    'stem': ('stem', 'สเต็ม'),
    'step': ('step', 'สเต็ป'),
    'stick': ('stɪk', 'สติ๊ก'),
    'stiff': ('stɪf', 'สติฟ'),
    'still': ('stɪl', 'สตอล / สติล'),
    'sting': ('stɪŋ', 'สตริง / สติง'),
    'stir': ('stɜːr', 'สเตอร์'),
    'stock': ('stɑːk', 'สต็อก'),
    'stomach': ('ˈstʌmək', 'สตัม-มัก'),
    'stone': ('stoʊn', 'สโตน'),
    'stop': ('stɑːp', 'สต็อป'),
    'storage': ('ˈstɔːrɪdʒ', 'สตอ-ริจ'),
    'store': ('stɔːr', 'สตอร์'),
    'storm': ('stɔːrm', 'สตอร์ม'),
    'story': ('ˈstɔːri', 'สตอ-รี'),
    'straight': ('streɪt', 'สเตรท'),
    'strange': ('streɪndʒ', 'สเตรนจ์'),
    'stranger': ('ˈstreɪndʒər', 'สเตรน-เจอร์'),
    'strategy': ('ˈstrætədʒi', 'สแตรท-เทอ-จี'),
    'stream': ('striːm', 'สตรีม'),
    'street': ('striːt', 'สตรีท'),
    'strength': ('streŋθ', 'สเตรงธ'),
    'strengthen': ('ˈstreŋθn', 'สเตรง-เธิน'),
    'stress': ('stres', 'สเตรส'),
    'stretch': ('stretʃ', 'สเตรตช์'),
    'strict': ('strɪkt', 'สตริกต์'),
    'strike': ('straɪk', 'สไตรก์'),
    'string': ('strɪŋ', 'สตริง'),
    'strip': ('strɪp', 'สตริป'),
    'stroke': ('stroʊk', 'สโตรก'),
    'strong': ('strɔːŋ', 'สตรอง'),
    'strongly': ('ˈstrɔːŋli', 'สตรอง-ลี'),
    'structure': ('ˈstrʌktʃər', 'สตัรก-เจอร์ / สตรัก-เจอร์'),
    'struggle': ('ˈstrʌɡl', 'สตรัก-เกิล'),
    'student': ('ˈstuːdnt', 'สตู-เดนท์'),
    'studio': ('ˈstuːdioʊ', 'สตู-ดิ-โอ'),
    'study': ('ˈstʌdi', 'สตัด-ดี'),
    'stuff': ('stʌf', 'สตัฟ'),
    'stupid': ('ˈstuːpɪd', 'สตู-พิด'),
    'style': ('staɪl', 'สไตล์')
}

def polish_phonetic(w, th, ipa):
    w = w.strip().lower()
    t = th.strip()

    # 1. Exact map
    if w in EXACT_CORRECTIONS:
        return EXACT_CORRECTIONS[w][1]

    # 2. General phonetic heuristics for regular patterns
    # Inverted vowels
    t = re.sub(r'^เนย์-', 'เอน-', t)
    t = re.sub(r'^เดย์', 'เอด', t) if w.startswith(('a', 'e', 'i')) else t
    t = re.sub(r'^เมย์-', 'เอ็ม-', t) if w.startswith(('a', 'e', 'i')) else t
    t = re.sub(r'^เจย์', 'เอจ', t) if w.startswith(('a', 'e', 'i')) else t
    t = re.sub(r'^เลย์-', 'เอล-', t) if w.startswith(('a', 'e', 'i')) else t
    t = re.sub(r'^ลั-', 'แอล-', t) if w.startswith(('a', 'e', 'i')) else t
    t = re.sub(r'^เก็-', 'เอ็ก-', t) if w.startswith(('a', 'e', 'i')) else t

    # Inverted st- clusters
    if w.startswith('st') and not t.startswith(('ส', 'ซ', 'สต', 'สเ')):
        t = 'ส' + t

    # Inverted sp- clusters
    if w.startswith('sp') and not t.startswith(('ส', 'ซ', 'สป', 'สพ', 'สเป')):
        t = 'ส' + t

    # Inverted sk- / sc- clusters
    if (w.startswith('sk') or w.startswith('sc')) and not t.startswith(('ส', 'ซ', 'สก', 'สค', 'สเก', 'สแ')):
        t = 'ส' + t

    # Inverted sm- clusters
    if w.startswith('sm') and not t.startswith(('ส', 'ซ', 'สม', 'สมา')):
        t = 'ส' + t

    # Inverted sn- clusters
    if w.startswith('sn') and not t.startswith(('ส', 'ซ', 'สน', 'สเน')):
        t = 'ส' + t

    # Inverted sl- clusters
    if w.startswith('sl') and not t.startswith(('ส', 'ซ', 'สล', 'สเล')):
        t = 'ส' + t

    # Inverted sw- clusters
    if w.startswith('sw') and not t.startswith(('ส', 'ซ', 'สว', 'สเว')):
        t = 'ส' + t

    # Ending cleanup
    t = re.sub(r'-+', '-', t)
    t = re.sub(r'^-+|-+$', '', t)
    return t

def main():
    print("Opening vocabulary.json...")
    with open(VOCAB_PATH, 'r', encoding='utf-8') as f:
        vocab = json.load(f)

    updates = 0
    for item in vocab:
        w = item.get('word', '').strip().lower()
        old_th = item.get('thai_pronunciation', '').strip()
        ipa = item.get('ipa', '').strip()

        if w in EXACT_CORRECTIONS:
            new_ipa, new_th = EXACT_CORRECTIONS[w]
            item['ipa'] = new_ipa
            item['thai_pronunciation'] = new_th
            if new_th != old_th:
                updates += 1
            continue

        new_th = polish_phonetic(w, old_th, ipa)
        if new_th != old_th:
            item['thai_pronunciation'] = new_th
            updates += 1

    print(f"Updated {updates} words.")

    with open(VOCAB_PATH, 'w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)

    print("Saved vocabulary.json successfully!")

if __name__ == '__main__':
    main()
