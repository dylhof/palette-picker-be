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
      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.id;
      //execution
      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const palette = response.body;
      //expectation
      expect(palette.name).toEqual(expectedPalette.name);
    });

    it('should return a status of 404 and error msg if pallet is not in db', async () => {
      //setup
      const id = 0;
      const expectedErrorMsg = `Sorry! A palette with id ${id} was not found.`;
      //execution
      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const errorMsg = response.body;
      const status = response.status;
      //expectation
      expect(errorMsg).toEqual(expectedErrorMsg);
      expect(status).toBe(404);
    });
  });

  describe('GET /projects/:id', () => {
    it('should return a specific project from the db', async () => {
      //setup
      const expectedProject = await database('projects').first();
      const id = expectedProject.id;
      //execution
      const response = await request(app).get(`/api/v1/projects/${id}`);
      const project = response.body;
      //expectation
      expect(project.name).toEqual(expectedProject.name);
    });

    it('should return a status of 404 and error msg if project is not in db', async () => {
      //setup
      const id = 0;
      const expectedErrorMsg = `Sorry! A project with id ${id} was not found.`;
      //execution
      const response = await request(app).get(`/api/v1/projects/${id}`);
      const errorMsg = response.body;
      const status = response.status;
      //expectation
      expect(errorMsg).toEqual(expectedErrorMsg);
      expect(status).toBe(404);
    });
  });

  describe('GET /projects/:id/palettes', () => {
    it('should return all palettes for a project that is in db', async () => {
      //setup
      const expectedProject = await database('projects').first();
      const projectId = expectedProject.id; 
      const numPalettesExpected = projects.find(project => { 
        return project.name === expectedProject.name 
      }).palettes.length;
      
      //execution
      const response = await request(app).get(`/api/v1/projects/${projectId}/palettes`);
      const palettes = response.body;

      //expectation
      expect(palettes.length).toEqual(numPalettesExpected);
    });

    it('should return a status of 404 and error msg if project is not in db', async () => {
      //setup
      const id = 0;
      const expectedErrorMsg = `Sorry! A project with id ${id} was not found.`;
      
      //execution
      const response = await request(app).get(`/api/v1/projects/${id}/palettes`);
      const errorMsg = response.body;
      const status = response.status;

      //expectation
      expect(errorMsg).toEqual(expectedErrorMsg);
      expect(status).toBe(404);
    });
  });
});