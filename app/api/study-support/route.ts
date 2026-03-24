import { NextRequest, NextResponse } from 'next/server';





export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const pdfFilename = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text - using buffer filename as placeholder for now
    const extractedText = file.name + ' content (' + buffer.length + ' bytes) - Real extraction will show PDF text here with Gemini AI processing unique content per file';

    if (!extractedText?.trim()) {
      return NextResponse.json({ error: 'No text found in PDF' }, { status: 400 });
    }

    // Check API key before AI calls
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === '') {
      console.warn('GEMINI_API_KEY missing, using demo data');
      return NextResponse.json({
        success: true,
        data: {
          pdfFilename,
          summary: 'Demo summary: This is a placeholder summary generated without AI. Add your GEMINI_API_KEY to .env.local for real AI processing.',
          keyPoints: [
            'Demo key point 1',
            'Demo key point 2', 
            'Demo key point 3',
            'Demo key point 4',
            'Demo key point 5'
          ],
          resourceUrls: [
            'https://www.khanacademy.org',
            'https://www.coursera.org',
            'https://www.youtube.com/education',
            'https://developer.mozilla.org',
            'https://www.w3schools.com'
          ],
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Generate AI content with real Gemini
    let summaryData, resourceUrls;

    try {
      const { generateSummaryAndKeyPoints, suggestResources } = await import('@/lib/gemini');
      summaryData = await generateSummaryAndKeyPoints(extractedText);
      resourceUrls = await suggestResources(summaryData.keyPoints);
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      return NextResponse.json(
        { error: `AI service error: ${aiError instanceof Error ? aiError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pdfFilename,
        summary: summaryData.summary,
        keyPoints: summaryData.keyPoints,
        resourceUrls,
        createdAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server error processing request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Study Support API ready. Upload PDF via POST.',
    demoMode: !process.env.GEMINI_API_KEY,
  });
}
