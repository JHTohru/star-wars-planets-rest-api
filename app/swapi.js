const fetch = require('node-fetch');

const swapiBaseURL = 'https://swapi.co/api/';
const getPlanetByName = async (planetName) => {
    const searchResults = [];
    let url = `${swapiBaseURL}planets?search=${planetName}`;

    do {
        const { next, results } = await fetch(url)
            .then(res => res.json())
            .catch(err => console.error(err));

        searchResults.push(...results);

        url = next;
    } while (url);

    return searchResults.find(({ name }) => name.toLowerCase() === planetName.trim().toLowerCase());
};
const getPlanetFilmsByPlanetName = async (planetName) => {
    const planet = await getPlanetByName(planetName);

    if (planet) {
        return Promise.all(
            planet.films.map(
                swapiFilmUrl => fetch(swapiFilmUrl)
                    .then(res => res.json())
                    .then(({ title }) => title)
                    .catch(err => console.error(err))
            )  
        )
        .catch(err => console.error(err));
    }

    return [];
};

module.exports = {
    getPlanetFilmsByPlanetName,
};

