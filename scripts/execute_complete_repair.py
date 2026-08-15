# -*- coding: utf-8 -*-
import json
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

# Rule-based cluster replacement for Latin/IPA in Thai pronunciations
CLUSTER_MAP = {
    'nd': 'นด์',
    'ŋk': 'งก์',
    'ŋks': 'งก์ส',
    'kst': 'กซต์',
    'kt': 'กต์',
    'ld': 'ลด์',
    'ɫd': 'ลด์',
    'lf': 'ลฟ์',
    'lvz': 'ลฟ์ส',
    'lt': 'ลต์',
    'ɫt': 'ลต์',
    'ɫp': 'ลป์',
    'ɫm': 'ลม์',
    'mpt': 'มป์ต์',
    'mps': 'มปส์',
    'mp': 'มป์',
    'mz': 'มส์',
    'ndʒ': 'นจ์',
    'nʤ': 'นจ์',
    'ntʃ': 'นช์',
    'nʧ': 'นช์',
    'nst': 'นสต์',
    'nts': 'นต์ส',
    'ntn': 'น-เทิน',
    'nt': 'นต์',
    'ns': 'นส์',
    'nz': 'นส์',
    'nθ': 'นธ์',
    'ps': 'ปส์',
    'pt': 'ปต์',
    'rdz': 'ร์ดส์',
    'rd': 'ร์ด',
    'rk': 'ร์ก',
    'rnd': 'ร์นด์',
    'rm': 'ร์ม',
    'rn': 'ร์น',
    'rt': 'ร์ต',
    'sk': 'สก์',
    'sp': 'สป์',
    'st': 'สต์',
    'vd': 'ฟวด์',
    'zd': 'สด์',
    'ðz': 'ธส์',
    'ŋθ': 'งธ์',
    'θs': 'ธส์',
    'ks': 'กส์',
    'dz': 'ดส์',
    'ft': 'ฟต์',
    'ls': 'ลส์',
    # Single consonants remaining at syllable ends
    'd': 'ด์',
    'k': 'ก',
    'l': 'ล',
    'm': 'ม',
    't': 'ต์',
    'v': 'ฟว์',
}

# Specific manual overrides for words where cluster replacement would be slightly imperfect
MANUAL_PRONUNCIATION_OVERRIDES = {
    'cd': ('ซี-ดี', 'ˌsiːˈdiː'),
    'dvd': ('ดี-วี-ดี', 'ˌdiː.viːˈdiː'),
    'crack': ('แคร็ก', 'kræk'),
    'drag': ('ดแร็ก', 'dræɡ'),
    'track': ('แทร็ก', 'træk'),
    'phrase': ('เฟรซ', 'freɪz'),
    'rhythmic': ('ริธ-มิก', 'ˈrɪð.mɪk'),
    'slap': ('สแล็ป', 'slæp'),
    'slash': ('สแลช', 'slæʃ'),
    'slave': ('สเลฟ', 'sleɪv'),
    'slice': ('สไลซ์', 'slaɪs'),
    'slightly': ('สไลต์-ลี', 'ˈslaɪt.li'),
    'slip': ('สลิป', 'slɪp'),
    'slot': ('สล็อต', 'slɒt'),
    'squad': ('สควอด', 'skwɒd'),
    'squeeze': ('สควีซ', 'skwiːz'),
    'thwart': ('ธวอร์ต', 'θwɔːt'),
    'twelve': ('ทเวลฟ์', 'twɛlv'),
    'twice': ('ทไวซ์', 'twaɪs'),
    'twin': ('ทวิน', 'twɪn'),
    'twist': ('ทวิสต์', 'twɪst'),
    'clock': ('คล็อก', 'klɒk'),
    'best': ('เบสต์', 'bɛst'),
    'red': ('เรด', 'rɛd'),
    'step': ('สเต็ป', 'stɛp'),
    'vet': ('เว็ท', 'vɛt'),
    'web': ('เว็บ', 'wɛb'),
    'wet': ('เว็ท', 'wɛt'),
    'background': ('แบ็ก-เกรานด์', 'ˈbæk.ɡraʊnd'),
    'backwards': ('แบ็ก-เวิร์ดส์', 'ˈbæk.wədz'),
    'balance': ('แบ-ลันส์', 'ˈbæl.əns'),
    'balanced': ('แบ-ลันสต์', 'ˈbæl.ənst'),
    'battlefield': ('แบท-เทิล-ฟีลด์', 'ˈbæt.əl.fiːld'),
    'beloved': ('บิ-ลัฟวด์', 'bɪˈlʌv.ɪd'),
    'benchmark': ('เบนช์-มาร์ก', 'ˈbentʃ.mɑːk'),
    'broadband': ('บรอด-แบนด์', 'ˈbrɔːd.bænd'),
    'circumstance': ('เซอร์-คัม-สแตนส์', 'ˈsɜː.kəm.stɑːns'),
    'clothes': ('โคลธส์', 'kləʊðz'),
    'mountain': ('เมาน์-เทิน', 'ˈmaʊn.tɪn'),
    'themselves': ('เดม-เซลฟ์ส', 'ðəmˈselvz'),
    'towards': ('เทอะ-วอร์ดส์', 'təˈwɔːdz'),
    'brand': ('แบรนด์', 'brænd'),
    'breast': ('เบรสต์', 'brest'),
    'bomb': ('บอมบ์', 'bɒm'),
}

