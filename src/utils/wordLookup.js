import vocabularyData from '../data/vocabulary.json';

// Build vocabulary map for O(1) instant lookup
const vocabMap = new Map();
vocabularyData.forEach(v => {
  if (v.word) {
    vocabMap.set(v.word.toLowerCase().trim(), v);
  }
});

// Common English Contractions & Short Forms
const contractions = {
  "i'm": { word: "I'm", type: "short form", meaning: "ฉันคือ / ฉันเป็น (ย่อมาจาก I am)", thai_pronunciation: "ไอม์", ipa: "aɪm", level: "A1" },
  "im": { word: "I'm", type: "short form", meaning: "ฉันคือ / ฉันเป็น (ย่อมาจาก I am)", thai_pronunciation: "ไอม์", ipa: "aɪm", level: "A1" },
  "it's": { word: "it's", type: "short form", meaning: "มันคือ / มันเป็น (ย่อมาจาก It is / It has)", thai_pronunciation: "อิทส์", ipa: "ɪts", level: "A1" },
  "that's": { word: "that's", type: "short form", meaning: "นั่นคือ (ย่อมาจาก That is)", thai_pronunciation: "แด๊ทส์", ipa: "ðæts", level: "A1" },
  "thats": { word: "that's", type: "short form", meaning: "นั่นคือ (ย่อมาจาก That is)", thai_pronunciation: "แด๊ทส์", ipa: "ðæts", level: "A1" },
  "can't": { word: "can't", type: "short form", meaning: "ไม่สามารถ / ทำไม่ได้ (ย่อมาจาก Cannot)", thai_pronunciation: "แค้นท์ / คานท์", ipa: "kænt", level: "A1" },
  "cant": { word: "can't", type: "short form", meaning: "ไม่สามารถ / ทำไม่ได้ (ย่อมาจาก Cannot)", thai_pronunciation: "แค้นท์ / คานท์", ipa: "kænt", level: "A1" },
  "couldn't": { word: "couldn't", type: "short form", meaning: "ไม่สามารถ (ในอดีต) (ย่อมาจาก Could not)", thai_pronunciation: "คูด-เดินท์", ipa: "ˈkʊdnt", level: "A2" },
  "couldnt": { word: "couldn't", type: "short form", meaning: "ไม่สามารถ (ในอดีต) (ย่อมาจาก Could not)", thai_pronunciation: "คูด-เดินท์", ipa: "ˈkʊdnt", level: "A2" },
  "wasn't": { word: "wasn't", type: "short form", meaning: "ไม่ได้เป็น / ไม่ได้อยู่ (ย่อมาจาก Was not)", thai_pronunciation: "วอส-เซินท์", ipa: "ˈwɒznt", level: "A1" },
  "wasnt": { word: "wasn't", type: "short form", meaning: "ไม่ได้เป็น / ไม่ได้อยู่ (ย่อมาจาก Was not)", thai_pronunciation: "วอส-เซินท์", ipa: "ˈwɒznt", level: "A1" },
  "weren't": { word: "weren't", type: "short form", meaning: "ไม่ได้เป็น / ไม่ได้อยู่ (ย่อมาจาก Were not)", thai_pronunciation: "เวิร์นท์", ipa: "wɜːnt", level: "A1" },
  "werent": { word: "weren't", type: "short form", meaning: "ไม่ได้เป็น / ไม่ได้อยู่ (ย่อมาจาก Were not)", thai_pronunciation: "เวิร์นท์", ipa: "wɜːnt", level: "A1" },
  "they'd": { word: "they'd", type: "short form", meaning: "พวกเขาจะ / พวกเขาได้ (ย่อมาจาก They would / They had)", thai_pronunciation: "เดด", ipa: "ðeɪd", level: "A2" },
  "theyd": { word: "they'd", type: "short form", meaning: "พวกเขาจะ / พวกเขาได้ (ย่อมาจาก They would / They had)", thai_pronunciation: "เดด", ipa: "ðeɪd", level: "A2" },
  "i'd": { word: "I'd", type: "short form", meaning: "ฉันจะ / ฉันได้ (ย่อมาจาก I would / I had)", thai_pronunciation: "ไอด์", ipa: "aɪd", level: "A2" },
  "id": { word: "I'd", type: "short form", meaning: "ฉันจะ / ฉันได้ (ย่อมาจาก I would / I had)", thai_pronunciation: "ไอด์", ipa: "aɪd", level: "A2" },
  "i've": { word: "I've", type: "short form", meaning: "ฉันได้ทำแล้ว (ย่อมาจาก I have)", thai_pronunciation: "ไอฟว์", ipa: "aɪv", level: "A2" },
  "ive": { word: "I've", type: "short form", meaning: "ฉันได้ทำแล้ว (ย่อมาจาก I have)", thai_pronunciation: "ไอฟว์", ipa: "aɪv", level: "A2" },
  "we've": { word: "we've", type: "short form", meaning: "พวกเราได้ทำแล้ว (ย่อมาจาก We have)", thai_pronunciation: "วีฟว์", ipa: "wiːv", level: "A2" },
  "you've": { word: "you've", type: "short form", meaning: "คุณได้ทำแล้ว (ย่อมาจาก You have)", thai_pronunciation: "ยูฟว์", ipa: "juːv", level: "A2" },
  "they've": { word: "they've", type: "short form", meaning: "พวกเขาได้ทำแล้ว (ย่อมาจาก They have)", thai_pronunciation: "เดฟว์", ipa: "ðeɪv", level: "A2" },
  "don't": { word: "don't", type: "short form", meaning: "ไม่ (ย่อมาจาก Do not)", thai_pronunciation: "โด๊นท์", ipa: "doʊnt", level: "A1" },
  "dont": { word: "don't", type: "short form", meaning: "ไม่ (ย่อมาจาก Do not)", thai_pronunciation: "โด๊นท์", ipa: "doʊnt", level: "A1" },
  "doesn't": { word: "doesn't", type: "short form", meaning: "ไม่ (ย่อมาจาก Does not)", thai_pronunciation: "ดัซ-เซินท์", ipa: "ˈdʌznt", level: "A1" },
  "doesnt": { word: "doesn't", type: "short form", meaning: "ไม่ (ย่อมาจาก Does not)", thai_pronunciation: "ดัซ-เซินท์", ipa: "ˈdʌznt", level: "A1" },
  "didn't": { word: "didn't", type: "short form", meaning: "ไม่ได้ทำ (ในอดีต) (ย่อมาจาก Did not)", thai_pronunciation: "ดิด-เดินท์", ipa: "ˈdɪdnt", level: "A1" },
  "didnt": { word: "didn't", type: "short form", meaning: "ไม่ได้ทำ (ในอดีต) (ย่อมาจาก Did not)", thai_pronunciation: "ดิด-เดินท์", ipa: "ˈdɪdnt", level: "A1" },
  "won't": { word: "won't", type: "short form", meaning: "จะไม่ (ย่อมาจาก Will not)", thai_pronunciation: "โว๊นท์", ipa: "woʊnt", level: "A1" },
  "wont": { word: "won't", type: "short form", meaning: "จะไม่ (ย่อมาจาก Will not)", thai_pronunciation: "โว๊นท์", ipa: "woʊnt", level: "A1" },
  "you're": { word: "you're", type: "short form", meaning: "คุณคือ / คุณเป็น (ย่อมาจาก You are)", thai_pronunciation: "ยัวร์", ipa: "jʊər", level: "A1" },
  "youre": { word: "youre", type: "short form", meaning: "คุณคือ / คุณเป็น (ย่อมาจาก You are)", thai_pronunciation: "ยัวร์", ipa: "jʊər", level: "A1" },
  "we're": { word: "we're", type: "short form", meaning: "พวกเราคือ / พวกเราเป็น (ย่อมาจาก We are)", thai_pronunciation: "เวียร์", ipa: "wɪər", level: "A1" },
  "they're": { word: "they're", type: "short form", meaning: "พวกเขาคือ / พวกเขาเป็น (ย่อมาจาก They are)", thai_pronunciation: "แดย์", ipa: "ðeər", level: "A1" },
  "he's": { word: "he's", type: "short form", meaning: "เขาคือ / เขาเป็น (ย่อมาจาก He is / He has)", thai_pronunciation: "ฮีส์", ipa: "hiːz", level: "A1" },
  "she's": { word: "she's", type: "short form", meaning: "เธอคือ / เธอเป็น (ย่อมาจาก She is / She has)", thai_pronunciation: "ชีส์", ipa: "ʃiːz", level: "A1" },
  "o'clock": { word: "o'clock", type: "adv.", meaning: "นาฬิกา (ใช้บอกเวลาตรง เช่น eight o'clock = 8 โมงตรง)", thai_pronunciation: "เออะ-คล็อก", ipa: "əˈklɒk", level: "A1" },
  "oclock": { word: "o'clock", type: "adv.", meaning: "นาฬิกา (ใช้บอกเวลาตรง เช่น eight o'clock = 8 โมงตรง)", thai_pronunciation: "เออะ-คล็อก", ipa: "əˈklɒk", level: "A1" }
};

