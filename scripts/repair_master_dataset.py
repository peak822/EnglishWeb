# -*- coding: utf-8 -*-
"""
Authoritative Master Repair Script for English Study Web
Fixes:
1. All 53 corrupted '-a-e' words that had 'นา-อีฟว์'
2. All 49 corrupted '-i-e' words that had 'ไอ'
3. All words with 'มาย', 'ไอ-เดอะ', 'ดี-ไอ', 'ไอ-อี', 'ไอ-เว็ร์', 'เอ็อกส์', 'ไอ-อา', 'อิอน'
4. All 60 words with /aʊ/ diphthong 'า-อู'
5. All 357 words with Latin/IPA consonant cluster leaks (nd, ŋk, st, ɫd, etc.)
6. All 21 truncated / single letter words (cd, dvd, crack, drag, track, twelve, etc.)
7. All 7 suspicious/null IPAs
8. All Part of Speech and Thai meaning errors (pivotal, -al nouns, entertain, expertise, 38 adjectives)
9. Sentences.json 40 wordId synchronizations
"""

import json
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# High Precision Pronunciation & IPA Dictionary
EXACT_PRONUNCIATIONS = {
    # 1. '-a-e' Words previously corrupted as 'นา-อีฟว์'
    'date': ('เดท', 'deɪt'),
    'face': ('เฟส', 'feɪs'),
    'fake': ('เฟก', 'feɪk'),
    'fame': ('เฟม', 'feɪm'),
    'fate': ('เฟท', 'feɪt'),
    'flame': ('เฟลม', 'fleɪm'),
    'frame': ('เฟรม', 'freɪm'),
    'game': ('เกม', 'ɡeɪm'),
    'gate': ('เกท', 'ɡeɪt'),
    'gaze': ('เกซ', 'ɡeɪz'),
    'grace': ('เกรส', 'ɡreɪs'),
    'grave': ('เกรฟ', 'ɡreɪv'),
    'hate': ('เฮท', 'heɪt'),
    'lake': ('เลก', 'leɪk'),
    'lane': ('เลน', 'leɪn'),
    'late': ('เลท', 'leɪt'),
    'male': ('เมล', 'meɪl'),
    'mate': ('เมท', 'meɪt'),
    'naïve': ('นา-อีฟว์', 'naɪˈiːv'),
    'naive': ('นา-อีฟว์', 'naɪˈiːv'),
    'name': ('เนม', 'neɪm'),
    'page': ('เพจ', 'peɪdʒ'),
    'pale': ('เพล', 'peɪl'),
    'pane': ('เพน', 'peɪn'),
    'pave': ('เพฟ', 'peɪv'),
    'phase': ('เฟส', 'feɪz'),
    'place': ('เพลส', 'pleɪs'),
    'plane': ('เพลน', 'pleɪn'),
    'plate': ('เพลท', 'pleɪt'),
    'race': ('เรส', 'reɪs'),
    'rape': ('เรป', 'reɪp'),
    'rate': ('เรท', 'reɪt'),
    'safe': ('เซฟ', 'seɪf'),
    'sage': ('เซจ', 'seɪdʒ'),
    'sake': ('เซก', 'seɪk'),
    'sale': ('เซล', 'seɪl'),
    'same': ('เซม', 'seɪm'),
    'save': ('เซฟ', 'seɪv'),
    'scale': ('สเกล', 'skeɪl'),
    'shake': ('เชค', 'ʃeɪk'),
    'shame': ('เชม', 'ʃeɪm'),
    'shape': ('เชป', 'ʃeɪp'),
    'snake': ('สเนค', 'sneɪk'),
    'space': ('สเปซ', 'speɪs'),
    'stage': ('สเตจ', 'steɪdʒ'),
    'stake': ('สเตก', 'steɪk'),
    'state': ('สเตท', 'steɪt'),
    'tale': ('เทล', 'teɪl'),
    'tame': ('เทม', 'teɪm'),
    'tape': ('เทป', 'teɪp'),
    'wage': ('เวจ', 'weɪdʒ'),
    'wake': ('เวค', 'weɪk'),
    'wane': ('เวน', 'weɪn'),
    'wave': ('เวฟ', 'weɪv'),

    # 2. '-i-e' Words previously corrupted as 'ไอ'
    'dive': ('ไดฟว์', 'daɪv'),
    'drive': ('ไดรฟว์', 'draɪv'),
    'file': ('ไฟล์', 'faɪl'),
    'fine': ('ไฟน์', 'faɪn'),
    'five': ('ไฟฟว์', 'faɪv'),
    'giant': ('ไจ-แอนต์', 'ˈdʒaɪ.ənt'),
    'hi': ('ไฮ', 'haɪ'),
    'i': ('ไอ', 'aɪ'),
    'knife': ('ไนฟ์', 'naɪf'),
    'liable': ('ไล-เออะ-เบิล', 'ˈlaɪ.ə.bəl'),
    'life': ('ไลฟ์', 'laɪf'),
    'like': ('ไลค์', 'laɪk'),
    'lion': ('ไล-เอิน', 'ˈlaɪ.ən'),
    'live': ('ลิฟว์ / ไลฟว์', 'lɪv'),
    'mile': ('ไมล์', 'maɪl'),
    'mine': ('มายน์', 'maɪn'),
    'nice': ('ไนส์', 'naɪs'),
    'nine': ('ไนน์', 'naɪn'),
    'pile': ('ไพล์', 'paɪl'),
    'pious': ('ไพ-เอิส', 'ˈpaɪ.əs'),
    'pipe': ('ไพพ์', 'paɪp'),
    'price': ('ไพรส์', 'praɪs'),
    'prime': ('ไพรม์', 'praɪm'),
    'prior': ('ไพร-เออร์', 'ˈpraɪ.ər'),
    'prize': ('ไพรซ์', 'praɪz'),
    'quite': ('ไควต์', 'kwaɪt'),
    'rice': ('ไรส์', 'raɪs'),
    'riot': ('ไร-เอิต', 'ˈraɪ.ət'),
    'rise': ('ไรส์', 'raɪz'),
    'site': ('ไซต์', 'saɪt'),
    'size': ('ไซส์', 'saɪz'),
    'ski': ('สกี', 'skiː'),
    'smile': ('สไมล์', 'smaɪl'),
    'spine': ('สไพน์', 'spaɪn'),
    'spite': ('สไปต์', 'spaɪt'),
    'strike': ('สไตรค์', 'straɪk'),
    'strive': ('สไตรฟว์', 'straɪv'),
    'trial': ('ไทร-อัล', 'ˈtraɪ.əl'),
    'tribe': ('ไทรบ์', 'traɪb'),
    'trio': ('ทรี-โอ', 'ˈtriː.oʊ'),
    'triumphant': ('ไทร-อัม-เฟินต์', 'traɪˈʌm.fənt'),
    'vice': ('ไวส์', 'vaɪs'),
    'video': ('วิด-ดี-โอ', 'ˈvɪd.i.oʊ'),
    'vile': ('ไวลด์', 'vaɪl'),
    'white': ('ไวท์', 'waɪt'),
    'wife': ('ไวฟ์', 'waɪf'),
    'wine': ('ไวน์', 'waɪn'),
    'wipe': ('ไวพ์', 'waɪp'),
    'wise': ('ไวส์', 'waɪz'),

    # 3. Words previously corrupted as 'มาย'
    'bye': ('บาย', 'baɪ'),
    'dry': ('ดราย', 'draɪ'),
    'fly': ('ฟลาย', 'flaɪ'),
    'fry': ('ฟราย', 'fraɪ'),
    'my': ('มาย', 'maɪ'),
    'shy': ('ชาย', 'ʃaɪ'),
    'sky': ('สกาย', 'skaɪ'),
    'spy': ('สปาย', 'spaɪ'),

    # 4. Words previously corrupted as 'ไอ-เดอะ'
    'bride': ('ไบรด์', 'braɪd'),
    'hide': ('ไฮด์', 'haɪd'),
    'pride': ('ไพรด์', 'praɪd'),
    'ride': ('ไรด์', 'raɪd'),
    'side': ('ไซด์', 'saɪd'),
    'tide': ('ไทด์', 'taɪd'),
    'wide': ('ไวด์', 'waɪd'),

    # 5. Words previously corrupted as 'ดี-ไอ'
    'decline': ('ดิ-ไคลน์', 'dɪˈklaɪn'),
    'define': ('ดิ-ไฟน์', 'dɪˈfaɪn'),
    'denial': ('ดิ-ไน-เอิล', 'dɪˈnaɪ.əl'),
    'derive': ('ดิ-ไรฟว์', 'dɪˈraɪv'),
    'describe': ('ดิ-สไครบ์', 'dɪˈskraɪb'),
    'despite': ('ดิ-สไปต์', 'dɪˈspaɪt'),
    'device': ('ดิ-ไวส์', 'dɪˈvaɪs'),
    'devise': ('ดิ-ไวส์', 'dɪˈvaɪz'),

    # 6. Words previously corrupted as 'ไอ-อี'
    'diary': ('ได-เออะ-รี', 'ˈdaɪə.ri'),
    'pity': ('พิท-ที', 'ˈpɪt.i'),
    'shiny': ('ไชน-นี', 'ˈʃaɪ.ni'),
    'spicy': ('สไป-ซี', 'ˈspaɪ.si'),
    'tidy': ('ไท-ดี', 'ˈtaɪ.di'),
    'tiny': ('ไท-นี', 'ˈtaɪ.ni'),

    # 7. Words previously corrupted as 'ไอ-เว็ร์'
    'diverge': ('ได-เวิร์จ', 'daɪˈvɜːdʒ'),
    'diverse': ('ได-เวิร์ส', 'daɪˈvɜːs'),
    'driver': ('ไดรฟ-เวอร์', 'ˈdraɪ.vər'),
    'liver': ('ลิฟ-เวอร์', 'ˈlɪv.ər'),
    'quiver': ('ควิฟ-เวอร์', 'ˈkwɪv.ər'),
    'river': ('ริฟ-เวอร์', 'ˈrɪv.ər'),

    # 8. Words previously corrupted as 'เอ็อกส์'
    'exchange': ('เอ็กซ-เชนจ์', 'ɪksˈtʃeɪndʒ'),
    'explain': ('เอ็กซ-เพลน', 'ɪkˈspleɪn'),
    'express': ('เอ็กซ-เพรส', 'ɪkˈspres'),
    'extra': ('เอ็กซ-ตร้า', 'ˈek.strə'),
    'extract': ('เอ็กซ-แทร็กต์', 'ˈek.strækt'),
    'extreme': ('เอ็กซ-ตรีม', 'ɪkˈstriːm'),

    # 9. Words previously corrupted as 'ไอ-อา'
    'image': ('อิม-มิจ', 'ˈɪm.ɪdʒ'),
    'irate': ('ไอ-เรท', 'aɪˈreɪt'),
    'pirate': ('ไพ-เรท', 'ˈpaɪ.rət'),
    'primate': ('ไพร-เมท', 'ˈpraɪ.meɪt'),
    'private': ('ไพร-เวท', 'ˈpraɪ.vət'),
    'visa': ('วี-ซ่า', 'ˈviː.zə'),

    # 10. Words previously corrupted as 'อิอน'
    'inch': ('อินช์', 'ɪntʃ'),
    'increase': ('อิน-ครีส', 'ɪnˈkriːs'),
    'inflict': ('อิน-ฟลิกต์', 'ɪnˈflɪkt'),
    'influence': ('อิน-ฟลู-เอินส์', 'ˈɪn.flu.əns'),
    'influx': ('อิน-ฟลักส์', 'ˈɪn.flʌks'),
    'infringe': ('อิน-ฟรินจ์', 'ɪnˈfrɪndʒ'),

    # 11. /aʊ/ Diphthong Words ('า-อู' fixes)
    'bow': ('โบว์ / บาว', 'baʊ'),
    'breakdown': ('เบรค-ดาวน์', 'ˈbreɪk.daʊn'),
    'council': ('เคาน-ซิล', 'ˈkaʊn.səl'),
    'councillor': ('เคาน-ซิล-เลอร์', 'ˈkaʊn.səl.ər'),
    'counsel': ('เคาน-เซิล', 'ˈkaʊn.səl'),
    'counselling': ('เคาน-เซล-ลิง', 'ˈkaʊn.səl.ɪŋ'),
    'counsellor': ('เคาน-เซิล-เลอร์', 'ˈkaʊn.səl.ər'),
    'count': ('เคานต์', 'kaʊnt'),
    'counter': ('เคาน-เตอร์', 'ˈkaʊn.tər'),
    'counterpart': ('เคาน-เตอร์-พาร์ต', 'ˈkaʊn.tə.pɑːt'),
    'countless': ('เคานต์-เลส', 'ˈkaʊnt.ləs'),
    'county': ('เคาน-ตี', 'ˈkaʊn.ti'),
    'crackdown': ('แครก-ดาวน์', 'ˈkræk.daʊn'),
    'drought': ('เดราต์', 'draʊt'),
    'flour': ('ฟลาว-เออร์', 'ˈflaʊ.ər'),
    'found': ('เฟานด์', 'faʊnd'),
    'foundation': ('เฟาน-เด-ชัน', 'faʊnˈdeɪ.ʃən'),
    'founder': ('เฟาน-เดอร์', 'ˈfaʊn.dər'),
    'greenhouse': ('กรีน-เฮาส์', 'ˈɡriːn.haʊs'),
    'ground': ('เกรานด์', 'ɡraʊnd'),
    'groundbreaking': ('เกรานด์-เบรค-คิง', 'ˈɡraʊndˌbreɪ.kɪŋ'),
    'hour': ('เอา-เออร์', 'ˈaʊ.ər'),
    'house': ('เฮาส์', 'haʊs'),
    'household': ('เฮาส์-โฮลด์', 'ˈhaʊs.hoʊld'),
    'housing': ('เฮาส์-ซิง', 'ˈhaʊ.zɪŋ'),
    'how': ('ฮาว', 'haʊ'),
    'however': ('ฮาว-เอฟ-เวอร์', 'haʊˈev.ər'),
    'layout': ('เลย์-เอาต์', 'ˈleɪ.aʊt'),
    'loud': ('เลาด์', 'laʊd'),
    'loudly': ('เลาด์-ลี', 'ˈlaʊd.li'),
    'mount': ('เมานต์', 'maʊnt'),
    'mountain': ('เมาน์-เทิน', 'ˈmaʊn.tɪn'),
    'mouse': ('เมาส์', 'maʊs'),
    'mouth': ('เมาธ์', 'maʊθ'),
    'now': ('นาว', 'naʊ'),
    'nowadays': ('นาว-อะ-เดส์', 'ˈnaʊ.ə.deɪz'),
    'paramount': ('แพ-ระ-เมานต์', 'ˈpær.ə.maʊnt'),
    'pound': ('พาวนด์', 'paʊnd'),
    'powder': ('พาว-เดอร์', 'ˈpaʊ.dər'),
    'power': ('พาว-เวอร์', 'ˈpaʊ.ər'),
    'powerful': ('พาว-เวอร์-ฟูล', 'ˈpaʊ.ə.fəl'),
    'powerhouse': ('พาว-เวอร์-เฮาส์', 'ˈpaʊə.haʊs'),
    'profound': ('โพร-เฟานด์', 'prəˈfaʊnd'),
    'profoundly': ('โพร-เฟานด์-ลี', 'prəˈfaʊnd.li'),
    'pronounce': ('พระ-เนานส์', 'prəˈnaʊns'),
    'pronounced': ('พระ-เนานสต์', 'prəˈnaʊnst'),
    'proud': ('พราวด์', 'praʊd'),
    'prowess': ('พราว-เอส', 'ˈpraʊ.es'),
    'round': ('ราวด์', 'raʊnd'),
    'shout': ('เชาต์', 'ʃaʊt'),
    'somehow': ('ซัม-ฮาว', 'ˈsʌm.haʊ'),
    'sound': ('ซาวนด์', 'saʊnd'),
    'south': ('เซาธ์', 'saʊθ'),
    'stout': ('สเตาต์', 'staʊt'),
    'thousand': ('เธา-เซินด์', 'ˈθaʊ.zənd'),
    'throughout': ('ธรู-เอาต์', 'θruːˈaʊt'),
    'towel': ('ทาว-เวล', 'ˈtaʊ.əl'),
    'tower': ('ทาว-เวอร์', 'ˈtaʊ.ər'),
    'town': ('ทาวน์', 'taʊn'),
    'trousers': ('เทรา-เซิร์ส', 'ˈtraʊ.zəz'),
    'warehouse': ('แวร์-เฮาส์', 'ˈweə.haʊs'),
    'out': ('เอาต์', 'aʊt'),
    'outcry': ('เอาต์-คราย', 'ˈaʊt.kraɪ'),
    'outgrowth': ('เอาต์-โกรว์ธ', 'ˈaʊt.ɡroʊθ'),
    'outshine': ('เอาต์-ไชน์', 'ˌaʊtˈʃaɪn'),

    # 12. Suffix -ful words (standardized to ฟูล)
    'graceful': ('เกรส-ฟูล', 'ˈɡreɪs.fəl'),
    'grateful': ('เกรต-ฟูล', 'ˈɡreɪt.fəl'),
    'harmful': ('ฮาร์ม-ฟูล', 'ˈhɑːm.fəl'),
    'helpful': ('เฮลป์-ฟูล', 'ˈhelp.fəl'),
    'hopeful': ('โฮป-ฟูล', 'ˈhoʊp.fəl'),
    'meaningful': ('มีน-นิง-ฟูล', 'ˈmiː.nɪŋ.fəl'),
    'merciful': ('เมอร์-ซิ-ฟูล', 'ˈmɜː.sɪ.fəl'),
    'painful': ('เพน-ฟูล', 'ˈpeɪn.fəl'),
    'plentiful': ('เพลน-ทิ-ฟูล', 'ˈplen.tɪ.fəl'),
    'tasteful': ('เทสต์-ฟูล', 'ˈteɪst.fəl'),
    'thoughtful': ('ธอต-ฟูล', 'ˈθɔːt.fəl'),
    'wasteful': ('เวสต์-ฟูล', 'ˈweɪst.fəl'),
    'watchful': ('วอทช์-ฟูล', 'ˈwɒtʃ.fəl'),
    'colourful': ('คัล-เลอร์-ฟูล', 'ˈkʌl.ə.fəl'),

    # 13. Truncated / Single-letter / Short words
    'cd': ('ซี-ดี', 'ˌsiːˈdiː'),
    'dvd': ('ดี-วี-ดี', 'ˌdiː.viːˈdiː'),
    'crack': ('แคร็ก', 'kræk'),
    'drag': ('ดแร็ก', 'dræɡ'),
    'track': ('แทร็ก', 'træk'),
    'phrase': ('เฟรซ', 'freɪz'),
    'rhythmic': ('ริธ-มิก', 'ˈrɪð.mɪk'),
    'slap': ('สแล็ป', 'slæp'),
    'slash': ('สแลช', 'slæʃ'),
    'slave': ('สเลฟ', 'sleɪv'),
    'slice': ('สไลซ์', 'slaɪs'),
    'slightly': ('สไลต์-ลี', 'ˈslaɪt.li'),
    'slip': ('สลิป', 'slɪp'),
    'slot': ('สล็อต', 'slɒt'),
    'squad': ('สควอด', 'skwɒd'),
    'squeeze': ('สควีซ', 'skwiːz'),
    'thwart': ('ธวอร์ต', 'θwɔːt'),
    'twelve': ('ทเวลฟ์', 'twelv'),
    'twice': ('ทไวซ์', 'twaɪs'),
    'twin': ('ทวิน', 'twɪn'),
    'twist': ('ทวิสต์', 'twɪst'),

    # 14. Missing / Plain text IPAs
    'clock': ('คล็อก', 'klɒk'),
    'best': ('เบสต์', 'bɛst'),
    'red': ('เรด', 'rɛd'),
    'step': ('สเต็ป', 'stɛp'),
    'vet': ('เว็ท', 'vɛt'),
    'web': ('เว็บ', 'wɛb'),
    'wet': ('เว็ท', 'wɛt'),

    # 15. Compound word truncations fixed
    'shortcut': ('ชอร์ต-คัต', 'ˈʃɔːt.kʌt'),
    'shortfall': ('ชอร์ต-ฟอล', 'ˈʃɔːt.fɔːl'),
    'shortly': ('ชอร์ต-ลี', 'ˈʃɔːt.li'),
    'stark': ('สตาร์ก', 'stɑːk'),
    'start': ('สตาร์ต', 'stɑːt'),
    'starve': ('สตาร์ฟ', 'stɑːv'),
    'earn': ('เอิร์น', 'ɜːn'),
    'earth': ('เอิร์ธ', 'ɜːθ'),
    'earthquake': ('เอิร์ธ-เควก', 'ˈɜːθ.kweɪk'),
    'friend': ('เฟรนด์', 'frend'),
    'trend': ('เทรนด์', 'trend'),
    'highly': ('ไฮ-ลี', 'ˈhaɪ.li'),
    'highway': ('ไฮ-เวย์', 'ˈhaɪ.weɪ'),
    'offhand': ('ออฟ-แฮนด์', 'ˌɒfˈhænd'),
    'offset': ('ออฟ-เซต', 'ˈɒf.set'),
    'upshot': ('อัพ-ช็อต', 'ˈʌp.ʃɒt'),
    'upstairs': ('อัพ-สแตส์', 'ˌʌpˈsteəz'),
    'upstream': ('อัพ-สตรีม', 'ˌʌpˈstriːm'),
    'workforce': ('เวิร์ก-ฟอร์ส', 'ˈwɜːk.fɔːs'),
    'workplace': ('เวิร์ก-เพลส', 'ˈwɜːk.pleɪs'),
    'workshop': ('เวิร์ก-ช็อป', 'ˈwɜːk.ʃɒp'),

    # 16. Common core words with high precision Thai
    'background': ('แบ็ก-เกรานด์', 'ˈbæk.ɡraʊnd'),
    'backwards': ('แบ็ก-เวิร์ดส์', 'ˈbæk.wədz'),
    'balance': ('แบ-ลันส์', 'ˈbæl.əns'),
    'balanced': ('แบ-ลันสต์', 'ˈbæl.ənst'),
    'bank': ('แบงก์', 'bæŋk'),
    'band': ('แบนด์', 'bænd'),
    'based': ('เบสด์', 'beɪst'),
    'basement': ('เบส-เมินท์', 'ˈbeɪs.mənt'),
    'battlefield': ('แบท-เทิล-ฟีลด์', 'ˈbæt.əl.fiːld'),
    'beloved': ('บิ-ลัฟวด์', 'bɪˈlʌv.ɪd'),
    'belt': ('เบลต์', 'belt'),
    'bench': ('เบนช์', 'bentʃ'),
    'benchmark': ('เบนช์-มาร์ก', 'ˈbentʃ.mɑːk'),
    'bend': ('เบนด์', 'bend'),
    'bent': ('เบนต์', 'bent'),
    'blank': ('แบลงก์', 'blæŋk'),
    'blast': ('แบลสต์', 'blɑːst'),
    'blend': ('เบลนด์', 'blend'),
    'boast': ('โบสต์', 'boʊst'),
    'bold': ('โบลด์', 'boʊld'),
    'bomb': ('บอมบ์', 'bɒm'),
    'brand': ('แบรนด์', 'brænd'),
    'breast': ('เบรสต์', 'brest'),
    'broadband': ('บรอด-แบนด์', 'ˈbrɔːd.bænd'),
    'burst': ('เบิร์สต์', 'bɜːst'),
    'camp': ('แคมป์', 'kæmp'),
    'cent': ('เซนต์', 'sent'),
    'challenge': ('แชล-เลนจ์', 'ˈtʃæl.ɪndʒ'),
    'change': ('เชนจ์', 'tʃeɪndʒ'),
    'chest': ('เชสต์', 'tʃest'),
    'circumstance': ('เซอร์-คัม-สแตนส์', 'ˈsɜː.kəm.stɑːns'),
    'closed': ('โคลสด์', 'kloʊzd'),
    'clothes': ('โคลธส์', 'kləʊðz'),
    'coast': ('โคสต์', 'koʊst'),
    'coherent': ('โค-ฮี-เรินต์', 'koʊˈhɪə.rənt'),
    'coincidence': ('โค-อิน-ซิ-เดนส์', 'koʊˈɪn.sɪ.dəns'),
    'cold': ('โคลด์', 'koʊld'),
    'collapse': ('เคอะ-แล็ปส์', 'kəˈlæps'),
    'collect': ('เคอะ-เล็กต์', 'kəˈlekt'),
    'colour': ('คัล-เลอร์', 'ˈkʌl.ər'),
    'coloured': ('คัล-เลอร์ด', 'ˈkʌl.əd'),
    'command': ('เคอะ-มานด์', 'kəˈmɑːnd'),
    'ecological': ('เอค-เคอะ-ลอจ-จิ-เคิล', 'ˌiː.kəˈlɒdʒ.ɪ.kəl'),
    'themselves': ('เดม-เซลฟ์ส', 'ðəmˈselvz'),
    'towards': ('เทอะ-วอร์ดส์', 'təˈwɔːdz'),
    'customary': ('คัส-เทอะ-เมอ-รี', 'ˈkʌs.tə.mər.i'),
    'delicacy': ('เดล-ลิ-คะ-ซี', 'ˈdel.ɪ.kə.si'),
    'democracy': ('เดอ-ม็อก-ระ-ซี', 'dɪˈmɒk.rə.si'),
    'dictionary': ('ดิก-ชัน-เนอ-รี', 'ˈdɪk.ʃən.ər.i'),
    'disciplinary': ('ดิส-ซิ-พลิน-เนอ-รี', 'ˈdɪs.ə.plɪn.ər.i'),
    'efficacy': ('เอฟ-ฟิ-คะ-ซี', 'ˈef.ɪ.kə.si'),
    'elementary': ('เอล-เลอ-เมน-ทรี', 'ˌel.ɪˈmen.tər.i'),
    'evolutionary': ('เอฟ-เวอะ-ลู-ชัน-เนอ-รี', 'ˌev.əˈluː.ʃən.ər.i'),
    'imaginary': ('อิ-แมจ-จิ-เนอ-รี', 'ɪˈmædʒ.ɪ.nər.i'),
    'impatient': ('อิม-เพ-เชินต์', 'ɪmˈpeɪ.ʃənt'),
    'involuntary': ('อิน-วอล-เลิน-เทอ-รี', 'ɪnˈvɒl.ən.tər.i'),
    'itinerary': ('ไอ-ทิน-เนอ-ระ-รี', 'aɪˈtɪn.ər.ər.i'),
}

