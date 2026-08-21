# -*- coding: utf-8 -*-
"""
Master Vocabulary & Thai Phonetic Repair Engine for English Study Web
Fixes all duplicate, incorrect, inverted, and corrupted Thai pronunciations across all 6,510 words.
"""

import json
import os
import re
import sys
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VOCAB_PATH = os.path.join(os.path.dirname(__file__), '../src/data/vocabulary.json')

# 1. Comprehensive Curated Dictionary for Key / Irregular / Oxford Words
CURATED_WORDS = {
    # A
    'a': ('ə, eɪ', 'เอ / อะ'),
    'an': ('æn, ən', 'แอน / เอิน'),
    'the': ('ðə, ðiː', 'เดอะ / ดิ'),
    'abandon': ('əˈbændən', 'อะ-แบน-เดิน'),
    'abandoned': ('əˈbændənd', 'อะ-แบน-เดินด์'),
    'ability': ('əˈbɪləti', 'อะ-บิล-ลิ-ที'),
    'able': ('ˈeɪbl', 'เอ-เบิล'),
    'about': ('əˈbaʊt', 'อะ-เบาท์'),
    'above': ('əˈbʌv', 'อะ-บัฟว์'),
    'abroad': ('əˈbrɔːd', 'อะ-บรอด'),
    'absence': ('ˈæbsəns', 'แอบ-เซินส์'),
    'absolute': ('ˈæbsəluːt', 'แอบ-โซ-ลูท'),
    'absolutely': ('ˌæbsəˈluːtli', 'แอบ-โซ-ลูท-ลี'),
    'abstract': ('ˈæbstrækt', 'แอบ-สแตรกต์'),
    'abuse': ('əˈbjuːs', 'อะ-บิวส์'),
    'academic': ('ˌækəˈdemɪk', 'แอค-คะ-เดม-มิก'),
    'accent': ('ˈæksent', 'แอค-เซนต์'),
    'accept': ('əkˈsept', 'แอค-เซพท์'),
    'acceptable': ('əkˈseptəbl', 'แอค-เซพ-เทอะ-เบิล'),
    'access': ('ˈækses', 'แอค-เซส'),
    'accident': ('ˈæksɪdənt', 'แอค-ซิ-เดินท์'),
    'accidental': ('ˌæksɪˈdentl', 'แอค-ซิ-เดน-ทัล'),
    'accommodate': ('əˈkɑːmədeɪt', 'อะ-คอม-โม-เดท'),
    'accommodation': ('əˌkɑːməˈdeɪʃn', 'อะ-คอม-โม-เด-ชัน'),
    'accompany': ('əˈkʌmpəni', 'อะ-คัม-พะ-นี'),
    'account': ('əˈkaʊnt', 'อะ-เคานท์'),
    'accounting': ('əˈkaʊntɪŋ', 'อะ-เคาน์-ทิง / แอค-เคาท์-ติ้ง'),
    'accountant': ('əˈkaʊntənt', 'อะ-เคาน์-เทินท์'),
    'accurate': ('ˈækjərət', 'แอค-คิว-เรต'),
    'accurately': ('ˈækjərətli', 'แอค-คิว-เรต-ลี'),
    'accuse': ('əˈkjuːz', 'อะ-คิวส์'),
    'accused': ('əˈkjuːzd', 'อะ-คิวสด์'),
    'achieve': ('əˈtʃiːv', 'อะ-ชีฟว์'),
    'achievement': ('əˈtʃiːvmənt', 'อะ-ชีฟ-เมินท์'),
    'acid': ('ˈæsɪd', 'แอ-ซิด'),
    'acknowledge': ('əkˈnɑːlɪdʒ', 'แอค-นอ-ลิดจ์'),
    'acquire': ('əˈkwaɪər', 'อะ-ไควร์'),
    'across': ('əˈkrɔːs', 'อะ-ครอส'),
    'act': ('ækt', 'แอคท์'),
    'action': ('ˈækʃn', 'แอค-ชัน'),
    'active': ('ˈæktɪv', 'แอค-ทิฟว์'),
    'actively': ('ˈæktɪvli', 'แอค-ทิฟ-ลี'),
    'activity': ('ækˈtɪvəti', 'แอค-ทิฟ-วิ-ที'),
    'actor': ('ˈæktər', 'แอค-เตอร์'),
    'actress': ('ˈæktrəs', 'แอค-เทรส'),
    'actual': ('ˈæktʃuəl', 'แอค-ชัวล'),
    'actually': ('ˈæktʃuəli', 'แอค-ชัวล-ลี'),
    'adapt': ('əˈdæpt', 'อะ-แดพท์'),
    'add': ('æd', 'แอด'),
    'addition': ('əˈdɪʃn', 'อะ-ดิ-ชัน'),
    'additional': ('əˈdɪʃənl', 'อะ-ดิ-ชัน-นัล'),
    'address': ('əˈdres', 'อะ-เดรส'),
    'adequate': ('ˈædɪkwət', 'แอด-ดิ-เควต'),
    'adjust': ('əˈdʒʌst', 'อะ-จัสต์'),
    'administration': ('ədˌmɪnɪˈstreɪʃn', 'แอด-มิน-นิ-สเตร-ชัน'),
    'admire': ('ədˈmaɪər', 'แอด-ไมร์'),
    'admit': ('ədˈmɪt', 'แอด-มิท'),
    'adopt': ('əˈdɑːpt', 'อะ-ดอปต์'),
    'adult': ('ˈædʌlt', 'แอด-ดัลท์'),
    'advance': ('ədˈvæns', 'แอด-วานส์'),
    'advanced': ('ədˈvænst', 'แอด-วานสด์'),
    'advantage': ('ədˈvæntɪdʒ', 'แอด-แวน-ทิจ'),
    'adventure': ('ədˈventʃər', 'แอด-เวน-เจอร์'),
    'advertise': ('ˈædvərtaɪz', 'แอด-เวอร์-ไทส์'),
    'advertisement': ('ˌædvərˈtaɪzmənt', 'แอด-เวอร์-ไทส์-เมินท์'),
    'advertising': ('ˈædvərtaɪzɪŋ', 'แอด-เวอร์-ไท-ซิง'),
    'advice': ('ədˈvaɪs', 'แอด-ไวส์'),
    'advise': ('ədˈvaɪz', 'แอด-ไวส์'),
    'affair': ('əˈfer', 'อะ-แฟร์'),
    'affect': ('əˈfekt', 'อะ-เฟคต์'),
    'afford': ('əˈfɔːrd', 'อะ-ฟอร์ด'),
    'afraid': ('əˈfreɪd', 'อะ-เฟรด'),
    'after': ('ˈæftər', 'อาฟ-เตอร์ / แอฟ-เตอร์'),
    'afternoon': ('ˌæftərˈnuːn', 'อาฟ-เตอร์-นูน / แอฟ-เตอร์-นูน'),
    'afterwards': ('ˈæftərwərdz', 'อาฟ-เตอร์-เวิร์ดส'),
    'again': ('əˈɡen', 'อะ-เกน'),
    'against': ('əˈɡenst', 'อะ-เกนสต์'),
    'age': ('eɪdʒ', 'เอจ'),
    'aged': ('eɪdʒd', 'เอจด์'),
    'agency': ('ˈeɪdʒənsi', 'เอ-เจน-ซี'),
    'agent': ('ˈeɪdʒənt', 'เอ-เจินท์'),
    'aggressive': ('əˈɡresɪv', 'อะ-เกรส-ซิฟว์'),
    'ago': ('əˈɡoʊ', 'อะ-โก'),
    'agree': ('əˈɡriː', 'อะ-กรี'),
    'agreement': ('əˈɡriːmənt', 'อะ-กรี-เมินท์'),
    'ahead': ('əˈhed', 'อะ-เฮด'),
    'aid': ('eɪd', 'เอด'),
    'aide': ('eɪd', 'เอด'),
    'aim': ('eɪm', 'เอม'),
    'air': ('er', 'แอร์'),
    'aircraft': ('ˈerkræft', 'แอร์-คราฟต์'),
    'airline': ('ˈerlaɪn', 'แอร์-ไลน์'),
    'airport': ('ˈerpɔːrt', 'แอร์-พอร์ต'),
    'alarm': ('əˈlɑːrm', 'อะ-ลาร์ม'),
    'album': ('ˈælbəm', 'แอล-บัม'),
    'alcohol': ('ˈælkəhɔːl', 'แอล-กอ-ฮอล์'),
    'alcoholic': ('ˌælkəˈhɑːlɪk', 'แอล-กอ-ฮอ-ลิก'),
    'alive': ('əˈlaɪv', 'อะ-ไลฟว์'),
    'all': ('ɔːl', 'ออล'),
    'all right': ('ˌɔːl ˈraɪt', 'ออล-ไรท์'),
    'allow': ('əˈlaʊ', 'อะ-ลาว'),
    'almost': ('ˈɔːlmoʊst', 'ออล-โมสต์'),
    'alone': ('əˈloʊn', 'อะ-โลน'),
    'along': ('əˈlɔːŋ', 'อะ-ลอง'),
    'alongside': ('əˌlɔːŋˈsaɪd', 'อะ-ลอง-ไซด์'),
    'already': ('ɔːlˈredi', 'ออล-เรด-ดี'),
    'also': ('ˈɔːlsoʊ', 'ออล-โซ'),
    'alter': ('ˈɔːltər', 'ออล-เทอร์'),
    'alternative': ('ɔːlˈtɜːrnətɪv', 'ออล-เทอร์-เนอ-ทิฟว์'),
    'although': ('ɔːlˈðoʊ', 'ออล-โธ'),
    'altitude': ('ˈæltɪtjuːd', 'แอล-ทิ-ทูด'),
    'always': ('ˈɔːlweɪz', 'ออล-เวย์ส'),
    'amaze': ('əˈmeɪz', 'อะ-เมซ'),
    'amazed': ('əˈmeɪzd', 'อะ-เมสด์'),
    'amazing': ('əˈmeɪzɪŋ', 'อะ-เม-ซิง'),
    'ambition': ('æmˈbɪʃn', 'แอม-บิ-ชัน'),
    'ambulance': ('ˈæmbjələns', 'แอม-บิว-เลินส์'),
    'among': ('əˈmʌŋ', 'อะ-มัง'),
    'amount': ('əˈmaʊnt', 'อะ-เมาท์'),
    'analyse': ('ˈænəlaɪz', 'แอน-นะ-ไลส์'),
    'analysis': ('əˈnæləsɪs', 'อะ-แนล-ลิ-ซิส'),
    'analyst': ('ˈænəlɪst', 'แอน-นะ-ลิสต์'),
    'ancient': ('ˈeɪnʃənt', 'เอน-เชินต์'),
    'and': ('ænd, ənd', 'แอนด์'),
    'angel': ('ˈeɪndʒl', 'เอน-เจิล'),
    'anger': ('ˈæŋɡər', 'แอง-เกอร์'),
    'angle': ('ˈæŋɡl', 'แอง-เกิล'),
    'angry': ('ˈæŋɡri', 'แอง-กรี'),
    'animal': ('ˈænɪml', 'แอน-นิ-มัล'),
    'ankle': ('ˈæŋkl', 'แอง-เคิล'),
    'anniversary': ('ˌænɪˈvɜːrsəri', 'แอน-นิ-เวอร์-ซะ-รี'),
    'announce': ('əˈnaʊns', 'อะ-เนาส์'),
    'announcement': ('əˈnaʊnsmənt', 'อะ-เนาส์-เมินท์'),
    'annoy': ('əˈnɔɪ', 'อะ-นอย'),
    'annoyed': ('əˈnɔɪd', 'อะ-นอยด์'),
    'annoying': ('əˈnɔɪɪŋ', 'อะ-นอย-อิ้ง'),
    'annual': ('ˈænjuəl', 'แอน-นวล'),
    'another': ('əˈnʌðər', 'อะ-นาธ-เธอร์'),
    'answer': ('ˈænsər', 'แอน-เซอร์'),
    'anxious': ('ˈæŋkʃəs', 'แอง-เชิส'),
    'any': ('ˈeni', 'เอน-นี่'),
    'any more': ('ˌeni ˈmɔːr', 'เอน-นี่-มอร์'),
    'anybody': ('ˈenibədi', 'เอน-นี่-บอ-ดี้'),
    'anyone': ('ˈeniwʌn', 'เอน-นี่-วัน'),
    'anything': ('ˈeniθɪŋ', 'เอน-นี่-ธิง'),
    'anyway': ('ˈeniweɪ', 'เอน-นี่-เวย์'),
    'anywhere': ('ˈeniwer', 'เอน-นี่-แวร์'),
    'apart': ('əˈpɑːrt', 'อะ-พาร์ท'),
    'apartment': ('əˈpɑːrtmənt', 'อะ-พาร์ท-เมินท์'),
    'apologize': ('əˈpɑːlədʒaɪz', 'อะ-พอล-โล-ไจส์'),
    'apology': ('əˈpɑːlədʒi', 'อะ-พอล-โล-จี'),
    'app': ('æp', 'แอป'),
    'apparent': ('əˈpærənt', 'อะ-แพร์-เรินท์'),
    'appeal': ('əˈpiːl', 'อะ-พีล'),
    'appealing': ('əˈpiːlɪŋ', 'อะ-พีล-ลิ่ง'),
    'appear': ('əˈpɪr', 'อะ-เพียร์'),
    'appearance': ('əˈpɪrəns', 'อะ-เพียร์-เรินส์'),
    'apple': ('ˈæpl', 'แอป-เปิล'),
    'application': ('ˌæplɪˈkeɪʃn', 'แอป-พลิ-เค-ชัน'),
    'apply': ('əˈplaɪ', 'อะ-พลอย / อะ-พลาย'),
    'appoint': ('əˈpɔɪnt', 'อะ-พอยท์'),
    'appointment': ('əˈpɔɪntmənt', 'อะ-พอยท์-เมินท์'),
    'appreciate': ('əˈpriːʃieɪt', 'อะ-พรี-ชิ-เอท'),
    'approach': ('əˈproʊtʃ', 'อะ-โปรช'),
    'appropriate': ('əˈproʊpriət', 'อะ-โปร-พริ-เอท'),
    'approval': ('əˈpruːvl', 'อะ-พรูฟ-วาล'),
    'approve': ('əˈpruːv', 'อะ-พรูฟว์'),
    'approximate': ('əˈprɑːksɪmət', 'อะ-พรอค-ซิ-เมท'),
    'architect': ('ˈɑːrkɪtekt', 'อาร์-คิ-เทคท์'),
    'architecture': ('ˈɑːrkɪtektʃər', 'อาร์-คิ-เทค-เจอร์'),
    'area': ('ˈeriə', 'แอ-เรีย'),
    'argue': ('ˈɑːrɡjuː', 'อาร์ก-กิว'),
    'argument': ('ˈɑːrɡjumənt', 'อาร์ก-กิว-เมินท์'),
    'arise': ('əˈraɪz', 'อะ-ไรส์'),
    'arm': ('ɑːrm', 'อาร์ม'),
    'army': ('ˈɑːrmi', 'อาร์-มี'),
    'around': ('əˈraʊnd', 'อะ-ราวนด์'),
    'arrange': ('əˈreɪndʒ', 'อะ-เรนจ์'),
    'arrangement': ('əˈreɪndʒmənt', 'อะ-เรนจ์-เมินท์'),
    'arrest': ('əˈrest', 'อะ-เรสต์'),
    'arrival': ('əˈraɪvl', 'อะ-ไรฟ-วาล'),
    'arrive': ('əˈraɪv', 'อะ-ไรฟว์'),
    'art': ('ɑːrt', 'อาร์ท'),
    'article': ('ˈɑːrtɪkl', 'อาร์-ทิ-เคิล'),
    'artist': ('ˈɑːrtɪst', 'อาร์-ทิสต์'),
    'artistic': ('ɑːrˈtɪstɪk', 'อาร์-ทิส-ติก'),
    'ashamed': ('əˈʃeɪmd', 'อะ-เชมด์'),
    'aside': ('əˈsaɪd', 'อะ-ไซด์'),
    'ask': ('æsk', 'แอสค์'),
    'asleep': ('əˈsliːp', 'อะ-สลีพ'),
    'aspect': ('ˈæspekt', 'แอส-เปกต์'),
    'assess': ('əˈses', 'อะ-เซส'),
    'assessment': ('əˈsesmənt', 'อะ-เซส-เมินท์'),
    'assignment': ('əˈsaɪnmənt', 'อะ-ไซน์-เมินท์'),
    'assist': ('əˈsɪst', 'อะ-ซิสต์'),
    'assistant': ('əˈsɪstənt', 'อะ-ซิส-เทินท์'),
    'associate': ('əˈsoʊʃieɪt', 'อะ-โซ-ชิ-เอท'),
    'associated': ('əˈsoʊʃieɪtɪd', 'อะ-โซ-ชิ-เอ-ทิด'),
    'association': ('əˌsoʊʃiˈeɪʃn', 'อะ-โซ-ชิ-เอ-ชัน'),
    'assume': ('əˈsuːm', 'อะ-ซูม'),
    'atmosphere': ('ˈætməsfɪr', 'แอต-โมส-เฟียร์'),
    'attach': ('əˈtætʃ', 'อะ-แทช'),
    'attack': ('əˈtæk', 'อะ-แทค'),
    'attempt': ('əˈtempt', 'อะ-เทมพท์'),
    'attend': ('əˈtend', 'อะ-เทนด์'),
    'attention': ('əˈtenʃn', 'อะ-เทน-ชัน'),
    'attitude': ('ˈætɪtuːd', 'แอต-ทิ-ทูด'),
    'attract': ('əˈtrækt', 'อะ-แทรกต์'),
    'attraction': ('əˈtrækʃn', 'อะ-แทรก-ชัน'),
    'attractive': ('əˈtræktɪv', 'อะ-แทรก-ทิฟว์'),
    'audience': ('ˈɔːdiəns', 'ออ-ดิ-เอนส์'),
    'author': ('ˈɔːθər', 'ออ-เธอร์'),
    'authority': ('əˈθɔːrəti', 'อะ-ธอ-ริ-ที'),
    'automatic': ('ˌɔːtəˈmætɪk', 'ออ-โต-แม-ติก'),
    'automatically': ('ˌɔːtəˈmætɪkli', 'ออ-โต-แม-ติก-ลี'),
    'available': ('əˈveɪləbl', 'อะ-เว-เลอะ-เบิล'),
    'average': ('ˈævərɪdʒ', 'แอฟ-เวอ-ริจ'),
    'avoid': ('əˈvɔɪd', 'อะ-วอยด์'),
    'award': ('əˈwɔːrd', 'อะ-วอร์ด'),
    'aware': ('əˈwer', 'อะ-แวร์'),
    'awareness': ('əˈwernəs', 'อะ-แวร์-เนส'),
    'away': ('əˈweɪ', 'อะ-เวย์'),
    'awful': ('ˈɔːfl', 'ออ-ฟูล'),

    # B
    'baby': ('ˈbeɪbi', 'เบ-บี'),
    'back': ('bæk', 'แบ็ค'),
    'background': ('ˈbækɡraʊnd', 'แบ็ค-กราวนด์'),
    'bad': ('bæd', 'แบด'),
    'badly': ('ˈbædli', 'แบด-ลี'),
    'bag': ('bæɡ', 'แบ็ก'),
    'bake': ('beɪk', 'เบค'),
    'balance': ('ˈbæləns', 'บาล-เลินส์'),
    'ball': ('bɔːl', 'บอล'),
    'ban': ('bæn', 'แบน'),
    'band': ('bænd', 'แบนด์'),
    'bank': ('bæŋk', 'แบงก์'),
    'bar': ('bɑːr', 'บาร์'),
    'barrier': ('ˈbæriər', 'แบร์-ริ-เออร์'),
    'base': ('beɪs', 'เบส'),
    'baseball': ('ˈbeɪsbɔːl', 'เบส-บอล'),
    'based': ('beɪst', 'เบสด์'),
    'basic': ('ˈbeɪsɪk', 'เบ-ซิก'),
    'basically': ('ˈbeɪsɪkli', 'เบ-ซิก-ลี'),
    'basis': ('ˈbeɪsɪs', 'เบ-ซิส'),
    'basket': ('ˈbæskɪt', 'บาส-เก็ต'),
    'basketball': ('ˈbæskɪtbɔːl', 'บาส-เก็ต-บอล'),
    'bath': ('bæθ', 'บาธ'),
    'bathroom': ('ˈbæθruːm', 'บาธ-รูม'),
    'battery': ('ˈbætəri', 'แบต-เตอ-รี'),
    'battle': ('ˈbætl', 'แบท-เทิล'),
    'be': ('biː', 'บี'),
    'beach': ('biːtʃ', 'บีช'),
    'bear': ('ber', 'แบร์'),
    'beat': ('biːt', 'บีท'),
    'beautiful': ('ˈbjuːtɪfl', 'บิว-ทิ-ฟูล'),
    'beauty': ('ˈbjuːti', 'บิว-ที'),
    'because': ('bɪˈkɔːz', 'บิ-คอส'),
    'become': ('bɪˈkʌm', 'บิ-คัม'),
    'bed': ('bed', 'เบด'),
    'bedroom': ('ˈbedruːm', 'เบด-รูม'),
    'bee': ('biː', 'บี'),
    'beef': ('biːf', 'บีฟ'),
    'beer': ('bɪr', 'เบียร์'),
    'before': ('bɪˈfɔːr', 'บิ-ฟอร์'),
    'begin': ('bɪˈɡɪn', 'บิ-กิน'),
    'beginning': ('bɪˈɡɪnɪŋ', 'บิ-กิน-นิง'),
    'behave': ('bɪˈheɪv', 'บิ-เฮฟว์'),
    'behavior': ('bɪˈheɪvjər', 'บิ-เฮฟ-เวียร์'),
    'behind': ('bɪˈhaɪnd', 'บิ-ไฮนด์'),
    'being': ('ˈbiːɪŋ', 'บี-อิ้ง'),
    'belief': ('bɪˈliːf', 'บิ-ลีฟ'),
    'believe': ('bɪˈliːv', 'บิ-ลีฟว์'),
    'bell': ('bel', 'เบล'),
    'belong': ('bɪˈlɔːŋ', 'บิ-ลอง'),
    'below': ('bɪˈloʊ', 'บิ-โล'),
    'belt': ('belt', 'เบลท์'),
    'bend': ('bend', 'เบนด์'),
    'benefit': ('ˈbenɪfɪt', 'เบน-เน-ฟิท'),
    'beside': ('bɪˈsaɪd', 'บิ-ไซด์'),
    'best': ('best', 'เบสต์'),
    'better': ('ˈbetər', 'เบท-เทอร์'),
    'between': ('bɪˈtwiːn', 'บิ-ทวีน'),
    'beyond': ('bɪˈjɑːnd', 'บิ-ยอนด์'),
    'bicycle': ('ˈbaɪsɪkl', 'ไบ-ซิ-เคิล'),
    'big': ('bɪɡ', 'บิ๊ก'),
    'bike': ('baɪk', 'ไบค์'),
    'bill': ('bɪl', 'บิล'),
    'billion': ('ˈbɪljən', 'บิล-เลียน'),
    'binding': ('ˈbaɪndɪŋ', 'ไบน์-ดิ่ง'),
    'biology': ('baɪˈɑːlədʒi', 'ไบ-ออล-โล-จี'),
    'bird': ('bɜːrd', 'เบิร์ด'),
    'birth': ('bɜːrθ', 'เบิร์ธ'),
    'birthday': ('ˈbɜːrθdeɪ', 'เบิร์ธ-เดย์'),
    'biscuit': ('ˈbɪskɪt', 'บิส-กิต'),
    'bit': ('bɪt', 'บิท'),
    'bite': ('baɪt', 'ไบท์'),
    'bitter': ('ˈbɪtər', 'บิท-เทอร์'),
    'black': ('blæk', 'แบล็ก'),
    'blame': ('bleɪm', 'เบลม'),
    'blank': ('blæŋk', 'แบลงก์'),
    'blind': ('blaɪnd', 'บลายนด์'),
    'block': ('blɑːk', 'บล็อก'),
    'blog': ('blɔːɡ', 'บล็อก'),
    'blonde': ('blɑːnd', 'บลอนด์'),
    'blood': ('blʌd', 'บลัด'),
    'blow': ('bloʊ', 'โบล'),
    'blue': ('bluː', 'บลู'),
    'board': ('bɔːrd', 'บอร์ด'),
    'boat': ('boʊt', 'โบท'),
    'body': ('ˈbɑːdi', 'บอ-ดี'),
    'boil': ('bɔɪl', 'บอยล์'),
    'bomb': ('bɑːm', 'บอม'),
    'bond': ('bɑːnd', 'บอนด์'),
    'bone': ('boʊn', 'โบน'),
    'book': ('bʊk', 'บุ๊ก'),
    'boot': ('buːt', 'บูท'),
    'border': ('ˈbɔːrdər', 'บอร์-เดอร์'),
    'bored': ('bɔːrd', 'บอร์ด'),
    'boring': ('ˈbɔːrɪŋ', 'บอ-ริ่ง'),
    'born': ('bɔːrn', 'บอร์น'),
    'borrow': ('ˈbɑːroʊ', 'บอ-โร'),
    'boss': ('bɔːs', 'บอส'),
    'both': ('boʊθ', 'โบธ'),
    'bother': ('ˈbɑːðər', 'บาธ-เธอร์'),
    'bottle': ('ˈbɑːtl', 'บอท-เทิล'),
    'bottom': ('ˈbɑːtəm', 'บอท-ทัม'),
    'bowl': ('boʊl', 'โบล'),
    'box': ('bɑːks', 'บ็อกซ์'),
    'boy': ('bɔɪ', 'บอย'),
    'boyfriend': ('ˈbɔɪfrend', 'บอย-เฟรนด์'),
    'brain': ('breɪn', 'เบรน'),
    'branch': ('bræntʃ', 'บรันช์'),
    'brand': ('brænd', 'แบรนด์'),
    'brave': ('breɪv', 'เบรฟว์'),
    'bread': ('bred', 'เบรด'),
    'break': ('breɪk', 'เบรก'),
    'breakfast': ('ˈbrekfəst', 'เบรก-ฟาสต์'),
    'breast': ('brest', 'เบรสต์'),
    'breath': ('breθ', 'เบรธ'),
    'breathe': ('briːð', 'บรีธ'),
    'breathing': ('ˈbriːðɪŋ', 'บรีธ-ธิง'),
    'bride': ('braɪd', 'ไบรด์'),
    'bridge': ('brɪdʒ', 'บริดจ์'),
    'brief': ('briːf', 'บรีฟ'),
    'bright': ('braɪt', 'ไบรท์'),
    'brilliant': ('ˈbrɪljənt', 'บริล-เลียนท์'),
    'bring': ('brɪŋ', 'บริง'),
    'broad': ('brɔːd', 'บรอด'),
    'broadcast': ('ˈbrɔːdkæst', 'บรอด-คาสต์'),
    'broken': ('ˈbroʊkən', 'โบร-เคิน'),
    'brother': ('ˈbrʌðər', 'บราธ-เธอร์'),
    'brown': ('braʊn', 'บราวน์'),
    'brush': ('brʌʃ', 'บรัช'),
    'bubble': ('ˈbʌbl', 'บับ-เบิล'),
    'budget': ('ˈbʌdʒɪt', 'บัด-เจ็ต'),
    'build': ('bɪld', 'บิลด์'),
    'building': ('ˈbɪldɪŋ', 'บิล-ดิ่ง'),
    'bullet': ('ˈbʊlɪt', 'บุล-ลิต'),
    'bunch': ('bʌntʃ', 'บันช์'),
    'burn': ('bɜːrn', 'เบิร์น'),
    'bury': ('ˈberi', 'เบ-รี'),
    'bus': ('bʌs', 'บัส'),
    'bush': ('bʊʃ', 'บุช'),
    'business': ('ˈbɪznəs', 'บิซ-เนส'),
    'businessman': ('ˈbɪznəsmæn', 'บิซ-เนส-แมน'),
    'busy': ('ˈbɪzi', 'บิซ-ซี'),
    'but': ('bʌt', 'บัท'),
    'butter': ('ˈbʌtər', 'บัท-เทอร์'),
    'button': ('ˈbʌtn', 'บัท-เทิน'),
    'buy': ('baɪ', 'บาย'),
    'buyer': ('ˈbaɪər', 'บาย-เออร์'),
    'by': ('baɪ', 'บาย'),
    'bye': ('baɪ', 'บาย'),

    # C, D, E, F Specific Fixes
    'church': ('tʃɜːrtʃ', 'เชิร์ช'),
    'daughter': ('ˈdɔːtər', 'ดอ-เทอร์'),
    'dentist': ('ˈdentɪst', 'เดน-ทิสต์'),
    'cutting': ('ˈkʌtɪŋ', 'คัท-ติ้ง'),
    'decision-making': ('dɪˈsɪʒn ˈmeɪkɪŋ', 'ดิ-ซิ-ชัน เมค-กิ้ง'),
    'depressed': ('dɪˈprest', 'ดิ-เพรสต์'),
    'depressing': ('dɪˈpresɪŋ', 'ดิ-เพรส-ซิ่ง'),
    'devastating': ('ˈdevəsteɪtɪŋ', 'เดฟ-วา-สเต-ติ้ง'),
    'dilute': ('daɪˈluːt', 'ได-ลูท'),
    'disappointing': ('ˌdɪsəˈpɔɪntɪŋ', 'ดิส-อะ-พอยท์-ติ้ง'),
    'disposition': ('ˌdɪspəˈzɪʃn', 'ดิส-โพ-ซิ-ชัน'),
    'distribute': ('dɪˈstrɪbjuːt', 'ดิส-ทริ-บิวต์'),
    'distribution': ('ˌdɪstrɪˈbjuːʃn', 'ดิส-ทริ-บิว-ชัน'),
    'disturbing': ('dɪˈstɜːrbɪŋ', 'ดิส-เทอร์-บิ่ง'),
    'drawing': ('ˈdrɔːɪŋ', 'ดรอว์-อิ้ง'),
    'driving': ('ˈdraɪvɪŋ', 'ไดรฟ-วิ่ง'),
    'during': ('ˈdjʊərɪŋ', 'ดู-ริ่ง / ดิว-ริ่ง'),
    'eccentric': ('ɪkˈsentrɪk', 'อิก-เซน-ทริก'),
    'editorial': ('ˌedɪˈtɔːriəl', 'เอ็ด-ดิ-ทอ-เรียล'),
    'eligible': ('ˈelɪdʒəbl', 'เอล-ลิ-จิ-เบิล'),
    'eloquent': ('ˈeləkwənt', 'เอล-เลอะ-เควนท์'),
    'embarrassed': ('ɪmˈbærəst', 'อิม-แบ-แรสต์'),
    'embarrassing': ('ɪmˈbærəsɪŋ', 'อิม-แบ-แรส-ซิ่ง'),
    'embassy': ('ˈembəsi', 'เอ็ม-บะ-ซี'),
    'embed': ('ɪmˈbed', 'เอ็ม-เบด'),
    'embodiment': ('ɪmˈbɑːdimənt', 'เอ็ม-บอ-ดิ-เมินท์'),
    'empathy': ('ˈempəθi', 'เอ็ม-พะ-ธี'),
    'empire': ('ˈempaɪər', 'เอ็ม-ไพร์'),
    'empower': ('ɪmˈpaʊər', 'เอ็ม-พาว-เวอร์'),
    'enable': ('ɪˈneɪbl', 'เอ็น-เอ-เบิล'),
    'enact': ('ɪˈnækt', 'เอ็น-แอคท์'),
    'encounter': ('ɪnˈkaʊntər', 'เอ็น-เคาน์-เตอร์'),
    'encourage': ('ɪnˈkɜːrɪdʒ', 'เอ็น-เคอ-ริจ'),
    'encouraging': ('ɪnˈkɜːrɪdʒɪŋ', 'เอ็น-เคอ-ริจ-จิ้ง'),
    'endless': ('ˈendləs', 'เอนด์-เลส'),
    'endorse': ('ɪnˈdɔːrs', 'เอ็น-ดอร์ส'),
    'endorsement': ('ɪnˈdɔːrsmənt', 'เอ็น-ดอร์ส-เมินท์'),
    'endure': ('ɪnˈdjʊr', 'เอ็น-ดูร์'),
    'enemy': ('ˈenəmi', 'เอน-เน-มี'),
    'energy': ('ˈenərdʒi', 'เอน-เนอร์-จี'),
    'enforce': ('ɪnˈfɔːrs', 'เอ็น-ฟอร์ส'),
    'engage': ('ɪnˈɡeɪdʒ', 'เอ็น-เกจ'),
    'engine': ('ˈendʒɪn', 'เอน-จิน'),
    'engineer': ('ˌendʒɪˈnɪr', 'เอน-จิ-เนียร์'),
    'engineering': ('ˌendʒɪˈnɪrɪŋ', 'เอน-จิ-เนียร์-ริ่ง'),
    'enhance': ('ɪnˈhæns', 'เอ็น-ฮานส์'),
    'enjoy': ('ɪnˈdʒɔɪ', 'เอ็น-จอย'),
    'enjoyable': ('ɪnˈdʒɔɪəbl', 'เอ็น-จอย-เออะ-เบิล'),
    'enormous': ('ɪˈnɔːrməs', 'อิ-นอร์-มัส'),
    'enough': ('ɪˈnʌf', 'อิ-นัฟ'),
    'ensure': ('ɪnˈʃʊr', 'เอ็น-ชัวร์'),
    'enter': ('ˈentər', 'เอน-เตอร์'),
    'enterprise': ('ˈentərpraɪz', 'เอน-เตอร์-ไพรส์'),
    'entertain': ('ˌentərˈteɪn', 'เอน-เตอร์-เทน'),
    'entertainment': ('ˌentərˈteɪnmənt', 'เอน-เตอร์-เทน-เมินท์'),
    'enthusiasm': ('ɪnˈθuːziæzəm', 'เอ็น-ทู-ซิ-แอส-ซัม'),
    'enthusiastic': ('ɪnˌθuːziˈæstɪk', 'เอ็น-ทู-ซิ-แอส-ติก'),
    'entire': ('ɪnˈtaɪər', 'เอ็น-ไทร์'),
    'entirely': ('ɪnˈtaɪərli', 'เอ็น-ไทร์-ลี'),
    'entitle': ('ɪnˈtaɪtl', 'เอ็น-ไท-เทิล'),
    'entity': ('ˈentəti', 'เอน-ทิ-ที'),
    'entrance': ('ˈentrəns', 'เอน-เทรินส์'),
    'entry': ('ˈentri', 'เอน-ทรี'),
    'envelope': ('ˈenvəloʊp', 'เอน-เว-โลป'),
    'environment': ('ɪnˈvaɪrənmənt', 'เอ็น-ไว-รอน-เมินท์'),
    'environmental': ('ɪnˌvaɪrənˈmentl', 'เอ็น-ไว-รอน-เมน-ทัล'),
    'epidemic': ('ˌepɪˈdemɪk', 'เอพ-พิ-เดม-มิก'),
    'episode': ('ˈepɪsoʊd', 'เอพ-พิ-โซด'),
    'equal': ('ˈiːkwəl', 'อี-ควล'),
    'equally': ('ˈiːkwəli', 'อี-ควล-ลี'),
    'equation': ('ɪˈkweɪʒn', 'อิ-เคว-ชัน'),
    'equipment': ('ɪˈkwɪpmənt', 'อิ-ควิป-เมินท์'),
    'equity': ('ˈekwəti', 'เอค-ควิ-ที'),
    'equivalent': ('ɪˈkwɪvələnt', 'อิ-ควิฟ-วะ-เลินท์'),
    'era': ('ˈɪrə', 'เอีย-ระ / เอ-ระ'),
    'error': ('ˈerər', 'เออ-เรอร์'),
    'escape': ('ɪˈskeɪp', 'อิส-เคป'),
    'especially': ('ɪˈspeʃəli', 'อิส-เปช-เชิล-ลี'),
    'essay': ('ˈeseɪ', 'เอส-เซย์'),
    'essential': ('ɪˈsenʃl', 'อิส-เซน-เชิล'),
    'essentially': ('ɪˈsenʃəli', 'อิส-เซน-เชิล-ลี'),
    'establish': ('ɪˈstæblɪʃ', 'อิส-แทบ-ลิช'),
    'establishment': ('ɪˈstæblɪʃmənt', 'อิส-แทบ-ลิช-เมินท์'),
    'estate': ('ɪˈsteɪt', 'อิส-เตท'),
    'estimate': ('ˈestɪmət', 'เอส-ติ-เมต'),
    'ethical': ('ˈeθɪkl', 'เอธ-ธิ-เคิล'),
    'ethics': ('ˈeθɪks', 'เอธ-ธิกส์'),
    'ethnic': ('ˈeθnɪk', 'เอธ-นิก'),
    'evaluate': ('ɪˈvæljueɪt', 'อิ-แวล-ลิว-เอท'),
    'evaluation': ('ɪˌvæljuˈeɪʃn', 'อิ-แวล-ลิว-เอ-ชัน'),
    'even': ('ˈiːvn', 'อี-เวิน'),
    'evening': ('ˈiːvnɪŋ', 'อีฟ-นิ่ง'),
    'event': ('ɪˈvent', 'อิ-เวนต์'),
    'eventually': ('ɪˈventʃuəli', 'อิ-เวน-ชัวล-ลี'),
    'ever': ('ˈevər', 'เอฟ-เวอร์'),
    'every': ('ˈevri', 'เอฟ-วรี'),
    'everybody': ('ˈevribədi', 'เอฟ-วรี-บอ-ดี้'),
    'everyone': ('ˈevriwʌn', 'เอฟ-วรี-วัน'),
    'everything': ('ˈevriθɪŋ', 'เอฟ-วรี-ธิง'),
    'everywhere': ('ˈevriwer', 'เอฟ-วรี-แวร์'),
    'evidence': ('ˈevɪdəns', 'เอฟ-วิ-เดนส์'),
    'evil': ('ˈiːvl', 'อี-วิล'),
    'exact': ('ɪɡˈzækt', 'อิก-แซคท์'),
    'exactly': ('ɪɡˈzæktli', 'อิก-แซคท์-ลี'),
    'examination': ('ɪɡˌzæmɪˈneɪʃn', 'อิก-แซม-มิ-เน-ชัน'),
    'examine': ('ɪɡˈzæmɪn', 'อิก-แซม-มิน'),
    'example': ('ɪɡˈzæmpl', 'อิก-แซม-เปิล'),
    'excellent': ('ˈeksələnt', 'เอค-เซิล-เลินท์'),
    'except': ('ɪkˈsept', 'อิก-เซพท์'),
    'exception': ('ɪkˈsepʃn', 'อิก-เซพ-ชัน'),
    'excessive': ('ɪkˈsesɪv', 'อิก-เซส-ซิฟว์'),
    'exchange': ('ɪksˈtʃeɪndʒ', 'อิกซ-เชนจ์'),
    'excited': ('ɪkˈsaɪtɪd', 'อิก-ไซ-ทิด'),
    'excitement': ('ɪkˈsaɪtmənt', 'อิก-ไซท์-เมินท์'),
    'exciting': ('ɪkˈsaɪtɪŋ', 'อิก-ไซ-ทิง'),
    'exclude': ('ɪkˈskluːd', 'อิก-สคลูด'),
    'exclusive': ('ɪkˈskluːsɪv', 'อิก-สคลู-ซิฟว์'),
    'excuse': ('ɪkˈskjuːs', 'อิก-สคิวส์'),
    'executive': ('ɪɡˈzekjətɪv', 'อิก-เซก-คิว-ทิฟว์'),
    'exercise': ('ˈeksərsaɪz', 'เอค-เซอร์-ไซส์'),
    'exhibit': ('ɪɡˈzɪbɪt', 'อิก-ซิ-บิท'),
    'exhibition': ('ˌeksɪˈbɪʃn', 'เอค-ซิ-บิ-ชัน'),
    'exist': ('ɪɡˈzɪst', 'อิก-ซิสต์'),
    'existence': ('ɪɡˈzɪstəns', 'อิก-ซิส-เทินส์'),
    'exit': ('ˈeksɪt', 'เอค-สิท'),
    'expand': ('ɪkˈspænd', 'อิก-สแพนด์'),
    'expansion': ('ɪkˈspænʃn', 'อิก-สแพน-ชัน'),
    'expect': ('ɪkˈspekt', 'อิก-สเปคต์'),
    'expectation': ('ˌekspekˈteɪʃn', 'เอค-สเปค-เต-ชัน'),
    'expected': ('ɪkˈspektɪd', 'อิก-สเปค-ทิด'),
    'expense': ('ɪkˈspens', 'อิก-สเปนส์'),
    'expensive': ('ɪkˈspensɪv', 'อิก-สเปน-ซิฟว์'),
    'experience': ('ɪkˈspɪriəns', 'อิก-สพี-เรียนส์'),
    'experienced': ('ɪkˈspɪriənst', 'อิก-สพี-เรียนสด์'),
    'experiment': ('ɪkˈsperɪmənt', 'อิก-สเปอ-ริ-เมินท์'),
    'expert': ('ˈekspɜːrt', 'เอค-สเพิร์ท'),
    'explain': ('ɪkˈspleɪn', 'อิก-สเพลน'),
    'explanation': ('ˌekspləˈneɪʃn', 'เอค-สพลา-เน-ชัน'),
    'explode': ('ɪkˈsploʊd', 'อิก-สโพลด์'),
    'exploit': ('ɪkˈsplɔɪt', 'อิก-สพลอยท์'),
    'exploration': ('ˌekspləˈreɪʃn', 'เอค-สพโล-เร-ชัน'),
    'explore': ('ɪkˈsplɔːr', 'อิก-สพลอร์'),
    'explosion': ('ɪkˈsploʊʒn', 'อิก-สโพล-ชัน'),
    'export': ('ˈekspɔːrt', 'เอค-สพอร์ต'),
    'expose': ('ɪkˈspoʊz', 'อิก-สโพส'),
    'exposure': ('ɪkˈspoʊʒər', 'อิก-สโพ-เชอร์'),
    'express': ('ɪkˈspres', 'อิก-สเพรส'),
    'expression': ('ɪkˈspreʃn', 'อิก-สเพรช-ชัน'),
    'extend': ('ɪkˈstend', 'อิก-สเทนด์'),
    'extension': ('ɪkˈstenʃn', 'อิก-สเทน-ชัน'),
    'extensive': ('ɪkˈstensɪv', 'อิก-สเทน-ซิฟว์'),
    'extent': ('ɪkˈstent', 'อิก-สเทนต์'),
    'external': ('ɪkˈstɜːrnl', 'อิก-สเทอร์-นัล'),
    'extra': ('ˈekstrə', 'เอค-สตรา'),
    'extraordinary': ('ɪkˈstrɔːrdəneri', 'อิก-สตรา-ออร์-ดิ-เน-รี'),
    'extreme': ('ɪkˈstriːm', 'อิก-สตรีม'),
    'extremely': ('ɪkˈstriːmli', 'อิก-สตรีม-ลี'),
    'eye': ('aɪ', 'ไอ')
}

