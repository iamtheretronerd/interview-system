const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Admin endpoints
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const res = await fetch(`${API_URL}/admin/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
};

export const getKnowledgebaseStatus = async () => {
  const res = await fetch(`${API_URL}/admin/knowledgebase`);
  return res.json();
};

export const getApplicants = async () => {
  const res = await fetch(`${API_URL}/admin/applicants`);
  return res.json();
};

export const getApplicantById = async (id) => {
  const res = await fetch(`${API_URL}/admin/applicants/${id}`);
  return res.json();
};

// Interview endpoints
export const startInterview = async () => {
  const res = await fetch(`${API_URL}/interview/start`, {
    method: 'POST',
  });
  return res.json();
};

export const sendMessage = async (sessionId, message) => {
  const res = await fetch(`${API_URL}/interview/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
  });
  return res.json();
};

export const endInterview = async (sessionId) => {
  const res = await fetch(`${API_URL}/interview/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  return res.json();
};