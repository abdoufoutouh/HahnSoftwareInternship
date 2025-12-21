# SQL.md
# HahnSoftware – MySQL Commands Reference

######################################
# 1. DATABASE
######################################

-- Select database
USE hahnsoftware_db;

-- Show databases
SHOW DATABASES;

######################################
# 2. TABLES
######################################

-- Show all tables
SHOW TABLES;

-- Describe tables
DESCRIBE users;
DESCRIBE projects;
DESCRIBE tasks;

######################################
# 3. INSERT DATA
######################################

-- Insert user
INSERT INTO users (first_name, last_name, email, password)
VALUES ('Test', 'User', 'test@hahn.com', 'password123');

-- Insert project (linked to user)
INSERT INTO projects (title, description, user_id)
VALUES ('Project 1', 'First test project', 1);

-- Insert tasks (linked to project)
INSERT INTO tasks (title, description, completed, due_date, project_id)
VALUES
('Task 1', 'First task', 0, '2025-12-25', 1),
('Task 2', 'Second task', 1, '2025-12-26', 1),
('Task 3', 'Third task', 0, '2025-12-27', 1);

######################################
# 4. RELATION CHECKS
######################################

-- Projects linked to users
SELECT
p.id   AS project_id,
p.title,
u.id   AS user_id,
u.email
FROM projects p
JOIN users u ON u.id = p.user_id;

-- Tasks linked to a project
SELECT
t.id AS task_id,
t.title,
t.completed,
t.due_date,
p.id AS project_id,
p.title AS project_title
FROM tasks t
JOIN projects p ON p.id = t.project_id
WHERE p.id = 1;

######################################
# 5. BUSINESS QUERIES
######################################

-- Project progress calculation
SELECT
p.id AS project_id,
COUNT(t.id) AS total_tasks,
SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) AS completed_tasks,
ROUND(
(SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) / COUNT(t.id)) * 100,
2
) AS progress_percent
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
WHERE p.id = 1
GROUP BY p.id;

######################################
# 6. CLEANUP (DEV ONLY)
######################################

DELETE FROM tasks;
DELETE FROM projects;
DELETE FROM users;