# Rule-based cluster replacement for Latin/IPA in Thai pronunciations
CLUSTER_MAP = {
    'nd': 'นด์',
    'ŋk': 'งก์',
    'ŋks': 'งก์ส',
    'kst': 'กซต์',
    'kt': 'กต์',
    'ld': 'ลด์',
    'ɫd': 'ลด์',
    'lf': 'ลฟ์',
    'lvz': 'ลฟ์ส',
    'lt': 'ลต์',
    'ɫt': 'ลต์',
    'ɫp': 'ลป์',
    'ɫm': 'ลม์',
    'mpt': 'มป์ต์',
    'mps': 'มปส์',
    'mp': 'มป์',
    'mz': 'มส์',
    'ndʒ': 'นจ์',
    'nʤ': 'นจ์',
    'ntʃ': 'นช์',
    'nʧ': 'นช์',
    'nst': 'นสต์',
    'nts': 'นต์ส',
    'ntn': 'น-เทิน',
    'nt': 'นต์',
    'ns': 'นส์',
    'nz': 'นส์',
    'nθ': 'นธ์',
    'ps': 'ปส์',
    'pt': 'ปต์',
    'rdz': 'ร์ดส์',
    'rd': 'ร์ด',
    'rk': 'ร์ก',
    'rnd': 'ร์นด์',
    'rm': 'ร์ม',
    'rn': 'ร์น',
    'rt': 'ร์ต',
    'sk': 'สก์',
    'sp': 'สป์',
    'st': 'สต์',
    'vd': 'ฟวด์',
    'zd': 'สด์',
    'ðz': 'ธส์',
    'ŋθ': 'งธ์',
    'θs': 'ธส์',
    'ks': 'กส์',
    'dz': 'ดส์',
    'ft': 'ฟต์',
    'ls': 'ลส์',
    'd': 'ด์',
    'k': 'ก',
    'l': 'ล',
    'm': 'ม',
    't': 'ต์',
    'v': 'ฟว์',
}

