const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const projects = require('./paletteData');

describe('server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('GET /projects', () => {
    it('should return all projects in the db', async () => {
      //setup
      const numExpectedProjects = projects.length;
      //execution
      const response = await request(app).get('/api/v1/projects');
      const result = response.body;
      //expectation
      expect(result.length).toEqual(numExpectedProjects);
    });
  });

  describe('GET /palette/:id', () => {
    it('should return a specific palette from the db', async () => {
      //setup
      let expectedPalette = await database('palettes').first();
      const id = expectedPalette.id;
      //execution
      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const palette = response.body;
      //expectation
      expect(palette.name).toEqual(expectedPalette.name);
    });
  });
})