# Manual POS & Meaning fixes
MANUAL_POS_AND_MEANING_OVERRIDES = {
    'pivotal': {'type': 'adj.', 'meaning': 'ซึ่งมีความสำคัญอย่างยิ่ง / ที่เป็นแกนหลักสำคัญ'},
    'appraisal': {'type': 'n.', 'meaning': 'การประเมินค่า / การประเมินผล'},
    'denial': {'type': 'n.', 'meaning': 'การปฏิเสธ / การไม่ยอมรับ'},
    'dismissal': {'type': 'n.', 'meaning': 'การเลิกจ้าง / การไล่ออก / การยกฟ้อง'},
    'disposal': {'type': 'n.', 'meaning': 'การกำจัด / การทิ้ง / การจัดการ'},
    'portrayal': {'type': 'n.', 'meaning': 'การพรรณนา / การวาดภาพ / การแสดงบทบาท'},
    'rebuttal': {'type': 'n.', 'meaning': 'การโต้แย้ง / การหักล้าง'},
    'refusal': {'type': 'n.', 'meaning': 'การปฏิเสธ / การไม่ยอมรับ'},
    'rehearsal': {'type': 'n.', 'meaning': 'การซ้อม / การฝึกซ้อม'},
    'removal': {'type': 'n.', 'meaning': 'การกำจัด / การโยกย้าย / การถอดออก'},
    'retrieval': {'type': 'n.', 'meaning': 'การดึงข้อมูล / การกู้ข้อมูลคืน'},
    'reversal': {'type': 'n.', 'meaning': 'การกลับตาลปัตร / การพลิกผัน / การยกเลิก'},
    'revival': {'type': 'n.', 'meaning': 'การฟื้นฟู / การคืนชีพ'},
    'survival': {'type': 'n.', 'meaning': 'การอยู่รอด / ความอยู่รอด'},
    'withdrawal': {'type': 'n.', 'meaning': 'การถอนตัว / การถอนเงิน / การถอนทัพ'},
    'entertain': {'type': 'v.', 'meaning': 'ให้ความบันเทิง / สร้างความเพลิดเพลิน'},
    'expertise': {'type': 'n.', 'meaning': 'ความเชี่ยวชาญ / ทักษะความชำนาญเฉพาะทาง'},
    'competitive': {'type': 'adj.', 'meaning': 'เกี่ยวกับการแข่งขัน / มุ่งมั่นที่จะชนะ / ที่แข่งขันได้'},
    'defensive': {'type': 'adj.', 'meaning': 'เกี่ยวกับการป้องกัน / ซึ่งตั้งรับ / ที่ระแวดระวัง'},
    'diplomatic': {'type': 'adj.', 'meaning': 'เกี่ยวกับการทูต / มีชั้นเชิงทางการทูต'},
    'electoral': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเลือกตั้ง'},
    'financial': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเงิน / ทางการเงิน'},
    'fiscal': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเงินการคลัง / ทางงบประมาณ'},
    'judicial': {'type': 'adj.', 'meaning': 'เกี่ยวกับศาลหรือการพิจารณาคดี / ทางตุลาการ'},
    'martial': {'type': 'adj.', 'meaning': 'เกี่ยวกับการต่อสู้ / ทางการทหาร'},
    'matching': {'type': 'adj.', 'meaning': 'ที่เข้าคู่กัน / ที่เข้าชุดกัน'},
    'metabolic': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเผาผลาญพลังงานในร่างกาย'},
    'occupational': {'type': 'adj.', 'meaning': 'เกี่ยวกับอาชีพการงาน'},
    'operational': {'type': 'adj.', 'meaning': 'เกี่ยวกับการปฏิบัติการ / พร้อมใช้งาน'},
    'pandemic': {'type': 'adj., n.', 'meaning': 'เกี่ยวกับการระบาดใหญ่ทั่วโลก, โรคระบาดครั้งใหญ่'},
    'pedagogical': {'type': 'adj.', 'meaning': 'เกี่ยวกับวิชาการสอน / ด้านครุศาสตร์'},
    'penal': {'type': 'adj.', 'meaning': 'เกี่ยวกับการลงโทษทางกฎหมาย / ทางอาญา'},
    'punitive': {'type': 'adj.', 'meaning': 'เพื่อเป็นการลงโทษ / เกี่ยวกับการลงโทษ'},
    'remedial': {'type': 'adj.', 'meaning': 'เพื่อการรักษาเยียวยา / เพื่อสอนเสริมปรับพื้นฐาน'},
    'reproductive': {'type': 'adj.', 'meaning': 'เกี่ยวกับการสืบพันธุ์ / ทางการขยายพันธุ์'},
    'speculative': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเก็งกำไร / ซึ่งเป็นการคาดเดา'},
    'surgical': {'type': 'adj.', 'meaning': 'เกี่ยวกับการผ่าตัด / ทางศัลยกรรม'},
    'theatrical': {'type': 'adj.', 'meaning': 'เกี่ยวกับโรงละครหรือการแสดงละคร / เวอร์เกินจริง'},
    'therapeutic': {'type': 'adj.', 'meaning': 'เกี่ยวกับการบำบัดรักษา / ให้ความรู้สึกผ่อนคลาย'},
    'working': {'type': 'adj.', 'meaning': 'เกี่ยวกับการทำงาน / ซึ่งใช้งานได้ / ซึ่งประกอบอาชีพ'},
    'comic': {'type': 'adj., n.', 'meaning': 'ตลกขบขัน, หนังสือการ์ตูน'},
}

