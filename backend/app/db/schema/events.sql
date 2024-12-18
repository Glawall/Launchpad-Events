CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    capacity INTEGER NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    event_type_id INTEGER REFERENCES event_types(id),
    creator_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);