const express = require('express'); 
const sapControl = require('../controllers/sapController');

// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------

const router = express.Router();

router.get('/', sapControl.renderTool);
router.get('/htmlversion', sapControl.createHTMLversion);
router.get('/pdf/50000', sapControl.generatePDF);

module.exports = router; 
