-- Generate 5 User entities

CALL registerUser('user1@example.com', 'user1', 'password1', 'John Doe', TRUE, '1990-01-01', 'Computer Science', 'University A', 'jpg');
CALL registerUser('user2@example.com', 'user2', 'password2', 'Jane Smith', FALSE, '1992-02-02', 'Mathematics', 'University B', 'png');
CALL registerUser('user3@example.com', 'user3', 'password3', 'Alice Johnson', FALSE, '1995-03-03', 'Biology', 'University C', 'gif');
CALL registerUser('user4@example.com', 'user4', 'password4', 'Bob Brown', TRUE, '1988-04-04', 'Physics', 'University D', 'jpeg');
CALL registerUser('user5@example.com', 'user5', 'password5', 'Charlie White', TRUE, '1991-05-05', 'Engineering', 'University E', 'bmp');