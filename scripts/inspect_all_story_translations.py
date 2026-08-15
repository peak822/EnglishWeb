# -*- coding: utf-8 -*-
import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/stories.json', 'r', encoding='utf-8') as f:
    stories = json.load(f)

print(f"Total Stories: {len(stories)}")

# Inspect each story's English vs Thai translation
for idx, s in enumerate(stories):
    print(f"[{idx+1}/{len(stories)}] ID: {s['id']} | Level: {s['level']} | Title: {s['title']} -> {s.get('titleThai', 'N/A')}")
    # Print excerpt
    en_words = len(s['content'].split())
    th_len = len(s.get('contentThai', ''))
    print(f"   EN ({en_words} words): {s['content'][:90]}...")
    print(f"   TH ({th_len} chars): {s.get('contentThai', '')[:90]}...")
    print("-" * 60)
