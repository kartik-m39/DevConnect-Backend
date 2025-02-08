const Project = require("../models/project");

async function createProject(req, res) {
    const { name, technologies, description } = req.body;
    
    if(!name || !technologies || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const project = await Project.create({
            name,
            technologies,
            description,
            userId: req.user._id
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (err) {
        console.error('Project creation error:', err);
        return res.status(500).json({ message: "Failed to create project" });
    }
}

async function getProjects(req, res) {
    try {
        const projects = await Project.find({})
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        return res.json({ projects });
    } catch (err) {
        console.error('Error fetching projects:', err);
        return res.status(500).json({ message: "Failed to fetch projects" });
    }
}

module.exports = {
    createProject,
    getProjects
};