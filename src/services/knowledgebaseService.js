const { getDB } = require("../config/db");

const getCollection = () => getDB().collection("knowledgebase");

const saveKnowledgebase = async (data) => {
  await getCollection().deleteMany({});

  const knowledgebase = {
    filename: data.filename,
    content: data.content,
    uploadedAt: new Date(),
  };

  const result = await getCollection().insertOne(knowledgebase);
  return { ...knowledgebase, _id: result.insertedId };
};

const getKnowledgebase = async () => {
  return await getCollection().findOne({});
};

const deleteKnowledgebase = async () => {
  return await getCollection().deleteMany({});
};

module.exports = {
  saveKnowledgebase,
  getKnowledgebase,
  deleteKnowledgebase,
};
