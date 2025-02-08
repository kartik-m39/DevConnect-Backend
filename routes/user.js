const express = require("express");
const { handleSignUp,handleLogin } = require("../controller/user");

const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Failed to logout' });
    }
});

module.exports = router;