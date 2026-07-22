import pypdfium2 as pdfium
import json
import re

pdf = pdfium.PdfDocument('../PDF/memmoread-oxford-3000.pdf')
vocab_dict = {}

# The format from pypdfium2 is:
# EnglishWord Meaning(Thai, no spaces) ThaiPronunciation(Thai with spaces) IPA
# e.g., "amazing อัศจรรย์ เออะ เม้ สิ่ ง ʌ m ˈeɪ z ɪ ŋ"

# Pages 5 to end (0-indexed)
for i in range(5, len(pdf)):
    page = pdf[i]
    text = page.get_textpage().get_text_range()
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not line or line.startswith("Vocab"):
            continue
        
        # We need to split the line into parts.
        # The line usually has 4 logical parts. 
        # Part 1: English word(s) - all ASCII letters/hyphens
        # Part 2: Meaning - Thai characters without spaces
        # Part 3: Thai Pronunciation - Thai characters with spaces
        # Part 4: IPA - Latin/IPA characters
        
        # Let's find the first Thai character to separate English word from the rest
        match = re.search(r'([a-zA-Z\s-]+?)\s+([ก-๛].*)', line)
        if match:
            word = match.group(1).strip()
            rest = match.group(2).strip()
            
            # The rest is Meaning + ThaiPron + IPA
            # Meaning is the first contiguous block of Thai characters (which might include punctuation like , or ( ))
            # Actually, meaning might have spaces if it's multiple meanings? 
            # From sample: "actor นักแสดงชาย แอ๊ ขึ เถ่อ ร ˈæ k t ɜːʴ" -> Meaning has no space
            # "activity กิจกรรม แอ่ ขึ ทิ เฝอะ ถี่ æ k t ˈɪ v ʌ t iː"
            # So Meaning is up to the first space? Let's check if meaning ever has spaces.
            # We can use regex to separate Thai parts from IPA parts.
            # IPA is at the end and uses ASCII/IPA chars.
            ipa_match = re.search(r'([a-zA-Zˈˌɔːʌæʃʒθðŋ]+[\s]*)$', rest)
            ipa = ""
            if ipa_match:
                ipa = ipa_match.group(1).strip()
                rest = rest[:ipa_match.start()].strip()
            
            # Now `rest` contains Meaning and Thai Pronunciation.
            # Meaning is the first word(s) before the phonetic syllables.
            # Phonetic syllables are separated by spaces: "เออะ เม้ สิ่ ง"
            # It's safest to split by space. The first token is Meaning. The rest is Thai Pronunciation.
            # Wait, what if Meaning is two words? "ทำ อาหาร"
            # Let's just assume the first space-separated token is meaning.
            tokens = rest.split(' ')
            meaning = tokens[0]
            thai_pron = " ".join(tokens[1:])
            
            vocab_dict[word.lower()] = {
                "meaning": meaning,
                "thai_pronunciation": thai_pron,
                "ipa": ipa
            }

# Now load vocabulary.json and update it
with open('../src/data/vocabulary.json', 'r', encoding='utf-8') as f:
    vocab_list = json.load(f)

matched = 0
for item in vocab_list:
    w = item['word'].lower().strip()
    if w in vocab_dict:
        item['meaning'] = vocab_dict[w]['meaning']
        item['thai_pronunciation'] = vocab_dict[w]['thai_pronunciation']
        item['ipa'] = vocab_dict[w]['ipa']
        matched += 1
    else:
        # Try to match first word
        w_first = w.split(' ')[0]
        if w_first in vocab_dict:
            item['meaning'] = vocab_dict[w_first]['meaning']
            item['thai_pronunciation'] = vocab_dict[w_first]['thai_pronunciation']
            item['ipa'] = vocab_dict[w_first]['ipa']
            matched += 1

print(f"Matched {matched} out of {len(vocab_list)} words.")

with open('../src/data/vocabulary.json', 'w', encoding='utf-8') as f:
    json.dump(vocab_list, f, ensure_ascii=False, indent=2)

print("Updated vocabulary.json")
