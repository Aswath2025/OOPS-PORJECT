-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id BIGSERIAL PRIMARY KEY,
    date_recorded DATE,
    new_user_registrations INTEGER DEFAULT 0,
    total_active_users INTEGER DEFAULT 0,
    exams_viewed INTEGER DEFAULT 0,
    scholarships_viewed INTEGER DEFAULT 0,
    materials_downloaded INTEGER DEFAULT 0,
    recommendations_generated INTEGER DEFAULT 0,
    most_viewed_exam VARCHAR(255),
    most_viewed_scholarship VARCHAR(255),
    most_downloaded_material VARCHAR(255),
    recommendation_feedback_positive INTEGER DEFAULT 0,
    recommendation_feedback_negative INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    exam_id BIGINT,
    scholarship_id BIGINT,
    entity_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_analytics_date_recorded ON analytics(date_recorded);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_exam_id ON bookmarks(exam_id);
CREATE INDEX idx_bookmarks_scholarship_id ON bookmarks(scholarship_id);
