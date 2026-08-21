# -*- coding: utf-8 -*-
import sys
import json
import os

sys.path.insert(0, os.path.dirname(__file__))
import ipa_to_thai

test_words = [
    ('accounting', 'əˈkaʊntɪŋ'),
    ('accused', 'əˈkjuːzd'),
    ('daughter', 'ˈdɔːtər'),
    ('church', 'tʃɜːrtʃ'),
    ('dentist', 'ˈdentɪst'),
    ('editorial', 'ˌedɪˈtɔːriəl'),
    ('distribute', 'dɪˈstrɪbjuːt'),
    ('distribution', 'ˌdɪstrɪˈbjuːʃn'),
    ('disappointing', 'ˌdɪsəˈpɔɪntɪŋ'),
    ('any', 'ˈeni'),
    ('ancient', 'ˈeɪnʃənt'),
    ('aid', 'eɪd'),
    ('aim', 'eɪm'),
    ('age', 'eɪdʒ'),
    ('album', 'ˈælbəm'),
    ('altitude', 'ˈæltɪtjuːd'),
    ('angel', 'ˈeɪndʒl'),
    ('annoying', 'əˈnɔɪɪŋ'),
    ('associated', 'əˈsoʊsieɪtɪd'),
    ('being', 'ˈbiːɪŋ'),
    ('binding', 'ˈbaɪndɪŋ'),
    ('depressed', 'dɪˈprest'),
    ('depressing', 'dɪˈpresɪŋ'),
    ('devastating', 'ˈdevəsteɪtɪŋ'),
    ('dilute', 'daɪˈluːt'),
    ('disposition', 'ˌdɪspəˈzɪʃn'),
    ('drawing', 'ˈdrɔːɪŋ'),
    ('driving', 'ˈdraɪvɪŋ'),
    ('during', 'ˈdjʊərɪŋ'),
    ('eccentric', 'ɪkˈsentrɪk'),
    ('eligible', 'ˈelɪdʒəbl'),
    ('eloquent', 'ˈeləkwənt'),
    ('embassy', 'ˈembəsi'),
    ('empire', 'ˈempaɪər'),
    ('empower', 'ɪmˈpaʊər')
]

for w, ipa in test_words:
    th = ipa_to_thai.parse_ipa_to_thai(ipa)
    print(f"{w:15} [{ipa:15}] -> {th}")
