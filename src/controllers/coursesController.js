const storage = require('../services/storage');

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Liste des cours
 *     responses:
 *       200:
 *         description: OK
 */
exports.listCourses = (req, res) => {
  let courses = storage.list('courses');
  const { title, teacher, page = 1, limit = 10 } = req.query;
  if (title) {
    courses = courses.filter((c) => c.title.includes(title));
  }
  if (teacher) {
    courses = courses.filter((c) => c.teacher.includes(teacher));
  }
  const start = (page - 1) * limit;
  const paginated = courses.slice(start, start + Number(limit));
  res.json({ courses: paginated, total: courses.length });
};

exports.getCourse = (req, res) => {
  const course = storage.get('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const students = storage.getCourseStudents(req.params.id);
  return res.json({ course, students });
};

exports.createCourse = (req, res) => {
  const { title, teacher } = req.body;
  if (!title || !teacher) {
    return res.status(400).json({ error: 'title and teacher required' });
  }
  const created = storage.create('courses', { title, teacher });
  return res.status(201).json(created);
};

exports.deleteCourse = (req, res) => {
  const result = storage.remove('courses', req.params.id);
  if (result === false) {
    return res.status(404).json({ error: 'Course not found' });
  }
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(204).send();
};

exports.updateCourse = (req, res) => {
  const course = storage.get('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { title, teacher } = req.body;
  if (title && storage.list('courses').find((c) => c.title === title && c.id !== course.id)) {
    return res.status(400).json({ error: 'Course title must be unique' });
  }
  if (title) {
    course.title = title;
  }
  if (teacher) {
    course.teacher = teacher;
  }
  return res.json(course);
};
