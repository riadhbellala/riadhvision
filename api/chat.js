import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Read the context file from the project root
    const contextPath = path.join(process.cwd(), 'portfolio_context.txt');
    const portfolioContext = fs.readFileSync(contextPath, 'utf8');

    // Parse incoming request body
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare the system prompt
    const systemPrompt = `You are a friendly personal assistant embedded in Riadh's portfolio website. You speak like a real human — warm, natural, and conversational. Answer questions about Riadh based only on the context provided. If you don't know something, say so honestly and suggest contacting Riadh directly. Never make up information. Context: ${portfolioContext}`;

    // Construct the messages array for the Groq API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call the Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      return res.status(500).json({ error: 'Failed to fetch response from AI provider.' });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Return the response
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
