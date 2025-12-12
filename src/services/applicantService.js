const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getCollection = () => getDB().collection("applicants");

const createApplicant = async (data) => {
  const applicant = {
    studentName: data.studentName || "Anonymous",
    program: data.program,
    outcome: data.outcome,
    ruleSummary: data.ruleSummary,
    transcript: data.transcript || [],
    createdAt: new Date(),
  };

  const result = await getCollection().insertOne(applicant);
  return { ...applicant, _id: result.insertedId };
};

const getAllApplicants = async () => {
  return await getCollection().find({}).sort({ createdAt: -1 }).toArray();
};

const getApplicantById = async (id) => {
  return await getCollection().findOne({ _id: new ObjectId(id) });
};

const updateApplicant = async (id, data) => {
  const result = await getCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
  return result;
};

module.exports = {
  createApplicant,
  getAllApplicants,
  getApplicantById,
  updateApplicant,
};
