import fs from 'fs';
import path from 'path';

// การใช้งาน:
// 1. รับ API Key ของ Gemini จาก Google AI Studio (https://aistudio.google.com/)
// 2. รันคำสั่ง: GEMINI_API_KEY="your_api_key_here" node scripts/validate_translations.js
// หรือตั้งค่าใน environment variable ไว้ก่อนรัน

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';
const BATCH_SIZE = 100; // ตรวจทีละ 100 คำ
const DELAY_MS = 3000; // หน่วงเวลา 3 วินาทีระหว่าง batch เพื่อป้องกัน Rate Limit

const VOCAB_PATH = path.resolve('./src/data/vocabulary.json');
const OUTPUT_PATH = path.resolve('./scripts/translation_issues.json');

async function validateBatch(batch) {
  const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านภาษาอังกฤษและภาษาไทย 
หน้าที่ของคุณคือตรวจสอบว่าคำแปลภาษาไทยของคำศัพท์ภาษาอังกฤษต่อไปนี้ ถูกต้อง เป็นธรรมชาติ และตรงกับความหมายหลัก (ในบริบทคำศัพท์ทั่วไป Oxford 3000) หรือไม่

ข้อมูลคำศัพท์:
${JSON.stringify(batch.map(b => ({ word: b.word, meaning: b.meaning, type: b.type })), null, 2)}

จงหาคำที่มีคำแปล "ผิดพลาดอย่างชัดเจน" หรือ "ไม่เป็นธรรมชาติอย่างมาก" 
และส่งผลลัพธ์กลับมาเป็น JSON Array ของ Object เท่านั้น (ห้ามมีข้อความอื่นนอกเหนือจาก JSON) ในรูปแบบ:
[
  {
    "word": "คำศัพท์",
    "current_meaning": "คำแปลปัจจุบัน",
    "suggested_meaning": "คำแปลที่ถูกต้องหรือเหมาะสมกว่า",
    "reason": "เหตุผลที่ควรแก้"
  }
]
ถ้าไม่มีคำไหนผิดเลย ให้ส่งกลับมาเป็น Array ว่าง []
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Error validating batch:', error.message);
    return []; // ข้ามไปถ้า error
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!API_KEY) {
    console.error('❌ ไม่พบ GEMINI_API_KEY กรุณาตั้งค่าก่อนรันสคริปต์');
    process.exit(1);
  }

  console.log('📖 อ่านไฟล์ข้อมูลคำศัพท์...');
  const vocabData = JSON.parse(fs.readFileSync(VOCAB_PATH, 'utf8'));
  const totalWords = vocabData.length;
  console.log(`พบคำศัพท์ทั้งหมด ${totalWords} คำ`);

  const issues = [];
  
  for (let i = 0; i < totalWords; i += BATCH_SIZE) {
    const batch = vocabData.slice(i, i + BATCH_SIZE);
    console.log(`\n🔍 กำลังตรวจสอบ Batch ที่ ${i / BATCH_SIZE + 1} (${i + 1} ถึง ${Math.min(i + BATCH_SIZE, totalWords)})...`);
    
    const batchIssues = await validateBatch(batch);
    if (batchIssues.length > 0) {
      console.log(`⚠️ พบคำที่อาจมีปัญหา ${batchIssues.length} คำ`);
      issues.push(...batchIssues);
    } else {
      console.log('✅ ไม่พบปัญหาใน Batch นี้');
    }

    // หน่วงเวลาก่อนส่ง request ถัดไปเพื่อกัน Rate limit (ยกเว้น batch สุดท้าย)
    if (i + BATCH_SIZE < totalWords) {
      console.log(`⏳ รอ ${DELAY_MS / 1000} วินาที...`);
      await delay(DELAY_MS);
    }
  }

  console.log('\n==================================');
  console.log(`🎉 ตรวจสอบเสร็จสิ้น! พบคำศัพท์ที่ควรแก้ไขทั้งหมด: ${issues.length} คำ`);
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(issues, null, 2), 'utf8');
  console.log(`💾 บันทึกผลลัพธ์ไว้ที่: ${OUTPUT_PATH}`);
  console.log('คุณสามารถเปิดไฟล์นี้เพื่อพิจารณาและแก้ไข vocabulary.json ต่อไปได้เลยครับ');
}

main().catch(console.error);
