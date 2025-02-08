const express = require("express");
const { createProject, getProjects } = require("../controller/project.js");
const { checkForAuth } = require("../middleware/auth");
const Project = require("../models/project.js");

const router = express.Router();

router.post("/create", checkForAuth, createProject);
router.get("/", checkForAuth, getProjects);

router.patch("/:id/status", checkForAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
    
        if (req.user.role !== 'CLIENT') {
            return res.status(403).json({ message: 'Only clients can update project status' });
        }

        const project = await Project.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ message: 'Failed to update project status' });
    }
});

module.exports = router;