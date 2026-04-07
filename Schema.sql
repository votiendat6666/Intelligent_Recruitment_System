CREATE DATABASE IF NOT EXISTS intelligent_recruitment_system;
USE intelligent_recruitment_system;

-- ==========================================
-- 1. QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN
-- ==========================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    role ENUM('admin', 'candidate', 'recruiter') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. QUẢN LÝ CÔNG TY & CÔNG VIỆC
-- ==========================================
CREATE TABLE companies (
    company_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    website VARCHAR(100),
    address TEXT,
    description TEXT,
    logo_url VARCHAR(255)
);

CREATE TABLE job_postings (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    recruiter_id INT,
    company_id INT,
    title VARCHAR(200) NOT NULL,
    job_type ENUM('full-time', 'part-time', 'remote', 'contract') NOT NULL,
    experience_level VARCHAR(50), -- VD: Junior, Senior
    salary_min DECIMAL(15, 2),
    salary_max DECIMAL(15, 2),
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    status ENUM('open', 'closed', 'draft') DEFAULT 'open',
    expired_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- ==========================================
-- 3. HỒ SƠ ỨNG VIÊN & KỸ NĂNG (DÀNH CHO AI MATCHING)
-- ==========================================
CREATE TABLE candidate_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    summary TEXT,
    years_of_experience INT,
    education_level VARCHAR(100),
    current_job_title VARCHAR(100),
    cv_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(50) UNIQUE NOT NULL
);

-- Bảng trung gian liên kết kỹ năng với ứng viên (Đánh giá mức độ thông thạo)
CREATE TABLE candidate_skills (
    profile_id INT,
    skill_id INT,
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5), -- 1: Cơ bản, 5: Chuyên gia
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES candidate_profiles(profile_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

-- Bảng trung gian liên kết kỹ năng yêu cầu cho mỗi công việc
CREATE TABLE job_skills (
    job_id INT,
    skill_id INT,
    importance_weight INT DEFAULT 1, -- Trọng số để AI tính toán độ ưu tiên
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES job_postings(job_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

-- ==========================================
-- 4. QUY TRÌNH ỨNG TUYỂN & ĐÁNH GIÁ THÔNG MINH
-- ==========================================
CREATE TABLE applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    candidate_id INT,
    status ENUM('applied', 'screening', 'interviewing', 'offered', 'rejected', 'hired') DEFAULT 'applied',
    ai_matching_score DECIMAL(5, 2), -- Điểm số AI đánh giá độ phù hợp (0-100)
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_postings(job_id),
    FOREIGN KEY (candidate_id) REFERENCES users(user_id)
);

CREATE TABLE interview_schedules (
    interview_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT,
    interviewer_id INT,
    scheduled_time DATETIME NOT NULL,
    location_link VARCHAR(255), -- Link họp online hoặc địa chỉ
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES applications(application_id),
    FOREIGN KEY (interviewer_id) REFERENCES users(user_id)
);