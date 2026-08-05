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
  "youre": { word: "you're", type: "short form", meaning: "คุณคือ / คุณเป็น (ย่อมาจาก You are)", thai_pronunciation: "ยัวร์", ipa: "jʊər", level: "A1" },
  "we're": { word: "we're", type: "short form", meaning: "พวกเราคือ / พวกเราเป็น (ย่อมาจาก We are)", thai_pronunciation: "เวียร์", ipa: "wɪər", level: "A1" },
  "they're": { word: "they're", type: "short form", meaning: "พวกเขาคือ / พวกเขาเป็น (ย่อมาจาก They are)", thai_pronunciation: "แดย์", ipa: "ðeər", level: "A1" },
  "he's": { word: "he's", type: "short form", meaning: "เขาคือ / เขาเป็น (ย่อมาจาก He is / He has)", thai_pronunciation: "ฮีส์", ipa: "hiːz", level: "A1" },
  "she's": { word: "she's", type: "short form", meaning: "เธอคือ / เธอเป็น (ย่อมาจาก She is / She has)", thai_pronunciation: "ชีส์", ipa: "ʃiːz", level: "A1" },
  "o'clock": { word: "o'clock", type: "adv.", meaning: "นาฬิกา (ใช้บอกเวลาตรง เช่น eight o'clock = 8 โมงตรง)", thai_pronunciation: "อะ-คล็อก", ipa: "əˈklɒk", level: "A1" },
  "oclock": { word: "o'clock", type: "adv.", meaning: "นาฬิกา (ใช้บอกเวลาตรง เช่น eight o'clock = 8 โมงตรง)", thai_pronunciation: "อะ-คล็อก", ipa: "əˈklɒk", level: "A1" }
};