// Precise Irregular Verbs and Nouns with dedicated inflected pronunciations
const irregulars = {
  'was': { base: 'be', thai: 'วอส', ipa: 'wɒz', note: 'รูปอดีตของ be (เอกพจน์)' },
  'were': { base: 'be', thai: 'เวิร์ร', ipa: 'wɜːr', note: 'รูปอดีตของ be (พหูพจน์)' },
  'is': { base: 'be', thai: 'อิส', ipa: 'ɪz', note: 'รูปปัจจุบันของ be (เอกพจน์)' },
  'am': { base: 'be', thai: 'แอม', ipa: 'æm', note: 'รูปปัจจุบันของ be (ใช้กับ I)' },
  'are': { base: 'be', thai: 'อาร์', ipa: 'ɑːr', note: 'รูปปัจจุบันของ be (พหูพจน์/you)' },
  'been': { base: 'be', thai: 'บีน', ipa: 'biːn', note: 'กริยาช่อง 3 ของ be' },
  'being': { base: 'be', thai: 'บี-อิง', ipa: 'ˈbiːɪŋ', note: 'รูป -ing ของ be' },
  'had': { base: 'have', thai: 'แฮด', ipa: 'hæd', note: 'รูปอดีตของ have' },
  'has': { base: 'have', thai: 'แฮส', ipa: 'hæz', note: 'รูปปัจจุบันเอกพจน์ของ have' },
  'having': { base: 'have', thai: 'แฮฟ-วิง', ipa: 'ˈhævɪŋ', note: 'รูป -ing ของ have' },
  'did': { base: 'do', thai: 'ดิด', ipa: 'dɪd', note: 'รูปอดีตของ do' },
  'does': { base: 'do', thai: 'ดัซ', ipa: 'dʌz', note: 'รูปปัจจุบันเอกพจน์ของ do' },
  'done': { base: 'do', thai: 'ดัน', ipa: 'dʌn', note: 'กริยาช่อง 3 ของ do' },
  'doing': { base: 'do', thai: 'ดู-อิง', ipa: 'ˈduːɪŋ', note: 'รูป -ing ของ do' },
  'went': { base: 'go', thai: 'เวนท์', ipa: 'went', note: 'รูปอดีตของ go (ไป)' },
  'gone': { base: 'go', thai: 'กอน', ipa: 'ɡɒn', note: 'กริยาช่อง 3 ของ go' },
  'goes': { base: 'go', thai: 'โกส์', ipa: 'ɡoʊz', note: 'รูปปัจจุบันเอกพจน์ของ go' },
  'going': { base: 'go', thai: 'โก-อิง', ipa: 'ˈɡoʊɪŋ', note: 'รูป -ing ของ go' },
  'felt': { base: 'feel', thai: 'เฟลท์', ipa: 'felt', note: 'รูปอดีตของ feel (รู้สึก)' },
  'feeling': { base: 'feel', thai: 'ฟีล-ลิง', ipa: 'ˈfiːlɪŋ', note: 'รูป -ing ของ feel' },
  'got': { base: 'get', thai: 'ก็อต', ipa: 'ɡɒt', note: 'รูปอดีตของ get (ได้รับ, กลายเป็น)' },
  'gotten': { base: 'get', thai: 'ก็อต-เทิน', ipa: 'ˈɡɑːtn', note: 'กริยาช่อง 3 ของ get' },
  'getting': { base: 'get', thai: 'เก็ต-ติง', ipa: 'ˈɡetɪŋ', note: 'รูป -ing ของ get' },
  'made': { base: 'make', thai: 'เมด', ipa: 'meɪd', note: 'รูปอดีตของ make (ทำ, สร้าง)' },
  'making': { base: 'make', thai: 'เมค-คิง', ipa: 'ˈmeɪkɪŋ', note: 'รูป -ing ของ make' },
  'took': { base: 'take', thai: 'ทุ๊ก', ipa: 'tʊk', note: 'รูปอดีตของ take (เอาไป, พาไป, ใช้เวลา)' },
  'taken': { base: 'take', thai: 'เท-เคิน', ipa: 'ˈteɪkən', note: 'กริยาช่อง 3 ของ take' },
  'taking': { base: 'take', thai: 'เทค-คิง', ipa: 'ˈteɪkɪŋ', note: 'รูป -ing ของ take' },
  'saw': { base: 'see', thai: 'ซอ', ipa: 'sɔː', note: 'รูปอดีตของ see (เห็น, ดู)' },
  'seen': { base: 'see', thai: 'ซีน', ipa: 'siːn', note: 'กริยาช่อง 3 ของ see' },
  'seeing': { base: 'see', thai: 'ซี-อิง', ipa: 'ˈsiːɪŋ', note: 'รูป -ing ของ see' },
  'knew': { base: 'know', thai: 'นิว / นู', ipa: 'njuː', note: 'รูปอดีตของ know (รู้, รู้จัก)' },
  'known': { base: 'know', thai: 'โนน', ipa: 'noʊn', note: 'กริยาช่อง 3 ของ know' },
  'knowing': { base: 'know', thai: 'โน-อิง', ipa: 'ˈnoʊɪŋ', note: 'รูป -ing ของ know' },
  'gave': { base: 'give', thai: 'เกฟว์', ipa: 'ɡeɪv', note: 'รูปอดีตของ give (ให้)' },
  'given': { base: 'give', thai: 'กิฟ-เวิน', ipa: 'ˈɡɪvn', note: 'กริยาช่อง 3 ของ give' },
  'giving': { base: 'give', thai: 'กิฟ-วิง', ipa: 'ˈɡɪvɪŋ', note: 'รูป -ing ของ give' },
  'found': { base: 'find', thai: 'เฟานด์', ipa: 'faʊnd', note: 'รูปอดีตของ find (พบ, เจอ)' },
  'finding': { base: 'find', thai: 'ไฟน์-ดิง', ipa: 'ˈfaɪndɪŋ', note: 'รูป -ing ของ find' },
  'told': { base: 'tell', thai: 'โทลด์', ipa: 'toʊld', note: 'รูปอดีตของ tell (บอก, เล่า)' },
  'telling': { base: 'tell', thai: 'เทล-ลิง', ipa: 'ˈtelɪŋ', note: 'รูป -ing ของ tell' },
  'thought': { base: 'think', thai: 'ธอท', ipa: 'θɔːt', note: 'รูปอดีตของ think (คิด)' },
  'thinking': { base: 'think', thai: 'ธิง-คิง', ipa: 'ˈθɪŋkɪŋ', note: 'รูป -ing ของ think' },
  'came': { base: 'come', thai: 'เคม', ipa: 'keɪm', note: 'รูปอดีตของ come (มา)' },
  'coming': { base: 'come', thai: 'คัม-มิง', ipa: 'ˈkʌmɪŋ', note: 'รูป -ing ของ come' },
  'comes': { base: 'come', thai: 'คัมส์', ipa: 'kʌmz', note: 'รูปปัจจุบันเอกพจน์ของ come' },
  'ran': { base: 'run', thai: 'แรน', ipa: 'ræn', note: 'รูปอดีตของ run (วิ่ง)' },
  'running': { base: 'run', thai: 'รัน-นิง', ipa: 'ˈrʌnɪŋ', note: 'รูป -ing ของ run' },
  'runs': { base: 'run', thai: 'รันส์', ipa: 'rʌnz', note: 'รูปปัจจุบันเอกพจน์ของ run' },
  'drank': { base: 'drink', thai: 'แดร็งก์', ipa: 'dræŋk', note: 'รูปอดีตของ drink (ดื่ม)' },
  'drunk': { base: 'drink', thai: 'ดรังก์', ipa: 'drʌŋk', note: 'กริยาช่อง 3 ของ drink' },
  'drinking': { base: 'drink', thai: 'ดริง-คิง', ipa: 'ˈdrɪŋkɪŋ', note: 'รูป -ing ของ drink' },
  'ate': { base: 'eat', thai: 'เอท', ipa: 'eɪt', note: 'รูปอดีตของ eat (กิน, รับประทาน)' },
  'eaten': { base: 'eat', thai: 'อีต-เทิน', ipa: 'ˈiːtn', note: 'กริยาช่อง 3 ของ eat' },
  'eating': { base: 'eat', thai: 'อีต-ทิง', ipa: 'ˈiːtɪŋ', note: 'รูป -ing ของ eat' },
  'eats': { base: 'eat', thai: 'อีทส์', ipa: 'iːts', note: 'รูปปัจจุบันเอกพจน์ของ eat' },
  'sat': { base: 'sit', thai: 'แซท', ipa: 'sæt', note: 'รูปอดีตของ sit (นั่ง)' },
  'sitting': { base: 'sit', thai: 'ซิท-ทิง', ipa: 'ˈsɪtɪŋ', note: 'รูป -ing ของ sit' },
  'woke': { base: 'wake', thai: 'โวค', ipa: 'woʊk', note: 'รูปอดีตของ wake (ตื่นนอน)' },
  'woken': { base: 'wake', thai: 'โว-เคิน', ipa: 'ˈwoʊkən', note: 'กริยาช่อง 3 ของ wake' },
  'waking': { base: 'wake', thai: 'เวค-คิง', ipa: 'ˈweɪkɪŋ', note: 'รูป -ing ของ wake' },
  'broke': { base: 'break', thai: 'โบรค', ipa: 'broʊk', note: 'รูปอดีตของ break (แตก, หัก, พัง)' },
  'broken': { base: 'break', thai: 'โบร-เคิน', ipa: 'ˈbroʊkən', note: 'กริยาช่อง 3 ของ break' },
  'breaking': { base: 'break', thai: 'เบรค-คิง', ipa: 'ˈbreɪkɪŋ', note: 'รูป -ing ของ break' },
  'heard': { base: 'hear', thai: 'เฮิร์ด', ipa: 'hɜːrd', note: 'รูปอดีตของ hear (ได้ยิน)' },
  'hearing': { base: 'hear', thai: 'เฮียร์-ริง', ipa: 'ˈhɪərɪŋ', note: 'รูป -ing ของ hear' },
  'drove': { base: 'drive', thai: 'โดรฟว์', ipa: 'droʊv', note: 'รูปอดีตของ drive (ขับรถ)' },
  'driven': { base: 'drive', thai: 'ดริฟ-เวิน', ipa: 'ˈdrɪvn', note: 'กริยาช่อง 3 ของ drive' },
  'driving': { base: 'drive', thai: 'ไดรฟ-วิง', ipa: 'ˈdraɪvɪŋ', note: 'รูป -ing ของ drive' },
  'spoke': { base: 'speak', thai: 'สโปค', ipa: 'spoʊk', note: 'รูปอดีตของ speak (พูด)' },
  'spoken': { base: 'speak', thai: 'สโป-เคิน', ipa: 'ˈspoʊkən', note: 'กริยาช่อง 3 ของ speak' },
  'speaking': { base: 'speak', thai: 'สปีค-คิง', ipa: 'ˈspiːkɪŋ', note: 'รูป -ing ของ speak' },
  'bought': { base: 'buy', thai: 'บอท', ipa: 'bɔːt', note: 'รูปอดีตของ buy (ซื้อ)' },
  'buying': { base: 'buy', thai: 'บาย-อิง', ipa: 'ˈbaɪɪŋ', note: 'รูป -ing ของ buy' },
  'buys': { base: 'buy', thai: 'บายส์', ipa: 'baɪz', note: 'รูปปัจจุบันเอกพจน์ของ buy' },
  'brought': { base: 'bring', thai: 'บรอท', ipa: 'brɔːt', note: 'รูปอดีตของ bring (นำมา, พามา)' },
  'bringing': { base: 'bring', thai: 'บริง-อิง', ipa: 'ˈbrɪŋɪŋ', note: 'รูป -ing ของ bring' },
  'caught': { base: 'catch', thai: 'คอท', ipa: 'kɔːt', note: 'รูปอดีตของ catch (จับ, คว้า)' },
  'catching': { base: 'catch', thai: 'แคช-ชิง', ipa: 'ˈkætʃɪŋ', note: 'รูป -ing ของ catch' },
  'slept': { base: 'sleep', thai: 'สเลปท์', ipa: 'slept', note: 'รูปอดีตของ sleep (นอนหลับ)' },
  'sleeping': { base: 'sleep', thai: 'สลีป-ปิง', ipa: 'ˈsliːpɪŋ', note: 'รูป -ing ของ sleep' },
  'sleeps': { base: 'sleep', thai: 'สลีปส์', ipa: 'sliːps', note: 'รูปปัจจุบันเอกพจน์ของ sleep' },
  'paid': { base: 'pay', thai: 'เพด', ipa: 'peɪd', note: 'รูปอดีตของ pay (จ่ายเงิน)' },
  'paying': { base: 'pay', thai: 'เพย์-อิง', ipa: 'ˈpeɪɪŋ', note: 'รูป -ing ของ pay' },
  'sent': { base: 'send', thai: 'เซนท์', ipa: 'sent', note: 'รูปอดีตของ send (ส่ง)' },
  'sending': { base: 'send', thai: 'เซน-ดิง', ipa: 'ˈsendɪŋ', note: 'รูป -ing ของ send' },
  'swept': { base: 'sweep', thai: 'สเวปท์', ipa: 'swept', note: 'รูปอดีตของ sweep (กวาด)' },
  'sweeping': { base: 'sweep', thai: 'สวีป-ปิง', ipa: 'ˈswiːpɪŋ', note: 'รูป -ing ของ sweep' },
  'met': { base: 'meet', thai: 'เมท', ipa: 'met', note: 'รูปอดีตของ meet (พบ, เจอ)' },
  'meeting': { base: 'meet', thai: 'มีต-ทิง', ipa: 'ˈmiːtɪŋ', note: 'การประชุม / รูป -ing ของ meet' },
  'left': { base: 'leave', thai: 'เลฟท์', ipa: 'left', note: 'รูปอดีตของ leave (ออกเดินทาง, ทิ้งไว้) / ทางซ้าย' },
  'leaving': { base: 'leave', thai: 'ลีฟ-วิง', ipa: 'ˈliːvɪŋ', note: 'รูป -ing ของ leave' },
  'put': { base: 'put', thai: 'พุท', ipa: 'pʊt', note: 'วาง, ใส่' },
  'putting': { base: 'put', thai: 'พุท-ทิง', ipa: 'ˈpʊtɪŋ', note: 'รูป -ing ของ put' },
  'cuts': { base: 'cut', thai: 'คัทส์', ipa: 'kʌts', note: 'รูปปัจจุบันเอกพจน์ของ cut' },
  'cutting': { base: 'cut', thai: 'คัท-ทิง', ipa: 'ˈkʌtɪŋ', note: 'รูป -ing ของ cut' },
  'set': { base: 'set', thai: 'เซ็ท', ipa: 'set', note: 'จัด, ตั้ง, กำหนด' },
  'setting': { base: 'set', thai: 'เซ็ต-ติง', ipa: 'ˈsetɪŋ', note: 'ฉาก, บริบท, การตั้งค่า' },
  'kept': { base: 'keep', thai: 'เคปท์', ipa: 'kept', note: 'รูปอดีตของ keep (เก็บรักษา)' },
  'keeping': { base: 'keep', thai: 'คีพ-ปิง', ipa: 'ˈkiːpɪŋ', note: 'รูป -ing ของ keep' },
  'shook': { base: 'shake', thai: 'ชุ๊ก', ipa: 'ʃʊk', note: 'รูปอดีตของ shake (เขย่า, สั่น)' },
  'shaking': { base: 'shake', thai: 'เชค-คิง', ipa: 'ˈʃeɪkɪŋ', note: 'รูป -ing ของ shake' },
  'taught': { base: 'teach', thai: 'ทอท', ipa: 'tɔːt', note: 'รูปอดีตของ teach (สอน)' },
  'teaching': { base: 'teach', thai: 'ทีช-ชิง', ipa: 'ˈtiːtʃɪŋ', note: 'รูป -ing ของ teach' },
  'wrote': { base: 'write', thai: 'โรท', ipa: 'roʊt', note: 'รูปอดีตของ write (เขียน)' },
  'written': { base: 'write', thai: 'ริท-เทิน', ipa: 'ˈrɪtn', note: 'กริยาช่อง 3 ของ write' },
  'writing': { base: 'write', thai: 'ไรท์-ทิง', ipa: 'ˈraɪtɪŋ', note: 'รูป -ing ของ write / การเขียน' },
  'wore': { base: 'wear', thai: 'วอร์', ipa: 'wɔːr', note: 'รูปอดีตของ wear (สวมใส่)' },
  'worn': { base: 'wear', thai: 'วอร์น', ipa: 'wɔːrn', note: 'กริยาช่อง 3 ของ wear' },
  'wearing': { base: 'wear', thai: 'แวร์-ริง', ipa: 'ˈweərɪŋ', note: 'รูป -ing ของ wear' },
  'lost': { base: 'lose', thai: 'ลอสต์', ipa: 'lɔːst', note: 'รูปอดีตของ lose (ทำหาย, แพ้, หลงทาง)' },
  'losing': { base: 'lose', thai: 'ลูซ-ซิง', ipa: 'ˈluːzɪŋ', note: 'รูป -ing ของ lose' },
  'fell': { base: 'fall', thai: 'เฟล', ipa: 'fel', note: 'รูปอดีตของ fall (ตก, หล่น, ล้ม)' },
  'fallen': { base: 'fall', thai: 'ฟอล-เลิน', ipa: 'ˈfɔːlən', note: 'กริยาช่อง 3 ของ fall' },
  'falling': { base: 'fall', thai: 'ฟอล-ลิง', ipa: 'ˈfɔːlɪŋ', note: 'รูป -ing ของ fall' },
  'shone': { base: 'shine', thai: 'โชน / ชอน', ipa: 'ʃoʊn', note: 'รูปอดีตของ shine (ส่องแสง)' },
  'shining': { base: 'shine', thai: 'ชาย-นิง', ipa: 'ˈʃaɪnɪŋ', note: 'รูป -ing ของ shine (กำลังส่องแสง)' },
  'hid': { base: 'hide', thai: 'ฮิด', ipa: 'hɪd', note: 'รูปอดีตของ hide (ซ่อน)' },
  'hidden': { base: 'hide', thai: 'ฮิด-เดน', ipa: 'ˈhɪdn', note: 'กริยาช่อง 3 ของ hide (ซ่อนอยู่)' },
  'hiding': { base: 'hide', thai: 'ไฮ-ดิง', ipa: 'ˈhaɪdɪŋ', note: 'รูป -ing ของ hide (กำลังซ่อน)' },
  'stood': { base: 'stand', thai: 'สตูด', ipa: 'stʊd', note: 'รูปอดีตของ stand (ยืน)' },
  'standing': { base: 'stand', thai: 'สแตน-ดิง', ipa: 'ˈstændɪŋ', note: 'รูป -ing ของ stand' },
  'understood': { base: 'understand', thai: 'อัน-เดอร์-สตูด', ipa: 'ˌʌndərˈstʊd', note: 'รูปอดีตของ understand (เข้าใจ)' },
  'understanding': { base: 'understand', thai: 'อัน-เดอร์-สแตน-ดิง', ipa: 'ˌʌndərˈstændɪŋ', note: 'ความเข้าใจ' },
  'chose': { base: 'choose', thai: 'โชส', ipa: 'tʃoʊz', note: 'รูปอดีตของ choose (เลือก)' },
  'chosen': { base: 'choose', thai: 'โช-เซิน', ipa: 'ˈtʃoʊzn', note: 'กริยาช่อง 3 ของ choose' },
  'choosing': { base: 'choose', thai: 'ชูส-ซิง', ipa: 'ˈtʃuːzɪŋ', note: 'รูป -ing ของ choose' },
  'began': { base: 'begin', thai: 'บิ-แกน', ipa: 'bɪˈɡæn', note: 'รูปอดีตของ begin (เริ่มต้น)' },
  'begun': { base: 'begin', thai: 'บิ-กัน', ipa: 'bɪˈɡʌn', note: 'กริยาช่อง 3 ของ begin' },
  'beginning': { base: 'begin', thai: 'บิ-กิน-นิง', ipa: 'bɪˈɡɪnɪŋ', note: 'รูป -ing ของ begin / จุดเริ่มต้น' },
  'spent': { base: 'spend', thai: 'สเปนท์', ipa: 'spent', note: 'รูปอดีตของ spend (ใช้จ่าย, ใช้เวลา)' },
  'spending': { base: 'spend', thai: 'สเปน-ดิง', ipa: 'ˈspendɪŋ', note: 'รูป -ing ของ spend' },
  'grew': { base: 'grow', thai: 'กรู', ipa: 'ɡruː', note: 'รูปอดีตของ grow (เติบโต, ปลูก)' },
  'grown': { base: 'grow', thai: 'โกรน', ipa: 'ɡroʊn', note: 'กริยาช่อง 3 ของ grow' },
  'growing': { base: 'grow', thai: 'โกร-อิง', ipa: 'ˈɡroʊɪŋ', note: 'รูป -ing ของ grow' },
  'drew': { base: 'draw', thai: 'ดรู', ipa: 'druː', note: 'รูปอดีตของ draw (วาดรูป, ดึง)' },
  'drawn': { base: 'draw', thai: 'ดรอน', ipa: 'drɔːn', note: 'กริยาช่อง 3 ของ draw' },
  'drawing': { base: 'draw', thai: 'ดรอ-อิง', ipa: 'ˈdrɔːɪŋ', note: 'รูป -ing ของ draw / ภาพวาด' },
  'flew': { base: 'fly', thai: 'ฟลู', ipa: 'fluː', note: 'รูปอดีตของ fly (บิน)' },
  'flown': { base: 'fly', thai: 'โฟลน', ipa: 'floʊn', note: 'กริยาช่อง 3 ของ fly' },
  'flying': { base: 'fly', thai: 'ฟลาย-อิง', ipa: 'ˈflaɪɪŋ', note: 'รูป -ing ของ fly' },
  'sang': { base: 'sing', thai: 'แซง', ipa: 'sæŋ', note: 'รูปอดีตของ sing (ร้องเพลง)' },
  'sung': { base: 'sing', thai: 'ซัง', ipa: 'sʌŋ', note: 'กริยาช่อง 3 ของ sing' },
  'singing': { base: 'sing', thai: 'ซิง-อิง', ipa: 'ˈsɪŋɪŋ', note: 'รูป -ing ของ sing / การร้องเพลง' },
  'swam': { base: 'swim', thai: 'สแวม', ipa: 'swæm', note: 'รูปอดีตของ swim (ว่ายน้ำ)' },
  'swum': { base: 'swim', thai: 'สวัม', ipa: 'swʌm', note: 'กริยาช่อง 3 ของ swim' },
  'swimming': { base: 'swim', thai: 'สวิม-มิง', ipa: 'ˈswɪmɪŋ', note: 'รูป -ing ของ swim / การว่ายน้ำ' },
  'won': { base: 'win', thai: 'วัน', ipa: 'wʌn', note: 'รูปอดีตของ win (ชนะ)' },
  'winning': { base: 'win', thai: 'วิน-นิง', ipa: 'ˈwɪnɪŋ', note: 'รูป -ing ของ win' },
  'teeth': { base: 'tooth', thai: 'ทีธ', ipa: 'tiːθ', note: 'พหูพจน์ของ tooth (ฟันหลายซี่)' },
  'feet': { base: 'foot', thai: 'ฟีท', ipa: 'fiːt', note: 'พหูพจน์ของ foot (เท้าสองข้าง)' },
  'men': { base: 'man', thai: 'เมน', ipa: 'men', note: 'พหูพจน์ของ man (ผู้ชายหลายคน)' },
  'women': { base: 'woman', thai: 'วิม-มิน', ipa: 'ˈwɪmɪn', note: 'พหูพจน์ของ woman (ผู้หญิงหลายคน)' },
  'children': { base: 'child', thai: 'ชิล-เดริน', ipa: 'ˈtʃɪldrən', note: 'พหูพจน์ของ child (เด็กๆ)' },
  'people': { base: 'person', thai: 'พี-เพิล', ipa: 'ˈpiːpl', note: 'พหูพจน์ของ person (ผู้คน)' },
  'mice': { base: 'mouse', thai: 'ไมส์', ipa: 'maɪs', note: 'พหูพจน์ของ mouse (หนูหลายตัว)' },
  'these': { base: 'this', thai: 'ดีส์', ipa: 'ðiːz', note: 'พหูพจน์ของ this (สิ่งเหล่านี้, เหล่านี้)' },
  'those': { base: 'that', thai: 'โดส์', ipa: 'ðoʊz', note: 'พหูพจน์ของ that (สิ่งเหล่านั้น, เหล่านั้น)' }
};

