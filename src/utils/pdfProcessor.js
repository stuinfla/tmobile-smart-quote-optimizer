import PDFParse from 'pdf-parse';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

class PDFProcessor {
  constructor() {
    // Initialize AI clients based on available API keys
    this.openai = null;
    this.anthropic = null;
    
    // Check for OpenAI API key
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true // For client-side usage
      });
    }
    
    // Check for Anthropic/Claude API key  
    const claudeKey = import.meta.env.VITE_ANTHROPIC_API_KEY || 
                     import.meta.env.VITE_CLAUDE_API_KEY || 
                     import.meta.env.CLAUDE_API_KEY;
    if (claudeKey) {
      this.anthropic = new Anthropic({
        apiKey: claudeKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  /**
   * Process a PDF file and extract T-Mobile pricing information
   * @param {File} file - PDF file to process
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Extracted pricing data
   */
  async processPDF(file, options = {}) {
    try {
      console.log('📄 Processing PDF:', file.name);
      
      // Step 1: Extract text from PDF
      const pdfBuffer = await file.arrayBuffer();
      const pdfData = await PDFParse(pdfBuffer);
      const extractedText = pdfData.text;
      
      if (!extractedText || extractedText.length < 100) {
        throw new Error('PDF appears to be empty or unreadable');
      }
      
      console.log('✓ Extracted', extractedText.length, 'characters from PDF');
      
      // Step 2: Process with AI to extract structured data
      const structuredData = await this.extractPricingData(extractedText, options);
      
      return {
        success: true,
        filename: file.name,
        textLength: extractedText.length,
        extractedData: structuredData,
        rawText: options.includeRawText ? extractedText : null
      };
      
    } catch (error) {
      console.error('❌ PDF Processing Error:', error);
      return {
        success: false,
        error: error.message,
        filename: file.name
      };
    }
  }

  /**
   * Extract pricing data using AI
   * @param {string} text - Extracted PDF text
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Structured pricing data
   */
  async extractPricingData(text, options = {}) {
    const prompt = this.buildExtractionPrompt(text, options);
    
    // Try Claude first (better for structured data extraction)
    if (this.anthropic) {
      try {
        console.log('🤖 Processing with Claude...');
        return await this.processWithClaude(prompt);
      } catch (error) {
        console.warn('⚠️ Claude processing failed:', error.message);
      }
    }
    
    // Fallback to OpenAI
    if (this.openai) {
      try {
        console.log('🤖 Processing with OpenAI...');
        return await this.processWithOpenAI(prompt);
      } catch (error) {
        console.warn('⚠️ OpenAI processing failed:', error.message);
      }
    }
    
    throw new Error('No AI service available. Please check your API keys in .env file.');
  }

  /**
   * Build extraction prompt for AI processing
   */
  buildExtractionPrompt(text, options) {
    return `You are a T-Mobile pricing data extraction specialist. Please analyze the following T-Mobile document and extract structured pricing information.

DOCUMENT TEXT:
${text.substring(0, 8000)}${text.length > 8000 ? '\n... (truncated)' : ''}

EXTRACTION REQUIREMENTS:
Please extract and return a JSON object with the following structure:

{
  "documentType": "rate_sheet|promotional_flyer|device_pricing|plan_pricing",
  "effectiveDate": "YYYY-MM-DD",
  "plans": [
    {
      "name": "Plan Name",
      "basePrice": 85.00,
      "autopayDiscount": 10.00,
      "finalPrice": 75.00,
      "lines": {
        "1": 85.00,
        "2": 70.00,
        "3": 60.00,
        "4": 55.00,
        "5": 50.00
      },
      "features": ["Unlimited data", "5G included"]
    }
  ],
  "devices": [
    {
      "name": "iPhone 15 Pro",
      "storage": "128GB",
      "retailPrice": 999.99,
      "monthlyFinancing": 41.67,
      "category": "phone|tablet|watch|accessory",
      "brand": "Apple"
    }
  ],
  "promotions": [
    {
      "name": "Keep and Switch",
      "description": "Up to $800 off when you switch",
      "conditions": "New customer, port in required",
      "value": 800.00,
      "applicableDevices": ["iPhone 15 Pro", "iPhone 15"]
    }
  ],
  "insuranceRates": [
    {
      "tier": 1,
      "monthlyRate": 7.00,
      "devices": ["Basic phones"]
    }
  ]
}

IMPORTANT:
- Only extract information that is explicitly stated in the document
- Use null for missing information
- Ensure all prices are numbers (not strings)
- Focus on current T-Mobile plans (Experience Beyond, Experience More, Essentials)
- Include any promotional pricing or trade-in offers
- Pay special attention to AutoPay discounts and line pricing tiers

Return only the JSON object, no additional text.`;
  }

  /**
   * Process with Claude/Anthropic
   */
  async processWithClaude(prompt) {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    const result = response.content[0].text.trim();
    return this.parseAIResponse(result);
  }

  /**
   * Process with OpenAI
   */
  async processWithOpenAI(prompt) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.1,
      max_tokens: 4000
    });
    
    const result = response.choices[0].message.content.trim();
    return this.parseAIResponse(result);
  }

  /**
   * Parse AI response and extract JSON
   */
  parseAIResponse(response) {
    try {
      // Try to find JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON brackets found, try parsing the whole response
      return JSON.parse(response);
    } catch (error) {
      console.error('❌ Failed to parse AI response as JSON:', error);
      return {
        error: 'Failed to parse structured data',
        rawResponse: response
      };
    }
  }

  /**
   * Update JSON data files with extracted information
   * @param {Object} extractedData - Data extracted from PDF
   * @returns {Promise<Object>} Update results
   */
  async updateDataFiles(extractedData) {
    const results = {
      plansUpdated: false,
      devicesUpdated: false,
      promotionsUpdated: false,
      insuranceUpdated: false,
      errors: []
    };

    try {
      // This would need to be implemented based on your data file structure
      // For now, return the extracted data for manual review
      console.log('📋 Extracted data ready for review:', extractedData);
      
      return {
        ...results,
        extractedData,
        success: true,
        message: 'Data extracted successfully. Manual review recommended before updating files.'
      };
    } catch (error) {
      results.errors.push(error.message);
      return { ...results, success: false };
    }
  }

  /**
   * Validate extracted data structure
   */
  validateData(data) {
    const errors = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Invalid data structure');
      return errors;
    }
    
    // Validate plans
    if (data.plans && Array.isArray(data.plans)) {
      data.plans.forEach((plan, index) => {
        if (!plan.name) errors.push(`Plan ${index}: Missing name`);
        if (typeof plan.basePrice !== 'number') errors.push(`Plan ${index}: Invalid base price`);
      });
    }
    
    // Validate devices
    if (data.devices && Array.isArray(data.devices)) {
      data.devices.forEach((device, index) => {
        if (!device.name) errors.push(`Device ${index}: Missing name`);
        if (typeof device.retailPrice !== 'number') errors.push(`Device ${index}: Invalid retail price`);
      });
    }
    
    return errors;
  }
}

export default PDFProcessor;