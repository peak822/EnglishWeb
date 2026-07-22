import pdfplumber

pdf_path = '../PDF/memmoread-oxford-3000.pdf'

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[5] # page 6
    text = page.extract_text()
    with open('test_page6.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print('wrote test_page6.txt')
