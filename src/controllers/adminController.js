const { saveKnowledgebase, getKnowledgebase } = require('../services/knowledgebaseService');
const { getAllApplicants, getApplicantById } = require('../services/applicantService');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

const uploadPDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const { extractText } = await import('unpdf');
  const uint8Array = new Uint8Array(req.file.buffer);
  const result = await extractText(uint8Array);
  
  // Handle different response formats
  let text = '';
  if (typeof result === 'string') {
    text = result;
  } else if (result && typeof result.text === 'string') {
    text = result.text;
  } else if (result && Array.isArray(result.text)) {
    text = result.text.join('\n');
  } else if (result && Array.isArray(result.pages)) {
    text = result.pages.join('\n');
  } else {
    console.log('PDF extraction result:', result);
    throw new AppError('Could not extract text from PDF', 400);
  }

  if (!text || text.trim().length === 0) {
    throw new AppError('PDF appears to be empty or contains no readable text', 400);
  }

  const saved = await saveKnowledgebase({
    filename: req.file.originalname,
    content: text
  });

  res.status(200).json({
    success: true,
    message: 'PDF uploaded successfully',
    filename: saved.filename,
    uploadedAt: saved.uploadedAt
  });
});

const getKnowledgebaseStatus = asyncHandler(async (req, res) => {
  const kb = await getKnowledgebase();

  if (!kb) {
    return res.status(200).json({ success: true, uploaded: false });
  }

  res.status(200).json({
    success: true,
    uploaded: true,
    filename: kb.filename,
    uploadedAt: kb.uploadedAt
  });
});

const getApplicants = asyncHandler(async (req, res) => {
  const applicants = await getAllApplicants();
  
  res.status(200).json({
    success: true,
    count: applicants.length,
    data: applicants
  });
});

const getApplicant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const applicant = await getApplicantById(id);

  if (!applicant) {
    throw new AppError('Applicant not found', 404);
  }

  res.status(200).json({
    success: true,
    data: applicant
  });
});

module.exports = {
  uploadPDF,
  getKnowledgebaseStatus,
  getApplicants,
  getApplicant
};