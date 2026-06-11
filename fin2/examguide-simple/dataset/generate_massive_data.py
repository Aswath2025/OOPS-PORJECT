import random
import datetime

# --- Configuration ---
NUM_EXAMS_TARGET = 650
SQL_OUTPUT_FILE = '../backend/src/main/resources/data.sql'

# --- Dictionaries for Generation ---
CATEGORIES = {
    'Defence': {
        'bodies': ['UPSC', 'Indian Navy', 'Indian Army', 'Indian Air Force', 'Ministry of Defence'],
        'exams': [
            'Indian Navy Agniveer MR', 'Indian Navy Agniveer SSR', 'Indian Army Agniveer General Duty',
            'Indian Army Agniveer Technical', 'Indian Army Agniveer Clerk', 'Indian Air Force Agniveer Vayu',
            'NDA & NA', 'CDS', 'AFCAT', 'CAPF AC', 'Territorial Army', 'Coast Guard Navik', 'Coast Guard Yantrik'
        ]
    },
    'SSC': {
        'bodies': ['SSC'],
        'exams': ['CGL', 'CHSL', 'MTS', 'CPO', 'Stenographer Grade C & D', 'GD Constable', 'JHT', 'Selection Post']
    },
    'Banking': {
        'bodies': ['IBPS', 'SBI', 'RBI', 'NABARD', 'SEBI'],
        'exams': ['PO', 'Clerk', 'SO', 'Office Assistant', 'Grade B Officer', 'Assistant Manager', 'Attendant']
    },
    'Railways': {
        'bodies': ['RRB', 'RRC'],
        'exams': ['NTPC', 'Group D', 'ALP', 'Technician', 'JE', 'RPF SI', 'RPF Constable']
    },
    'Civil Services': {
        'bodies': ['UPSC', 'State PSC'],
        'exams': ['Civil Services (IAS/IPS)', 'Geologist', 'Engineering Services', 'Forest Services']
    },
    'Teaching': {
        'bodies': ['CBSE', 'NTA', 'State Boards'],
        'exams': ['CTET', 'UGC NET', 'CSIR NET', 'PRT', 'TGT', 'PGT', 'Super TET']
    },
    'Engineering': {
        'bodies': ['NTA', 'IITs', 'State Technical Boards'],
        'exams': ['JEE Main', 'JEE Advanced', 'GATE', 'BITSAT', 'VITEEE', 'MHT CET', 'KCET', 'AP EAMCET']
    },
    'Medical': {
        'bodies': ['NTA', 'AIIMS', 'State Boards'],
        'exams': ['NEET UG', 'NEET PG', 'AIIMS Nursing', 'JIPMER', 'PGIMER']
    },
    'Law': {
        'bodies': ['Consortium of NLUs', 'NTA'],
        'exams': ['CLAT', 'AILET', 'LSAT India', 'MH CET Law']
    }
}

