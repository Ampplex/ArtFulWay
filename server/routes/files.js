// Create this file in your routes folder (e.g., server/routes/files.js)
const express = require('express');
const router = express.Router();
const { getObjectURL } = require('../services/s3/index');

// API endpoint to get signed URLs for S3 objects
router.get('/getSignedUrl', async (req, res) => {
  try {
    const { key } = req.query;
    
    if (!key) {
      return res.status(400).json({ 
        success: false, 
        message: 'File key is required' 
      });
    }
    
    const url = await getObjectURL(key);

    console.log('Generated signed URL:', url);
    
    res.json({ 
      success: true, 
      url 
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate file URL' 
    });
  }
});

module.exports = router;