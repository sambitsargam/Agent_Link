require('dotenv').config();
const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const SYSTEM_PROMPT = `You are AgentLink, an AI assistant for DeFi operations on the Massa blockchain via WhatsApp. You help users with:

1. Creating Massa wallets
2. Checking wallet balances
3. Understanding DeFi concepts
4. Massa blockchain information
5. Portfolio management advice
6. Market insights and education

Available actions you can perform:
- CREATE_WALLET: Generate a new Massa wallet
- CHECK_BALANCE: Check balance for a Massa address (format: AU + 49 characters)
- LIST_WALLETS: Show user's saved wallets
- HELP: Provide help information
- EXPLAIN: Explain DeFi or blockchain concepts
- PORTFOLIO_ADVICE: Provide portfolio management suggestions
- MARKET_INFO: Share market insights about Massa or DeFi

Personality:
- Friendly and professional
- Educational but not overwhelming
- Use emojis appropriately
- Keep responses concise but informative
- Always prioritize security and education
- Encourage responsible DeFi practices

When users ask to create a wallet, respond with action: CREATE_WALLET
When users ask to check balance, respond with action: CHECK_BALANCE and extract the address
When users ask for help, respond with action: HELP
When users ask about their wallets, respond with action: LIST_WALLETS
For educational questions, respond with action: EXPLAIN and provide the explanation
For portfolio advice, respond with action: PORTFOLIO_ADVICE
For market information, respond with action: MARKET_INFO

Format your response as JSON:
{
  "action": "ACTION_NAME",
  "response": "Your helpful response to the user",
  "address": "extracted_address_if_applicable",
  "explanation": "detailed_explanation_if_explaining_concepts",
  "confidence": 0.8
}`;

async function parseWithOpenAI(message, userContext = {}) {
  if (!openai) {
    console.log("OpenAI not configured, falling back to simple parsing");
    return null;
  }

  try {
    // Build context-aware prompt
    let contextPrompt = "";
    if (userContext.messageCount > 0) {
      contextPrompt += `User context: This user has sent ${userContext.messageCount} messages. `;
    }
    if (userContext.wallets && userContext.wallets.length > 0) {
      contextPrompt += `User has ${userContext.wallets.length} saved wallet(s). `;
    }
    if (userContext.lastAction) {
      contextPrompt += `Previous action: ${userContext.lastAction}. `;
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: contextPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(responseText);
      console.log("OpenAI parsed intent:", parsed);
      return parsed;
    } catch (parseError) {
      console.log("OpenAI response was not valid JSON, treating as explanation:", responseText);
      return {
        action: "EXPLAIN",
        response: responseText,
        explanation: responseText,
        confidence: 0.6
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
}

async function generateSmartResponse(action, context = {}) {
  if (!openai) {
    return null;
  }

  try {
    let prompt = "";
    
    switch (action) {
      case "WALLET_CREATED":
        prompt = `Generate a congratulatory and educational response for a user who just created a Massa wallet. Include:
        - Congratulations
        - Brief explanation of what they can do next
        - Security reminders
        - Mention Massa blockchain benefits
        Keep it concise and use appropriate emojis.`;
        break;
        
      case "BALANCE_RESULT":
        const balance = context.balance || "0";
        const address = context.address || "";
        prompt = `Generate a response for a user checking their Massa wallet balance. Balance: ${balance} MAS, Address: ${address}. Include:
        - Balance information
        - Brief context about MAS tokens
        - Suggestions for what they can do next
        Use emojis and keep it friendly.`;
        break;
        
      case "EXPLAIN_MASSA":
        prompt = `Explain Massa blockchain in simple terms for a WhatsApp user. Include:
        - What makes Massa special (parallel blocks, autonomous smart contracts)
        - High throughput capabilities
        - DeFi opportunities
        Keep it conversational and under 200 words.`;
        break;
        
      default:
        return null;
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are AgentLink, a friendly DeFi assistant. Respond in a conversational WhatsApp style with emojis." },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating smart response:", error);
    return null;
  }
}

async function explainConcept(query) {
  if (!openai) {
    return null;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are AgentLink, a DeFi education assistant. Explain blockchain and DeFi concepts in simple terms for WhatsApp users. Focus on Massa blockchain when relevant. Use emojis and keep explanations under 250 words.` 
        },
        { role: 'user', content: `Explain: ${query}` }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error explaining concept:", error);
    return null;
  }
}

async function generatePersonalizedHelp(userMessage, userContext = {}) {
  if (!openai) {
    return null;
  }

  try {
    let contextInfo = "";
    if (userContext.wallets && userContext.wallets.length > 0) {
      contextInfo += `User has ${userContext.wallets.length} wallet(s). `;
    }
    if (userContext.messageCount > 0) {
      contextInfo += `This is message #${userContext.messageCount + 1}. `;
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are AgentLink helping a user on WhatsApp. ${contextInfo}Available features:
          - Create Massa wallets
          - Check balances
          - Explain DeFi concepts
          - Portfolio advice
          - Market insights
          - Massa blockchain information
          
          Respond with helpful next steps and available commands.` 
        },
        { role: 'user', content: `User said: "${userMessage}". What help should I provide?` }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating personalized help:", error);
    return null;
  }
}

async function generatePortfolioAdvice(userContext = {}) {
  if (!openai) {
    return null;
  }

  try {
    let walletInfo = "No wallets created yet.";
    if (userContext.wallets && userContext.wallets.length > 0) {
      walletInfo = `User has ${userContext.wallets.length} wallet(s) created.`;
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are a DeFi portfolio advisor. Provide helpful advice about cryptocurrency portfolio management, focusing on Massa blockchain opportunities. Be educational and encouraging but emphasize risk management.` 
        },
        { role: 'user', content: `Give portfolio advice for a user. Context: ${walletInfo}` }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating portfolio advice:", error);
    return null;
  }
}

async function generateMarketInfo() {
  if (!openai) {
    return null;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are a DeFi market analyst. Provide general insights about the Massa blockchain ecosystem, DeFi trends, and educational content about cryptocurrency markets. Focus on Massa's unique features like autonomous smart contracts and high throughput. Keep it educational and balanced.` 
        },
        { role: 'user', content: `Provide current market insights about Massa blockchain and DeFi trends` }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating market info:", error);
    return null;
  }
}

module.exports = {
  parseWithOpenAI,
  generateSmartResponse,
  explainConcept,
  generatePersonalizedHelp,
  generatePortfolioAdvice,
  generateMarketInfo,
  isOpenAIConfigured: () => !!openai
};
