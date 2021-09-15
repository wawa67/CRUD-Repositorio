const express = require("express");

const { v4: uuidv4, validate } = require("uuid");

const app = express();

app.use(express.json());

function checkExistsRepositories(request,response,next){
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository || !validate(id,4)) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkExistsRepositories, (request, response) => {
  const {title,url,techs} = request.body;

  const {repository} = request

  if(title != null && title != ''){
    repository.title = title 
  }
  if(url != null && url != ''){
    repository.url = url
  }

  if(techs != null && techs != ''){
    repository.techs = techs
  }

  return response.json(repository);
});

app.delete("/repositories/:id",checkExistsRepositories, (request, response) => {
  const {repository} = request

  const index = repositories.indexOf(repository)
  
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkExistsRepositories, (request, response) => {
  const {repository} = request

  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