// Supplemental vocabulary (story terms, proper names, modern words, etc.)
const supplementalDict = {
  'color': { word: 'color', type: 'n.', level: 'A1', meaning: 'สี (รูปสะกดแบบอเมริกันของ colour)', thai_pronunciation: 'คัล-เลอร์', ipa: 'ˈkʌlər' },
  'colors': { word: 'colors', type: 'n.', level: 'A1', meaning: 'สีต่างๆ (หลายสี)', thai_pronunciation: 'คัล-เลอร์ส', ipa: 'ˈkʌlərz' },
  'favorite': { word: 'favorite', type: 'adj., n.', level: 'A1', meaning: 'ที่ชื่นชอบที่สุด, ของโปรด (รูปสะกดแบบอเมริกันของ favourite)', thai_pronunciation: 'เฟ-เวอ-ริท', ipa: 'ˈfeɪvərɪt' },
  'favorites': { word: 'favorites', type: 'n.', level: 'A1', meaning: 'ของโปรด, สิ่งที่ชอบที่สุด (หลายอย่าง)', thai_pronunciation: 'เฟ-เวอ-ริทส์', ipa: 'ˈfeɪvərɪts' },
  'center': { word: 'center', type: 'n.', level: 'A1', meaning: 'ศูนย์กลาง, จุดศูนย์กลาง (รูปสะกดแบบอเมริกันของ centre)', thai_pronunciation: 'เซน-เทอร์', ipa: 'ˈsentər' },
  'centers': { word: 'centers', type: 'n.', level: 'A1', meaning: 'ศูนย์กลาง (หลายแห่ง)', thai_pronunciation: 'เซน-เทอร์ส', ipa: 'ˈsentərz' },
  'theater': { word: 'theater', type: 'n.', level: 'A1', meaning: 'โรงภาพยนตร์, โรงละคร (รูปสะกดแบบอเมริกันของ theatre)', thai_pronunciation: 'เธีย-เทอร์', ipa: 'ˈθiːətər' },
  'theaters': { word: 'theaters', type: 'n.', level: 'A1', meaning: 'โรงภาพยนตร์/โรงละคร (หลายแห่ง)', thai_pronunciation: 'เธีย-เทอร์ส', ipa: 'ˈθiːətərz' },
  'meter': { word: 'meter', type: 'n.', level: 'A1', meaning: 'เมตร (หน่วยวัด), มิเตอร์ (รูปสะกดแบบอเมริกันของ metre)', thai_pronunciation: 'มิ-เทอร์', ipa: 'ˈmiːtər' },
  'meters': { word: 'meters', type: 'n.', level: 'A1', meaning: 'เมตร (หลายเมตร)', thai_pronunciation: 'มิ-เทอร์ส', ipa: 'ˈmiːtərz' },
  'neighbor': { word: 'neighbor', type: 'n.', level: 'A1', meaning: 'เพื่อนบ้าน (รูปสะกดแบบอเมริกันของ neighbour)', thai_pronunciation: 'เน-เบอร์', ipa: 'ˈneɪbər' },
  'neighbors': { word: 'neighbors', type: 'n.', level: 'A1', meaning: 'เพื่อนบ้าน (หลายคน)', thai_pronunciation: 'เน-เบอร์ส', ipa: 'ˈneɪbərz' },
  'gray': { word: 'gray', type: 'adj., n.', level: 'A1', meaning: 'สีเทา (รูปสะกดแบบอเมริกันของ grey)', thai_pronunciation: 'เกรย์', ipa: 'ɡreɪ' },
  'refrigerator': { word: 'refrigerator', type: 'n.', level: 'A2', meaning: 'ตู้เย็น', thai_pronunciation: 'ริ-ฟริจ-เจอะ-เร-เทอร์', ipa: 'rɪˈfrɪdʒəreɪtər' },
  'garlic': { word: 'garlic', type: 'n.', level: 'A2', meaning: 'กระเทียม', thai_pronunciation: 'การ์-ลิก', ipa: 'ˈɡɑːrlɪk' },
  'pasta': { word: 'pasta', type: 'n.', level: 'A1', meaning: 'พาสต้า (เส้นก๋วยเตี๋ยวแบบอิตาเลียน)', thai_pronunciation: 'พาส-ต้า', ipa: 'ˈpɑːstə' },
  'stove': { word: 'stove', type: 'n.', level: 'A2', meaning: 'เตาหุงต้ม, เตาปรุงอาหาร', thai_pronunciation: 'สโตฟว์', ipa: 'stoʊv' },
  'olive': { word: 'olive', type: 'n.', level: 'A2', meaning: 'มะกอก, ลูกมะกอก (เช่น olive oil น้ำมันมะกอก)', thai_pronunciation: 'ออล-ลิฟ', ipa: 'ˈɒlɪv' },
  'noodles': { word: 'noodles', type: 'n.', level: 'A1', meaning: 'ก๋วยเตี๋ยว, บะหมี่, เส้นพาสต้า', thai_pronunciation: 'นู-เดิลส์', ipa: 'ˈnuːdlz' },
  'sprinkle': { word: 'sprinkle', type: 'v.', level: 'B1', meaning: 'โรย, โปรย, ปรุงแต่ง', thai_pronunciation: 'สปริรง-เคิล', ipa: 'ˈsprɪŋkl' },
  'homemade': { word: 'homemade', type: 'adj.', level: 'A2', meaning: 'ทำเองที่บ้าน, ปรุงเองในครัวเรือน', thai_pronunciation: 'โฮม-เมด', ipa: 'ˌhoʊmˈmeɪd' },
  'stethoscope': { word: 'stethoscope', type: 'n.', level: 'B2', meaning: 'หูฟังของแพทย์ (สำหรับฟังเสียงหัวใจ/ปอด)', thai_pronunciation: 'สเตธ-เธอะ-สโคป', ipa: 'ˈsteθəskoʊp' },
  'detergent': { word: 'detergent', type: 'n.', level: 'B1', meaning: 'ผงซักฟอก, น้ำยาซักผ้า', thai_pronunciation: 'ดิ-เทอร์-เจินต์', ipa: 'dɪˈtɜːrdʒənt' },
  'broom': { word: 'broom', type: 'n.', level: 'A2', meaning: 'ไม้กวาด', thai_pronunciation: 'บรูม', ipa: 'bruːm' },
  'mop': { word: 'mop', type: 'n., v.', level: 'A2', meaning: 'ไม้ถูพื้น, ถูพื้นทำความสะอาด', thai_pronunciation: 'ม็อป', ipa: 'mɒp' },
  'balcony': { word: 'balcony', type: 'n.', level: 'A2', meaning: 'ระเบียง, มุขระเบียง', thai_pronunciation: 'แบล-เคอะ-นี', ipa: 'ˈbælkəni' },
  'muffin': { word: 'muffin', type: 'n.', level: 'A2', meaning: 'ขนมมัฟฟิน (ขนมอบทรงถ้วย)', thai_pronunciation: 'มัฟ-ฟิน', ipa: 'ˈmʌfɪn' },
  'muffins': { word: 'muffins', type: 'n.', level: 'A2', meaning: 'ขนมมัฟฟิน (หลายชิ้น)', thai_pronunciation: 'มัฟ-ฟินส์', ipa: 'ˈmʌfɪnz' },
  'trattoria': { word: 'trattoria', type: 'n.', level: 'B1', meaning: 'ร้านอาหารอิตาเลียนขนาดเล็กแบบดั้งเดิม', thai_pronunciation: 'ตราต-โท-รี-อา', ipa: 'ˌtrætəˈriːə' },
  'bruschetta': { word: 'bruschetta', type: 'n.', level: 'B1', meaning: 'บรูสเก็ตต้า (ขนมปังกระเทียมปิ้งหน้ามะเขือเทศสไตล์อิตาเลียน)', thai_pronunciation: 'บรู-สเก็ต-ต้า', ipa: 'bruːˈsketə' },
  'fettuccine': { word: 'fettuccine', type: 'n.', level: 'B1', meaning: 'เส้นเฟตตูชินี (พาสต้าเส้นแบน)', thai_pronunciation: 'เฟต-ตุช-ชี-นี', ipa: 'ˌfetʊˈtʃiːni' },
  'mozzarella': { word: 'mozzarella', type: 'n.', level: 'A2', meaning: 'มอสซาเรลล่าชีส (ชีสยืดสีขาว)', thai_pronunciation: 'ม็อซ-ซะ-เรล-ล่า', ipa: 'ˌmɒtsəˈrelə' },
  'basil': { word: 'basil', type: 'n.', level: 'A2', meaning: 'ใบโหระพา, กะเพรา', thai_pronunciation: 'เบ-เซิล', ipa: 'ˈbæzl' },
  'margherita': { word: 'margherita', type: 'n.', level: 'A2', meaning: 'พิซซ่ามาร์เกริต้า (หน้ามะเขือเทศ มอสซาเรลล่า และโหระพา)', thai_pronunciation: 'มาร์-เก-ริ-ต้า', ipa: 'ˌmɑːrɡəˈriːtə' },
  'headquarters': { word: 'headquarters', type: 'n.', level: 'B2', meaning: 'สำนักงานใหญ่, กองบัญชาการ', thai_pronunciation: 'เฮด-ควอร์-เทอร์ส', ipa: 'ˈhedkwɔːrtərz' },
  'bokashi': { word: 'bokashi', type: 'n.', level: 'B2', meaning: 'โบกาชิ (วิธีการหมักปุ๋ยชีวภาพจากเศษอาหารสไตล์ญี่ปุ่น)', thai_pronunciation: 'โบ-กา-ชิ', ipa: 'boʊˈkɑːʃi' },
  'mesh': { word: 'mesh', type: 'n., adj.', level: 'B2', meaning: 'ตาข่าย, ผ้าตาข่ายโปร่ง', thai_pronunciation: 'เมช', ipa: 'meʃ' },
  'strawberries': { word: 'strawberries', type: 'n.', level: 'A1', meaning: 'ผลสตรอว์เบอร์รี (หลายผล)', thai_pronunciation: 'สตรอ-เบอ-รีส', ipa: 'ˈstrɔːbəriz' },
  'subterranean': { word: 'subterranean', type: 'adj.', level: 'B2', meaning: 'ใต้ดิน, ที่อยู่ใต้พื้นดิน', thai_pronunciation: 'ซับ-เทอร์-เร-เนียน', ipa: 'ˌsʌbtəˈreɪniən' },
  'corridor': { word: 'corridor', type: 'n.', level: 'B2', meaning: 'ระเบียงทางเดิน, เส้นทางเดินรถด่วนพิเศษ', thai_pronunciation: 'คอร์-ริ-ดอร์', ipa: 'ˈkɒrɪdɔːr' },
  'david': { word: 'David', type: 'proper noun', level: 'A1', meaning: 'เดวิด (ชื่อผู้ชาย)', thai_pronunciation: 'เด-วิด', ipa: 'ˈdeɪvɪd' },
  'brandon': { word: 'Brandon', type: 'proper noun', level: 'A1', meaning: 'แบรนดอน (ชื่อผู้ชาย)', thai_pronunciation: 'แบรน-ดอน', ipa: 'ˈbrændən' },
  'sophia': { word: 'Sophia', type: 'proper noun', level: 'A1', meaning: 'โซเฟีย (ชื่อผู้หญิง)', thai_pronunciation: 'โซ-เฟีย', ipa: 'soʊˈfiːə' },
  'elena': { word: 'Elena', type: 'proper noun', level: 'A1', meaning: 'เอเลน่า (ชื่อผู้หญิง)', thai_pronunciation: 'เอ-เล-น่า', ipa: 'eˈleɪnə' },
  'marcus': { word: 'Marcus', type: 'proper noun', level: 'A1', meaning: 'มาร์คัส (ชื่อผู้ชาย)', thai_pronunciation: 'มาร์-คัส', ipa: 'ˈmɑːrkəs' },
  'maya': { word: 'Maya', type: 'proper noun', level: 'A1', meaning: 'มายา (ชื่อผู้หญิง)', thai_pronunciation: 'มา-ย่า', ipa: 'ˈmaɪə' },
  'julian': { word: 'Julian', type: 'proper noun', level: 'A1', meaning: 'จูเลียน (ชื่อผู้ชาย)', thai_pronunciation: 'จู-เลียน', ipa: 'ˈdʒuːliən' },
  'rachel': { word: 'Rachel', type: 'proper noun', level: 'A1', meaning: 'ราเชล (ชื่อผู้หญิง)', thai_pronunciation: 'เร-เชิล', ipa: 'ˈreɪtʃəl' },
  'nathan': { word: 'Nathan', type: 'proper noun', level: 'A1', meaning: 'นาธาน (ชื่อผู้ชาย)', thai_pronunciation: 'เน-เธิน', ipa: 'ˈneɪθən' },
  'kevin': { word: 'Kevin', type: 'proper noun', level: 'A1', meaning: 'เควิน (ชื่อผู้ชาย)', thai_pronunciation: 'เค-วิน', ipa: 'ˈkevɪn' },
  'daniel': { word: 'Daniel', type: 'proper noun', level: 'A1', meaning: 'แดเนียล (ชื่อผู้ชาย)', thai_pronunciation: 'แด-เนียล', ipa: 'ˈdænjəl' },
  'garcia': { word: 'Garcia', type: 'proper noun', level: 'A1', meaning: 'การ์เซีย (นามสกุล)', thai_pronunciation: 'การ์-ซี-อา', ipa: 'ɡɑːrˈsiːə' },
  'miller': { word: 'Miller', type: 'proper noun', level: 'A1', meaning: 'มิลเลอร์ (นามสกุล)', thai_pronunciation: 'มิล-เลอร์', ipa: 'ˈmɪlər' },
  'chase': { word: 'chase', type: 'v., n.', level: 'A2', meaning: 'วิ่งไล่ตาม, ไล่กวด, การไล่ตาม', thai_pronunciation: 'เชส', ipa: 'tʃeɪs' },
  'relieved': { word: 'relieved', type: 'adj.', level: 'B1', meaning: 'รู้สึกโล่งใจ, คลายกังวล, ผ่อนคลาย', thai_pronunciation: 'ริ-ลีฟด์', ipa: 'rɪˈliːvd' },
  'airlock': { word: 'airlock', type: 'n.', level: 'B2', meaning: 'ประตูกักอากาศ, ห้องปรับความดันอากาศ', thai_pronunciation: 'แอร์-ล็อก', ipa: 'ˈeəlɒk' },
  'humanity': { word: 'humanity', type: 'n.', level: 'B2', meaning: 'มนุษยชาติ, ความเป็นมนุษย์, มนุษยธรรม', thai_pronunciation: 'ฮิว-แมน-นิ-ที', ipa: 'hjuːˈmænəti' },
  'dairy': { word: 'dairy', type: 'n., adj.', level: 'B1', meaning: 'ผลิตภัณฑ์ที่ทำจากนม (นม เนย ชีส), เกี่ยวกับฟาร์มโคนม', thai_pronunciation: 'แด-รี', ipa: 'ˈdeəri' },
  'aisle': { word: 'aisle', type: 'n.', level: 'B2', meaning: 'ทางเดินระหว่างแถวที่นั่งหรือชั้นวางของในห้าง', thai_pronunciation: 'ไอล', ipa: 'aɪl' },
  'toward': { word: 'toward', type: 'prep.', level: 'A2', meaning: 'มุ่งหน้าไปทาง, ไปสู่, ตรงไปยัง', thai_pronunciation: 'เทอะ-วอร์ด', ipa: 'təˈwɔːd' },
  'towards': { word: 'towards', type: 'prep.', level: 'A2', meaning: 'มุ่งหน้าไปทาง, ไปสู่, ตรงไปยัง', thai_pronunciation: 'เทอะ-วอร์ดส์', ipa: 'təˈwɔːdz' },
  'bakery': { word: 'bakery', type: 'n.', level: 'A2', meaning: 'ร้านขายขนมปัง, ร้านเบเกอรี่, โรงอบขนมปัง', thai_pronunciation: 'เบ-เคอะ-รี', ipa: 'ˈbeɪkəri' },
  'checkout': { word: 'checkout', type: 'n.', level: 'A2', meaning: 'จุดชำระเงินในซูเปอร์มาร์เก็ต, การเช็กเอาต์', thai_pronunciation: 'เช็ก-เอ๊าท์', ipa: 'ˈtʃekaʊt' },
  'noon': { word: 'noon', type: 'n.', level: 'A2', meaning: 'เที่ยงวัน, เวลา 12 นาฬิกาตรง', thai_pronunciation: 'นูน', ipa: 'nuːn' },
  'coworker': { word: 'coworker', type: 'n.', level: 'B1', meaning: 'เพื่อนร่วมงาน', thai_pronunciation: 'โค-เวิร์ก-เกอร์', ipa: 'ˈkoʊˌwɜːrkər' },
  'coworkers': { word: 'coworkers', type: 'n.', level: 'B1', meaning: 'เพื่อนร่วมงาน (หลายคน)', thai_pronunciation: 'โค-เวิร์ก-เกอร์ส', ipa: 'ˈkoʊˌwɜːrkərz' },
  'chore': { word: 'chore', type: 'n.', level: 'B1', meaning: 'งานบ้าน, ภารกิจประจำวัน', thai_pronunciation: 'ชอร์', ipa: 'tʃɔːr' },
  'chores': { word: 'chores', type: 'n.', level: 'B1', meaning: 'งานบ้านประจำวัน (หลายอย่าง)', thai_pronunciation: 'ชอร์ส', ipa: 'tʃɔːrz' },
  'vacuum': { word: 'vacuum', type: 'v., n.', level: 'A2', meaning: 'ดูดฝุ่น (ทำความสะอาด), เครื่องดูดฝุ่น', thai_pronunciation: 'แวค-คิวอัม', ipa: 'ˈvækjuːm' },
  'scrub': { word: 'scrub', type: 'v.', level: 'B1', meaning: 'ขัดถู, เช็ดถูอย่างแรง', thai_pronunciation: 'สครบ', ipa: 'skrʌb' },
  'laundry': { word: 'laundry', type: 'n.', level: 'A2', meaning: 'การซักรีด, เสื้อผ้าที่รอซักหรือซักแล้ว', thai_pronunciation: 'ลอน-ดรี', ipa: 'ˈlɔːndri' },
  'exhausting': { word: 'exhausting', type: 'adj.', level: 'B1', meaning: 'ที่เหน็ดเหนื่อยมาก, ที่ทำให้หมดแรง', thai_pronunciation: 'อิก-ซอส-ติง', ipa: 'ɪɡˈzɔːstɪŋ' },
  'spotless': { word: 'spotless', type: 'adj.', level: 'B2', meaning: 'สะอาดหมดจด, ไร้รอยเปื้อน, ไม่มีที่ติ', thai_pronunciation: 'สป็อต-เลิส', ipa: 'ˈspɒtləs' },
  'brew': { word: 'brew', type: 'v.', level: 'B1', meaning: 'ชง (ชา/กาแฟ), หมักบ่ม', thai_pronunciation: 'บรู', ipa: 'bruː' },
  'sofa': { word: 'sofa', type: 'n.', level: 'A1', meaning: 'โซฟา, เก้าอี้นวมตัวยาว', thai_pronunciation: 'โซ-ฟา', ipa: 'ˈsoʊfə' },
  'mom': { word: 'mom', type: 'n.', level: 'A1', meaning: 'แม่ (ภาษาพูดแบบเป็นกันเอง)', thai_pronunciation: 'มัม', ipa: 'mɑːm' },
  'dad': { word: 'dad', type: 'n.', level: 'A1', meaning: 'พ่อ (ภาษาพูดแบบเป็นกันเอง)', thai_pronunciation: 'แด๊ด', ipa: 'dæd' },
  'check-up': { word: 'check-up', type: 'n.', level: 'A2', meaning: 'การตรวจสุขภาพ, การตรวจเช็กร่างกาย/ฟัน', thai_pronunciation: 'เช็ก-อัพ', ipa: 'ˈtʃekʌp' },
  'clean-up': { word: 'clean-up', type: 'n.', level: 'A2', meaning: 'การทำความสะอาดครั้งใหญ่, การเก็บกวาด', thai_pronunciation: 'คลีน-อัพ', ipa: 'ˈkliːnʌp' },
  'trash': { word: 'trash', type: 'n., v.', level: 'A2', meaning: 'ขยะ, สิ่งของไร้ค่า, ทิ้งขยะ', thai_pronunciation: 'แทรช', ipa: 'træʃ' },
  'super': { word: 'super', type: 'adv., adj.', level: 'A2', meaning: 'อย่างยิ่ง, สุดๆ, ยอดเยี่ยมมาก', thai_pronunciation: 'ซู-เปอร์', ipa: 'ˈsuːpər' },
  'sneak': { word: 'sneak', type: 'v.', level: 'B2', meaning: 'แอบย่อง, ลอบทำ, หลบๆ ซ่อนๆ', thai_pronunciation: 'สนีก', ipa: 'sniːk' },
  'balloon': { word: 'balloon', type: 'n.', level: 'A2', meaning: 'ลูกโป่ง, บอลลูน', thai_pronunciation: 'บัล-ลูน', ipa: 'bəˈluːn' },
  'balloons': { word: 'balloons', type: 'n.', level: 'A2', meaning: 'ลูกโป่งหลายลูก', thai_pronunciation: 'บัล-ลูนส์', ipa: 'bəˈluːnz' },
  'banner': { word: 'banner', type: 'n.', level: 'B1', meaning: 'ป้ายผ้า, ป้ายแบนเนอร์ข้อความ', thai_pronunciation: 'แบน-เนอร์', ipa: 'ˈbænər' },
  'ten-minute': { word: 'ten-minute', type: 'adj.', level: 'A2', meaning: 'ซึ่งใช้เวลา 10 นาที', thai_pronunciation: 'เท็น-มิน-นิท', ipa: 'ˈten ˈmɪnɪt' },
  'workout': { word: 'workout', type: 'n.', level: 'B1', meaning: 'การออกกำลังกาย, การฝึกซ้อมร่างกาย', thai_pronunciation: 'เวิร์ก-เอาท์', ipa: 'ˈwɜːrkaʊt' },
  'treadmill': { word: 'treadmill', type: 'n.', level: 'B1', meaning: 'ลู่วิ่งไฟฟ้า, เครื่องวิ่งสายพาน', thai_pronunciation: 'เทรด-มิล', ipa: 'ˈtredmɪl' },
  'weightlifting': { word: 'weightlifting', type: 'n.', level: 'B1', meaning: 'กีฬายกน้ำหนัก, การฝึกยกน้ำหนัก', thai_pronunciation: 'เวท-ลิฟ-ติง', ipa: 'ˈweɪtlɪftɪŋ' },
  'motivated': { word: 'motivated', type: 'adj.', level: 'B1', meaning: 'มีแรงกระตุ้น, มีพลังใจ, มีความตั้งใจสูง', thai_pronunciation: 'โม-ทิ-เว-ทิด', ipa: 'ˈmoʊtɪveɪtɪd' },
  'clunking': { word: 'clunking', type: 'adj., n.', level: 'B2', meaning: 'เสียงกระทบของโลหะดังกึกกัก/ตึงตัง', thai_pronunciation: 'คลังก์-คิง', ipa: 'ˈklʌŋkɪŋ' },
  'steer': { word: 'steer', type: 'v.', level: 'B1', meaning: 'ควบคุมทิศทาง, บังคับพวงมาลัย, นำทาง', thai_pronunciation: 'สเตียร์', ipa: 'stɪər' },
  'flasher': { word: 'flasher', type: 'n.', level: 'B1', meaning: 'ไฟฉุกเฉิน / ไฟสัญญาณกระพริบของรถยนต์', thai_pronunciation: 'แฟลช-เชอร์', ipa: 'ˈflæʃər' },
  'flashers': { word: 'flashers', type: 'n.', level: 'B1', meaning: 'ไฟฉุกเฉิน (กระพริบพร้อมกัน)', thai_pronunciation: 'แฟลช-เชอร์ส', ipa: 'ˈflæʃərz' },
  'tow': { word: 'tow', type: 'v., n.', level: 'B1', meaning: 'ลาก, จูง, การลากจูง (เช่น tow truck รถลาก)', thai_pronunciation: 'โท', ipa: 'toʊ' },
  'nearby': { word: 'nearby', type: 'adj., adv.', level: 'A2', meaning: 'ใกล้เคียง, ในบริเวณใกล้ๆ', thai_pronunciation: 'เนียร์-บาย', ipa: 'ˌnɪəˈbaɪ' },
  'stressful': { word: 'stressful', type: 'adj.', level: 'B1', meaning: 'ที่เต็มไปด้วยความเครียด, ตึงเครียด', thai_pronunciation: 'สเตรส-ฟูล', ipa: 'ˈstresfl' },
  'luckily': { word: 'luckily', type: 'adv.', level: 'A2', meaning: 'โชคดีที่..., อย่างโชคช่วย', thai_pronunciation: 'ลัค-คิ-ลี', ipa: 'ˈlʌkɪli' },
  'grocery': { word: 'grocery', type: 'n.', level: 'A2', meaning: 'ร้านขายของชำ, ร้านขายของกินของใช้', thai_pronunciation: 'โกร-เซอะ-รี', ipa: 'ˈɡroʊsəri' },
  'groceries': { word: 'groceries', type: 'n.', level: 'A2', meaning: 'ของชำ, ของกินของใช้ในบ้านที่ซื้อจากร้าน', thai_pronunciation: 'โกร-เซอะ-รีส', ipa: 'ˈɡroʊsəriz' },
  'automatically': { word: 'automatically', type: 'adv.', level: 'B1', meaning: 'โดยอัตโนมัติ', thai_pronunciation: 'ออ-โต-แมต-ติก-ลี', ipa: 'ˌɔːtəˈmætɪkli' },
  'chunk': { word: 'chunk', type: 'n.', level: 'B2', meaning: 'ก้อนใหญ่, เงินก้อนใหญ่, ส่วนสำคัญ', thai_pronunciation: 'ชังก์', ipa: 'tʃʌŋk' },
  'paycheck': { word: 'paycheck', type: 'n.', level: 'B1', meaning: 'เช็คเงินเดือน, เงินเดือนที่ได้รับ', thai_pronunciation: 'เพย์-เช็ก', ipa: 'ˈpeɪtʃek' },
  'awkward': { word: 'awkward', type: 'adj.', level: 'B1', meaning: 'กระอักกระอ่วน, เคอะเขิน, อึดอัด', thai_pronunciation: 'ออค-เวิร์ด', ipa: 'ˈɔːkwəd' },
  'casual': { word: 'casual', type: 'adj.', level: 'B1', meaning: 'เป็นกันเอง, สบายๆ, ไม่เป็นทางการ', thai_pronunciation: 'แคช-ชวล', ipa: 'ˈkæʒuəl' },
  'deadline': { word: 'deadline', type: 'n.', level: 'B1', meaning: 'กำหนดเวลาส่งงาน, เส้นตาย', thai_pronunciation: 'เดด-ไลน์', ipa: 'ˈdedlaɪn' },
  'deadlines': { word: 'deadlines', type: 'n.', level: 'B1', meaning: 'กำหนดเวลาส่งงาน (หลายชิ้น)', thai_pronunciation: 'เดด-ไลน์ส', ipa: 'ˈdedlaɪnz' },
  'overwhelmed': { word: 'overwhelmed', type: 'adj.', level: 'B2', meaning: 'รู้สึกท่วมท้น, รู้สึกรับมือไม่ไหว, ล้นมือ', thai_pronunciation: 'โอ-เวอร์-เวลมด์', ipa: 'ˌoʊvərˈwelmd' },
  'adjust': { word: 'adjust', type: 'v.', level: 'B2', meaning: 'ปรับ, ปรับเปลี่ยน, ปรับตัว', thai_pronunciation: 'อะ-จัสต์', ipa: 'əˈdʒʌst' },
  'adjusting': { word: 'adjusting', type: 'v.', level: 'B2', meaning: 'กำลังปรับเปลี่ยน / การปรับตัว', thai_pronunciation: 'อะ-จัส-ติง', ipa: 'əˈdʒʌstɪŋ' },
  'weird': { word: 'weird', type: 'adj.', level: 'B1', meaning: 'แปลกประหลาด, พิลึก, ประหลาด', thai_pronunciation: 'เวียร์ด', ipa: 'wɪəd' },
  'terrified': { word: 'terrified', type: 'adj.', level: 'B1', meaning: 'หวาดกลัวมาก, ตกใจกลัวสุดขีด', thai_pronunciation: 'เท-ริ-ฟายด์', ipa: 'ˈterɪfaɪd' },
  'neighborhood': { word: 'neighborhood', type: 'n.', level: 'B1', meaning: 'ย่าน, แถบละแวกบ้าน, ชุมชนใกล้เคียง', thai_pronunciation: 'เน-เบอร์-ฮูด', ipa: 'ˈneɪbərhʊd' },
  'scope': { word: 'scope', type: 'v., n.', level: 'B2', meaning: 'สำรวจ, สอดส่องมองหา, ขอบเขตงาน', thai_pronunciation: 'สโคป', ipa: 'skoʊp' },
  'scoped': { word: 'scoped', type: 'v.', level: 'B2', meaning: 'สำรวจดูแล้ว, กวาดสายตามองหาแล้ว', thai_pronunciation: 'สโคปต์', ipa: 'skoʊpt' },
  'tom': { word: 'Tom', type: 'proper noun', level: 'A1', meaning: 'ทอม (ชื่อผู้ชาย)', thai_pronunciation: 'ทอม', ipa: 'tɒm' },
  'sarah': { word: 'Sarah', type: 'proper noun', level: 'A1', meaning: 'ซาร่าห์ (ชื่อผู้หญิง)', thai_pronunciation: 'เซ-ร่า', ipa: 'ˈseərə' },
  'luna': { word: 'Luna', type: 'proper noun', level: 'A1', meaning: 'ลูน่า (ชื่อสัตว์เลี้ยง/แมว หรือพระจันทร์)', thai_pronunciation: 'ลู-น่า', ipa: 'ˈluːnə' },
  'reynolds': { word: 'Reynolds', type: 'proper noun', level: 'A1', meaning: 'เรย์โนลด์ส (ชื่อเฉพาะ/นามสกุลกัปตัน)', thai_pronunciation: 'เรย์-โนลด์ส', ipa: 'ˈrenəldz' },
  'mars': { word: 'Mars', type: 'proper noun', level: 'A2', meaning: 'ดาวอังคาร', thai_pronunciation: 'มาร์ส', ipa: 'mɑːz' },
  '8:30': { word: '8:30 AM', type: 'time', level: 'A1', meaning: 'เวลา แปดโมงครึ่ง (8 นาฬิกา 30 นาที ตอนเช้า)', thai_pronunciation: 'เอท เธอร-ตี เอ-เอ็ม', ipa: 'eɪt ˈθɜːti eɪ em' },
  '830': { word: '8:30 AM', type: 'time', level: 'A1', meaning: 'เวลา แปดโมงครึ่ง (8 นาฬิกา 30 นาที ตอนเช้า)', thai_pronunciation: 'เอท เธอร-ตี เอ-เอ็ม', ipa: 'eɪt ˈθɜːti eɪ em' },
  '10:00': { word: '10:00 AM', type: 'time', level: 'A1', meaning: 'เวลา สิบโมงตรง (10 นาฬิกาตรง ตอนเช้า)', thai_pronunciation: 'เท็น อะ-คล็อก เอ-เอ็ม', ipa: 'ten əˈklɒk eɪ em' },
  '1000': { word: '10:00 AM', type: 'time', level: 'A1', meaning: 'เวลา สิบโมงตรง (10 นาฬิกาตรง ตอนเช้า)', thai_pronunciation: 'เท็น อะ-คล็อก เอ-เอ็ม', ipa: 'ten əˈklɒk eɪ em' },
  'cozy': { word: 'cozy', type: 'adj.', level: 'B1', ipa: 'ˈkoʊzi', thai_pronunciation: 'โค-ซี', meaning: 'อบอุ่นสบาย, เป็นกันเอง, น่าอยู่' },
  'tasty': { word: 'tasty', type: 'adj.', level: 'A2', ipa: 'ˈteɪsti', thai_pronunciation: 'เทส-ตี', meaning: 'อร่อย, รสชาติดี' },
  'cough': { word: 'cough', type: 'v., n.', level: 'A2', ipa: 'kɔːf', thai_pronunciation: 'คอฟ', meaning: 'ไอ, เสียงไอ, อาการไอ' },
  'pharmacy': { word: 'pharmacy', type: 'n.', level: 'A2', ipa: 'ˈfɑːrməsi', thai_pronunciation: 'ฟาร์-มะ-ซี', meaning: 'ร้านขายยา, เภสัชกรรม' },
  'pharmacist': { word: 'pharmacist', type: 'n.', level: 'B1', ipa: 'ˈfɑːrməsɪst', thai_pronunciation: 'ฟาร์-มะ-ซิสต์', meaning: 'เภสัชกร' },
  'syrup': { word: 'syrup', type: 'n.', level: 'B1', ipa: 'ˈsɪrəp', thai_pronunciation: 'ไซ-รัป / ซี-รัป', meaning: 'ยาน้ำเชื่อม, น้ำเชื่อม' },
  'receptionist': { word: 'receptionist', type: 'n.', level: 'A2', ipa: 'rɪˈsepʃənɪst', thai_pronunciation: 'ริ-เซพ-ชัน-นิสต์', meaning: 'พนักงานต้อนรับ' },
  'two-night': { word: 'two-night', type: 'adj.', level: 'A2', ipa: 'tuː naɪt', thai_pronunciation: 'ทู-ไนท์', meaning: 'เป็นเวลาสองคืน' },
  '7:00': { word: '7:00 AM', type: 'time', level: 'A1', ipa: 'ˈsevən əˈklɒk eɪ em', thai_pronunciation: 'เซฟ-เวิน อะ-คล็อก เอ-เอ็ม', meaning: 'เวลา 7 นาฬิกาตรง (เจ็ดโมงเช้า)' },
  'wi-fi': { word: 'Wi-Fi', type: 'n.', level: 'A1', ipa: 'ˈwaɪ faɪ', thai_pronunciation: 'ไว-ไฟ', meaning: 'สัญญาณอินเทอร์เน็ตไร้สาย ไวไฟ' },
  'elevator': { word: 'elevator', type: 'n.', level: 'A2', ipa: 'ˈelɪveɪtər', thai_pronunciation: 'เอล-ลิ-เว-เตอร์', meaning: 'ลิฟต์โดยสาร' },
  'unpacked': { word: 'unpacked', type: 'v.', level: 'A2', ipa: 'ʌnˈpækt', thai_pronunciation: 'อัน-แพ็กต์', meaning: 'รื้อกระเป๋า, เปิดห่อสิ่งของออกมา (รูปอดีตของ unpack)' },
  '3:00': { word: '3:00 PM', type: 'time', level: 'A1', ipa: 'θriː əˈklɒk piː em', thai_pronunciation: 'ธรี อะ-คล็อก พี-เอ็ม', meaning: 'เวลา 3 นาฬิกาตอนบ่าย (บ่ายสามโมงตรง)' },
  'pm': { word: 'PM', type: 'abbr.', level: 'A1', ipa: 'ˌpiː ˈem', thai_pronunciation: 'พี-เอ็ม', meaning: 'หลังเที่ยงวัน (ช่วงเวลาตั้งแต่เที่ยงวันถึงเที่ยงคืน)' },
  'dr': { word: 'Dr.', type: 'n.', level: 'A1', ipa: 'ˈdɑːktər', thai_pronunciation: 'ด็อก-เตอร์', meaning: 'นายแพทย์, คุณหมอ, ด็อกเตอร์ (คำย่อของ Doctor)' },
  'evans': { word: 'Evans', type: 'proper noun', level: 'A1', ipa: 'ˈevənz', thai_pronunciation: 'เอฟ-เวินส์', meaning: 'เอแวนส์ (นามสกุล)' },
  '3:30': { word: '3:30 PM', type: 'time', level: 'A1', ipa: 'θriː ˈθɜːrti piː em', thai_pronunciation: 'ธรี เธอร-ตี พี-เอ็ม', meaning: 'เวลา บ่ายสามโมงครึ่ง' },
  'calendar': { word: 'calendar', type: 'n.', level: 'A2', ipa: 'ˈkælɪndər', thai_pronunciation: 'แคล-ลิน-เดอร์', meaning: 'ปฏิทิน, ตารางนัดหมาย' },
  'marcus': { word: 'Marcus', type: 'proper noun', level: 'A1', ipa: 'ˈmɑːrkəs', thai_pronunciation: 'มาร์-คัส', meaning: 'มาร์คัส (ชื่อผู้ชาย)' },
  'inconvenience': { word: 'inconvenience', type: 'n.', level: 'B2', ipa: 'ˌɪnkənˈviːniəns', thai_pronunciation: 'อิน-เคิน-วี-เนียนส์', meaning: 'ความไม่สะดวก, ความยุ่งยาก' },
  'upload': { word: 'upload', type: 'v., n.', level: 'A2', ipa: 'ˌʌpˈloʊd', thai_pronunciation: 'อัป-โหลด', meaning: 'อัปโหลดข้อมูล, ส่งข้อมูลขึ้นเซิร์ฟเวอร์' },
  'interviewers': { word: 'interviewers', type: 'n.', level: 'B1', ipa: 'ˈɪntərvjuːərz', thai_pronunciation: 'อิน-เทอร์-วิว-เออร์ส', meaning: 'ผู้สัมภาษณ์ (หลายคน)' },
  'problem-solving': { word: 'problem-solving', type: 'n., adj.', level: 'B2', ipa: 'ˈprɑːbləm ˌsɑːlvɪŋ', thai_pronunciation: 'พรอบ-เลิม ซอล-วิง', meaning: 'การแก้ปัญหา, ทักษะการแก้ไขปัญหา' },
  'prioritizing': { word: 'prioritizing', type: 'v.', level: 'B2', ipa: 'praɪˈɔːrətaɪzɪŋ', thai_pronunciation: 'ไพร-ออ-ริ-ไท-ซิง', meaning: 'การจัดลำดับความสำคัญ (รูป -ing ของ prioritize)' },
  'workflows': { word: 'workflows', type: 'n.', level: 'B2', ipa: 'ˈwɜːrkfloʊz', thai_pronunciation: 'เวิร์ก-โฟลส์', meaning: 'ขั้นตอนการทำงาน, กระบวนการไหลของงาน' },
  'browsing': { word: 'browsing', type: 'v.', level: 'A2', ipa: 'ˈbraʊzɪŋ', thai_pronunciation: 'บราว-ซิง', meaning: 'การเปิดดู, การเลือกดูของตามร้านหรืออินเทอร์เน็ต' },
  'subway': { word: 'subway', type: 'n.', level: 'A2', ipa: 'ˈsʌbweɪ', thai_pronunciation: 'ซับ-เวย์', meaning: 'รถไฟใต้ดิน, ทางลอดใต้ดิน' },
  'one-year': { word: 'one-year', type: 'adj.', level: 'A2', ipa: 'wʌn jɪər', thai_pronunciation: 'วัน-เยียร์', meaning: 'ระยะเวลาหนึ่งปี' },
  'commute': { word: 'commute', type: 'v., n.', level: 'B1', ipa: 'kəˈmjuːt', thai_pronunciation: 'เคอะ-มิวท์', meaning: 'การเดินทางไปกลับที่ทำงานเป็นประจำ' },
  'easier': { word: 'easier', type: 'adj.', level: 'A1', ipa: 'ˈiːziər', thai_pronunciation: 'อี-ซี-เออร์', meaning: 'ง่ายกว่า, สะดวกกว่า (ขั้นกว่าของ easy)' },
  'compatibility': { word: 'compatibility', type: 'n.', level: 'B2', ipa: 'kəmˌpætəˈbɪləti', thai_pronunciation: 'เคิม-แพท-เทอะ-บิล-ลิ-ที', meaning: 'ความเข้ากันได้, การทำงานร่วมกันได้' },
  'hurdles': { word: 'hurdles', type: 'n.', level: 'B2', ipa: 'ˈhɜːrdlz', thai_pronunciation: 'เฮิร์ด-เดิลส์', meaning: 'อุปสรรค, เครื่องกีดขวาง (พหูพจน์)' },
  'stakeholders': { word: 'stakeholders', type: 'n.', level: 'B2', ipa: 'ˈsteɪkhoʊldərz', thai_pronunciation: 'สเตค-โฮล-เดอร์ส', meaning: 'ผู้มีส่วนได้ส่วนเสีย (หลายฝ่าย)' },
  'bottlenecks': { word: 'bottlenecks', type: 'n.', level: 'B2', ipa: 'ˈbɑːtlneks', thai_pronunciation: 'บอท-เทิล-เน็กส์', meaning: 'จุดคอขวด, จุดที่เป็นอุปสรรคชะลอการทำงาน' },
  'reprioritizing': { word: 'reprioritizing', type: 'v.', level: 'B2', ipa: 'ˌriːpraɪˈɔːrətaɪzɪŋ', thai_pronunciation: 'รี-ไพร-ออ-ริ-ไท-ซิง', meaning: 'การจัดลำดับความสำคัญใหม่' },
  'non-essential': { word: 'non-essential', type: 'adj., n.', level: 'B2', ipa: 'ˌnɑːn ɪˈsenʃl', thai_pronunciation: 'นอน-อิส-เซน-เชิล', meaning: 'ที่ไม่จำเป็นเร่งด่วน, ไม่ใช่สิ่งจำเป็นหลัก' },
  'ui': { word: 'UI', type: 'n.', level: 'B2', ipa: 'ˌjuː ˈaɪ', thai_pronunciation: 'ยู-ไอ', meaning: 'หน้าจอส่วนต่อประสานกับผู้ใช้ (User Interface)' },
  'sprint': { word: 'sprint', type: 'n., v.', level: 'B2', ipa: 'sprɪnt', thai_pronunciation: 'สปรินท์', meaning: 'การวิ่งเต็มฝีเท้าระยะสั้น, รอบการทำงานระยะสั้น (ในทีมพัฒนาซอฟต์แวร์)' },
  'timeline': { word: 'timeline', type: 'n.', level: 'B1', ipa: 'ˈtaɪmlaɪn', thai_pronunciation: 'ไทม์-ไลน์', meaning: 'กำหนดการตามลำดับเวลา, เส้นเวลา' },
  'constructively': { word: 'constructively', type: 'adv.', level: 'B2', ipa: 'kənˈstrʌktɪvli', thai_pronunciation: 'เคิน-สตรัค-ทิฟ-ลี', meaning: 'ในเชิงสร้างสรรค์, อย่างมีประโยชน์' },
  'showcase': { word: 'showcase', type: 'v., n.', level: 'B2', ipa: 'ˈʃoʊkeɪs', thai_pronunciation: 'โชว์-เคส', meaning: 'จัดแสดงให้เห็นเด่นชัด, ตู้โชว์, ผลงานตัวอย่าง' },
  'dependable': { word: 'dependable', type: 'adj.', level: 'B2', ipa: 'dɪˈpendəbl', thai_pronunciation: 'ดิ-เพน-เดอะ-เบิล', meaning: 'พึ่งพาได้, ไว้ใจได้, พึ่งใบบุญได้' },
  'harmoniously': { word: 'harmoniously', type: 'adv.', level: 'B2', ipa: 'hɑːrˈmoʊniəsli', thai_pronunciation: 'ฮาร์-โม-เนียส-ลี', meaning: 'อย่างกลมกลืนเป็นอันหนึ่งอันเดียวกัน, อย่างปรองดอง' },
  'roommate': { word: 'roommate', type: 'n.', level: 'A2', ipa: 'ˈruːmmeɪt', thai_pronunciation: 'รูม-เมท', meaning: 'เพื่อนร่วมห้องพัก' },
  'unwashed': { word: 'unwashed', type: 'adj.', level: 'B1', ipa: 'ˌʌnˈwɔːʃt', thai_pronunciation: 'อัน-วอชท์', meaning: 'ที่ยังไม่ได้ล้าง, สกปรก' },
  'late-night': { word: 'late-night', type: 'adj.', level: 'A2', ipa: 'leɪt naɪt', thai_pronunciation: 'เลท-ไนท์', meaning: 'ช่วงดึก, ตอนดึกสงัด' },
  'alex': { word: 'Alex', type: 'proper noun', level: 'A1', ipa: 'ˈælɪks', thai_pronunciation: 'อเล็กซ์', meaning: 'อเล็กซ์ (ชื่อคน)' },
  'dining': { word: 'dining', type: 'n., adj.', level: 'A2', ipa: 'ˈdaɪnɪŋ', thai_pronunciation: 'ได-นิง', meaning: 'การรับประทานอาหาร (เช่น dining room ห้องรับประทานอาหาร)' },
  'accusatory': { word: 'accusatory', type: 'adj.', level: 'C1', ipa: 'əˈkjuːzətɔːri', thai_pronunciation: 'เออะ-คิว-ซะ-ทอ-รี', meaning: 'ในเชิงกล่าวโทษ, แสดงท่าทีปรักปรำ' },
  'freelance': { word: 'freelance', type: 'adj., n., v.', level: 'B1', ipa: 'ˈfriːlæns', thai_pronunciation: 'ฟรี-แลนส์', meaning: 'ทำงานอิสระ, อาชีพอิสระ' },
  'workload': { word: 'workload', type: 'n.', level: 'B1', ipa: 'ˈwɜːrkloʊd', thai_pronunciation: 'เวิร์ก-โหลด', meaning: 'ปริมาณงานที่ต้องทำ' },
  '11:00': { word: '11:00 AM', type: 'time', level: 'A1', ipa: 'ɪˈlevn əˈklɒk eɪ em', thai_pronunciation: 'อิ-เลฟ-เวิน อะ-คล็อก เอ-เอ็ม', meaning: 'เวลา สิบเอ็ดโมงตรง' },
  'weekdays': { word: 'weekdays', type: 'n.', level: 'A2', ipa: 'ˈwiːkdeɪz', thai_pronunciation: 'วีค-เดย์ส', meaning: 'วันธรรมดา (จันทร์ถึงศุกร์)' },
  'diplomatically': { word: 'diplomatically', type: 'adv.', level: 'B2', ipa: 'ˌdɪpləˈmætɪkli', thai_pronunciation: 'ดิพ-เลอะ-แมต-ติก-ลี', meaning: 'อย่างมีชั้นเชิงทางการทูต, อย่างบัวไม่ให้ช้ำน้ำไม่ให้ขุ่น' },
  'stress-free': { word: 'stress-free', type: 'adj.', level: 'A2', ipa: 'stres friː', thai_pronunciation: 'สเตรส-ฟรี', meaning: 'ปราศจากความเครียด, สบายใจไร้กังวล' },
  'cancellation': { word: 'cancellation', type: 'n.', level: 'B1', ipa: 'ˌkænsəˈleɪʃn', thai_pronunciation: 'แคน-เซิล-เล-ชัน', meaning: 'การยกเลิก' },
  'earliest': { word: 'earliest', type: 'adj., adv.', level: 'A2', ipa: 'ˈɜːrliɪst', thai_pronunciation: 'เออร์-ลิ-อิสต์', meaning: 'เร็วที่สุด, แต่เนิ่นๆ ที่สุด (ขั้นสุดของ early)' },
  'vouchers': { word: 'vouchers', type: 'n.', level: 'B1', ipa: 'ˈvaʊtʃərz', thai_pronunciation: 'เวา-เชอร์ส', meaning: 'คูปองแทนเงินสด, บัตรกำนัล (หลายใบ)' },
  'out-of-pocket': { word: 'out-of-pocket', type: 'adj.', level: 'B2', ipa: 'ˌaʊt əv ˈpɑːkɪt', thai_pronunciation: 'เอาท์-เอิฟว์-พ็อก-เก็ต', meaning: 'ที่ต้องควักกระเป๋าจ่ายเงินส่วนตัวล่วงหน้า' },
  "carrier's": { word: "carrier's", type: 'n.', level: 'B1', ipa: 'ˈkæriərz', thai_pronunciation: 'แค-ริ-เออร์ส', meaning: 'ของสายการบิน / ของผู้ให้บริการขนส่ง' },
  'invoices': { word: 'invoices', type: 'n.', level: 'B1', ipa: 'ˈɪnvɔɪsɪz', thai_pronunciation: 'อิน-วอย-สิส', meaning: 'ใบแจ้งหนี้, ใบส่งของ (หลายใบ)' },
  'reimbursed': { word: 'reimbursed', type: 'v.', level: 'B2', ipa: 'ˌriːɪmˈbɜːrst', thai_pronunciation: 'รี-อิม-เบิร์สต์', meaning: 'ได้รับเงินชดเชยคืนแล้ว, จ่ายเงินคืนแล้ว' },
  'awry': { word: 'awry', type: 'adj., adv.', level: 'C1', ipa: 'əˈraɪ', thai_pronunciation: 'เออะ-ไร', meaning: 'ผิดแผน, ผิดทิศผิดทาง, บิดเบี้ยวไปจากเดิม' }
};

