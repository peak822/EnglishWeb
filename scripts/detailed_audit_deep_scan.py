# -*- coding: utf-8 -*-
"""
Deep inspection to find any words where Thai pronunciation might still have anomalies.
"""

import json
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VOCAB_PATH = os.path.join(os.path.dirname(__file__), '../src/data/vocabulary.json')
with open(VOCAB_PATH, 'r', encoding='utf-8') as f:
    vocab = json.load(f)

anomalies = []

# List of valid 1-syllable words in English
VALID_SINGLE_SYLLABLE_WORDS = {
    'breach', 'breath', 'breathe', 'cheese', 'choose', 'clause', 'cruise',
    'freeze', 'league', 'phrase', 'plague', 'pledge', 'praise', 'scheme',
    'should', 'shrewd', 'smooth', 'soothe', 'speech', 'thought', 'through',
    'weight', 'straight', 'bright', 'brought', 'caught', 'flight', 'friend',
    'height', 'knight', 'laugh', 'light', 'night', 'sight', 'slight', 'straight',
    'taught', 'threat', 'throat', 'throne', 'tight', 'twelve', 'white', 'whole',
    'whose', 'write', 'wrong', 'strength', 'source', 'struck', 'spring', 'stream',
    'street', 'strike', 'string', 'strong', 'struck', 'struggle', 'screen', 'scream',
    'spread', 'square', 'squash', 'squeeze', 'staff', 'stage', 'stain', 'stair',
    'stake', 'stall', 'stamp', 'stare', 'start', 'starve', 'state', 'stay',
    'steak', 'steal', 'steam', 'steel', 'steep', 'steer', 'stem', 'stick',
    'stiff', 'still', 'sting', 'stir', 'stock', 'stone', 'stop', 'store',
    'storm', 'story', 'strap', 'straw', 'stray', 'strip', 'stroke', 'stuff'
}

for item in vocab:
    w = item.get('word', '').strip().lower()
    th = item.get('thai_pronunciation', '').strip()
    ipa = item.get('ipa', '').strip()
    
    issues = []
    
    # 1. Suspiciously short Thai pronunciation (<= 4 chars) for words with >= 5 chars
    if len(w) >= 5 and len(th) <= 4 and w not in VALID_SINGLE_SYLLABLE_WORDS:
        issues.append(f"Short Thai ({th}) for word length {len(w)}")
        
    # 2. Contains broken vowels/consonant artifacts
    if re.search(r'งิ|โอ-ไอ|ไอ-อุ|โอ-เรอะ|เซ็ด|แรส์|พอยพนท์|แวส์|แทท|สิวท|ดอนร|ดัร์|คิรพ|ดอนท|ธรดี|ธรที|ธิรฟ|ธิรล|ท-อี|สัมก', th):
        issues.append("Corrupted string artifact")
        
    # 3. Contains English letters or weird symbols
    if re.search(r'[a-zA-Z?_+=<>]', th):
        issues.append("Non-Thai characters")

    # 4. Words ending in -tion / -sion but Thai doesn't end in -ชัน / -ชั่น
    if (w.endswith('tion') or w.endswith('sion')) and not (th.endswith('ชัน') or th.endswith('ชั่น') or th.endswith('ชึน') or th.endswith('เชิน')):
        issues.append("Missing -ชัน ending")
        
    # 5. Words ending in -able / -ible but Thai doesn't end in -เบิล / -เบิ้ล
    if (w.endswith('able') or w.endswith('ible')) and not (th.endswith('เบิล') or th.endswith('เบิ้ล') or th.endswith('บัล') or th.endswith('บล')):
        issues.append("Missing -เบิล ending")
        
    # 6. Words ending in -ment but Thai doesn't end in -เมินท์ / -เมนท์
    if w.endswith('ment') and not (th.endswith('เมินท์') or th.endswith('เมนท์') or th.endswith('มึนท์') or th.endswith('ต์') or th.endswith('นด์')):
        issues.append("Missing -เมินท์ ending")

    if issues:
        anomalies.append({
            'word': w,
            'ipa': ipa,
            'th': th,
            'meaning': item.get('meaning', ''),
            'issues': issues
        })

print(f"Total flagged anomalies: {len(anomalies)}")

with open(os.path.join(os.path.dirname(__file__), 'deep_scan_anomalies.json'), 'w', encoding='utf-8') as f:
    json.dump(anomalies, f, ensure_ascii=False, indent=2)

print("Wrote results to scripts/deep_scan_anomalies.json")
