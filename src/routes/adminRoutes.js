const express = require('express');
const multer = require('multer');
const { validate } = require('../middleware/validators');
const {
  uploadPDF,
  getKnowledgebaseStatus,
  getApplicants,
  getApplicant
} = require('../controllers/adminController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isPDF = file.mimetype === 'application/pdf' || 
                  file.originalname.toLowerCase().endsWith('.pdf');
    if (isPDF) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 } // 5MB limit
});


router.post('/upload', upload.single('pdf'), uploadPDF);

router.get('/knowledgebase', getKnowledgebaseStatus);

router.get('/applicants', getApplicants);
router.get('/applicants/:id', validate('mongoId'), getApplicant);

module.exports = router;