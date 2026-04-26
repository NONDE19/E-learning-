// ===== DATA STORE =====
const database = {
    users: [
        { id: 1, name: 'John Doe', email: 'student@demo.com', password: 'password', role: 'Student', status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'admin@demo.com', password: 'password', role: 'Admin', status: 'Active', joined: '2024-01-01' },
        { id: 3, name: 'Mike Johnson', email: 'instructor@demo.com', password: 'password', role: 'Instructor', status: 'Active', joined: '2024-01-05' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@demo.com', password: 'password', role: 'Student', status: 'Active', joined: '2024-02-10' },
        { id: 5, name: 'Tom Brown', email: 'tom@demo.com', password: 'password', role: 'Student', status: 'Inactive', joined: '2024-03-01' },
    ],
    courses: [
        {
            id: 1,
            name: 'Web Development Fundamentals',
            instructor: 'Mike Johnson',
            description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
            price: 49.99,
            duration: 40,
            level: 'Beginner',
            curriculum: ['HTML Basics', 'CSS Styling', 'JavaScript Fundamentals', 'DOM Manipulation', 'Responsive Design'],
            students: 245
        },
        {
            id: 2,
            name: 'Advanced JavaScript & React',
            instructor: 'Mike Johnson',
            description: 'Master modern JavaScript and build scalable React applications.',
            price: 79.99,
            duration: 60,
            level: 'Advanced',
            curriculum: ['ES6+ Features', 'Async Programming', 'React Hooks', 'State Management', 'Performance Optimization'],
            students: 189
        },
        {
            id: 3,
            name: 'Python for Data Science',
            instructor: 'Dr. Analytics',
            description: 'Learn Python programming for data analysis and machine learning.',
            price: 59.99,
            duration: 50,
            level: 'Intermediate',
            curriculum: ['Python Basics', 'NumPy & Pandas', 'Data Visualization', 'Machine Learning Intro', 'Projects'],
            students: 312
        },
        {
            id: 4,
            name: 'UI/UX Design Masterclass',
            instructor: 'Design Expert',
            description: 'Create beautiful and user-friendly interfaces from scratch.',
            price: 69.99,
            duration: 45,
            level: 'Beginner',
            curriculum: ['Design Principles', 'Wireframing', 'Prototyping', 'User Testing', 'Design Tools'],
            students: 156
        },
        {
            id: 5,
            name: 'Full Stack Web Development',
            instructor: 'Tech Master',
            description: 'Complete guide to becoming a full-stack developer.',
            price: 99.99,
            duration: 80,
            level: 'Advanced',
            curriculum: ['Frontend Basics', 'Backend Development', 'Databases', 'API Design', 'Deployment'],
            students: 287
        },
        {
            id: 6,
            name: 'Mobile App Development with React Native',
            instructor: 'Mobile Dev',
            description: 'Build cross-platform mobile apps with React Native.',
            price: 89.99,
            duration: 55,
            level: 'Intermediate',
            curriculum: ['React Native Basics', 'Navigation', 'Components', 'Native Modules', 'Publishing'],
            students: 123
        },
    ],
    enrollments: [
        { id: 1, studentId: 1, courseId: 1, progress: 75, status: 'In Progress', enrolledDate: '2024-03-01' },
        { id: 2, studentId: 1, courseId: 3, progress: 50, status: 'In Progress', enrolledDate: '2024-03-15' },
        { id: 3, studentId: 1, courseId: 4, progress: 100, status: 'Completed', enrolledDate: '2024-02-01' },
        { id: 4, studentId: 4, courseId: 1, progress: 30, status: 'In Progress', enrolledDate: '2024-03-20' },
        { id: 5, studentId: 4, courseId: 2, progress: 0, status: 'Enrolled', enrolledDate: '2024-04-01' },
        { id: 6, studentId: 5, courseId: 3, progress: 85, status: 'In Progress', enrolledDate: '2024-02-15' },
    ],
    currentUser: null
};

let editingCourseId = null;
let editingUserId = null;
let editingEnrollmentId = null;

// ===== AUTHENTICATION =====
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = database.users.find(u => u.email === email && u.password === password);

    if (user) {
        database.currentUser = user;
        document.getElementById('loginForm').reset();
        switchPage(user.role === 'Admin' ? 'adminPage' : 'studentPage');
        if (user.role === 'Admin') {
            loadAdminDashboard();
        } else {
            loadStudentDashboard();
        }
    } else {
        alert('Invalid email or password');
    }
}

function setDemoStudent() {
    database.currentUser = database.users[0];
    switchPage('studentPage');
    loadStudentDashboard();
}

function setDemoAdmin() {
    database.currentUser = database.users[1];
    switchPage('adminPage');
    loadAdminDashboard();
}

function logout() {
    database.currentUser = null;
    switchPage('loginPage');
    document.getElementById('loginForm').reset();
}

