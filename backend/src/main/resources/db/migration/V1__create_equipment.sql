CREATE TABLE equipment (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN (
        'MOBILITY', 'DUMBBELL', 'CARDIO', 'CABLE', 'MACHINE', 'BODYWEIGHT', 'OTHER'
    ))
);
