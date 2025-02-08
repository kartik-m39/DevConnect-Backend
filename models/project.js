const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    technologies: {
        type: Array,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: String,
        enum: ['OPEN', 'DONE'],
        default: 'OPEN'
    },

},{timestamps: true});

const Project = mongoose.model('project', projectSchema);

module.exports = Project;