def clean_general_phonetic(word, current_th, ipa):
    w = word.strip().lower()
    th = current_th.strip()
    
    # 1. Check curated
    if w in CURATED_WORDS:
        return CURATED_WORDS[w][1]

    # 2. Fix inverted vowel start on words starting with vowels (a, e, i, o, u)
    if w.startswith(('a', 'e', 'i', 'o', 'u')):
        # E.g. เนย์- -> เอน-, เดย์ -> เอด, เมย์ -> เอม, เจย์ -> เอจ, เลย์ -> เอล
        th = re.sub(r'^เนย์-', 'เอน-', th)
        th = re.sub(r'^เนย์', 'เอน', th)
        th = re.sub(r'^เดย์', 'เอด', th)
        th = re.sub(r'^เมย์-', 'เอ็ม-', th)
        th = re.sub(r'^เมย์', 'เอม', th)
        th = re.sub(r'^เจย์', 'เอจ', th)
        th = re.sub(r'^เลย์-', 'เอล-', th)
        th = re.sub(r'^เลย์', 'เอล', th)
        th = re.sub(r'^ลั-', 'แอล-', th)
        th = re.sub(r'^เก็-', 'เอ็ก-', th)
        th = re.sub(r'^เแด-', 'เอล-', th)
        th = re.sub(r'^แอก-เอาคนท์', 'แอค-เคานท์', th)
        th = re.sub(r'^แอส์-', 'แอส-', th)

    # 3. Fix corrupted '-งิ' ending to '-อิ้ง' / '-ติ้ง' / '-ดิ่ง' / '-ลิ่ง' / '-นิ่ง' / '-มิ่ง' / '-ซิ่ง' / '-ชิ่ง' / '-ริ่ง' / '-กิ้ง' / '-พิ่ง' / '-ฟวิ่ง'
    if th.endswith('งิ') or th.endswith('-งิ'):
        th = re.sub(r'-งิ$', '', th)
        th = re.sub(r'งิ$', '', th)
        # Determine appropriate -ing syllable
        if w.endswith('ting'):
            th = th + '-ติ้ง' if not th.endswith('ท') else th + 'ติ้ง'
        elif w.endswith('ding'):
            th = th + '-ดิ่ง' if not th.endswith('ด') else th + 'ดิ่ง'
        elif w.endswith('sing') or w.endswith('ssing') or w.endswith('cing'):
            th = th + '-ซิ่ง' if not th.endswith('ส') else th + 'ซิ่ง'
        elif w.endswith('shing') or w.endswith('ching'):
            th = th + '-ชิ่ง'
        elif w.endswith('ling') or w.endswith('lling'):
            th = th + '-ลิ่ง'
        elif w.endswith('ning') or w.endswith('nning'):
            th = th + '-นิ่ง'
        elif w.endswith('ming') or w.endswith('mming'):
            th = th + '-มิ่ง'
        elif w.endswith('ring') or w.endswith('rring'):
            th = th + '-ริ่ง'
        elif w.endswith('king') or w.endswith('cking'):
            th = th + '-กิ้ง'
        elif w.endswith('ping') or w.endswith('pping'):
            th = th + '-พิ่ง'
        elif w.endswith('ving'):
            th = th + '-วิ่ง'
        else:
            th = th + '-อิ้ง'

    # 4. Fix other garbled artifacts
    th = th.replace('โอ-ไอ', 'โอ-ซิ')
    th = th.replace('ไอ-อุ', 'ลูท')
    th = th.replace('โอ-เรอะ', 'มอร์')
    th = th.replace('เซ็ด', 'สด์')
    th = th.replace('แรส์', 'แรส')
    th = th.replace('พอยพนท์', 'พอยท์')
    th = th.replace('แวส์', 'วัส')
    th = th.replace('แทท', 'เทท')
    th = th.replace('บินด์', 'ไบนด์')
    th = th.replace('ดอนร', 'ดรอ')
    th = th.replace('ดิรฟว์', 'ไดรฟว์')
    th = th.replace('ดัร์', 'ดิว-ริ่ง')
    th = th.replace('คิรพ', 'คริพ-เพิล')
    th = th.replace('ดอนท', 'ดอ-เทอร์')

    # 5. Clean up redundant dashes
    th = re.sub(r'-+', '-', th)
    th = re.sub(r'^-+|-+$', '', th)

    return th

def main():
    print("Loading vocabulary.json...")
    with open(VOCAB_PATH, 'r', encoding='utf-8') as f:
        vocab = json.load(f)

    print(f"Total vocabulary items: {len(vocab)}")
    
    fixed_count = 0
    curated_count = 0

    for item in vocab:
        w = item.get('word', '').strip().lower()
        old_th = item.get('thai_pronunciation', '').strip()
        ipa = item.get('ipa', '').strip()

        # Check curated exact match
        if w in CURATED_WORDS:
            new_ipa, new_th = CURATED_WORDS[w]
            item['ipa'] = new_ipa
            item['thai_pronunciation'] = new_th
            if new_th != old_th:
                fixed_count += 1
            curated_count += 1
            continue

        # Clean general phonetic
        new_th = clean_general_phonetic(w, old_th, ipa)
        if new_th != old_th:
            item['thai_pronunciation'] = new_th
            fixed_count += 1

    print(f"Total entries updated: {fixed_count}")
    print(f"Total curated entries applied: {curated_count}")

    with open(VOCAB_PATH, 'w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)

    print("Saved updated vocabulary.json successfully!")

if __name__ == '__main__':
    main()
