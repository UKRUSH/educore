import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const modelName = 'gemini-1.5-flash';

/**
 * Generate a summary and key points from the extracted text
 */
export async function generateSummaryAndKeyPoints(text: string): Promise<{
  summary: string;
  keyPoints: string[];
}> {
  if (!apiKey || apiKey === '') {
    console.warn('No GEMINI_API_KEY, returning demo data');
    return {
      summary: 'Demo summary for study material. This uses placeholder data. Set GEMINI_API_KEY in .env.local for real AI.',
      keyPoints: [
        'Key concept 1 from your PDF',
        'Key concept 2',
        'Key concept 3', 
        'Key concept 4',
        'Key concept 5'
      ]
    };
  }

  const prompt = `You are an AI study assistant. Analyze the following text and provide:
1. A concise summary (2-3 paragraphs)
2. A list of key points in bullet format

Format your response as:
SUMMARY:
[Your summary here]

KEY_POINTS:
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4]
- [Point 5]

Text to analyze:
${text.substring(0, 10000)}`;

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Parse the response
    const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)KEY_POINTS:/i);
    const keyPointsMatch = response.match(/KEY_POINTS:\s*([\s\S]*)/i);

    const summary = summaryMatch ? summaryMatch[1].trim() : 'Summary not available';
    
    const keyPoints = keyPointsMatch 
      ? keyPointsMatch[1]
          .split('\n')
          .map(line => line.replace(/^-\s*/i, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 10)
      : [];

    return { summary, keyPoints };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate relevant learning resource suggestions based on key points
 */
export async function suggestResources(keyPoints: string[]): Promise<string[]> {
  const topics = keyPoints.slice(0, 5).join(', ');
  
  const prompt = `Based on the following key topics from a study material:
${topics}

Suggest 5 relevant learning resources (URLs) that would help a student understand these topics better.
Include a mix of:
- Online articles/tutorials
- YouTube video lectures
- Documentation

Format your response as a JSON array of URLs only, like:
["url1", "url2", "url3", "url4", "url5"]

Only include valid, accessible URLs. Do not include any other text.`;

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    try {
      const urls = JSON.parse(response);
      if (Array.isArray(urls)) {
        return urls.slice(0, 5);
      }
    } catch {
      const urlRegex = /https?:\/\/[^\s"]\]]+/g;
      const urls = response.match(urlRegex) || [];
      return urls.slice(0, 5);
    }

    return [
      'https://www.khanacademy.org',
      'https://www.coursera.org',
      'https://www.youtube.com/education',
      'https://developer.mozilla.org',
      'https://www.w3schools.com'
    ];
  } catch (error) {
    console.error('Resource suggestion error:', error);
    return [
      'https://www.khanacademy.org',
      'https://www.coursera.org',
      'https://www.youtube.com/education',
      'https://developer.mozilla.org',
      'https://www.w3schools.com'
    ];
  }
}

export default genAI;
