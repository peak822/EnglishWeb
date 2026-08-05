# Design Spec: Daily Life Stories Expansion (A1–B2)

## 1. Goal & Context
Expand the application's reading materials by adding **12 high-quality, practical everyday life articles/stories** across four CEFR levels (3 stories each for A1, A2, B1, and B2).
These stories focus on practical situations that learners encounter in daily life, enhancing vocabulary retention and real-world English communication skills.

---

## 2. Story Schema & Guidelines
All story entries follow the existing JSON structure in `src/data/stories.json`:
- `id`: String identifier formatted as `story-{level_lowercase}-{number}`
- `title`: English title (concise, clear, title-cased)
- `titleThai`: Accurate and natural Thai translation of the title
- `genre`: `"Daily Life"`
- `level`: `"A1"` | `"A2"` | `"B1"` | `"B2"`
- `readTime`: `"1 min"` / `"2 mins"` for A1/A2, `"3 mins"` / `"4 mins"` for B1/B2
- `content`: English text strictly calibrated to CEFR vocabulary levels, using natural conversational flow and varied punctuation.
- `contentThai`: Fluent, natural, sentence-by-sentence Thai translation.

---

## 3. Detailed Specifications of the 12 New Stories

### 🟢 Level A1 (Beginner)
1. **`story-a1-6` - Ordering at a Cafe**
   - **Title Thai:** สั่งอาหารที่คาเฟ่
   - **Read Time:** 1 min
   - **English Content:**
     > I walk into a cozy cafe on Sunday morning. The waiter smiles and hands me a menu. I order a chicken sandwich and an iced lemon tea. I ask to eat here. The waiter brings my food in five minutes. The sandwich is warm and tasty. I pay with cash and thank the waiter.
   - **Thai Content:**
     > ฉันเดินเข้าไปในคาเฟ่ที่แสนอบอุ่นในเช้าวันอาทิตย์ พนักงานเสิร์ฟยิ้มและยื่นเมนูให้ฉัน ฉันสั่งแซนด์วิชไก่และชามะนาวเย็นหนึ่งแก้ว ฉันบอกว่าทานที่นี่ พนักงานนำอาหารมาเสิร์ฟภายในห้านาที แซนด์วิชอุ่นและอร่อยมาก ฉันจ่ายเงินสดและกล่าวขอบคุณพนักงานเสิร์ฟ

2. **`story-a1-7` - Asking for Directions**
   - **Title Thai:** การถามทาง
   - **Read Time:** 1 min
   - **English Content:**
     > I am lost in the city center. I need to find the train station. I see a police officer near a shop. I say, "Excuse me, where is the train station?" The officer smiles and says, "Walk straight for two blocks, then turn left. It is next to the big bank." I thank him and follow his directions. Soon, I see the station.
   - **Thai Content:**
     > ฉันหลงทางอยู่ในใจกลางเมือง ฉันต้องไปที่สถานีรถไฟ ฉันเห็นตำรวจคนหนึ่งอยู่ใกล้ร้านค้า ฉันจึงพูดว่า "ขอโทษนะคะ สถานีรถไฟไปทางไหนคะ" ตำรวจยิ้มแล้วตอบว่า "เดินตรงไปสองบล็อก แล้วเลี้ยวซ้าย มันอยู่ติดกับธนาคารใหญ่ครับ" ฉันขอบคุณเขาและเดินตามเส้นทางที่บอก ไม่นาน ฉันก็มองเห็นสถานีรถไฟ

3. **`story-a1-8` - At the Pharmacy**
   - **Title Thai:** ที่ร้านขายยา
   - **Read Time:** 1 min
   - **English Content:**
     > I feel sick today. I have a bad headache and a cough. I walk to the local pharmacy to get medicine. The pharmacist asks, "How can I help you?" I tell him my symptoms. He gives me some pills and syrup. He tells me to take two pills after breakfast and dinner. He also says to drink plenty of warm water. I feel happy to get help.
   - **Thai Content:**
     > วันนี้ฉันรู้สึกไม่สบาย ฉันปวดศีรษะมากและมีอาการไอ ฉันเดินไปที่ร้านขายยาแถวบ้านเพื่อซื้อยา เภสัชกรถามว่า "มีอะไรให้ช่วยไหมครับ" ฉันบอกอาการของตัวเองไป เขาให้ยาเม็ดและยาน้ำเชื่อมมา เขาบอกให้ฉันทานยาวันละสองเม็ดหลังอาหารเช้าและเย็น อีกทั้งยังแนะนำให้ดื่มน้ำอุ่นมากๆ ฉันรู้สึกดีใจที่ได้รับความช่วยเหลือ

