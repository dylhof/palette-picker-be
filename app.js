const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').where('id', id)
    .then(palettes => {
      if(palettes.length) {
        return response.status(200).json(palettes[0])
      } else {
        return response.status(404).json(`Sorry! A palette with id ${id} was not found.`)
      }
    })
    .catch(error => response.status(500).json({ error }));
})

app.get('/api/v1/projects/:id', (request, response) => {
  const id = parseInt(request.params.id)
  database('projects').where('id', id)
    .then(projects => {
      if(projects.length) {
        return response.status(200).json(projects[0])
      } else {
        return response.status(404).json(`Sorry! A project with id ${id} was not found.`)
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const id = parseInt(request.params.id);
  database('projects').where('id', id)
    .then(projects => {
       if(!projects.length) {
         return response.status(404).json(`Sorry! A project with id ${id} was not found.`)
       } 
    })
    .then(() => {
      database('palettes').where('project_id', id)
        .then(palettes => {return response.status(200).json(palettes)})
        .catch(error => { return response.status(500).json({ error })});
    })
    .catch(error => {return response.status(500).json({ error })});
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if(!project.name) {
    return response.status(422).json('Every project needs a name!')
  }
  database('projects').where('name', project.name)
    .then(projects => {
      if(projects.length){
        return response.status(409).json('Project name already exists.')
      } 
      database('projects').insert(project, 'id')
        .then(projectIds => response.status(201).json({ id: projectIds[0] }))
        .catch(error => response.status(500).json({ error }))
    })
  .catch(error => {return response.status(500).json({ error })})
    
})

module.exports = app;