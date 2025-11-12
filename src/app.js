const express = require('express');
const swaggerUi = require('swagger-ui-express');
const studentsRoutes = require('./routes/students');
const coursesRoutes = require('./routes/courses');

const swaggerFile = require('../swagger.json');
const app = express();
app.use(express.json());

const storage = require('./services/storage');
storage.seed();

app.use('/students', studentsRoutes);
app.use('/courses', coursesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
