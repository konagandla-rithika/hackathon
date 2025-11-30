const express = require('express');
const { body } = require('express-validator');
const Message = require('../models/Message');
const validationHandler = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters'),
    body('phone').optional().trim()
  ],
  validationHandler,
  async (req, res, next) => {
    try {
      const message = await Message.create(req.body);
      res.status(201).json({ ok: true, messageId: message._id });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get all contact messages (admin only)
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
