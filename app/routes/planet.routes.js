const {
    create: createPlanet,
    remove: removePlanet,
    fetchAll: fetchAllPlanets,
    findOneById: findOnePlanetById,
    search: searchPlanet,
} = require('../controllers/planet.controller');

module.exports = (app) => {
    app.post('/planets', createPlanet);
    app.get('/planets', fetchAllPlanets);
    app.get('/planets/:planetId', findOnePlanetById);
    app.get('/planets/search/:searchParam', searchPlanet);
    app.delete('/planets/:planetId', removePlanet);
};