// Irregular Verbs and Nouns
const irregulars = {
  'was': { base: 'be', note: 'รูปอดีตของ be (เอกพจน์)' },
  'were': { base: 'be', note: 'รูปอดีตของ be (พหูพจน์)' },
  'is': { base: 'be', note: 'รูปปัจจุบันของ be (เอกพจน์)' },
  'am': { base: 'be', note: 'รูปปัจจุบันของ be (ใช้กับ I)' },
  'are': { base: 'be', note: 'รูปปัจจุบันของ be (พหูพจน์/you)' },
  'been': { base: 'be', note: 'กริยาช่อง 3 ของ be' },
  'being': { base: 'be', note: 'รูป -ing ของ be' },
  'had': { base: 'have', note: 'รูปอดีตของ have' },
  'has': { base: 'have', note: 'รูปปัจจุบันเอกพจน์ของ have' },
  'having': { base: 'have', note: 'รูป -ing ของ have' },
  'did': { base: 'do', note: 'รูปอดีตของ do' },
  'does': { base: 'do', note: 'รูปปัจจุบันเอกพจน์ของ do' },
  'done': { base: 'do', note: 'กริยาช่อง 3 ของ do' },
  'doing': { base: 'do', note: 'รูป -ing ของ do' },
  'went': { base: 'go', note: 'รูปอดีตของ go' },
  'gone': { base: 'go', note: 'กริยาช่อง 3 ของ go' },
  'goes': { base: 'go', note: 'รูปปัจจุบันเอกพจน์ของ go' },
  'going': { base: 'go', note: 'รูป -ing ของ go' },
  'felt': { base: 'feel', note: 'รูปอดีตของ feel' },
  'feeling': { base: 'feel', note: 'รูป -ing ของ feel' },
  'got': { base: 'get', note: 'รูปอดีตของ get' },
  'gotten': { base: 'get', note: 'กริยาช่อง 3 ของ get' },
  'getting': { base: 'get', note: 'รูป -ing ของ get' },
  'made': { base: 'make', note: 'รูปอดีตของ make' },
  'making': { base: 'make', note: 'รูป -ing ของ make' },
  'took': { base: 'take', note: 'รูปอดีตของ take' },
  'taken': { base: 'take', note: 'กริยาช่อง 3 ของ take' },
  'taking': { base: 'take', note: 'รูป -ing ของ take' },
  'saw': { base: 'see', note: 'รูปอดีตของ see' },
  'seen': { base: 'see', note: 'กริยาช่อง 3 ของ see' },
  'seeing': { base: 'see', note: 'รูป -ing ของ see' },
  'knew': { base: 'know', note: 'รูปอดีตของ know' },
  'known': { base: 'know', note: 'กริยาช่อง 3 ของ know' },
  'knowing': { base: 'know', note: 'รูป -ing ของ know' },
  'gave': { base: 'give', note: 'รูปอดีตของ give' },
  'given': { base: 'give', note: 'กริยาช่อง 3 ของ give' },
  'giving': { base: 'give', note: 'รูป -ing ของ give' },
  'found': { base: 'find', note: 'รูปอดีตของ find' },
  'finding': { base: 'find', note: 'รูป -ing ของ find' },
  'told': { base: 'tell', note: 'รูปอดีตของ tell' },
  'telling': { base: 'tell', note: 'รูป -ing ของ tell' },
  'thought': { base: 'think', note: 'รูปอดีตของ think' },
  'thinking': { base: 'think', note: 'รูป -ing ของ think' },
  'came': { base: 'come', note: 'รูปอดีตของ come' },
  'coming': { base: 'come', note: 'รูป -ing ของ come' },
  'comes': { base: 'come', note: 'รูปปัจจุบันเอกพจน์ของ come' },
  'ran': { base: 'run', note: 'รูปอดีตของ run' },
  'running': { base: 'run', note: 'รูป -ing ของ run' },
  'runs': { base: 'run', note: 'รูปปัจจุบันเอกพจน์ของ run' },
  'drank': { base: 'drink', note: 'รูปอดีตของ drink' },
  'drunk': { base: 'drink', note: 'กริยาช่อง 3 ของ drink' },
  'drinking': { base: 'drink', note: 'รูป -ing ของ drink' },
  'ate': { base: 'eat', note: 'รูปอดีตของ eat' },
  'eaten': { base: 'eat', note: 'กริยาช่อง 3 ของ eat' },
  'eating': { base: 'eat', note: 'รูป -ing ของ eat' },
  'eats': { base: 'eat', note: 'รูปปัจจุบันเอกพจน์ของ eat' },
  'sat': { base: 'sit', note: 'รูปอดีตของ sit' },
  'sitting': { base: 'sit', note: 'รูป -ing ของ sit' },
  'woke': { base: 'wake', note: 'รูปอดีตของ wake' },
  'woken': { base: 'wake', note: 'กริยาช่อง 3 ของ wake' },
  'waking': { base: 'wake', note: 'รูป -ing ของ wake' },
  'broke': { base: 'break', note: 'รูปอดีตของ break' },
  'broken': { base: 'break', note: 'กริยาช่อง 3 ของ break' },
  'breaking': { base: 'break', note: 'รูป -ing ของ break' },
  'heard': { base: 'hear', note: 'รูปอดีตของ hear' },
  'hearing': { base: 'hear', note: 'รูป -ing ของ hear' },
  'drove': { base: 'drive', note: 'รูปอดีตของ drive' },
  'driven': { base: 'drive', note: 'กริยาช่อง 3 ของ drive' },
  'driving': { base: 'drive', note: 'รูป -ing ของ drive' },
  'spoke': { base: 'speak', note: 'รูปอดีตของ speak' },
  'spoken': { base: 'speak', note: 'กริยาช่อง 3 ของ speak' },
  'speaking': { base: 'speak', note: 'รูป -ing ของ speak' },
  'bought': { base: 'buy', note: 'รูปอดีตของ buy' },
  'buying': { base: 'buy', note: 'รูป -ing ของ buy' },
  'buys': { base: 'buy', note: 'รูปปัจจุบันเอกพจน์ของ buy' },
  'brought': { base: 'bring', note: 'รูปอดีตของ bring' },
  'bringing': { base: 'bring', note: 'รูป -ing ของ bring' },
  'caught': { base: 'catch', note: 'รูปอดีตของ catch' },
  'catching': { base: 'catch', note: 'รูป -ing ของ catch' },
  'slept': { base: 'sleep', note: 'รูปอดีตของ sleep' },
  'sleeping': { base: 'sleep', note: 'รูป -ing ของ sleep' },
  'sleeps': { base: 'sleep', note: 'รูปปัจจุบันเอกพจน์ของ sleep' },
  'paid': { base: 'pay', note: 'รูปอดีตของ pay' },
  'paying': { base: 'pay', note: 'รูป -ing ของ pay' },
  'sent': { base: 'send', note: 'รูปอดีตของ send' },
  'sending': { base: 'send', note: 'รูป -ing ของ send' },
  'swept': { base: 'sweep', note: 'รูปอดีตของ sweep' },
  'sweeping': { base: 'sweep', note: 'รูป -ing ของ sweep' },
  'met': { base: 'meet', note: 'รูปอดีตของ meet' },
  'meeting': { base: 'meet', note: 'รูป -ing ของ meet' },
  'left': { base: 'leave', note: 'รูปอดีตของ leave' },
  'leaving': { base: 'leave', note: 'รูป -ing ของ leave' },
  'put': { base: 'put', note: 'วาง, ใส่' },
  'putting': { base: 'put', note: 'รูป -ing ของ put' },
  'cuts': { base: 'cut', note: 'รูปปัจจุบันเอกพจน์ของ cut' },
  'cutting': { base: 'cut', note: 'รูป -ing ของ cut' },
  'set': { base: 'set', note: 'จัด, ตั้ง, กำหนด' },
  'setting': { base: 'set', note: 'รูป -ing ของ set' },
  'kept': { base: 'keep', note: 'รูปอดีตของ keep' },
  'keeping': { base: 'keep', note: 'รูป -ing ของ keep' },
  'shook': { base: 'shake', note: 'รูปอดีตของ shake' },
  'shaking': { base: 'shake', note: 'รูป -ing ของ shake' },
  'taught': { base: 'teach', note: 'รูปอดีตของ teach' },
  'teaching': { base: 'teach', note: 'รูป -ing ของ teach' },
  'wrote': { base: 'write', note: 'รูปอดีตของ write' },
  'written': { base: 'write', note: 'กริยาช่อง 3 ของ write' },
  'writing': { base: 'write', note: 'รูป -ing ของ write' },
  'wore': { base: 'wear', note: 'รูปอดีตของ wear' },
  'worn': { base: 'wear', note: 'กริยาช่อง 3 ของ wear' },
  'wearing': { base: 'wear', note: 'รูป -ing ของ wear' },
  'lost': { base: 'lose', note: 'รูปอดีตของ lose' },
  'losing': { base: 'lose', note: 'รูป -ing ของ lose' },
  'fell': { base: 'fall', note: 'รูปอดีตของ fall' },
  'fallen': { base: 'fall', note: 'กริยาช่อง 3 ของ fall' },
  'falling': { base: 'fall', note: 'รูป -ing ของ fall' },
  'shone': { base: 'shine', note: 'รูปอดีตของ shine' },
  'shining': { base: 'shine', note: 'รูป -ing ของ shine' },
  'hid': { base: 'hide', note: 'รูปอดีตของ hide' },
  'hidden': { base: 'hide', note: 'กริยาช่อง 3 ของ hide' },
  'hiding': { base: 'hide', note: 'รูป -ing ของ hide' },
  'stood': { base: 'stand', note: 'รูปอดีตของ stand' },
  'standing': { base: 'stand', note: 'รูป -ing ของ stand' },
  'understood': { base: 'understand', note: 'รูปอดีตของ understand' },
  'understanding': { base: 'understand', note: 'รูป -ing ของ understand' },
  'became': { base: 'become', note: 'รูปอดีตของ become' },
  'becoming': { base: 'become', note: 'รูป -ing ของ become' },
  'began': { base: 'begin', note: 'รูปอดีตของ begin' },
  'begun': { base: 'begin', note: 'กริยาช่อง 3 ของ begin' },
  'beginning': { base: 'begin', note: 'รูป -ing ของ begin' },
  'chose': { base: 'choose', note: 'รูปอดีตของ choose' },
  'chosen': { base: 'choose', note: 'กริยาช่อง 3 ของ choose' },
  'choosing': { base: 'choose', note: 'รูป -ing ของ choose' },
  'drew': { base: 'draw', note: 'รูปอดีตของ draw' },
  'drawn': { base: 'draw', note: 'กริยาช่อง 3 ของ draw' },
  'drawing': { base: 'draw', note: 'รูป -ing ของ draw' },
  'flew': { base: 'fly', note: 'รูปอดีตของ fly' },
  'flown': { base: 'fly', note: 'กริยาช่อง 3 ของ fly' },
  'flying': { base: 'fly', note: 'รูป -ing ของ fly' },
  'forgot': { base: 'forget', note: 'รูปอดีตของ forget' },
  'forgotten': { base: 'forget', note: 'กริยาช่อง 3 ของ forget' },
  'forgetting': { base: 'forget', note: 'รูป -ing ของ forget' },
  'grew': { base: 'grow', note: 'รูปอดีตของ grow' },
  'grown': { base: 'grow', note: 'กริยาช่อง 3 ของ grow' },
  'growing': { base: 'grow', note: 'รูป -ing ของ grow' },
  'hung': { base: 'hang', note: 'รูปอดีตของ hang' },
  'hanging': { base: 'hang', note: 'รูป -ing ของ hang' },
  'hurt': { base: 'hurt', note: 'รูปอดีตของ hurt' },
  'hurting': { base: 'hurt', note: 'รูป -ing ของ hurt' },
  'laid': { base: 'lay', note: 'รูปอดีตของ lay' },
  'laying': { base: 'lay', note: 'รูป -ing ของ lay' },
  'led': { base: 'lead', note: 'รูปอดีตของ lead' },
  'leading': { base: 'lead', note: 'รูป -ing ของ lead' },
  'lent': { base: 'lend', note: 'รูปอดีตของ lend' },
  'lending': { base: 'lend', note: 'รูป -ing ของ lend' },
  'let': { base: 'let', note: 'ปล่อยให้, อนุญาต' },
  'letting': { base: 'let', note: 'รูป -ing ของ let' },
  'lit': { base: 'light', note: 'รูปอดีตของ light' },
  'lighting': { base: 'light', note: 'รูป -ing ของ light' },
  'rode': { base: 'ride', note: 'รูปอดีตของ ride' },
  'ridden': { base: 'ride', note: 'กริยาช่อง 3 ของ ride' },
  'riding': { base: 'ride', note: 'รูป -ing ของ ride' },
  'rang': { base: 'ring', note: 'รูปอดีตของ ring' },
  'rung': { base: 'ring', note: 'กริยาช่อง 3 ของ ring' },
  'ringing': { base: 'ring', note: 'รูป -ing ของ ring' },
  'rose': { base: 'rise', note: 'รูปอดีตของ rise' },
  'risen': { base: 'rise', note: 'กริยาช่อง 3 ของ rise' },
  'rising': { base: 'rise', note: 'รูป -ing ของ rise' },
  'sold': { base: 'sell', note: 'รูปอดีตของ sell' },
  'selling': { base: 'sell', note: 'รูป -ing ของ sell' },
  'shot': { base: 'shoot', note: 'รูปอดีตของ shoot' },
  'shooting': { base: 'shoot', note: 'รูป -ing ของ shoot' },
  'shut': { base: 'shut', note: 'ปิด' },
  'shutting': { base: 'shut', note: 'รูป -ing ของ shut' },
  'sang': { base: 'sing', note: 'รูปอดีตของ sing' },
  'sung': { base: 'sing', note: 'กริยาช่อง 3 ของ sing' },
  'singing': { base: 'sing', note: 'รูป -ing ของ sing' },
  'sank': { base: 'sink', note: 'รูปอดีตของ sink' },
  'sunken': { base: 'sink', note: 'กริยาช่อง 3 ของ sink' },
  'sinking': { base: 'sink', note: 'รูป -ing ของ sink' },
  'spent': { base: 'spend', note: 'รูปอดีตของ spend' },
  'spending': { base: 'spend', note: 'รูป -ing ของ spend' },
  'swam': { base: 'swim', note: 'รูปอดีตของ swim' },
  'swum': { base: 'swim', note: 'กริยาช่อง 3 ของ swim' },
  'swimming': { base: 'swim', note: 'รูป -ing ของ swim' },
  'threw': { base: 'throw', note: 'รูปอดีตของ throw' },
  'thrown': { base: 'throw', note: 'กริยาช่อง 3 ของ throw' },
  'throwing': { base: 'throw', note: 'รูป -ing ของ throw' },
  'teeth': { base: 'tooth', note: 'พหูพจน์ของ tooth (ฟันหลายซี่)' },
  'feet': { base: 'foot', note: 'พหูพจน์ของ foot (เท้าสองข้าง)' },
  'men': { base: 'man', note: 'พหูพจน์ของ man (ผู้ชายหลายคน)' },
  'women': { base: 'woman', note: 'พหูพจน์ของ woman (ผู้หญิงหลายคน)' },
  'children': { base: 'child', note: 'พหูพจน์ของ child (เด็กๆ)' },
  'people': { base: 'person', note: 'พหูพจน์ของ person (ผู้คน)' },
  'mice': { base: 'mouse', note: 'พหูพจน์ของ mouse (หนูหลายตัว)' },
  'these': { base: 'this', note: 'พหูพจน์ของ this (สิ่งเหล่านี้, เหล่านี้)' },
  'those': { base: 'that', note: 'พหูพจน์ของ that (สิ่งเหล่านั้น, เหล่านั้น)' }
};

