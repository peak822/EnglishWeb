import pdfplumber
import json
import os

pdf_path = '../PDF/memmoread-oxford-3000.pdf'
out_path = './memmoread_data.json'

data = []

with pdfplumber.open(pdf_path) as pdf:
    # Start from page 6 (index 5)
    for i in range(5, len(pdf.pages)):
        page = pdf.pages[i]
        table = page.extract_table()
        if table:
            for row in table:
                if not row or not row[0] or row[0].strip() == 'Vocab':
                    continue
                
                vocab = row[0].strip() if row[0] else ''
                pos = row[1].strip() if row[1] else ''
                meaning = row[2].strip() if len(row) > 2 and row[2] else ''
                thai_pron = row[3].strip() if len(row) > 3 and row[3] else ''
                ipa = row[4].strip() if len(row) > 4 and row[4] else ''
                
                data.append({
                    'word': vocab,
                    'type': pos,
                    'meaning': meaning,
                    'thai_pronunciation': thai_pron,
                    'ipa': ipa
                })

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Extracted {len(data)} words to memmoread_data.json')
