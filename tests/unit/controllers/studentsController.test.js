const studentsController = require('../../../src/controllers/studentsController');
const storage = require('../../../src/services/storage');

jest.mock('../../../src/services/storage');

describe('studentsController', () => {
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn().mockReturnValue(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  test('listStudents should filter by name', () => {
    storage.list.mockReturnValue([
      { name: 'Alice', email: 'a@a.com' },
      { name: 'Bob', email: 'b@b.com' },
    ]);
    const req = { query: { name: 'Alice' } };
    studentsController.listStudents(req, res);
    expect(res.json).toHaveBeenCalledWith({
      students: [{ name: 'Alice', email: 'a@a.com' }],
      total: 1,
    });
  });

  test('getStudent should return 404 if not found', () => {
    storage.get.mockReturnValue(null);
    const req = { params: { id: 99 } };
    studentsController.getStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
  });

  test('createStudent should return 400 if missing fields', () => {
    const req = { body: { name: '' } };
    studentsController.createStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'name and email required' });
  });

  test('deleteStudent should return 404 if student not found', () => {
    storage.remove.mockReturnValue(false);
    const req = { params: { id: 1 } };
    studentsController.deleteStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
  });

  test('updateStudent should return 404 if student not found', () => {
    storage.get.mockReturnValue(undefined);
    const req = { params: { id: 1 }, body: {} };
    studentsController.updateStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
  });
});
