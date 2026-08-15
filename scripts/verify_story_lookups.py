# -*- coding: utf-8 -*-
import json
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

with open('src/data/stories.json', 'r', encoding='utf-8') as f:
    stories = json.load(f)

vocab_words = {item['word'].lower(): item for item in vocab}

# Load irregulars and lemma rules
IRREGULARS = {
    "felt": "feel", "woke": "wake", "slept": "sleep", "took": "take", "met": "meet",
    "drank": "drink", "ate": "eat", "found": "find", "chose": "choose", "bought": "buy",
    "paid": "pay", "ran": "run", "went": "go", "made": "make", "got": "get", "saw": "see",
    "came": "come", "said": "say", "told": "tell", "thought": "think", "knew": "know",
    "gave": "give", "brought": "bring", "began": "begin", "wrote": "write", "left": "leave"
}

def lemmatize(w):
    w = w.lower().strip()
    if w in vocab_words:
        return w
    if w in IRREGULARS and IRREGULARS[w] in vocab_words:
        return IRREGULARS[w]
    if w.endswith("ies") and (w[:-3] + "y") in vocab_words:
        return w[:-3] + "y"
    if w.endswith("ied") and (w[:-3] + "y") in vocab_words:
        return w[:-3] + "y"
    if w.endswith("ves") and (w[:-3] + "f") in vocab_words:
        return w[:-3] + "f"
    if w.endswith("es") and w[:-2] in vocab_words:
        return w[:-2]
    if w.endswith("s") and w[:-1] in vocab_words:
        return w[:-1]
    if w.endswith("ing") and (w[:-3] + "e") in vocab_words:
        return w[:-3] + "e"
    if w.endswith("ing") and w[:-3] in vocab_words:
        return w[:-3]
    if w.endswith("ed") and (w[:-2] + "e") in vocab_words:
        return w[:-2] + "e"
    if w.endswith("ed") and w[:-2] in vocab_words:
        return w[:-2]
    if w.endswith("ly") and w[:-2] in vocab_words:
        return w[:-2]
    return None

total_tokens = 0
resolved_tokens = 0
unresolved = {}

for story in stories:
    for raw in story['content'].split():
        clean = re.sub(r'^[^\w]+|[^\w]+$', '', raw.lower())
        if not clean or clean.isdigit():
            continue
        total_tokens += 1
        lemma = lemmatize(clean)
        if lemma:
            resolved_tokens += 1
        else:
            unresolved[clean] = unresolved.get(clean, 0) + 1

pct = (resolved_tokens / total_tokens) * 100
print(f"Total Story Words Tested: {total_tokens}")
print(f"Direct/Lemmatized Vocabulary Matches: {resolved_tokens} ({pct:.2f}%)")
print(f"Unique Unresolved Words: {len(unresolved)}")
print("Sample unresolved:", sorted(unresolved.items(), key=lambda x: -x[1])[:30])