# Manual POS & Meaning fixes
MANUAL_POS_AND_MEANING_OVERRIDES = {
    'pivotal': {'type': 'adj.', 'meaning': 'ซึ่งมีความสำคัญอย่างยิ่ง / ที่เป็นแกนหลักสำคัญ'},
    'appraisal': {'type': 'n.', 'meaning': 'การประเมินค่า / การประเมินผล'},
    'denial': {'type': 'n.', 'meaning': 'การปฏิเสธ / การไม่ยอมรับความจริง'},
    'dismissal': {'type': 'n.', 'meaning': 'การเลิกจ้าง / การปลดออก / การยกฟ้อง'},
    'disposal': {'type': 'n.', 'meaning': 'การกำจัด / การจัดการ / การทิ้ง'},
    'portrayal': {'type': 'n.', 'meaning': 'การพรรณนา / การวาดภาพ / การแสดงบทบาท'},
    'rebuttal': {'type': 'n.', 'meaning': 'การโต้แย้ง / การหักล้าง'},
    'refusal': {'type': 'n.', 'meaning': 'การปฏิเสธ / การบอกปัด'},
    'rehearsal': {'type': 'n.', 'meaning': 'การฝึกซ้อม / การซ้อมใหญ่'},
    'removal': {'type': 'n.', 'meaning': 'การกำจัด / การโยกย้าย / การถอดออก'},
    'retrieval': {'type': 'n.', 'meaning': 'การดึงข้อมูลกลับมา / การกู้คืนข้อมูล'},
    'reversal': {'type': 'n.', 'meaning': 'การกลับตาลปัตร / การพลิกผัน / การยกเลิก'},
    'revival': {'type': 'n.', 'meaning': 'การฟื้นฟู / การคืนชีพ'},
    'survival': {'type': 'n.', 'meaning': 'การอยู่รอด / ความอยู่รอด'},
    'withdrawal': {'type': 'n.', 'meaning': 'การถอนตัว / การถอนเงิน / การถอนทัพ'},
    'entertain': {'type': 'v.', 'meaning': 'ให้ความบันเทิง / สร้างความเพลิดเพลิน'},
    'expertise': {'type': 'n.', 'meaning': 'ความเชี่ยวชาญ / ทักษะความชำนาญเฉพาะทาง'},
    'competitive': {'type': 'adj.', 'meaning': 'เกี่ยวกับการแข่งขัน / มุ่งมั่นที่จะชนะ / ที่แข่งขันได้'},
    'defensive': {'type': 'adj.', 'meaning': 'เกี่ยวกับการป้องกัน / ซึ่งตั้งรับ / ที่ระแวดระวัง'},
    'diplomatic': {'type': 'adj.', 'meaning': 'เกี่ยวกับการทูต / มีชั้นเชิงทางการทูต'},
    'electoral': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเลือกตั้ง'},
    'financial': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเงิน / ทางการเงิน'},
    'fiscal': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเงินการคลัง / ทางงบประมาณ'},
    'judicial': {'type': 'adj.', 'meaning': 'เกี่ยวกับศาลหรือการพิจารณาคดี / ทางตุลาการ'},
    'martial': {'type': 'adj.', 'meaning': 'เกี่ยวกับการต่อสู้ / ทางการทหาร'},
    'matching': {'type': 'adj.', 'meaning': 'ที่เข้าคู่กัน / ที่เข้าชุดกัน'},
    'metabolic': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเผาผลาญพลังงานในร่างกาย'},
    'occupational': {'type': 'adj.', 'meaning': 'เกี่ยวกับอาชีพการงาน'},
    'operational': {'type': 'adj.', 'meaning': 'เกี่ยวกับการปฏิบัติการ / พร้อมใช้งาน'},
    'pandemic': {'type': 'adj., n.', 'meaning': 'เกี่ยวกับการระบาดใหญ่ทั่วโลก, โรคระบาดครั้งใหญ่'},
    'pedagogical': {'type': 'adj.', 'meaning': 'เกี่ยวกับวิชาการสอน / ด้านครุศาสตร์'},
    'penal': {'type': 'adj.', 'meaning': 'เกี่ยวกับการลงโทษทางกฎหมาย / ทางอาญา'},
    'punitive': {'type': 'adj.', 'meaning': 'เพื่อเป็นการลงโทษ / เกี่ยวกับการลงโทษ'},
    'remedial': {'type': 'adj.', 'meaning': 'เพื่อการรักษาเยียวยา / เพื่อสอนเสริมปรับพื้นฐาน'},
    'reproductive': {'type': 'adj.', 'meaning': 'เกี่ยวกับการสืบพันธุ์ / ทางการขยายพันธุ์'},
    'speculative': {'type': 'adj.', 'meaning': 'เกี่ยวกับการเก็งกำไร / ซึ่งเป็นการคาดเดา'},
    'surgical': {'type': 'adj.', 'meaning': 'เกี่ยวกับการผ่าตัด / ทางศัลยกรรม'},
    'theatrical': {'type': 'adj.', 'meaning': 'เกี่ยวกับโรงละครหรือการแสดงละคร / เวอร์เกินจริง'},
    'therapeutic': {'type': 'adj.', 'meaning': 'เกี่ยวกับการบำบัดรักษา / ให้ความรู้สึกผ่อนคลาย'},
    'working': {'type': 'adj.', 'meaning': 'เกี่ยวกับการทำงาน / ซึ่งใช้งานได้ / ซึ่งประกอบอาชีพ'},
    'comic': {'type': 'adj., n.', 'meaning': 'ตลกขบขัน, หนังสือการ์ตูน'},
}

