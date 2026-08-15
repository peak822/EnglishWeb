# -*- coding: utf-8 -*-
import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/stories.json', 'r', encoding='utf-8') as f:
    stories = json.load(f)

for idx, s in enumerate(stories[:31]):
    print(f"[{idx+1}] ID: {s['id']} ({s['level']}) - {s['title']}")
    print(f"Title Thai: {s.get('titleThai')}")
    print(f"EN:\n{s['content']}")
    print(f"TH:\n{s.get('contentThai')}")
    print("=" * 70)
