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

  describe('POST /projects', () => {
    it('should add a project to the db and return status 201 and an id', async () => {
      //setup
      const newProject = { name: 'Awesome Project' };

      //execution
      const response = await request(app).post(`/api/v1/projects`).send(newProject);
      const projects = await database('projects').where('id', response.body.id);
      const project = projects[0];

      //expectation
      expect(response.status).toBe(201);
      expect(project.name).toEqual(newProject.name);
    });

    it('should return a status of 422 and a message if the project does not have a name', async () => {
      //setup
      const newProject = {name: ''};
      const expectedMessage = 'Every project needs a name!';

      //execution
      const response = await request(app).post('/api/v1/projects').send(newProject);
      
      //expectation
      expect(response.status).toBe(422);
      expect(response.body).toEqual(expectedMessage);
    });

    it('should return a status of 409 and a message if the name is a duplicate', async () => {
      //setup
      const existingProject = projects[0];
      const nameToTry = existingProject.name;
      const newProject = { name: nameToTry };
      const expectedMessage = 'Project name already exists.';

      //execution
      const response = await request(app).post('/api/v1/projects').send(newProject);

      //expectation
      expect(response.status).toBe(409);
      expect(response.body).toEqual(expectedMessage);
    });
  });

  describe('POST /palettes', () => {
    it('should add a palette to the db and return an id', async () => {
      //setup
      const project = await database('projects').first();
      const projectId = project.id;
      const newPalette = {
        name: 'Pretty Colors',
        color1: '#3hd95j',
        color2: '#39dhu7',
        color3: '#102e9c',
        color4: '#936kd4',
        color5: '#9shj27',
        project_id: projectId
      };

      //execution
      const response = await request(app).post('/api/v1/palettes').send(newPalette);
      const palettes = await database('palettes').where('id', response.body.id);
      const palette = palettes[0];
      //expectation
      expect(response.status).toBe(201);
      expect(palette.name).toEqual(newPalette.name);
    });

    it('should return status 422 and a message if missing params', async () => {
      //setup
      const project = await database('projects').first();
      const projectId = project.id;
      const newPalette = {
        color1: '#3hd95j',
        color2: '#39dhu7',
        color3: '#102e9c',
        color4: '#936kd4',
        color5: '#9shj27',
        project_id: projectId
      };
      const expectedMessage = `Expected format: { 
          name: <String>, 
          color1: <String>, 
          color2: <String>, 
          color3: <String>, 
          color4: <String>, 
          color5: <String>,
          project_id: <Integer>
        }. You're missing a name property`;

      //execution
      const response = await request(app).post('/api/v1/palettes').send(newPalette);

      //expectation
      expect(response.status).toBe(422);
      expect(response.body).toEqual(expectedMessage);
    });

    it('should return a status of 412 and a message if no matching project id', async () => {
      //setup
      const newPalette = {
        name: 'Pretty Colors',
        color1: '#3hd95j',
        color2: '#39dhu7',
        color3: '#102e9c',
        color4: '#936kd4',
        color5: '#9shj27',
        project_id: "0"
      };
      const expectedMessage = 'Cannot add a palette without a project. No project exists with id: 0';

      //execution
      const response = await request(app).post('/api/v1/palettes').send(newPalette);

      //expectation
      expect(response.status).toBe(412);
      expect(response.body).toEqual(expectedMessage);
    });
  });

  describe('PUT /projects/:id', () => {
    it('should update a specific project in the db', async () => {
      //setup
      const projectToUpdate = await database('projects').first();
      const id = projectToUpdate.id;
      const updatedProject = { name: 'Fancy project name'};

      //execution
      const response = await request(app).put(`/api/v1/projects/${id}`).send(updatedProject);
      const results = await database('projects').where('id', id);
      const project = results[0];

      //expectation
      expect(response.status).toBe(204);
      expect(project.name).toEqual(updatedProject.name);
    });

    it('should return a status 404 and a message if no project with id exists in db', async () => {
      //setup
      const updatedProject = { name: 'Fancy project name'};
      const expectedMessage = 'No project exists with the id 0';

      //execution
      const response = await request(app).put(`/api/v1/projects/0`).send(updatedProject);

      //expectation
      expect(response.status).toBe(404);
      expect(response.body).toEqual(expectedMessage);
    });

    it('should return a status of 409 and a message if project name already exists', async () => {
      //setup
      const existingProject = await database('projects').first();
      const updatedProject = { name: existingProject.name };
      const id = existingProject.id++;
      const expectedMessage = 'Project name already exists.';

      //execution
      const response = await request(app).put(`/api/v1/projects/${id}`).send(updatedProject);

      //expectation
      expect(response.status).toBe(409);
      expect(response.body).toEqual(expectedMessage);
    });
  });

  describe('PUT /palettes/:id', () => {
    it('should update a specific palette it the db', async () => {
      //setup
      const paletteToUpdate = await database('palettes').first();
      const id = paletteToUpdate.id;
      const updatedPalette = {
        name: 'Pretty Colors',
        color1: '#3hd95j',
        color2: '#39dhu7',
        color3: '#102e9c',
        color4: '#936kd4',
        color5: '#9shj27',
        project_id: paletteToUpdate.project_id
      };
      //execution
      const response = await request(app).put(`/api/v1/palettes/${id}`).send(updatedPalette);
      const results = await database('palettes').where('id', id);
      const palette = results[0];

      //expectation
      expect(response.status).toBe(204);
      expect(palette.name).toEqual(updatedPalette.name);
      expect(palette.color4).toEqual(updatedPalette.color4);
    });

    it('should return a status of 404 and a message if no palette with id exisits in db', async() => {
      //setup
      const expectedMessage = 'No palette exists with the id: 0';
      const updatedPalette = {
        name: 'Pretty Colors',
        color1: '#3hd95j',
        color2: '#39dhu7',
        color3: '#102e9c',
        color4: '#936kd4',
        color5: '#9shj27',
        project_id: 0
      };
      //execution
      const response = await request(app).put('/api/v1/palettes/0').send(updatedPalette);
    
      //expectation
      expect(response.status).toBe(404);

      expect(response.body).toEqual(expectedMessage);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete a specific project and associated palettes from the db', async () => {
      //setup
      const projectToDelete = await database('projects').first();
      const id = projectToDelete.id;
      
      //execution
      const response = await request(app).delete(`/api/v1/projects/${id}`);
      const results = await database('projects').where('id', id);
      const assocPalettes = await database('palettes').where('project_id', id);
      
      //expectation
      expect(response.status).toBe(204);
      expect(results.length).toBe(0);
      expect(assocPalettes.length).toBe(0);
    });

    it('should return a 404 and a message if there is no project with id in db', async () => {
      //setup
      const id = 0;
      const expectedMessage = `No project exists with id: ${id}.`;

      //execution
      const response = await request(app).delete(`/api/v1/projects/${id}`);
    
      //expectation
      expect(response.status).toBe(404);
      expect(response.body).toEqual(expectedMessage);
    });
  });

  describe('DELETE /palettes/:id', () => {
    it('should delete a specific palette from the db', async () => {
      //setup
      const paletteToDelete = await database('palettes').first();
      const id = paletteToDelete.id;

      //execution
      const response = await request(app).delete(`/api/v1/palettes/${id}`);
      const results = await database('palettes').where('id', id);

      //expectation
      expect(response.status).toBe(204);
      expect(results.length).toBe(0);
    });

    it('should return a 404 and a message if there is no palette with id in db', async () => {
      //setup
      const id = 0;
      const expectedMessage = `No palette exists with id: ${id}`;

      //execution
      const response = await request(app).delete(`/api/v1/palettes/${id}`);

      //expectation
      expect(response.status).toBe(404);
      expect(response.body).toEqual(expectedMessage);
    });
  });
});