def main():
    print("=== STARTING MASTER DATASET REPAIR ===")
    
    # 1. Load vocabulary.json
    with open('src/data/vocabulary.json', 'r', encoding='utf-8') as f:
        vocab = json.load(f)

    fixed_pronunciation = 0
    fixed_ipa = 0
    fixed_meaning = 0

    for item in vocab:
        w = item.get('word', '').strip()
        low = w.lower()

        # Step 1A: Exact manual overrides
        if low in EXACT_PRONUNCIATIONS:
            th, ip = EXACT_PRONUNCIATIONS[low]
            item['thai_pronunciation'] = th
            item['ipa'] = ip
            fixed_pronunciation += 1
            fixed_ipa += 1
        else:
            # Step 1B: Cluster replacements for remaining Latin/IPA in Thai
            thai = item.get('thai_pronunciation', '')
            if re.search(r'[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌɐ]', thai):
                for k in sorted(CLUSTER_MAP.keys(), key=lambda x: -len(x)):
                    thai = thai.replace(k, CLUSTER_MAP[k])
                # Remove stress marks or orphan characters
                thai = re.sub(r'[ˈˌːɐ]', '', thai)
                item['thai_pronunciation'] = thai
                fixed_pronunciation += 1

        # Step 1C: POS & Meaning Overrides
        if low in MANUAL_POS_AND_MEANING_OVERRIDES:
            ovr = MANUAL_POS_AND_MEANING_OVERRIDES[low]
            if 'type' in ovr:
                item['type'] = ovr['type']
            if 'meaning' in ovr:
                item['meaning'] = ovr['meaning']
            fixed_meaning += 1

    print(f"Repaired: {fixed_pronunciation} pronunciations, {fixed_ipa} IPAs, {fixed_meaning} meanings/POS tags.")

    # Save repaired vocabulary.json
    with open('src/data/vocabulary.json', 'w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)
    print("Saved src/data/vocabulary.json successfully.")

    # 2. Synchronize sentences.json
    with open('src/data/sentences.json', 'r', encoding='utf-8') as f:
        sentences = json.load(f)

    word_to_id = {v['word'].lower().strip(): v['id'] for v in vocab}
    # Map US variants to UK counterparts in vocabulary
    word_to_id['color'] = word_to_id.get('colour', 840)
    word_to_id['favorite'] = word_to_id.get('favourite', 1932)
    word_to_id['center'] = word_to_id.get('centre', 696)
    word_to_id['theater'] = word_to_id.get('theatre', 5765)
    word_to_id['meter'] = word_to_id.get('metre', 3244)
    word_to_id['neighbor'] = word_to_id.get('neighbour', 3426)
    word_to_id['gray'] = word_to_id.get('grey', 2253)

    synced_sentences = 0
    for s in sentences:
        sw = s['word'].lower().strip()
        if sw in word_to_id:
            s['wordId'] = word_to_id[sw]
            synced_sentences += 1
        else:
            print(f"Warning: Sentence word '{s['word']}' could not be matched!")

    with open('src/data/sentences.json', 'w', encoding='utf-8') as f:
        json.dump(sentences, f, ensure_ascii=False, indent=2)
    print(f"Synchronized {synced_sentences}/{len(sentences)} sentence entries in src/data/sentences.json.")

    print("\n=== MASTER REPAIR COMPLETED SUCCESSFULLY ===")

if __name__ == '__main__':
    main()