---

### 🟡 Level A2 (Elementary)
4. **`story-a2-6` - Checking In at a Hotel**
   - **Title Thai:** เช็คอินที่โรงแรม
   - **Read Time:** 2 mins
   - **English Content:**
     > After a long bus ride, we finally arrived at our hotel in the evening. I walked up to the front desk with our reservation confirmation. The receptionist welcomed us warmly and asked for my ID card. She checked the system and confirmed our two-night stay in a double room. She gave us two electronic key cards and explained that breakfast was served on the second floor from 7:00 AM to 10:00 AM. She also gave us the Wi-Fi password. We took the elevator up to the fourth floor, unpacked our bags, and relaxed on the comfortable bed.
   - **Thai Content:**
     > หลังจากนั่งรถบัสมาเป็นเวลานาน ในที่สุดพวกเราก็มาถึงโรงแรมในตอนเย็น ฉันเดินไปที่เคาน์เตอร์ต้อนรับพร้อมใบยืนยันการจอง พนักงานต้อนรับกล่าวต้อนรับอย่างอบอุ่นและขอดูบัตรประชาชนของฉัน เธอตรวจสอบในระบบและยืนยันการเข้าพักสองคืนในห้องเตียงคู่ เธอให้คีย์การ์ดสองใบและอธิบายว่าอาหารเช้าเสิร์ฟที่ชั้นสองตั้งแต่เวลา 7:00 น. ถึง 10:00 น. เธอยังให้รหัสผ่าน Wi-Fi แก่เราด้วย พวกเราขึ้นลิฟต์ไปยังชั้นสี่ แกะกระเป๋าเดินทาง และพักผ่อนบนเตียงที่แสนสบาย

5. **`story-a2-7` - Returning a Store Item**
   - **Title Thai:** คืนสินค้าที่ร้านค้า
   - **Read Time:** 2 mins
   - **English Content:**
     > Last weekend, I bought a blue jacket at a clothing store in the mall. When I tried it on at home, I realized it was too tight around the shoulders. Today after work, I went back to the store with the jacket and the receipt. I explained the issue politely to the shop assistant. She checked the tag and the receipt to make sure everything was in good condition. Then, she helped me find the same jacket in a larger size. It fit me much better! The exchange was fast and easy, and I left the store very satisfied.
   - **Thai Content:**
     > เมื่อสุดสัปดาห์ที่แล้ว ฉันซื้อเสื้อแจ็กเก็ตสีน้ำเงินจากร้านขายเสื้อผ้าในห้างสรรพสินค้า เมื่อลองใส่ที่บ้าน ฉันพบว่ามันแน่นเกินไปบริเวณหัวไหล่ วันนี้หลังเลิกงาน ฉันจึงกลับไปที่ร้านพร้อมเสื้อแจ็กเก็ตและใบเสร็จ ฉันอธิบายปัญหาให้พนักงานขายฟังอย่างสุภาพ เธอตรวจดูป้ายสินค้าและใบเสร็จเพื่อให้แน่ใจว่าสินค้าอยู่ในสภาพสมบูรณ์ จากนั้น เธอช่วยฉันหาแจ็กเก็ตตัวเดิมในขนาดที่ใหญ่ขึ้น มันพอดีตัวฉันมากกว่าเดิมมาก! การเปลี่ยนสินค้าเป็นไปอย่างรวดเร็วและง่ายดาย และฉันออกจากร้านด้วยความพึงพอใจอย่างยิ่ง

