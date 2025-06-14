
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssistantRequest {
  message: string;
  context?: {
    userId: string;
    currentSubject?: 'math' | 'spelling';
    recentErrors?: string[];
    userStats?: any;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context }: AssistantRequest = await req.json();
    
    console.log('AI Assistant request:', { message, context });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key není nastaven');
    }

    // Build context-aware system prompt
    let systemPrompt = `Jsi AI studentský asistent pro českou vzdělávací aplikaci. Tvoje role:

1. Pomáháš dětem s matematikou a pravopisem v češtině
2. Analyzuješ jejich chyby a poskytuj personalizované tipy
3. Buď pozitivní, povzbudivý a přátelský
4. Používej jednoduché výrazy vhodné pro děti
5. Dávej konkrétní, praktické rady
6. Oslavuj pokroky a úspěchy

Tvoje odpovědi by měly být:
- Krátké a srozumitelné
- Pozitivní a motivující
- Praktické s konkrétními tipy
- V češtině`;

    if (context?.currentSubject) {
      systemPrompt += `\n\nAktuální předmět: ${context.currentSubject === 'math' ? 'matematika' : 'pravopis'}`;
    }

    if (context?.recentErrors?.length) {
      systemPrompt += `\n\nNedávné chyby studenta: ${context.recentErrors.join(', ')}
Zaměř se na tyto oblasti a poskytni tipy pro zlepšení.`;
    }

    if (context?.userStats) {
      systemPrompt += `\n\nStatistiky studenta: ${JSON.stringify(context.userStats)}
Využij tyto informace pro personalizované rady.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      
      // Handle specific API errors
      if (data.error?.code === 'insufficient_quota') {
        throw new Error('OpenAI API kvóta byla vyčerpána. Zkuste to prosím později.');
      } else if (data.error?.code === 'rate_limit_exceeded') {
        throw new Error('Příliš mnoho požadavků. Zkuste to prosím za chvíli.');
      } else {
        throw new Error(`OpenAI API chyba: ${data.error?.message || 'Neznámá chyba'}`);
      }
    }

    const assistantResponse = data.choices[0].message.content;
    
    console.log('AI Assistant response:', assistantResponse);

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant function:', error);
    
    // Provide user-friendly error messages
    let userMessage = 'Promiň, teď nemůžu odpovědět. ';
    
    if (error.message.includes('quota') || error.message.includes('kvóta')) {
      userMessage += 'API kvóta byla vyčerpána. Zkus to prosím později.';
    } else if (error.message.includes('rate_limit')) {
      userMessage += 'Příliš mnoho požadavků najednou. Zkus to za chvíli.';
    } else {
      userMessage += 'Zkus to prosím později.';
    }
    
    return new Response(
      JSON.stringify({ 
        error: userMessage,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
