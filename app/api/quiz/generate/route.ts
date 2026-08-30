import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export interface GeneratedQuizQuestion {
  question: string;
  toolType: 'vernier' | 'micrometer';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  scaleData: {
    mainScaleValue: number;
    secondaryScaleValue: number;
    unit: string;
  };
}

const FALLBACK_QUESTIONS: GeneratedQuizQuestion[] = [
  {
    question: 'Berapakah hasil pembacaan Jangka Sorong jika skala utama menunjukkan 14 mm dan garis nonius ke-7 berimpit presisi (ketelitian 0,05 mm)?',
    toolType: 'vernier',
    options: ['14.35 mm', '14.70 mm', '14.07 mm', '14.75 mm'],
    correctAnswerIndex: 0,
    explanation: 'Hasil = Skala Utama + (Skala Nonius x 0.05 mm) = 14 mm + (7 x 0.05 mm) = 14 mm + 0.35 mm = 14.35 mm.',
    scaleData: { mainScaleValue: 14, secondaryScaleValue: 7, unit: 'mm' },
  },
  {
    question: 'Pada Mikrometer Sekrup, skala utama pada sleeve menunjukkan 8,5 mm dan garis thimble berimpit pada angka 24. Berapakah hasil pengukuran akhirnya?',
    toolType: 'micrometer',
    options: ['8.74 mm', '8.54 mm', '8.24 mm', '8.94 mm'],
    correctAnswerIndex: 0,
    explanation: 'Hasil = Skala Sleeve + (Skala Thimble x 0.01 mm) = 8.5 mm + (24 x 0.01 mm) = 8.5 mm + 0.24 mm = 8.74 mm.',
    scaleData: { mainScaleValue: 8.5, secondaryScaleValue: 24, unit: 'mm' },
  },
  {
    question: 'Berapakah nilai ketelitian satu garis divisi pada Thimble Mikrometer Sekrup standar 0-25 mm?',
    toolType: 'micrometer',
    options: ['0.01 mm', '0.05 mm', '0.1 mm', '0.001 mm'],
    correctAnswerIndex: 0,
    explanation: 'Satu putaran penuh Thimble (50 divisi) memajukan spindel sejauh 0.5 mm, sehingga 1 divisi = 0.5 mm / 50 = 0.01 mm.',
    scaleData: { mainScaleValue: 0, secondaryScaleValue: 1, unit: 'mm' },
  },
  {
    question: 'Bagian Jangka Sorong yang digunakan untuk mengukur diameter dalam (inside diameter) pipa adalah...',
    toolType: 'vernier',
    options: ['Rahang Atas (Inner Jaws)', 'Rahang Bawah (Outer Jaws)', 'Tangkai Kedalaman (Depth Probe)', 'Skala Utama'],
    correctAnswerIndex: 0,
    explanation: 'Rahang atas (Inner Jaws) dirancang khusus untuk mengukur diameter dalam seperti lubang silinder atau pipa.',
    scaleData: { mainScaleValue: 0, secondaryScaleValue: 0, unit: 'mm' },
  },
];

function shuffleQuestionOptions(q: GeneratedQuizQuestion): GeneratedQuizQuestion {
  const originalCorrectText = q.options[q.correctAnswerIndex];
  const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectIndex,
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'placeholder-gemini-key') {
      // Pick random fallback question and shuffle options
      const randomFallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      return NextResponse.json({ question: shuffleQuestionOptions(randomFallback), source: 'fallback' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Act as an expert Mechanical Metrology Instructor. Generate 1 multiple choice quiz question about reading Vernier Caliper (Jangka Sorong) or Micrometer (Mikrometer Sekrup).
    Return STRICT JSON ONLY matching this exact format:
    {
      "question": "Question text in Indonesian...",
      "toolType": "vernier" or "micrometer",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": number (0-3),
      "explanation": "Clear explanation of calculation step-by-step in Indonesian",
      "scaleData": {
        "mainScaleValue": number,
        "secondaryScaleValue": number,
        "unit": "mm"
      }
    }
    Make sure options are mathematically distinct and the question is highly educational.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedData: GeneratedQuizQuestion = JSON.parse(text);
    return NextResponse.json({ question: shuffleQuestionOptions(parsedData), source: 'gemini' });
  } catch (error) {
    console.error('Gemini Quiz Generation Error:', error);
    // Return randomized fallback question on failure
    const randomFallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return NextResponse.json({ question: shuffleQuestionOptions(randomFallback), source: 'fallback_error' });
  }
}
