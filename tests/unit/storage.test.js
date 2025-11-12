const storage = require('../../src/services/storage');

beforeEach(() => {
  storage.reset();
  storage.seed();
});

test('should allow duplicate course title', () => {
  const result = storage.create('courses', { title: 'Math', teacher: 'Someone' });
  expect(result.title).toBe('Math');
});

test('should list seeded students', () => {
  const students = storage.list('students');
  expect(students.length).toBe(3);
  expect(students[0].name).toBe('Alice');
});

test('should create a new student', () => {
  const result = storage.create('students', { name: 'David', email: 'david@example.com' });
  expect(result.name).toBe('David');
  expect(storage.list('students').length).toBe(4);
});

test('should not allow duplicate student email', () => {
  const result = storage.create('students', { name: 'Eve', email: 'alice@example.com' });
  expect(result.error).toBe('Email must be unique');
});

test('should delete a student', () => {
  const students = storage.list('students');
  const result = storage.remove('students', students[0].id);
  expect(result).toBe(true);
});

test('should not delete non-existent student', () => {
  const result = storage.remove('students', 999);
  expect(result).toBe(false);
});

test('should not delete enrolled student', () => {
  storage.enroll(1, 1);
  const result = storage.remove('students', 1);
  expect(result).toEqual({ error: 'Cannot delete student: enrolled in a course' });
});

test('should enroll a student successfully', () => {
  const result = storage.enroll(1, 1);
  expect(result).toEqual({ success: true });
});

test('should not enroll non-existent course', () => {
  const result = storage.enroll(1, 999);
  expect(result).toEqual({ error: 'Course not found' });
});

test('should not enroll non-existent student', () => {
  const result = storage.enroll(999, 1);
  expect(result).toEqual({ error: 'Student not found' });
});

test('should not enroll same student twice', () => {
  storage.enroll(1, 1);
  const result = storage.enroll(1, 1);
  expect(result).toEqual({ error: 'Student already enrolled in this course' });
});

test('should unenroll successfully', () => {
  storage.enroll(1, 1);
  const result = storage.unenroll(1, 1);
  expect(result).toEqual({ success: true });
});

test('should not unenroll if not enrolled', () => {
  const result = storage.unenroll(1, 2);
  expect(result).toEqual({ error: 'Enrollment not found' });
});

test('should get student courses', () => {
  storage.enroll(1, 1);
  const result = storage.getStudentCourses(1);
  expect(result.length).toBe(1);
  expect(result[0].title).toBe('Math');
});

test('should get course students', () => {
  storage.enroll(1, 1);
  const result = storage.getCourseStudents(1);
  expect(result.length).toBe(1);
  expect(result[0].name).toBe('Alice');
});

test('should get a specific student by id', () => {
  const student = storage.get('students', 1);
  expect(student).toHaveProperty('name', 'Alice');
});

test('should return undefined for non-existent id', () => {
  const result = storage.get('students', 999);
  expect(result).toBeUndefined();
});

test('should reset data correctly', () => {
  storage.reset();
  expect(storage.list('students').length).toBe(0);
});
