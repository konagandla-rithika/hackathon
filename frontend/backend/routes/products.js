const express = require('express');
const { body } = require('express-validator');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');
const validationHandler = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().populate('farmerId', 'username');
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmerId', 'username');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (farmer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Product name required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('category').isIn(['pickle', 'oil', 'snacks', 'spices', 'other']).optional()
  ],
  validationHandler,
  async (req, res, next) => {
    try {
      const { name, description, price, category, stock, image } = req.body;
      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock: stock || 0,
        image,
        farmerId: req.userId
      });
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product (farmer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.farmerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (farmer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.farmerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
