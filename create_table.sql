CREATE TABLE IF NOT EXISTS measures (
    id UUID PRIMARY KEY UNIQUE NOT NULL,
    customer_id VARCHAR NOT NULL,
    measure_type VARCHAR NOT NULL,
    date DATETIME NOT NULL,
    value INT,
    has_confirmed BOOLEAN DEFAULT FALSE
);