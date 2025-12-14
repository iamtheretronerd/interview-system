const { ChatGroq } = require('@langchain/groq');
const { HumanMessage, SystemMessage, AIMessage } = require('@langchain/core/messages');

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7
});

const buildSystemPrompt = (knowledgebase) => {
  return `You are "Falcon", the admissions assistant for Falcon University.

## YOUR KNOWLEDGEBASE:
${knowledgebase}

## YOUR JOB:
1. Interview prospective students to collect information needed to determine their eligibility
2. Ask questions based ONLY on the requirements in YOUR KNOWLEDGEBASE above
3. Evaluate their eligibility based ONLY on the rules in YOUR KNOWLEDGEBASE above

## INTERVIEW RULES:
- First, greet the student and ask for their name
- Then ask which program they are applying for
- Ask questions ONE AT A TIME based on what YOUR KNOWLEDGEBASE requires for that program
- Only ask questions that are relevant to the requirements in YOUR KNOWLEDGEBASE
- Be friendly and conversational
- Keep responses concise

## IMPORTANT:
- Do NOT make up requirements that are not in YOUR KNOWLEDGEBASE
- Do NOT skip requirements that ARE in YOUR KNOWLEDGEBASE
- If the knowledgebase mentions a requirement, you MUST ask about it
- If something is NOT in the knowledgebase, do NOT ask about it

## WHEN YOU HAVE COLLECTED ALL REQUIRED INFORMATION:
Evaluate the student against the requirements in YOUR KNOWLEDGEBASE, then respond with:
1. A friendly message explaining the result
2. A JSON block at the end in this exact format:

IMPORTANT: DO not mention you will be returning a JSON block at the end. Just return the JSON block
and mention the interview will end after this.

\`\`\`json
{
  "completed": true,
  "studentName": "Student's Name",
  "program": "Program Name",
  "outcome": "Meets Criteria" or "Criteria Not Met",
  "ruleSummary": "Brief explanation of which requirements were met or not met based on YOUR KNOWLEDGEBASE"
}
\`\`\`

During the interview (before final decision), do NOT include any JSON. Just respond naturally.`;
};

const convertTranscriptToMessages = (transcript) => {
  return transcript.map(msg => {
    if (msg.role === 'assistant') {
      return new AIMessage(msg.message);
    } else {
      return new HumanMessage(msg.message);
    }
  });
};

const chat = async (transcript, knowledgebase) => {
  const systemPrompt = buildSystemPrompt(knowledgebase);
  const messages = [
    new SystemMessage(systemPrompt),
    ...convertTranscriptToMessages(transcript)
  ];

  const response = await llm.invoke(messages);
  return response.content;
};

const extractDecision = (message) => {
  // Check if message contains JSON block
  const jsonMatch = message.match(/```json\s*([\s\S]*?)\s*```/);
  
  if (!jsonMatch) {
    return { completed: false };
  }

  try {
    const data = JSON.parse(jsonMatch[1]);
    
    if (data.completed) {
      // Remove JSON block from message for display
      const cleanMessage = message.replace(/```json[\s\S]*?```/, '').trim();
      
      return {
        completed: true,
        studentName: data.studentName || 'Anonymous',
        program: data.program || 'Unknown',
        outcome: data.outcome || 'Criteria Not Met',
        ruleSummary: data.ruleSummary || '',
        displayMessage: cleanMessage
      };
    }
  } catch (error) {
    console.error('Failed to parse JSON from LLM:', error);
  }

  return { completed: false };
};

module.exports = {
  chat,
  extractDecision
};