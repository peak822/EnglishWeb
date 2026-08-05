const { generateThaiPronunciation, validatePronunciation } = require('./generate_thai_pronunciations.cjs');

const testCases = [
  { word: 'abandon', expected: 'อะ-แบน-เดิน' },
  { word: 'ability', expected: 'อะ-บิล-ลิ-ที' },
  { word: 'able', expected: 'เอ-เบิล' },
  { word: 'abolish', expected: 'อะ-บอล-ลิช' },
  { word: 'abortion', expected: 'อะ-บอร์-ชัน' },
  { word: 'absence', expected: 'แอ็บ-เซินส์' },
  { word: 'absent', expected: 'แอ็บ-เซินท์' },
  { word: 'absolute', expected: 'แอ็บ-โซ-ลูท' },
  { word: 'academic', expected: 'แอค-เคอะ-เดม-มิก' },
  { word: 'comfortable', expected: 'คัมฟ์-เทอะ-เบิล' },
  { word: 'recipe', expected: 'เรส-เซอะ-พี' },
  { word: 'subtle', expected: 'ซัท-เทิล' },
  { word: 'Wednesday', expected: 'เวนส์-เดย์' },
  { word: 'about', expected: 'อะ-เบาท์' },
  { word: 'above', expected: 'อะ-บัฟว์' },
  { word: 'development', expected: 'ดิ-เวล-เลิพ-เมินท์' },
  { word: 'experience', expected: 'อิค-สเปีย-เรียนส์' },
  { word: 'government', expected: 'กัฟ-เวิร์น-เมินท์' },
  { word: 'important', expected: 'อิม-พอร์-เทินท์' },
  { word: 'question', expected: 'เควส-ชัน' }
];

let failed = 0;
console.log('--- Running Thai Phonetic Transcription Unit Tests ---');
testCases.forEach(({ word, expected }) => {
  const result = generateThaiPronunciation(word);
  const validation = validatePronunciation(result);
  if (result !== expected || !validation.valid) {
    console.error(`❌ FAIL: "${word}" -> got "${result}", expected "${expected}" | validation: ${JSON.stringify(validation)}`);
    failed++;
  } else {
    console.log(`✅ PASS: "${word}" -> "${result}"`);
  }
});

if (failed > 0) {
  console.error(`\nTest suite finished with ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log('\n🎉 All phonetic test cases passed successfully!');
}
