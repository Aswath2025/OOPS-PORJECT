-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth VARCHAR(50),
    education TEXT,
    category VARCHAR(50),
    work_experience TEXT,
    exam_preferences TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    conducting_body VARCHAR(255) NOT NULL,
    official_website VARCHAR(500),
    category VARCHAR(100),
    level VARCHAR(50),
    mode VARCHAR(50),
    notification_date DATE,
    application_start_date DATE,
    application_end_date DATE,
    exam_date DATE,
    result_date DATE,
    eligibility_criteria TEXT,
    min_age VARCHAR(50),
    max_age VARCHAR(50),
    age_relaxation TEXT,
    exam_pattern TEXT,
    total_marks INTEGER,
    duration VARCHAR(100),
    number_of_subjects INTEGER,
    marking_scheme TEXT,
    subject_weightage TEXT,
    syllabus TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    amount VARCHAR(100),
    deadline DATE,
    eligibility_criteria TEXT,
    required_documents TEXT,
    application_process TEXT,
    application_link VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500),
    external_link VARCHAR(500),
    exam_id BIGINT,
    tags VARCHAR(500),
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_exams_category ON exams(category);
CREATE INDEX idx_exams_level ON exams(level);
CREATE INDEX idx_exams_exam_date ON exams(exam_date);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_materials_exam_id ON study_materials(exam_id);
CREATE INDEX idx_materials_type ON study_materials(type);
