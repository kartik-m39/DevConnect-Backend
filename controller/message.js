const Message = require('../models/messages');

async function createMessage(req, res) {
    const { message, senderId, projectOwnerId } = req.body;

    if (!message || !senderId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const msg = await Message.create({
            message,
            sender: senderId,
            receiver: receiverId,
            status: 'UNREAD'
        });

        return res.status(201).json({
            message: 'Message created successfully',
            msg
        });
    } catch (err) {
        console.error('Message creation error:', err);
        return res.status(500).json({ message: 'Failed to create message' });
    }
}

module.exports = {
    createMessage,
}