// ===== PAGE NAVIGATION =====
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function switchStudentTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');

    if (tabName === 'courses') {
        loadAvailableCourses();
    } else if (tabName === 'my-courses') {
        loadMyCourses();
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById('admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');

    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');

    if (tabName === 'courses') {
        loadAdminCourses();
    } else if (tabName === 'users') {
        loadAdminUsers();
    } else if (tabName === 'enrollments') {
        loadAdminEnrollments();
    } else if (tabName === 'reports') {
        loadAdminReports();
    }
}

// ===== STUDENT PORTAL =====
function loadStudentDashboard() {
    const user = database.currentUser;
    const studentEnrollments = database.enrollments.filter(e => e.studentId === user.id);

    const enrolledCount = studentEnrollments.length;
    const completedCount = studentEnrollments.filter(e => e.status === 'Completed').length;
    const totalHours = studentEnrollments.reduce((sum, e) => {
        const course = database.courses.find(c => c.id === e.courseId);
        return sum + (course ? course.duration * (e.progress / 100) : 0);
    }, 0);
    const avgProgress = studentEnrollments.length > 0
        ? Math.round(studentEnrollments.reduce((sum, e) => sum + e.progress, 0) / studentEnrollments.length)
        : 0;

    document.getElementById('enrolledCount').textContent = enrolledCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('hoursLearned').textContent = Math.round(totalHours);
    document.getElementById('avgProgress').textContent = avgProgress + '%';

    // Load recent courses
    let recentCoursesHtml = '';
    studentEnrollments.slice(0, 6).forEach(enrollment => {
        const course = database.courses.find(c => c.id === enrollment.courseId);
        if (course) {
            recentCoursesHtml += `
                <div class="course-card">
                    <div class="course-header">
                        <h3>${course.name}</h3>
                        <span class="course-level">${course.level}</span>
                    </div>
                    <div class="course-body">
                        <p>${course.instructor}</p>
                        <p><strong>Progress:</strong> ${enrollment.progress}%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <p><strong>Status:</strong> ${enrollment.status}</p>
                    </div>
                </div>
            `;
        }
    });
    document.getElementById('recentCourses').innerHTML = recentCoursesHtml || '<p>No courses enrolled yet.</p>';
}

function loadAvailableCourses() {
    const user = database.currentUser;
    const enrolledCourseIds = database.enrollments
        .filter(e => e.studentId === user.id)
        .map(e => e.courseId);

    let coursesHtml = '';
    database.courses.forEach(course => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        coursesHtml += `
            <div class="course-card" onclick="showCourseDetails(${course.id})">
                <div class="course-header">
                    <h3>${course.name}</h3>
                    <span class="course-level">${course.level}</span>
                </div>
                <div class="course-body">
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span>${course.students} students</span>
                        <span>${course.duration}h</span>
                    </div>
                    <div class="course-price">$${course.price}</div>
                    ${isEnrolled ? '<button class="btn btn-secondary" disabled>Already Enrolled</button>' : '<button class="btn btn-primary">View Details</button>'}
                </div>
            </div>
        `;
    });
    document.getElementById('availableCourses').innerHTML = coursesHtml;
}

function loadMyCourses() {
    const user = database.currentUser;
    const studentEnrollments = database.enrollments.filter(e => e.studentId === user.id);

    let myCoursesHtml = '';
    studentEnrollments.forEach(enrollment => {
        const course = database.courses.find(c => c.id === enrollment.courseId);
        if (course) {
            myCoursesHtml += `
                <div class="course-card">
                    <div class="course-header">
                        <h3>${course.name}</h3>
                        <span class="course-level">${course.level}</span>
                    </div>
                    <div class="course-body">
                        <p>${course.instructor}</p>
                        <p><strong>Progress:</strong> ${enrollment.progress}%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <p><strong>Status:</strong> ${enrollment.status}</p>
                        <button class="btn btn-primary" onclick="showCourseDetails(${course.id})">Continue Learning</button>
                    </div>
                </div>
            `;
        }
    });
    document.getElementById('myCourses').innerHTML = myCoursesHtml || '<p>You have not enrolled in any courses yet.</p>';
}

function filterCourses() {
    const searchTerm = document.getElementById('searchCourse').value.toLowerCase();
    const levelFilter = document.getElementById('levelFilter').value;

    const filtered = database.courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm) || course.description.toLowerCase().includes(searchTerm);
        const matchesLevel = !levelFilter || course.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const user = database.currentUser;
    const enrolledCourseIds = database.enrollments
        .filter(e => e.studentId === user.id)
        .map(e => e.courseId);

    let coursesHtml = '';
    filtered.forEach(course => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        coursesHtml += `
            <div class="course-card" onclick="showCourseDetails(${course.id})">
                <div class="course-header">
                    <h3>${course.name}</h3>
                    <span class="course-level">${course.level}</span>
                </div>
                <div class="course-body">
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span>${course.students} students</span>
                        <span>${course.duration}h</span>
                    </div>
                    <div class="course-price">$${course.price}</div>
                    ${isEnrolled ? '<button class="btn btn-secondary" disabled>Already Enrolled</button>' : '<button class="btn btn-primary">View Details</button>'}
                </div>
            </div>
        `;
    });
    document.getElementById('availableCourses').innerHTML = coursesHtml;
}

