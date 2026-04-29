CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    name VARCHAR(255),
    email TEXT UNIQUE NOT NULL,
    role VARCHAR(255) CHECK (
        role IN (
            'student',
            'trainer',
            'institution_admin',
            'programme_manager',
            'monitoring_officer'
        )
    ) NOT NULL,
    institution_id INTEGER REFERENCES institutions(id) ON DELETE
    SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE batch_trainers (
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (batch_id, trainer_id)
);


CREATE TABLE batch_students (
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (batch_id, student_id)
);


CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    trainer_id INTEGER REFERENCES users(id) ON DELETE
    SET NULL,
        title VARCHAR(100),
        date DATE,
        start_time TIME,
        end_time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late')),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (session_id, student_id)
);