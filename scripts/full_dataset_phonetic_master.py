# -*- coding: utf-8 -*-
"""
Full Dataset Phonetic Master V2:
Audits, cleans, and regenerates phonetic Thai transliterations for all 6,510 words.
"""

import json
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from ipa_to_thai import parse_ipa_to_thai

# High Accuracy Hand-Curated Thai Pronunciations
CURATED_EXACT = {
    'nobody': ('ˈnoʊbədi', 'โน-บอ-ดี', 'pron.', 'ไม่มีใคร, ไม่มีผู้ใด'),
    'o’clock': ('əˈklɒk', 'เออะ-คล็อก / อะ-คล็อก', 'adv.', 'โมง, นาฬิกา (บอกเวลาตรง)'),
    'brain': ('breɪn', 'เบรน', 'n.', 'สมอง, สติปัญญา'),
    'brave': ('breɪv', 'เบรฟ', 'adj.', 'กล้าหาญ'),
    'bread': ('bred', 'เบรด', 'n.', 'ขนมปัง'),
    'break': ('breɪk', 'เบรค', 'v., n.', 'แตก, หัก, พักผ่อน, การหยุดพัก'),
    'breakfast': ('ˈbrekfəst', 'เบรค-ฟาสต์', 'n.', 'อาหารเช้า'),
    'breath': ('breθ', 'เบรธ', 'n.', 'ลมหายใจ'),
    'breathe': ('briːð', 'บรีธ', 'v.', 'หายใจ'),
    'drain': ('dreɪn', 'เดรน', 'v., n.', 'ระบายน้ำ, ท่อระบายน้ำ'),
    'dress': ('dres', 'เดรส', 'n., v.', 'ชุดกระโปรง, แต่งกาย'),
    'fraud': ('frɔːd', 'ฟรอด', 'n.', 'การฉ้อโกง, ผู้หลอกลวง'),
    'fresh': ('freʃ', 'เฟรช', 'adj.', 'สด, สดชื่น, ใหม่'),
    'fruit': ('fruːt', 'ฟรูท', 'n.', 'ผลไม้'),
    'grade': ('ɡreɪd', 'เกรด', 'n., v.', 'ระดับ, ชั้นเรียน, ผลการเรียน'),
    'grain': ('ɡreɪn', 'เกรน', 'n.', 'เมล็ดข้าว, ธัญพืช'),
    'great': ('ɡreɪt', 'เกรท', 'adj.', 'ยิ่งใหญ่, ดีเยี่ยม'),
    'green': ('ɡriːn', 'กรีน', 'adj., n.', 'สีเขียว'),
    'greet': ('ɡriːt', 'กรีท', 'v.', 'ทักทาย, ต้อนรับ'),
    'greeting': ('ˈɡriːtɪŋ', 'กรีท-ทิง', 'n.', 'คำทักทาย'),
    'grey': ('ɡreɪ', 'เกรย์', 'adj., n.', 'สีเทา'),
    'grief': ('ɡriːf', 'กรีฟ', 'n.', 'ความโศกเศร้า, ความทุกข์ระทม'),
    'group': ('ɡruːp', 'กรุ๊ป', 'n., v.', 'กลุ่ม, รวมกลุ่ม'),
    'praise': ('preɪz', 'เพรส', 'v., n.', 'สรรเสริญ, ชมเชย'),
    'pray': ('preɪ', 'เพรย์', 'v.', 'อธิษฐาน, สวดมนต์'),
    'press': ('pres', 'เพรส', 'n., v.', 'กด, หนังสือพิมพ์, สื่อมวลชน'),
    'prey': ('preɪ', 'เพรย์', 'n.', 'เหยื่อ, สัตว์ที่ถูกล่า'),
    'proof': ('pruːf', 'พรูฟ', 'n.', 'หลักฐาน, ข้อพิสูจน์'),
    'prove': ('pruːv', 'พรูฟว์', 'v.', 'พิสูจน์'),
    'rage': ('reɪdʒ', 'เรจ', 'n., v.', 'ความโกรธเกรี้ยว, คลุ้มคลั่ง'),
    'raid': ('reɪd', 'เรด', 'n., v.', 'การบุกจู่โจม, ตรวจค้น'),
    'rail': ('reɪl', 'เรล', 'n.', 'รางรถไฟ, ราวเกาะ'),
    'rain': ('reɪn', 'เรน', 'n., v.', 'ฝน, ฝนตก'),
    'ray': ('reɪ', 'เรย์', 'n.', 'รังสี, ลำแสง'),
    'rear': ('rɪər', 'เรียร์', 'adj., n., v.', 'ด้านหลัง, เลี้ยงดู'),
    'red': ('red', 'เรด', 'adj., n.', 'สีแดง'),
    'provender': ('ˈprɒvɪndər', 'พรอฟ-วิน-เดอร์', 'n.', 'เสบียง, อาหารสัตว์'),
    'route': ('ruːt', 'รูท', 'n.', 'เส้นทาง'),
    'rude': ('ruːd', 'รูด', 'adj.', 'หยาบคาย, ไร้มารยาท'),
    'rule': ('ruːl', 'รูล', 'n., v.', 'กฎ, กติกา, ปกครอง'),
    'scream': ('skriːm', 'สครีม', 'v., n.', 'กรีดร้อง, เสียงกรีดร้อง'),
    'screen': ('skriːn', 'สกรีน', 'n., v.', 'หน้าจอ, คัดกรอง'),
    'script': ('skrɪpt', 'สคริปต์', 'n.', 'บทละคร, ตัวเขียน, สคริปต์'),
    'sea': ('siː', 'ซี', 'n.', 'ทะเล, มหาสมุทร'),
    'shoe': ('ʃuː', 'ชู', 'n.', 'รองเท้า'),
    'shoes': ('ʃuːz', 'ชูส์', 'n.', 'รองเท้า (คู่)'),
    'straight': ('streɪt', 'สเตรท', 'adj., adv.', 'ตรง, ตรงไป'),
    'stream': ('striːm', 'สตรีม', 'n., v.', 'ลำธาร, กระแสน้ำ, ถ่ายทอดสด'),
    'stress': ('stres', 'สเตรส', 'n., v.', 'ความเครียด, เน้นย้ำ'),
    'stretch': ('stretʃ', 'สเตรช', 'v., n.', 'ยืด, ขยายตัว'),
    'strict': ('strɪkt', 'สตริกต์', 'adj.', 'เข้มงวด, เคร่งครัด'),
    'strong': ('strɒŋ', 'สตรอง', 'adj.', 'แข็งแรง, เข้มแข็ง, รุนแรง'),
    'trace': ('treɪs', 'เทรส', 'v., n.', 'ตามรอย, ร่องรอย'),
    'trade': ('treɪd', 'เทรด', 'n., v.', 'การค้า, ค้าขาย, แลกเปลี่ยน'),
    'trail': ('treɪl', 'เทรล', 'n., v.', 'ทางเดินป่า, ร่องรอย'),
    'train': ('treɪn', 'เทรน', 'n., v.', 'รถไฟ, ฝึกฝน, ฝึกอบรม'),
    'training': ('ˈtreɪnɪŋ', 'เทรน-นิง', 'n.', 'การฝึกอบรม, การฝึกซ้อม'),
    'trait': ('treɪt', 'เทรท', 'n.', 'ลักษณะนิสัย, คุณลักษณะเด่น'),
    'troop': ('truːp', 'ทรูป', 'n.', 'กองทหาร, กองกำลัง'),
    'truce': ('truːs', 'ทรูส', 'n.', 'การพักรบ, ข้อตกลงหยุดยิง'),
    'true': ('truː', 'ทรู', 'adj.', 'จริง, แท้จริง, ถูกต้อง'),
    'truly': ('ˈtruːli', 'ทรู-ลี', 'adv.', 'อย่างแท้จริง, โดยแท้จริง'),
    'week': ('wiːk', 'วีค', 'n.', 'สัปดาห์, 7 วัน'),
    'manage': ('ˈmænɪdʒ', 'แมน-นิจ', 'v.', 'จัดการ, บริหาร, รับมือ'),
    'managed': ('ˈmænɪdʒd', 'แมน-นิจด์', 'v.', 'จัดการแล้ว (รูปอดีตของ manage)'),
    'laugh': ('læf, lɑːf', 'ลาฟ / แล็ฟ', 'v., n.', 'หัวเราะ, เสียงหัวเราะ'),
    'laughter': ('ˈlæftər, ˈlɑːftər', 'ลาฟ-เตอร์ / แล็ฟ-เตอร์', 'n.', 'เสียงหัวเราะ, ความขบขัน'),
    'damage': ('ˈdæmɪdʒ', 'แดม-มิจ', 'n., v.', 'ความเสียหาย, ทำให้เสียหาย'),
    'data': ('ˈdeɪtə, ˈdætə', 'เด-ต้า / ดา-ต้า', 'n.', 'ข้อมูล'),
    'database': ('ˈdeɪtəbeɪs', 'เด-ต้า-เบส', 'n.', 'ฐานข้อมูล'),
    'door': ('dɔːr', 'ดอร์', 'n.', 'ประตู'),
    'double': ('ˈdʌbl', 'ดับ-เบิล', 'adj., n., v.', 'สองเท่า, สองชั้น'),
    'down': ('daʊn', 'ดาวน์', 'adv., prep.', 'ลง, ข้างล่าง'),
    'download': ('ˌdaʊnˈloʊd', 'ดาวน์-โหลด', 'v., n.', 'ดาวน์โหลด'),
    'dream': ('driːm', 'ดรีม', 'n., v.', 'ฝัน, ความฝัน'),
    'due': ('djuː, duː', 'ดิว / ดู', 'adj.', 'ครบกำหนด, เนื่องจาก'),
    'duty': ('ˈdjuːti, ˈduːti', 'ดิว-ที / ดู-ที', 'n.', 'หน้าที่, ภาษีศุลกากร'),
    'all right': ('ɔːl ˈraɪt', 'ออล ไรท์', 'adj./adv. exclam.', 'เรียบร้อย, ตกลง, ไม่เป็นไร'),
    'have to': ('ˈhæv tuː, ˈhæf tə', 'แฮฟว์ ทู', 'modal v.', 'ต้อง, จำเป็นต้อง'),
    'ice cream': ('ˈaɪs kriːm', 'ไอศ-ครีม / ไอศกรีม', 'n.', 'ไอศกรีม, ของหวานแช่แข็ง'),
    'next to': ('ˈnekst tuː, ˈnekst tə', 'เน็กซ์ ทู', 'prep.', 'ถัดจาก, ข้างๆ'),
    'behaviour': ('bɪˈheɪvjər', 'บิ-เฮ-เวียร์', 'n.', 'พฤติกรรม, ความประพฤติ'),
    'behavior': ('bɪˈheɪvjər', 'บิ-เฮ-เวียร์', 'n.', 'พฤติกรรม, ความประพฤติ'),
    'concise': ('kənˈsaɪs', 'คัน-ไซส์', 'adj.', 'กระชับ, รัดกุม'),
    'conserve': ('kənˈsɜːrv', 'คัน-เสิร์ฟ', 'v.', 'อนุรักษ์, สงวนรักษา'),
    'convene': ('kənˈviːn', 'คัน-วีน', 'v.', 'เรียกประชุม, รวมตัว'),
    'coexist': ('ˌkoʊɪɡˈzɪst', 'โค-อิก-ซิสต์', 'v.', 'อยู่ร่วมกัน, อาศัยอยู่ร่วมกัน'),
}

