const Planet = require('../models/planet.model');
const { getPlanetFilmsByPlanetName } = require('../swapi');

const formatPlanetDocument = async (planetDocument) => {
    const { climate, createdAt, _id: id, name, terrain, updatedAt } = planetDocument.toObject();
    const films = await getPlanetFilmsByPlanetName(name);

    return {
        name,
        id,
        climate,
        terrain,
        films,
        createdAt,
        updatedAt,
    };
};
const formatMultiplePlanetsDocuments = async planetsDocuments => Promise.all(planetsDocuments.map(async planet => formatPlanetDocument(planet)));

module.exports = {
    create: async (req, res) => {
        const { body: { climate, name, terrain } } = req;
        let errorMessage = '';

        if (!climate) {
            errorMessage = 'Invalid climate value.\n';
        }

        if (!name) {
            errorMessage += 'Invalid name value.\n';
        }

        if (!terrain) {
            errorMessage += 'Invalid terrain value';
        }

        if (errorMessage) {
            return res.status(400).send({ message: errorMessage });
        }

        const planet = new Planet({
            climate,
            name,
            terrain,
        });

        return planet
            .save()
            .then(async (planetDocument) => {
                const planet = await formatPlanetDocument(planetDocument);

                return res.send(planet);
            })
            .catch(err => res.status(500).send({ message: err.message || 'Some error occurred while creating the planet.'}));
    },
    fetchAll: async (req, res) => Planet
        .find()
        .then(planetsDocuments => formatMultiplePlanetsDocuments(planetsDocuments))
        .then(planets => res.send(planets))
        .catch(err => res.status(500).send({ message: err.message || 'Some error occurred while fetching planets.' })),
    findOneById: async (req, res) => Planet
        .findById(req.params.planetId)
        .then(async (planetDocument) => {
            if (!planetDocument) {
                return res.status(404).send({ message: `Planet not found with id ${req.params.planetId}`});
            }

            const planet = await formatPlanetDocument(planetDocument);

            return res.send(planet);
        })
        .catch((err) => {
            // if (err.kind === 'ObjectId') {
            //     return res.status(404).send({ message: `Planet not found with id ${req.params.planetId}`});
            // }

            return res.status(500).send({ message: `Error retrieving planet with id ${req.params.planetId}`});
        }),
    remove: async (req, res) => Planet
        .findByIdAndRemove(req.params.planetId)
        .then((planet) => {
            if (!planet) {
                return res.status(404).send({ message: `Planet not found with id ${req.params.planetId}`});
            }

            return res.send({ message: 'Planet deleted successfully.' });
        })
        .catch((err) => {
            // if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            //     return res.status(404).send({ message: `Planet not found with id ${req.params.planetId}` });
            // }

            return res.status(500).send({ message: `Could not delete planet with id ${req.params.planetId}` });
        }),
    search: async (req, res) => Planet
        .find({ name: { $regex: new RegExp(req.params.searchParam, 'gi') } })
        .then(async (planetsDocuments) => {
            if (!planetsDocuments.length) {
                return res.status(500).send({ message: `Planet not found with the search parameter "${req.params.searchParam}"`});
            }

            const planets = await formatMultiplePlanetsDocuments(planetsDocuments);

            return res.send(planets);
        })
        .catch(err => res.status(500).send({ message: err.message })),
};