// Supplemental vocabulary (story terms, proper names, modern words, etc.)
const supplementalDict = {
  'chase': { word: 'chase', type: 'v. n.', level: 'A2', meaning: 'วิ่งไล่ตาม, ไล่กวด, การไล่ตาม', thai_pronunciation: 'เชส', ipa: 'tʃeɪs' },
  'relieved': { word: 'relieved', type: 'adj.', level: 'B1', meaning: 'รู้สึกโล่งใจ, คลายกังวล, ผ่อนคลาย', thai_pronunciation: 'ริ-ลีฟด์', ipa: 'rɪˈliːvd' },
  'airlock': { word: 'airlock', type: 'n.', level: 'B2', meaning: 'ประตูกักอากาศ, ห้องปรับความดันอากาศ', thai_pronunciation: 'แอร์-ล็อก', ipa: 'ˈeəlɒk' },
  'humanity': { word: 'humanity', type: 'n.', level: 'B2', meaning: 'มนุษยชาติ, ความเป็นมนุษย์, มนุษยธรรม', thai_pronunciation: 'ฮิว-แมน-นิ-ที', ipa: 'hjuːˈmænəti' },
  'dairy': { word: 'dairy', type: 'n. adj.', level: 'B1', meaning: 'ผลิตภัณฑ์ที่ทำจากนม (นม เนย ชีส), เกี่ยวกับฟาร์มโคนม', thai_pronunciation: 'แด-รี', ipa: 'ˈdeəri' },
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
  'vacuum': { word: 'vacuum', type: 'v. n.', level: 'A2', meaning: 'ดูดฝุ่น (ทำความสะอาด), เครื่องดูดฝุ่น', thai_pronunciation: 'แวค-คิวอัม', ipa: 'ˈvækjuːm' },
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
  'trash': { word: 'trash', type: 'n. v.', level: 'A2', meaning: 'ขยะ, สิ่งของไร้ค่า, ทิ้งขยะ', thai_pronunciation: 'แทรช', ipa: 'træʃ' },
  'super': { word: 'super', type: 'adv. adj.', level: 'A2', meaning: 'อย่างยิ่ง, สุดๆ, ยอดเยี่ยมมาก', thai_pronunciation: 'ซู-เปอร์', ipa: 'ˈsuːpər' },
  'sneak': { word: 'sneak', type: 'v.', level: 'B2', meaning: 'แอบย่อง, ลอบทำ, หลบๆ ซ่อนๆ', thai_pronunciation: 'สนีก', ipa: 'sniːk' },
  'balloon': { word: 'balloon', type: 'n.', level: 'A2', meaning: 'ลูกโป่ง, บอลลูน', thai_pronunciation: 'บัล-ลูน', ipa: 'bəˈluːn' },
  'balloons': { word: 'balloons', type: 'n.', level: 'A2', meaning: 'ลูกโป่งหลายลูก', thai_pronunciation: 'บัล-ลูนส์', ipa: 'bəˈluːnz' },
  'banner': { word: 'banner', type: 'n.', level: 'B1', meaning: 'ป้ายผ้า, ป้ายแบนเนอร์ข้อความ', thai_pronunciation: 'แบน-เนอร์', ipa: 'ˈbænər' },
  'ten-minute': { word: 'ten-minute', type: 'adj.', level: 'A2', meaning: 'ซึ่งใช้เวลา 10 นาที', thai_pronunciation: 'เท็น-มิน-นิท', ipa: 'ˈten ˈmɪnɪt' },
  'workout': { word: 'workout', type: 'n.', level: 'B1', meaning: 'การออกกำลังกาย, การฝึกซ้อมร่างกาย', thai_pronunciation: 'เวิร์ก-เอาท์', ipa: 'ˈwɜːrkaʊt' },
  'treadmill': { word: 'treadmill', type: 'n.', level: 'B1', meaning: 'ลู่วิ่งไฟฟ้า, เครื่องวิ่งสายพาน', thai_pronunciation: 'เทรด-มิล', ipa: 'ˈtredmɪl' },
  'weightlifting': { word: 'weightlifting', type: 'n.', level: 'B1', meaning: 'กีฬายกน้ำหนัก, การฝึกยกน้ำหนัก', thai_pronunciation: 'เวท-ลิฟ-ติง', ipa: 'ˈweɪtlɪftɪŋ' },
  'motivated': { word: 'motivated', type: 'adj.', level: 'B1', meaning: 'มีแรงกระตุ้น, มีพลังใจ, มีความตั้งใจสูง', thai_pronunciation: 'โม-ทิ-เว-ทิด', ipa: 'ˈmoʊtɪveɪtɪd' },
  'clunking': { word: 'clunking', type: 'adj. n.', level: 'B2', meaning: 'เสียงกระทบของโลหะดังกึกกัก/ตึงตัง', thai_pronunciation: 'คลังก์-คิง', ipa: 'ˈklʌŋkɪŋ' },
  'steer': { word: 'steer', type: 'v.', level: 'B1', meaning: 'ควบคุมทิศทาง, บังคับพวงมาลัย, นำทาง', thai_pronunciation: 'สเตียร์', ipa: 'stɪər' },
  'flasher': { word: 'flasher', type: 'n.', level: 'B1', meaning: 'ไฟฉุกเฉิน / ไฟสัญญาณกระพริบของรถยนต์', thai_pronunciation: 'แฟลช-เชอร์', ipa: 'ˈflæʃər' },
  'flashers': { word: 'flashers', type: 'n.', level: 'B1', meaning: 'ไฟฉุกเฉิน (กระพริบพร้อมกัน)', thai_pronunciation: 'แฟลช-เชอร์ส', ipa: 'ˈflæʃərz' },
  'tow': { word: 'tow', type: 'v. n.', level: 'B1', meaning: 'ลาก, จูง, การลากจูง (เช่น tow truck รถลาก)', thai_pronunciation: 'โท', ipa: 'toʊ' },
  'nearby': { word: 'nearby', type: 'adj. adv.', level: 'A2', meaning: 'ใกล้เคียง, ในบริเวณใกล้ๆ', thai_pronunciation: 'เนียร์-บาย', ipa: 'ˌnɪəˈbaɪ' },
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
  'scope': { word: 'scope', type: 'v. n.', level: 'B2', meaning: 'สำรวจ, สอดส่องมองหา, ขอบเขตงาน', thai_pronunciation: 'สโคป', ipa: 'skoʊp' },
  'scoped': { word: 'scoped', type: 'v.', level: 'B2', meaning: 'สำรวจดูแล้ว, กวาดสายตามองหาแล้ว', thai_pronunciation: 'สโคปต์', ipa: 'skoʊpt' },
  'tom': { word: 'Tom', type: 'proper noun', level: 'A1', meaning: 'ทอม (ชื่อผู้ชาย)', thai_pronunciation: 'ทอม', ipa: 'tɒm' },
  'sarah': { word: 'Sarah', type: 'proper noun', level: 'A1', meaning: 'ซาร่าห์ (ชื่อผู้หญิง)', thai_pronunciation: 'เซ-ร่า', ipa: 'ˈseərə' },
  'luna': { word: 'Luna', type: 'proper noun', level: 'A1', meaning: 'ลูน่า (ชื่อสัตว์เลี้ยง/แมว หรือพระจันทร์)', thai_pronunciation: 'ลู-น่า', ipa: 'ˈluːnə' },
  'reynolds': { word: 'Reynolds', type: 'proper noun', level: 'A1', meaning: 'เรย์โนลด์ส (ชื่อเฉพาะ/นามสกุลกัปตัน)', thai_pronunciation: 'เรย์-โนลด์ส', ipa: 'ˈrenəldz' },
  'mars': { word: 'Mars', type: 'proper noun', level: 'A2', meaning: 'ดาวอังคาร', thai_pronunciation: 'มาร์ส', ipa: 'mɑːz' },
  '8:30': { word: '8:30 AM', type: 'time', level: 'A1', meaning: 'เวลา แปดโมงครึ่ง (8 นาฬิกา 30 นาที ตอนเช้า)', thai_pronunciation: 'เอท เธอร-ตี เอ-เอ็ม', ipa: 'eɪt ˈθɜːti eɪ em' },
  '830': { word: '8:30 AM', type: 'time', level: 'A1', meaning: 'เวลา แปดโมงครึ่ง (8 นาฬิกา 30 นาที ตอนเช้า)', thai_pronunciation: 'เอท เธอร-ตี เอ-เอ็ม', ipa: 'eɪt ˈθɜːti eɪ em' },
  '10:00': { word: '10:00 AM', type: 'time', level: 'A1', meaning: 'เวลา สิบโมงตรง (10 นาฬิกาตรง ตอนเช้า)', thai_pronunciation: 'เท็น อะ-คล็อก เอ-เอ็ม', ipa: 'ten əˈklɒk eɪ em' },
  '1000': { word: '10:00 AM', type: 'time', level: 'A1', meaning: 'เวลา สิบโมงตรง (10 นาฬิกาตรง ตอนเช้า)', thai_pronunciation: 'เท็น อะ-คล็อก เอ-เอ็ม', ipa: 'ten əˈklɒk eɪ em' }
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
    .replace(/^[.,!?;:'"“”‘’()\[\]{}—–\s]+/, '')
    .replace(/[.,!?;:'"“”‘’()\[\]{}—–\s]+$/, '');
  
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
        thai_pronunciation: entry.thai_pronunciation,
        ipa: entry.ipa,
        level: entry.level,
        note: `รูปแสดงความเป็นเจ้าของ ('s) ของ ${entry.word}`,
        notFound: false
      };
    }
  }

  // 5. Irregular verbs & nouns lookup
  if (irregulars[lower]) {
    const ir = irregulars[lower];
    const baseEntry = vocabMap.get(ir.base) || supplementalDict[ir.base];
    if (baseEntry) {
      return {
        word: cleaned,
        baseWord: baseEntry.word,
        type: baseEntry.type,
        meaning: baseEntry.meaning,
        thai_pronunciation: baseEntry.thai_pronunciation,
        ipa: baseEntry.ipa,
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

  // Fallback for custom / unlisted words
  return {
    word: cleaned,
    notFound: true
  };
}