6. **`story-a2-8` - Booking a Doctor's Appointment**
   - **Title Thai:** นัดหมายแพทย์
   - **Read Time:** 2 mins
   - **English Content:**
     > Yesterday morning, I called the medical clinic to schedule an annual health check-up. The receptionist answered politely and asked for my full name and date of birth. She asked which doctor I wanted to see and what time suited me best. I requested an appointment on Friday afternoon after 3:00 PM. She checked the schedule and booked me with Dr. Evans for 3:30 PM. She reminded me to bring my insurance card and avoid eating heavy food before the appointment. I noted the date in my calendar immediately.
   - **Thai Content:**
     > เมื่อเช้าวานนี้ ฉันโทรศัพท์ไปที่คลินิกการแพทย์เพื่อนัดหมายการตรวจสุขภาพประจำปี พนักงานต้อนรับรับสายอย่างสุภาพและสอบถามชื่อ-นามสกุลรวมถึงวันเดือนปีเกิดของฉัน เธอถามว่าฉันต้องการพบแพทย์ท่านใดและเวลาไหนที่สะดวกที่สุด ฉันขอนัดหมายในบ่ายวันศุกร์หลังเวลา 15:00 น. เธอตรวจสอบตารางเวลาและนัดหมายให้ฉันพบคุณหมออีแวนส์ในเวลา 15:30 น. เธอเตือนให้ฉันนำบัตรประกันสุขภาพไปด้วยและหลีกเลี่ยงการรับประทานอาหารมื้อหนักก่อนการตรวจ ฉันจดบันทึกวันนัดลงในปฏิทินทันที

---

### 🟠 Level B1 (Intermediate)
7. **`story-b1-6` - Dealing with Customer Service**
   - **Title Thai:** การติดต่อฝ่ายบริการลูกค้า
   - **Read Time:** 3 mins
   - **English Content:**
     > A few days ago, I ordered an electric coffee maker online, but when the package arrived, the glass pot was cracked. I was quite frustrated, so I contacted customer support through their live chat. The representative, Marcus, was very understanding and apologized for the inconvenience. He asked me to upload a quick photo of the damaged package along with my order number. Within ten minutes, he verified the issue and offered two options: a full refund or a free replacement sent by express delivery. I chose the replacement, and the new coffee maker arrived in perfect condition two days later. The prompt support turned a bad experience into a positive one.
   - **Thai Content:**
     > สองสามวันก่อน ฉันสั่งซื้อเครื่องชงกาแฟไฟฟ้าทางออนไลน์ แต่เมื่อพัสดุมาถึง ปรากฏว่าโถแก้วมีรอยแตกร้าว ฉันรู้สึกหงุดหงิดพอสมควร จึงติดต่อฝ่ายบริการลูกค้าผ่านระบบแชทสด ตัวแทนฝ่ายบริการชื่อมาร์คัสเข้าใจปัญหาเป็นอย่างดีและกล่าวขออภัยในความไม่สะดวก เขาขอให้ฉันอัปโหลดรูปถ่ายพัสดุที่เสียหายพร้อมกับหมายเลขคำสั่งซื้อ ภายในสิบนาที เขาตรวจสอบปัญหาเรียบร้อยและเสนอทางเลือกสองทาง ได้แก่ การคืนเงินเต็มจำนวน หรือการส่งสินค้าทดแทนชิ้นใหม่ด้วยบริการส่งด่วน ฉันเลือกรับสินค้าทดแทน และเครื่องชงกาแฟเครื่องใหม่ก็มาถึงในสภาพสมบูรณ์แบบในอีกสองวันถัดมา การดูแลที่รวดเร็วช่วยเปลี่ยนประสบการณ์ที่แย่ให้กลายเป็นความประทับใจ

