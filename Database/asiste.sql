-- base inicial de AsisTE
-- tratemos de mantener estos nombres para no complicarnos despues con el scaffolding

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- usuarios del sistema

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- roles

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE
);


-- relacion usuarios y roles

CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE CASCADE
);


-- estudiantes

CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dni VARCHAR(15) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    grade VARCHAR(50),
    section VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- apoderados

CREATE TABLE guardians (
    guardian_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dni VARCHAR(15) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- relacion estudiantes y apoderados

CREATE TABLE student_guardians (
    student_id UUID NOT NULL,
    guardian_id UUID NOT NULL,
    relationship VARCHAR(50),

    PRIMARY KEY (student_id, guardian_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE,

    FOREIGN KEY (guardian_id)
        REFERENCES guardians(guardian_id)
        ON DELETE CASCADE
);


-- dispositivos

CREATE TABLE devices (
    device_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- asistencias

CREATE TABLE attendances (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    device_id UUID,
    attendance_date DATE NOT NULL,
    entry_time TIMESTAMP,
    exit_time TIMESTAMP,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (device_id)
        REFERENCES devices(device_id),

    CONSTRAINT chk_attendance_status
        CHECK (
            status IN (
                'puntual',
                'tardanza',
                'ausente',
                'justificado'
            )
        )
);


-- notificaciones

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_id UUID,
    guardian_id UUID NOT NULL,
    message VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (attendance_id)
        REFERENCES attendances(attendance_id),

    FOREIGN KEY (guardian_id)
        REFERENCES guardians(guardian_id),

    CONSTRAINT chk_notification_status
        CHECK (
            status IN (
                'pendiente',
                'enviado',
                'error'
            )
        )
);


-- roles iniciales para probar el sistema

INSERT INTO roles (role_name)
VALUES
    ('Administrador'),
    ('Docente');