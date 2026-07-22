import json
import time
import sys
from deep_translator import GoogleTranslator
import eng_to_ipa as ipa

vocab_file = '../src/data/vocabulary.json'
with open(vocab_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

words_to_translate = []
words_needing_ipa = []

for item in data:
    if not item.get('meaning'):
        words_to_translate.append(item)
    if not item.get('ipa'):
        words_needing_ipa.append(item)

print(f"Needs translation: {len(words_to_translate)}", flush=True)
print(f"Needs IPA: {len(words_needing_ipa)}", flush=True)

for item in words_needing_ipa:
    try:
        result = ipa.convert(item['word'])
        if result and not result.endswith('*'):
            item['ipa'] = result
        else:
            item['ipa'] = result.replace('*', '') if result else ''
    except:
        item['ipa'] = ''

# Save after IPA
with open(vocab_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Saved IPAs!", flush=True)

translator = GoogleTranslator(source='en', target='th')
batch_size = 50

for i in range(0, len(words_to_translate), batch_size):
    batch = words_to_translate[i:i+batch_size]
    words = [item['word'] for item in batch]
    print(f"Translating batch {i//batch_size + 1}/{(len(words_to_translate)//batch_size)+1}... ({len(words)} words)", flush=True)
    try:
        translations = translator.translate_batch(words)
        for j, translation in enumerate(translations):
            batch[j]['meaning'] = translation
        # save incrementally
        with open(vocab_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        time.sleep(1)
    except Exception as e:
        print(f"Error in batch {i//batch_size + 1}: {e}", flush=True)
        # Try one by one
        for item in batch:
            try:
                item['meaning'] = translator.translate(item['word'])
                time.sleep(0.5)
            except:
                pass
        with open(vocab_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("Done translations!", flush=True)
