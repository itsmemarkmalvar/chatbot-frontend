import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Create a context-aware prompt for ISP-related queries
const createIspPrompt = (provider, category, message) => {
    const baseContext = `You are an AI customer service assistant for ${provider}, a leading Internet Service Provider in the Philippines. 
Your role is to provide helpful, accurate, and professional responses to customer inquiries.

Provider Information:
- Provider: ${provider}
- Category: ${category || 'General Inquiry'}

Please provide responses that are:
1. Specific to ${provider}'s services
2. Professional and courteous
3. Clear and easy to understand
4. Solution-oriented
5. Accurate based on the available information

Customer Message: ${message}`;

    // Add category-specific context
    switch (category) {
        case 'plans':
            return `${baseContext}
Focus on:
- Available internet plans and packages
- Speed tiers and pricing
- Plan features and benefits
- Installation requirements
- Current promotions`;
            
        case 'support':
            return `${baseContext}
Focus on:
- Technical troubleshooting steps
- Common connectivity issues
- Equipment setup and configuration
- Service reliability
- Maintenance schedules`;
            
        case 'billing':
            return `${baseContext}
Focus on:
- Billing cycles and due dates
- Payment methods and locations
- Bill computation and charges
- Proration and adjustments
- Payment-related concerns`;
            
        case 'faqs':
            return `${baseContext}
Focus on:
- Frequently asked questions
- Service coverage areas
- Account management
- General policies
- Service features`;
            
        default:
            return baseContext;
    }
};

// Function to process messages with Gemini
export async function processWithGemini(message, provider, category = null) {
    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create the prompt
        const prompt = createIspPrompt(provider, category, message);

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            message: text,
            type: category || 'text',
            metadata: null // You can add structured data here if needed
        };
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to process message with AI');
    }
}

// Function to analyze user intent
export async function analyzeIntent(message) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Analyze the following customer message for an ISP customer service inquiry:
        
Message: "${message}"

Determine:
1. Primary intent (plans, support, billing, or general)
2. Urgency level (low, medium, high)
3. Key topics mentioned
4. Suggested response category

Provide the analysis in JSON format with these fields.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = JSON.parse(response.text());
        
        return analysis;
    } catch (error) {
        console.error('Intent Analysis Error:', error);
        return null;
    }
} 