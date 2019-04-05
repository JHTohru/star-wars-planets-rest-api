const { model, Schema } = require('mongoose');

const PlanetSchema = Schema(
    {
        climate: String,
        name: String,
        terrain: String,
    },
    {
        timestamps: true,
    },
);

PlanetSchema.index({ name: 'text' });

module.exports = model('Planet', PlanetSchema);

