import pdfplumber

pdf_path = '../PDF/memmoread-oxford-3000.pdf'
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[6]
    words = page.extract_words()
    with open('output.txt', 'w', encoding='utf-8') as f:
        for i, w in enumerate(words[:50]):
            f.write(f"{i}: {w['text']}\n")