def is_anomalous_thai(thai_str, word):
    t = (thai_str or '').strip()
    w = (word or '').strip().lower()
    first_char = w[0] if w else ''
    
    # 1. Non-vowel initial word starts with 'อ' or 'เอ' without consonant
    if first_char not in ['a', 'e', 'i', 'o', 'u', 'y'] and not w.startswith(('hour', 'honest', 'honor', 'heir')):
        if t.startswith(('อี', 'เอา', 'อู', 'อุ', 'อ็อ', 'อั', 'อิ', 'โอ', 'ออย', 'ออล', 'ออร์', 'ออคร', 'แอก', 'แอด')):
            return True
        if t.startswith('อ-') or t.startswith('อะ-') or t.startswith('เอะ-') or t.startswith('อา-'):
            return True
        # Inverted 'เอ' + coda (e.g. เอน, เอด, เอค, เอฟ, เอส, เอช, เอย์, เอล, เอจ, เอธ)
        if re.match(r'^เอ[ก-ฮ์]{1,2}$', t):
            return True

    # 2. Contains vowel-only sequence
    if 'อะ-อา-เอะ' in t or 'อะ-อา' in t or 'เอะ-อา-ไอ' in t or 'โอ-น-เอะ' in t or 'โอ-เอะ' in t or 'แอ-เอะ' in t:
        return True

    # 3. Ends in trailing dangling -เอะ
    if t.endswith('-เอะ') or '-เอะ-' in t:
        return True

    return False

