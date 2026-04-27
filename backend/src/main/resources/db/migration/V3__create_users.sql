CREATE TABLE users (
    id       UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(32)  NOT NULL CHECK (role IN ('ADMIN', 'USER'))
);
