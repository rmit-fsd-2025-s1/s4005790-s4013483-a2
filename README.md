# s4005790-s4013483-a2
Github Repository Link - https://github.com/rmit-fsd-2025-s1/s4005790-s4013483-a2
GitHub Repository For Assignment 2 - Submitted by Dang Nguyen and Joshua Santosa

Login credentials for testing:
Lecturer:
- username: larry@lecturer.com
- password: password\  
Tutor:
- username: tom@tutor.com
- password: password\
(Note: Feel free to create your own using the 'Create Account' button in the sign in page)

To add lecturer to a course:
1. Go to admin page (http://localhost:3002)
2. Find "Set Lecturer Courses" heading
3. Choose lecturer and select courses
4. Click "Set Courses" button

To add lecturer to a course (without admin):
1. Go to the database (https://getmysql.com/phpmyadmin/)
2. Enter in this credentials:
- Username = S4013483
- Password = 4z7&j$y0*0p9#9o0N0UQg2YQ@s!!qade33lKt0q&Xaoi@Ob5l7
3. Go to the lecturer_courses table
4. Click "Edit" to edit the prompt.
5. Delete the existing prompt
6. Paste in this prompt:
SELECT * FROM `lecturer_courses`;,

INSERT INTO lecturer_courses (lecturerProfileId, courseCode)
VALUES (lecturerId, 'course_code')

7. The lecturerID (an integer value) can be found on the lecturer_profile table
8. The course_code can be found on the courses table
9. For example, a query may look like this:
SELECT * FROM `lecturer_courses`;
INSERT INTO lecturer_courses (lecturerProfileId, courseCode)
VALUES (7, 'COSC1111'), (7, 'COSC2217');

Where lecturer with lecturerId 7 is assigned to course with code 'COSC1111' and 'COSC2217'



### Note for any of the following you may go into each individual folder to run/build
To run the application:
1. Open terminal
2. Open project folder
3. `npm install`
4. `npm run install-all`
5. `npm run dev`

To build application:
1. Open terminal
2. Open project folder
3. `npm run build`
4. `npm run start`