def main():
    vocab_path = os.path.join(os.path.dirname(__file__), '../src/data/vocabulary.json')
    with open(vocab_path, 'r', encoding='utf-8') as f:
        vocab = json.load(f)

    print(f"Processing {len(vocab)} vocabulary entries...")

    curated_count = 0
    reconstructed_count = 0

    for item in vocab:
        w = (item.get('word') or '').strip().lower()
        old_thai = item.get('thai_pronunciation', '').strip()
        ipa = item.get('ipa', '').strip()

        # Step 1: Curated dictionary (highest accuracy)
        if w in CURATED_EXACT:
            cur = CURATED_EXACT[w]
            item['ipa'] = cur[0]
            item['thai_pronunciation'] = cur[1]
            if len(cur) > 2 and cur[2]:
                item['type'] = cur[2]
            if len(cur) > 3 and cur[3]:
                item['meaning'] = cur[3]
            curated_count += 1
            continue

        # Step 2: Fix anomalous pronunciations using IPA transcriber
        if is_anomalous_thai(old_thai, w):
            new_thai = parse_ipa_to_thai(ipa)
            if new_thai and len(new_thai) >= 2:
                item['thai_pronunciation'] = new_thai
                reconstructed_count += 1
            else:
                cleaned = re.sub(r'-เอะ$', '', old_thai).replace('-เอะ-', '-')
                item['thai_pronunciation'] = cleaned
                reconstructed_count += 1

    with open(vocab_path, 'w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)

    print(f"Done! Curated applied: {curated_count}, Reconstructed: {reconstructed_count}")

if __name__ == '__main__':
    main()