8. **`story-b1-7` - A Job Interview Experience**
   - **Title Thai:** ประสบการณ์การสัมภาษณ์งาน
   - **Read Time:** 3 mins
   - **English Content:**
     > Last Thursday, I had a job interview for a junior web developer position at an IT company. Even though I prepared thoroughly, my heart was racing as I sat in the conference room. The interviewers introduced themselves and began by asking about my background and recent portfolio projects. I highlighted my problem-solving skills and gave concrete examples of how I worked in team settings. When they asked how I handle tight deadlines, I explained my method for prioritizing critical features first. Toward the end, they invited me to ask questions about company culture and development workflows. Walking out of the building, I felt confident that I had presented my best self.
   - **Thai Content:**
     > เมื่อวันพฤหัสบดีที่ผ่านมา ฉันได้เข้ารับการสัมภาษณ์งานในตำแหน่งนักพัฒนาเว็บระดับจูเนียร์ที่บริษัทไอทีแห่งหนึ่ง แม้ว่าจะเตรียมตัวมาอย่างถี่ถ้วน แต่หัวใจของฉันยังคงเต้นแรงขณะนั่งอยู่ในห้องประชุม ผู้สัมภาษณ์แนะนำตัวและเริ่มสอบถามเกี่ยวกับประวัติและผลงานโปรเจกต์ล่าสุดของฉัน ฉันเน้นย้ำถึงทักษะการแก้ปัญหาและยกตัวอย่างที่เป็นรูปธรรมว่าฉันทำงานร่วมกับทีมอย่างไร เมื่อพวกเขาถามว่าฉันรับมือกับกำหนดส่งงานที่กระชั้นชิดอย่างไร ฉันได้อธิบายวิธีจัดลำดับความสำคัญของฟีเจอร์หลักก่อน ในช่วงท้าย พวกเขาเปิดโอกาสให้ฉันถามเกี่ยวกับวัฒนธรรมองค์กรและขั้นตอนการทำงาน เมื่อเดินออกจากอาคาร ฉันรู้สึกมั่นใจว่าได้แสดงศักยภาพที่ดีที่สุดของตัวเองออกไปแล้ว

9. **`story-b1-8` - Finding and Renting an Apartment**
   - **Title Thai:** การหาและเช่าอพาร์ตเมนต์
   - **Read Time:** 3 mins
   - **English Content:**
     > Finding a suitable apartment in the city was one of the most challenging things I did this year. I spent weeks browsing rental websites, filtering for places near public transit and within my monthly budget. Finally, I found a bright studio apartment near a subway station and scheduled a viewing. When I inspected the place, I checked the water pressure, inspected the windows, and asked the landlord about utility costs and maintenance policies. Everything met my expectations, so I filled out the rental application that evening. After passing the background check, I signed a one-year lease and paid the security deposit. Having my own quiet space makes the daily commute much easier.
   - **Thai Content:**
     > การหาอพาร์ตเมนต์ที่เหมาะสมในเมืองเป็นหนึ่งในสิ่งที่ท้าทายที่สุดที่ฉันทำในปีนี้ ฉันใช้เวลาหลายสัปดาห์ค้นหาบนเว็บไซต์ให้เช่าที่พัก โดยกรองเฉพาะสถานที่ใกล้ระบบขนส่งสาธารณะและอยู่ในงบประมาณรายเดือน ในที่สุด ฉันก็พบห้องสตูดิโอที่สว่างสดใสใกล้สถานีรถไฟฟ้าใต้ดินและนัดหมายเข้าชม เมื่อไปตรวจดูห้อง ฉันได้ทดสอบแรงดันน้ำ ตรวจดูหน้าต่าง และสอบถามเจ้าของห้องเกี่ยวกับค่าสาธารณูปโภคและนโยบายการซ่อมบำรุง ทุกอย่างตรงตามที่คาดหวัง ฉันจึงกรอกใบสมัครขอเช่าในเย็นวันนั้น หลังผ่านการตรวจสอบประวัติ ฉันได้เซ็นสัญญาเช่าหนึ่งปีและชำระเงินมัดจำ การมีพื้นที่ส่วนตัวที่เงียบสงบช่วยให้การเดินทางไปทำงานในแต่ละวันสะดวกสบายขึ้นมาก

---