STATES = ['UP', 'Bihar', 'Rajasthan', 'MP', 'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 
          'Kerala', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Odisha', 'Punjab', 'Haryana']
STATE_ROLES = ['Police Constable', 'Police SI', 'Patwari', 'Lekhpal', 'VDO', 'Forest Guard', 'PSC Civil Services', 'TET', 'SET']

MODES = ['Online / CBT', 'Offline / OMR', 'Hybrid (CBT + Interview)']
DURATIONS = ['60 Minutes', '90 Minutes', '120 Minutes', '150 Minutes', '180 Minutes', '3 Hours']
ELIGIBILITIES = [
    '10th Pass from a recognized board.',
    '12th Pass (Science/Arts/Commerce) with 50% minimum.',
    'Graduation in any discipline.',
    'B.Tech / B.E. in relevant engineering discipline.',
    'Master Degree in related field.',
    'Graduation + typing speed 30 WPM.',
    '10th Pass + Physical standard requirements.'
]
SYLLABUS_TEMPLATES = [
    "General Knowledge & Awareness (Geography, History, Polity), Mathematics (Quantitative Aptitude), General English, Reasoning.",
    "Technical stream specific subjects (Core subjects), Engineering Mathematics, General Aptitude.",
    "Child Development & Pedagogy, Language I & II, Mathematics / Science / Social Studies.",
    "Physics, Chemistry, Biology (Botany & Zoology) covering entire 11th & 12th standard curriculum.",
    "Quantitative Aptitude, Reasonable Ability, English Language, General/Financial Awareness, Computer Aptitude."
]
EXAM_PATTERNS = [
    "Tier I: Computer Based Test (Objective) -> Tier II: Descriptive Paper -> Tier III: Skill Test.",
    "Prelims (Objective Type) -> Mains (Subjective Type) -> Personal Interview.",
    "Phase 1: Written Examination -> Phase 2: Physical Fitness Test (PFT) -> Phase 3: Medical.",
    "Single Phase Objective CBT comprising 100 MCQs, followed by document verification.",
    "Section A (Language) + Section B (Domain Specific) + Section C (General Test)."
]
MARKING_SCHEMES = [
    "+1 for correct, -0.25 for incorrect",
    "+2 for correct, -0.50 for incorrect",
    "+4 for correct, -1 for incorrect",
    "+1 for correct, No negative marking",
    "+3 for correct, -1 for incorrect"
]

def escape_sql(text):
    if text is None:
        return ""
    return str(text).replace("'", "''")

def generate_exam():
    # 30% chance of being a State exam, 70% chance of national
    is_state = random.random() < 0.3
    
    if is_state:
        state = random.choice(STATES)
        role = random.choice(STATE_ROLES)
        name = f"{state} {role}"
        category = 'State Exams'
        body = f"{state} Staff Selection" if 'PSC' not in role else f"{state} Public Service Commission"
        level = 'State'
    else:
        category, data = random.choice(list(CATEGORIES.items()))
        body = random.choice(data['bodies'])
        base_exam = random.choice(data['exams'])
        
        # Add year or prefix for uniqueness if needed, but we rely on huge permutations
        if category in ['SSC', 'Banking']:
            name = f"{body} {base_exam}"
        elif category == 'Defence' and 'Agniveer' in base_exam:
            name = base_exam # Navy Agniveer SSR, etc.
        else:
            name = base_exam
        level = 'National'

    # Append random year for variety 2024/2025
    year = random.choice(['2024', '2025'])
    name = f"{name} {year}"

    notification = datetime.date(int(year) - 1 if year == '2025' and random.random() < 0.2 else int(year), random.randint(1,12), random.randint(1,28))
    app_start = notification + datetime.timedelta(days=random.randint(2,7))
    app_end = app_start + datetime.timedelta(days=random.randint(20,30))
    exam_date = app_end + datetime.timedelta(days=random.randint(30,120))
    result_date = exam_date + datetime.timedelta(days=random.randint(30,60))

    mode = random.choice(MODES)
    eligibility = random.choice(ELIGIBILITIES)
    minAge = str(random.choice([18, 20, 21]))
    maxAge = str(random.choice([25, 27, 30, 32, 40]))
    ageRelaxation = "SC/ST: 5 Years, OBC: 3 Years"
    
    pattern = random.choice(EXAM_PATTERNS)
    totalMarks = random.choice([100, 200, 250, 400, 500, 720])
    duration = random.choice(DURATIONS)
    subjects = random.randint(3, 6)
    scheme = random.choice(MARKING_SCHEMES)
    
    # Customize syllabus based on category slightly
    if 'Engineering' in category or 'Technical' in name:
        syllabus = SYLLABUS_TEMPLATES[1]
    elif 'Medical' in category or 'NEET' in name:
        syllabus = SYLLABUS_TEMPLATES[3]
    elif 'Teaching' in category or 'TET' in name:
        syllabus = SYLLABUS_TEMPLATES[2]
    elif 'Banking' in category:
        syllabus = SYLLABUS_TEMPLATES[4]
    else:
        syllabus = SYLLABUS_TEMPLATES[0]

    # Add dummy URLs
    official_website = "https://" + body.replace(" ", "").lower() + ".nic.in"
    is_featured = 'TRUE' if random.random() < 0.05 else 'FALSE'
    is_published = 'TRUE'

    return f"INSERT INTO exams (name, conducting_body, category, level, mode, eligibility_criteria, min_age, max_age, age_relaxation, exam_pattern, total_marks, duration, number_of_subjects, marking_scheme, syllabus, official_website, is_featured, is_published, created_at, updated_at, notification_date, application_start_date, application_end_date, exam_date, result_date) VALUES (" \
           f"'{escape_sql(name)}', '{escape_sql(body)}', '{escape_sql(category)}', '{escape_sql(level)}', '{escape_sql(mode)}', '{escape_sql(eligibility)}', '{minAge}', '{maxAge}', '{ageRelaxation}', '{escape_sql(pattern)}', {totalMarks}, '{duration}', {subjects}, '{escape_sql(scheme)}', '{escape_sql(syllabus)}', '{official_website}', {is_featured}, {is_published}, NOW(), NOW(), '{notification}', '{app_start}', '{app_end}', '{exam_date}', '{result_date}');"

def main():
    generated_names = set()
    inserts = []
    
    # Explicitly ensure Indian Navy Agniveer exists
    inserts.append("INSERT INTO exams (name, conducting_body, category, level, mode, eligibility_criteria, min_age, max_age, age_relaxation, exam_pattern, total_marks, duration, number_of_subjects, marking_scheme, syllabus, official_website, is_featured, is_published, created_at, updated_at, notification_date, application_start_date, application_end_date, exam_date, result_date) VALUES ('Indian Navy Agniveer SSR 2024', 'Indian Navy', 'Defence', 'National', 'Online / CBT', '12th Pass with Mathematics, Physics and Chemistry/Biology/Computer Science', '17.5', '21', 'None', 'Computer based test -> PFT -> Medical', 100, '60 Minutes', 4, '+1 for correct, -0.25 for incorrect', 'English, Science, Mathematics and General Awareness', 'https://joinindiannavy.gov.in', TRUE, TRUE, NOW(), NOW(), '2024-05-13', '2024-05-13', '2024-06-05', '2024-07-09', '2024-08-09');")
    generated_names.add("Indian Navy Agniveer SSR 2024")

    print(f"Generating {NUM_EXAMS_TARGET} exams...")
    
    # Force some core exams that user likely checks
    core_exams = ["SSC CGL 2024", "SBI PO 2024", "UPSC Civil Services 2024", "NEET UG 2024", "JEE Main 2025"]
    for c in core_exams:
        if c not in generated_names:
            stmt = generate_exam()
            old_name_segment = stmt.split("VALUES ('")[1].split("',")[0]
            stmt = stmt.replace(f"VALUES ('{old_name_segment}'", f"VALUES ('{c}'")
            inserts.append(stmt)
            generated_names.add(c)
    
    while len(inserts) < NUM_EXAMS_TARGET:
        stmt = generate_exam()
        name = stmt.split("VALUES ('")[1].split("',")[0]
        original_name = name
        attempt = 1
        while name in generated_names:
            name = f"{original_name} (Phase {attempt})"
            attempt += 1
            
        stmt = stmt.replace(f"VALUES ('{original_name}'", f"VALUES ('{name}'")
        generated_names.add(name)
        inserts.append(stmt)
            
    with open(SQL_OUTPUT_FILE, 'w') as f:
        f.write("-- Auto-generated massive dataset (600+ exams)\n")
        f.write("DELETE FROM exams;\n") # clear old
        for statement in inserts:
            f.write(statement + "\n")
            
    print(f"Successfully wrote {len(inserts)} INSERT statements to {SQL_OUTPUT_FILE}")

if __name__ == '__main__':
    main()