function showCourseDetails(courseId) {
    const course = database.courses.find(c => c.id === courseId);
    const enrollment = database.enrollments.find(e => e.studentId === database.currentUser.id && e.courseId === courseId);

    let curriculumHtml = '<ul class="curriculum-list">';
    course.curriculum.forEach(item => {
        curriculumHtml += `<li>${item}</li>`;
    });
    curriculumHtml += '</ul>';

    const detailsHtml = `
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Duration:</strong> ${course.duration} hours</p>
        <p><strong>Level:</strong> ${course.level}</p>
        <p><strong>Price:</strong> $${course.price}</p>
        <p><strong>Students Enrolled:</strong> ${course.students}</p>
        <p><strong>Description:</strong></p>
        <p>${course.description}</p>
        <p><strong>Curriculum:</strong></p>
        ${curriculumHtml}
    `;

    document.getElementById('courseDetails').innerHTML = detailsHtml;
    const enrollBtn = document.getElementById('enrollBtn');
    
    if (enrollment) {
        enrollBtn.style.display = 'none';
    } else {
        enrollBtn.style.display = 'block';
        enrollBtn.onclick = () => enrollCourse(courseId);
    }

    document.getElementById('courseModal').classList.add('active');
}

function enrollCourse(courseId = null) {
    const course = database.courses.find(c => c.id === courseId);
    if (!course) return;

    const newEnrollment = {
        id: Math.max(...database.enrollments.map(e => e.id), 0) + 1,
        studentId: database.currentUser.id,
        courseId: course.id,
        progress: 0,
        status: 'Enrolled',
        enrolledDate: new Date().toISOString().split('T')[0]
    };

    database.enrollments.push(newEnrollment);
    closeCourseModal();
    alert(`Successfully enrolled in ${course.name}!`);
    loadStudentDashboard();
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
}

// ===== ADMIN PANEL =====
function loadAdminDashboard() {
    const totalUsers = database.users.length;
    const totalCourses = database.courses.length;
    const totalEnrollments = database.enrollments.length;
    const totalRevenue = database.enrollments.length * 45; // Average price estimation

    const activeUsers = database.users.filter(u => u.status === 'Active').length;
    const inactiveUsers = database.users.filter(u => u.status === 'Inactive').length;

    const avgStudentProgress = database.enrollments.length > 0
        ? Math.round(database.enrollments.reduce((sum, e) => sum + e.progress, 0) / database.enrollments.length)
        : 0;

    const courseEnrollments = {};
    database.enrollments.forEach(e => {
        courseEnrollments[e.courseId] = (courseEnrollments[e.courseId] || 0) + 1;
    });
    const topCourse = Object.keys(courseEnrollments).reduce((a, b) =>
        courseEnrollments[a] > courseEnrollments[b] ? a : b, Object.keys(courseEnrollments)[0]);
    const topCourseData = database.courses.find(c => c.id === parseInt(topCourse));

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('totalEnrollments').textContent = totalEnrollments;
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('inactiveUsers').textContent = inactiveUsers;
    document.getElementById('avgStudentProgress').textContent = avgStudentProgress + '%';
    document.getElementById('topCourseEnrollments').textContent = topCourseData ? topCourseData.name : '-';
}

function loadAdminCourses() {
    let coursesHtml = '';
    database.courses.forEach(course => {
        const enrollmentCount = database.enrollments.filter(e => e.courseId === course.id).length;
        coursesHtml += `
            <tr>
                <td>${course.name}</td>
                <td>${course.instructor}</td>
                <td>$${course.price}</td>
                <td>${enrollmentCount}</td>
                <td>${course.level}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="editCourse(${course.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    document.getElementById('coursesList').innerHTML = coursesHtml;
}

function loadAdminUsers() {
    let usersHtml = '';
    database.users.forEach(user => {
        usersHtml += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>${user.joined}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="editUser(${user.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    document.getElementById('usersList').innerHTML = usersHtml;
}

function loadAdminEnrollments() {
    let enrollmentsHtml = '';
    database.enrollments.forEach(enrollment => {
        const student = database.users.find(u => u.id === enrollment.studentId);
        const course = database.courses.find(c => c.id === enrollment.courseId);
        enrollmentsHtml += `
            <tr>
                <td>${student.name}</td>
                <td>${course.name}</td>
                <td>
                    <div class="progress-bar" style="width: 100px;">
                        <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                    </div>
                    ${enrollment.progress}%
                </td>
                <td>${enrollment.status}</td>
                <td>${enrollment.enrolledDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="editProgress(${enrollment.id})">Update</button>
                        <button class="btn btn-danger" onclick="deleteEnrollment(${enrollment.id})">Remove</button>
                    </div>
                </td>
            </tr>
        `;
    });
    document.getElementById('enrollmentsList').innerHTML = enrollmentsHtml;
}

function loadAdminReports() {
    // Course Performance
    let coursePerformanceHtml = '';
    database.courses.forEach(course => {
        const courseEnrollments = database.enrollments.filter(e => e.courseId === course.id);
        const avgProgress
