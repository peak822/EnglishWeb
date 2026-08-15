# -*- coding: utf-8 -*-
import json
import re
import sys

# Force UTF-8 stdout
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

latin_leak_items = []
for item in vocab:
    thai = item.get('thai_pronunciation', '').strip()
    if re.search(r'[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]', thai):
        latin_leak_items.append(item)

print(f"Total latin leak items: {len(latin_leak_items)}")

clusters = set()
for item in latin_leak_items:
    thai = item.get('thai_pronunciation', '')
    found = re.findall(r'[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]+', thai)
    for c in found:
        clusters.add(c)

print(f"Unique leaked clusters count: {len(clusters)}")
for c in sorted(list(clusters)):
    # Find sample words for this cluster
    samples = [x['word'] for x in latin_leak_items if c in x['thai_pronunciation']][:3]
    print(f"  {c.ljust(10)} -> samples: {', '.join(samples)}")
