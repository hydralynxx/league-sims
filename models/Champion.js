const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    health: Number,
    mana: Number,
    health_regen: Number,
    mana_regen: Number,
    armor: Number,
    magic_resist: Number,
    attack_damage: Number,
    ability_power: Number,
    crit_damage: Number,
    base_as: Number,
    as_ratio: Number,
    bonus_as: Number,
    adaptive_type: String
});

const ChampionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    urlName: {
        type: String,
        required: true
    },
    stats: {
        1: statsSchema,
        2: statsSchema,
        3: statsSchema,
        4: statsSchema,
        5: statsSchema,
        6: statsSchema,
        7: statsSchema,
        8: statsSchema,
        9: statsSchema,
        10: statsSchema,
        11: statsSchema,
        12: statsSchema,
        13: statsSchema,
        14: statsSchema,
        15: statsSchema,
        16: statsSchema,
        17: statsSchema,
        18: statsSchema,
    }
});

module.exports = mongoose.model('Champion', ChampionSchema);