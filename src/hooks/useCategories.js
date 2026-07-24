export const THEMES = [
  {
    id: 'theme_food',
    name: '🍔 Food & Drinks',
    keywords: ['กิน', 'ดื่ม', 'อาหาร', 'ผลไม้', 'ผัก', 'เนื้อ', 'หวาน', 'น้ำ', 'ข้าว', 'เค้ก', 'ขนม', 'นม', 'กาแฟ', 'อร่อย', 'หิว']
  },
  {
    id: 'theme_business',
    name: '💼 Business & Work',
    keywords: ['ธุรกิจ', 'งาน', 'บริษัท', 'เงิน', 'ซื้อ', 'ขาย', 'ออฟฟิศ', 'ผู้จัดการ', 'ลูกค้า', 'ราคา', 'ตลาด', 'ธนาคาร', 'ลงทุน', 'พนักงาน']
  },
  {
    id: 'theme_travel',
    name: '✈️ Travel & Places',
    keywords: ['เดินทาง', 'รถ', 'เรือ', 'เครื่องบิน', 'สถานที่', 'โรงแรม', 'ท่องเที่ยว', 'ถนน', 'สถานี', 'สนามบิน', 'แผนที่', 'เที่ยว', 'ทะเล', 'ภูเขา']
  },
  {
    id: 'theme_emotion',
    name: '❤️ Emotions',
    keywords: ['รู้สึก', 'ดีใจ', 'เสียใจ', 'โกรธ', 'รัก', 'เกลียด', 'อารมณ์', 'กลัว', 'เศร้า', 'ยิ้ม', 'ร้องไห้', 'หัวเราะ', 'สุข', 'เครียด']
  },
  {
    id: 'theme_body',
    name: '💪 Body & Health',
    keywords: ['ร่างกาย', 'หัว', 'ตา', 'หู', 'จมูก', 'ปาก', 'แขน', 'ขา', 'มือ', 'เท้า', 'หมอ', 'ป่วย', 'ยา', 'สุขภาพ', 'เจ็บ', 'โรงพยาบาล']
  },
  {
    id: 'theme_school',
    name: '📚 School & Education',
    keywords: ['เรียน', 'สอน', 'โรงเรียน', 'ครู', 'นักเรียน', 'หนังสือ', 'อ่าน', 'เขียน', 'วิชา', 'สอบ', 'ความรู้', 'มหาวิทยาลัย', 'กระดาษ', 'ปากกา']
  },
  {
    id: 'theme_nature',
    name: '🌳 Nature & Weather',
    keywords: ['ธรรมชาติ', 'ต้นไม้', 'ดอกไม้', 'สัตว์', 'แมว', 'หมา', 'นก', 'ปลา', 'พระอาทิตย์', 'พระจันทร์', 'ดาว', 'ฝน', 'ลม', 'ร้อน', 'หนาว', 'ป่า']
  }
];

export const filterWords = (words, filterValue) => {
  if (!filterValue || filterValue === 'all') {
    return words;
  }

  // If it's a theme filter
  if (filterValue.startsWith('theme_')) {
    const theme = THEMES.find(t => t.id === filterValue);
    if (!theme) return words;
    
    return words.filter(word => {
      // Check if the meaning contains any of the theme's keywords
      const meaning = word.meaning || '';
      return theme.keywords.some(keyword => meaning.includes(keyword));
    });
  }

  // Otherwise, assume it's a CEFR level (A1, A2, etc.)
  return words.filter(word => word.level === filterValue);
};
