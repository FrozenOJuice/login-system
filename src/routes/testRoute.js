const express = require('express');
const router = express.Router();
const sanitizeInput = require('../middleware/sanitizeInput');

router.post('/sanitize-test', sanitizeInput, (req, res) => {
    // Echo back the sanitized body
    res.json({
        original: req.body,
    });
});

module.exports = router;