# Apply fixes
fixed_count_pronunciation = 0
fixed_count_ipa = 0
fixed_count_meaning = 0

for item in vocab:
    w = item.get('word', '').strip()
    low = w.lower()

    # Manual Overrides First
    if low in MANUAL_PRONUNCIATION_OVERRIDES:
        th, ip = MANUAL_PRONUNCIATION_OVERRIDES[low]
        item['thai_pronunciation'] = th
        item['ipa'] = ip
        fixed_count_pronunciation += 1
        fixed_count_ipa += 1
    else:
        # Check if contains Latin / IPA leaks
        thai = item.get('thai_pronunciation', '')
        if re.search(r'[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]', thai):
            # Sort keys by length descending to replace multi-char clusters first
            for k in sorted(CLUSTER_MAP.keys(), key=lambda x: -len(x)):
                thai = thai.replace(k, CLUSTER_MAP[k])
            # Remove any stray IPA stress marks
            thai = re.sub(r'[ˈˌː]', '', thai)
            item['thai_pronunciation'] = thai
            fixed_count_pronunciation += 1

    # Check POS & Meaning Overrides
    if low in MANUAL_POS_AND_MEANING_OVERRIDES:
        ovr = MANUAL_POS_AND_MEANING_OVERRIDES[low]
        if 'type' in ovr:
            item['type'] = ovr['type']
        if 'meaning' in ovr:
            item['meaning'] = ovr['meaning']
        fixed_count_meaning += 1

print(f"Applied fixes -> Pronunciations: {fixed_count_pronunciation}, IPAs: {fixed_count_ipa}, Meanings/POS: {fixed_count_meaning}")

# Verify 0 leaks remaining
remaining_leaks = [x for x in vocab if re.search(r'[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]', x.get('thai_pronunciation', ''))]
print(f"Remaining leaks in Thai: {len(remaining_leaks)}")

# Write fixed vocabulary
with open('src/data/vocabulary.json', 'w', encoding='utf-8') as out:
    json.dump(vocab, out, ensure_ascii=False, indent=2)

print("Saved updated src/data/vocabulary.json")

# Now synchronize sentences.json wordIds
with open('src/data/sentences.json', 'r', encoding='utf-8') as f:
    sentences = json.load(f)

word_to_id = {v['word'].lower().strip(): v['id'] for v in vocab}
synced_sentences = 0
for s in sentences:
    sw = s['word'].lower().strip()
    if sw in word_to_id:
        s['wordId'] = word_to_id[sw]
        synced_sentences += 1
    else:
        print(f"Warning: sentence word '{s['word']}' not found in vocabulary")

with open('src/data/sentences.json', 'w', encoding='utf-8') as f:
    json.dump(sentences, f, ensure_ascii=False, indent=2)

print(f"Synchronized {synced_sentences}/{len(sentences)} sentences.json wordIds")
