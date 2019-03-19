const projects = require('../../../paletteData')

const createProject = (knex, project) => {
  return knex('projects').insert({name: project.name}, 'id')
    .then(projectIds => {
      let palettePromises = []
      project.palettes.forEach(palette => {
        palettePromises.push(
          createPalettes(knex, {
            ...palette, 
            project_id: projectIds[0]
          })
        )
      });
      return Promise.all(palettePromises)
    })
};

const createPalettes = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = []
      projects.forEach(project => {
        projectPromises.push(createProject(knex, project))
      })
      return Promise.all(projectPromises)
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