### 🔴 Level B2 (Upper-Intermediate)
10. **`story-b2-5` - Negotiating a Project Deadline**
    - **Title Thai:** การเจรจาต่อรองกำหนดส่งงาน
    - **Read Time:** 4 mins
    - **English Content:**
      > Halfway through our quarterly software release, our engineering team ran into unexpected compatibility hurdles with the legacy database. Realizing that rushing the deployment could introduce critical bugs for our end users, I scheduled a strategic meeting with our product manager and stakeholders. Instead of simply requesting more time, I prepared a detailed assessment outlining the technical bottlenecks alongside three realistic recovery scenarios. I proposed reprioritizing non-essential UI features to the following sprint while extending the core integration testing by one week. The stakeholders appreciated the transparent risk evaluation and approved the revised timeline. Taking the initiative to address potential pitfalls constructively turned what could have been a crisis into a showcase of dependable leadership.
    - **Thai Content:**
      > ในช่วงกึ่งกลางของการส่งมอบซอฟต์แวร์ประจำไตรมาส ทีมวิศวกรของเราพบกับอุปสรรคด้านความเข้ากันไม่ได้ของระบบฐานข้อมูลรุ่นเก่า เมื่อตระหนักว่าการเร่งเปิดตัวอาจทำให้เกิดข้อผิดพลาดร้ายแรงต่อผู้ใช้งาน ฉันจึงนัดประชุมเชิงกลยุทธ์กับผู้จัดการผลิตภัณฑ์และผู้มีส่วนได้ส่วนเสีย แทนที่จะเพียงแค่ขอเวลาเพิ่ม ฉันได้เตรียมการประเมินโดยละเอียดที่ระบุจุดคอขวดทางเทคนิคควบคู่ไปกับ 3 ทางเลือกในการแก้ไขที่เป็นไปได้จริง ฉันเสนอให้เลื่อนฟีเจอร์ตกแต่งส่วนหน้าที่ไม่จำเป็นไปยังรอบการพัฒนาถัดไป และขยายเวลาการทดสอบระบบหลักออกไปหนึ่งสัปดาห์ ผู้มีส่วนได้ส่วนเสียชื่นชมการประเมินความเสี่ยงที่โปร่งใสและอนุมัติตารางเวลาที่ปรับปรุงใหม่ การริเริ่มรับมือกับปัญหาที่อาจเกิดขึ้นอย่างสร้างสรรค์ได้เปลี่ยนสิ่งที่อาจกลายเป็นวิกฤตให้กลายเป็นการแสดงความเป็นผู้นำที่พึ่งพาได้

11. **`story-b2-6` - Resolving a Roommate Dispute**
    - **Title Thai:** การปรับความเข้าใจและการอยู่ร่วมกัน
    - **Read Time:** 4 mins
    - **English Content:**
      > Living harmoniously with a roommate requires continuous empathy and clear boundaries. After several weeks of growing frustration over unwashed dishes and late-night noise, I felt that passive resistance would only poison the atmosphere. I invited my roommate, Alex, for dinner at our dining table to address the matter calmly. I used 'I' statements to convey how sleep disruption was affecting my productivity without sounding accusatory. Alex acknowledged that an intense freelance workload had caused him to neglect shared duties. Together, we drafted a shared chore chart and established quiet hours starting from 11:00 PM on weekdays. By addressing friction directly yet diplomatically, we restored mutual respect and transformed our shared apartment into a stress-free sanctuary.
    - **Thai Content:**
      > การอยู่ร่วมกับรูมเมตอย่างราบรื่นจำเป็นต้องอาศัยความเข้าอกเข้าใจและการกำหนดขอบเขตที่ชัดเจนอย่างต่อเนื่อง หลังจากที่ความอึดอัดใจเริ่มสะสมมาหลายสัปดาห์เกี่ยวกับจานชามที่ไม่ได้ล้างและเสียงดังยามดึก ฉันรู้สึกว่าการนิ่งเฉยมีแต่จะทำให้บรรยากาศแย่ลง ฉันจึงชวนอเล็กซ์ รูมเมตของฉัน มารับประทานอาหารเย็นที่โต๊ะอาหารเพื่อพูดคุยกันอย่างใจเย็น ฉันใช้ประโยคที่เน้นความรู้สึกของตัวเองเพื่อสื่อสารว่าการนอนหลับไม่สนิทส่งผลต่อประสิทธิภาพการทำงานของฉันอย่างไรโดยไม่ใช้น้ำเสียงกล่าวโทษ อเล็กซ์ยอมรับว่างานฟรีแลนซ์ที่รัดตัวทำให้เขาละเลยหน้าที่ส่วนรวม พวกเราจึงร่วมกันร่างตารางเวรทำความสะอาดและกำหนดช่วงเวลาห้ามส่งเสียงดังตั้งแต่ 23:00 น. ในวันธรรมดา การเผชิญหน้ากับความขัดแย้งอย่างตรงไปตรงมาและประนีประนอมช่วยฟื้นฟูความเคารพซึ่งกันและกัน และเปลี่ยนอพาร์ตเมนต์ของเราให้กลับมาเป็นพื้นที่พักผ่อนที่ไร้ความเครียดอีกครั้ง

