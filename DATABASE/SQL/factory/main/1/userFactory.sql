-- Generate 5 User entities
-- password: Password123
CALL registerUser('user1@example.com', 'user1', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'John Doe', TRUE, '1990-01-01', 'Computer Science', 'University A', 'jpg');
CALL registerUser('user2@example.com', 'user2', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Jane Smith', FALSE, '1992-02-02', 'Mathematics', 'University B', 'png');
CALL registerUser('user3@example.com', 'user3', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Alice Johnson', FALSE, '1995-03-03', 'Biology', 'University C', 'gif');
CALL registerUser('user4@example.com', 'user4', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Bob Brown', TRUE, '1988-04-04', 'Physics', 'University D', 'jpeg');
CALL registerUser('user5@example.com', 'user5', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Charlie White', TRUE, '1991-05-05', 'Engineering', 'University E', 'bmp');