/**
 * Robust word lookup supporting:
 * - Direct dictionary match
 * - Contractions (I'm, didn't, can't, etc.)
 * - Possessives (sister's, parents')
 * - Irregular verbs & irregular nouns (went -> go, teeth -> tooth, etc.)
 * - Rule-based Lemmatization (-ed, -ing, -s, -es, -ies, -ves, -ly, -est, -er)
 * - Supplemental everyday dictionary
 */
export function lookupWord(rawWord) {
  if (!rawWord || typeof rawWord !== 'string') return null;

  // Clean edge punctuation while preserving inner letters, hyphens, and apostrophes
  const cleaned = rawWord.trim()
    .replace(/^[.,!?;:'"“”‘’()[\]{}—–\s]+/, '')
    .replace(/[.,!?;:'"“”‘’()[\]{}—–\s]+$/, '');
  
  if (!cleaned) return null;
  const lower = cleaned.toLowerCase();

  // 1. Direct match in core vocabulary
  if (vocabMap.has(lower)) {
    const entry = vocabMap.get(lower);
    return {
      word: cleaned,
      ...entry,
      isBaseWord: true,
      notFound: false
    };
  }

  // 2. Direct match in contractions
  if (contractions[lower]) {
    return {
      word: cleaned,
      ...contractions[lower],
      notFound: false
    };
  }

  // 3. Direct match in supplemental dictionary
  if (supplementalDict[lower]) {
    return {
      word: cleaned,
      ...supplementalDict[lower],
      notFound: false
    };
  }

  // 4. Possessive noun check (e.g. sister's -> sister, parents' -> parent)
  if (lower.endsWith("'s") || lower.endsWith("’s") || lower.endsWith("s'")) {
    const baseNoun = lower.replace(/['’]s$/, '').replace(/s['’]$/, '');
    const entry = vocabMap.get(baseNoun) || supplementalDict[baseNoun];
    if (entry) {
      return {
        word: cleaned,
        baseWord: entry.word,
        type: entry.type,
        meaning: `ของ${entry.meaning}`,
        thai_pronunciation: entry.thai_pronunciation + 'ส์',
        ipa: entry.ipa + 'z',
        level: entry.level,
        note: `รูปแสดงความเป็นเจ้าของ ('s) ของ ${entry.word}`,
        notFound: false
      };
    }
  }

  // 5. Irregular verbs & nouns lookup (With individual phonetic info)
  if (irregulars[lower]) {
    const ir = irregulars[lower];
    const baseEntry = vocabMap.get(ir.base) || supplementalDict[ir.base];
    if (baseEntry) {
      return {
        word: cleaned,
        baseWord: baseEntry.word,
        type: baseEntry.type,
        meaning: baseEntry.meaning,
        thai_pronunciation: ir.thai || baseEntry.thai_pronunciation,
        ipa: ir.ipa || baseEntry.ipa,
        level: baseEntry.level,
        note: ir.note || `รูปผันของ ${baseEntry.word}`,
        notFound: false
      };
    }
  }

  // 6. Rule-based Lemmatization
  const tryBase = (candidate, note, meaningPrefix = '') => {
    const candLower = candidate.toLowerCase();
    const entry = vocabMap.get(candLower) || supplementalDict[candLower];
    if (entry) {
      return {
        word: cleaned,
        baseWord: entry.word,
        type: entry.type,
        meaning: meaningPrefix ? `${meaningPrefix} ${entry.meaning}` : entry.meaning,
        thai_pronunciation: entry.thai_pronunciation,
        ipa: entry.ipa,
        level: entry.level,
        note: note || `รูปของ ${entry.word}`,
        notFound: false
      };
    }
    return null;
  };

  // -ies -> -y (groceries -> grocery, berries -> berry)
  if (lower.endsWith('ies') && lower.length > 4) {
    const res = tryBase(lower.slice(0, -3) + 'y', 'พหูพจน์ (-ies)');
    if (res) return res;
  }

  // -ied -> -y (carried -> carry, tried -> try)
  if (lower.endsWith('ied') && lower.length > 4) {
    const res = tryBase(lower.slice(0, -3) + 'y', 'รูปอดีต (-ied)');
    if (res) return res;
  }

  // -ves -> -f or -fe (shelves -> shelf)
  if (lower.endsWith('ves') && lower.length > 4) {
    const res1 = tryBase(lower.slice(0, -3) + 'f', 'พหูพจน์ (-ves)');
    if (res1) return res1;
    const res2 = tryBase(lower.slice(0, -3) + 'fe', 'พหูพจน์ (-ves)');
    if (res2) return res2;
  }

  // -es (watches -> watch, boxes -> box)
  if (lower.endsWith('es') && lower.length > 3) {
    const res = tryBase(lower.slice(0, -2), 'พหูพจน์ / กริยาเอกพจน์ (-es)');
    if (res) return res;
  }

  // -s (dogs -> dog, loves -> love)
  if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 2) {
    const res = tryBase(lower.slice(0, -1), 'พหูพจน์ / กริยาเอกพจน์ (-s)');
    if (res) return res;
  }

  // -ed (walked -> walk, decided -> decide, stepped -> step)
  if (lower.endsWith('ed') && lower.length > 3) {
    let res = tryBase(lower.slice(0, -2), 'รูปอดีต (-ed)');
    if (res) return res;
    res = tryBase(lower.slice(0, -1), 'รูปอดีต (-d)');
    if (res) return res;
    if (lower.length > 4 && lower[lower.length - 3] === lower[lower.length - 4]) {
      res = tryBase(lower.slice(0, -3), 'รูปอดีต (-ed)');
      if (res) return res;
    }
  }

  // -ing (playing -> play, making -> make, running -> run)
  if (lower.endsWith('ing') && lower.length > 4) {
    let res = tryBase(lower.slice(0, -3), 'รูปกำลังทำ / Gerund (-ing)');
    if (res) return res;
    res = tryBase(lower.slice(0, -3) + 'e', 'รูปกำลังทำ / Gerund (-ing)');
    if (res) return res;
    if (lower.length > 5 && lower[lower.length - 4] === lower[lower.length - 5]) {
      res = tryBase(lower.slice(0, -4), 'รูปกำลังทำ / Gerund (-ing)');
      if (res) return res;
    }
  }

  // -ly (slowly -> slow, luckily -> lucky)
  if (lower.endsWith('ly') && lower.length > 3) {
    let res = tryBase(lower.slice(0, -2), 'กริยาวิเศษณ์ (-ly)', 'อย่าง');
    if (res) return res;
    if (lower.endsWith('ily')) {
      res = tryBase(lower.slice(0, -3) + 'y', 'กริยาวิเศษณ์ (-ily)', 'อย่าง');
      if (res) return res;
    }
  }

  // -est, -er (hardest -> hard, closer -> close)
  if (lower.endsWith('est') && lower.length > 4) {
    let res = tryBase(lower.slice(0, -3), 'ขั้นสุด (-est)', 'ที่สุด');
    if (res) return res;
    res = tryBase(lower.slice(0, -2), 'ขั้นสุด (-st)', 'ที่สุด');
    if (res) return res;
  }
  if (lower.endsWith('er') && lower.length > 3) {
    let res = tryBase(lower.slice(0, -2), 'ขั้นกว่า (-er)', 'กว่า');
    if (res) return res;
    res = tryBase(lower.slice(0, -1), 'ขั้นกว่า (-r)', 'กว่า');
    if (res) return res;
  }

  // Default: Not found
  return {
    word: cleaned,
    notFound: true
  };
}
