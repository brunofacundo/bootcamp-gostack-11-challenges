const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const repositories = [];
const app = express();

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', (request, response, next) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);
    if (repositoryIndex < 0) {
        return response.status(400).send('Repository not found');
    }

    return next();
});

app.get('/repositories', (request, response) => {
    return response.json(repositories);
});

app.post('/repositories', (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    };
    repositories.push(repository);

    return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);
    const repository = {
        ...repositories[repositoryIndex],
        title,
        url,
        techs
    };
    repositories[repositoryIndex] = repository;

    return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);
    repositories.splice(repositoryIndex, 1);

    return response.status(204).json();
});

app.post('/repositories/:id/like', (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);
    repositories[repositoryIndex].likes++;

    return response.json(repositories[repositoryIndex]);
});

module.exports = app;
