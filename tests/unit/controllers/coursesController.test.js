const coursesController = require('../../../src/controllers/coursesController');
const storage = require('../../../src/services/storage');

jest.mock('../../../src/services/storage');

beforeEach(() => {
  jest.clearAllMocks();
});

test('listCourses should return paginated courses', () => {
  storage.list.mockReturnValue([
    { id: 1, title: 'Math', teacher: 'John' },
    { id: 2, title: 'English', teacher: 'Emma' },
  ]);
  const req = { query: { page: 1, limit: 1 } };
  const res = { json: jest.fn() };
  coursesController.listCourses(req, res);
  expect(res.json).toHaveBeenCalledWith({
    courses: [{ id: 1, title: 'Math', teacher: 'John' }],
    total: 2,
  });
});

test('listCourses should filter by title', () => {
  storage.list.mockReturnValue([{ id: 1, title: 'Math', teacher: 'John' }]);
  const req = { query: { title: 'Math' } };
  const res = { json: jest.fn() };
  coursesController.listCourses(req, res);
  expect(res.json).toHaveBeenCalled();
});

test('getCourse should return 404 if not found', () => {
  storage.get.mockReturnValue(null);
  const req = { params: { id: 1 } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.getCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('getCourse should return course and students', () => {
  storage.get.mockReturnValue({ id: 1, title: 'Math' });
  storage.getCourseStudents.mockReturnValue([{ id: 1, name: 'Alice' }]);
  const req = { params: { id: 1 } };
  const res = { json: jest.fn() };
  coursesController.getCourse(req, res);
  expect(res.json).toHaveBeenCalledWith({
    course: { id: 1, title: 'Math' },
    students: [{ id: 1, name: 'Alice' }],
  });
});

test('createCourse should return 400 if missing data', () => {
  const req = { body: { title: '' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.createCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('createCourse should create course', () => {
  storage.create.mockReturnValue({ id: 1, title: 'Math', teacher: 'John' });
  const req = { body: { title: 'Math', teacher: 'John' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.createCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
});

test('deleteCourse should return 404 if not found', () => {
  storage.remove.mockReturnValue(false);
  const req = { params: { id: 1 } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.deleteCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('deleteCourse should return 400 if error', () => {
  storage.remove.mockReturnValue({ error: 'Cannot delete' });
  const req = { params: { id: 1 } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.deleteCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('deleteCourse should return 204 on success', () => {
  storage.remove.mockReturnValue(true);
  const req = { params: { id: 1 } };
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  coursesController.deleteCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(204);
});

test('updateCourse should return 404 if not found', () => {
  storage.get.mockReturnValue(null);
  const req = { params: { id: 1 }, body: {} };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.updateCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('updateCourse should return 400 if title not unique', () => {
  storage.get.mockReturnValue({ id: 1, title: 'Math' });
  storage.list.mockReturnValue([{ id: 2, title: 'Math' }]);
  const req = { params: { id: 1 }, body: { title: 'Math' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  coursesController.updateCourse(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('updateCourse should update title and teacher', () => {
  const course = { id: 1, title: 'Old', teacher: 'OldT' };
  storage.get.mockReturnValue(course);
  storage.list.mockReturnValue([{ id: 1, title: 'Old' }]);
  const req = { params: { id: 1 }, body: { title: 'New', teacher: 'NewT' } };
  const res = { json: jest.fn() };
  coursesController.updateCourse(req, res);
  expect(course.title).toBe('New');
  expect(course.teacher).toBe('NewT');
});