12. **`story-b2-7` - Handling Flight Delays & Airline Compensation**
    - **Title Thai:** การรับมือเที่ยวบินล่าช้าและการเรียกร้องค่าชดเชย
    - **Read Time:** 4 mins
    - **English Content:**
      > While traveling internationally for a business conference, severe weather conditions triggered widespread airport chaos, culminating in the cancellation of my connecting flight. Rather than joining the massive, overwhelmed queue at the service desk, I promptly opened the airline's mobile app to secure a seat on the earliest available departure the following morning. Simultaneously, I approached an agent to request meal vouchers and hotel accommodations as mandated by passenger rights regulations. I retained all receipts for out-of-pocket transportation and food expenses. Upon returning home, I filed a formal compensation claim through the carrier's online portal, attaching digital copies of boarding passes and expense invoices. Within three weeks, the claim was approved and fully reimbursed, proving that staying composed and knowing your rights is crucial when travel plans go awry.
    - **Thai Content:**
      > ระหว่างการเดินทางไปร่วมการประชุมทางธุรกิจในต่างประเทศ สภาพอากาศที่แปรปรวนรุนแรงทำให้เกิดความโกลาหลทั่วสนามบิน จนนำไปสู่การยกเลิกเที่ยวบินต่อเครื่องของฉัน แทนที่จะไปต่อแถวยาวเหยียดที่เคาน์เตอร์บริการ ฉันรีบเปิดแอปพลิเคชันของสายการบินเพื่อจองที่นั่งในเที่ยวบินแรกสุดของเช้าวันถัดไปทันที ในขณะเดียวกัน ฉันได้เดินไปสอบถามเจ้าหน้าที่เพื่อขอรับคูปองอาหารและที่พักโรงแรมตามสิทธิคุ้มครองผู้โดยสาร ฉันเก็บใบเสร็จค่าเดินทางและค่าอาหารที่สำรองจ่ายไว้ทั้งหมด เมื่อเดินทางกลับถึงบ้าน ฉันได้ยื่นเรื่องเรียกร้องค่าชดเชยอย่างเป็นทางการผ่านพอร์ทัลออนไลน์ของสายการบิน พร้อมแนบสำเนาบอร์ดดิ้งพาสและใบเสร็จค่าใช้จ่าย ภายในสามสัปดาห์ คำร้องได้รับการอนุมัติและจ่ายเงินชดเชยเต็มจำนวน ซึ่งพิสูจน์ว่าการมีสติและการรู้สิทธิของตนเองมีความสำคัญยิ่งเมื่อแผนการเดินทางเกิดความผิดพลาด

---

## 4. Verification Plan
1. **JSON Syntax Validation:** Run `node` parser to ensure `src/data/stories.json` has 100% valid JSON syntax with no missing commas or broken keys.
2. **Schema & Field Integrity:** Validate that all 12 new items contain valid `id`, `title`, `titleThai`, `genre: "Daily Life"`, `level`, `readTime`, `content`, and `contentThai`.
3. **Application Build Test:** Run `npm run build` to ensure the entire application bundles cleanly.
