import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLang = 'en', targetLang = 'cs' }: TranslationRequest = await req.json();
    
    if (!text?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Translating "${text}" from ${sourceLang} to ${targetLang}`);

    // Try MyMemory API first
    try {
      const myMemoryResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (myMemoryResponse.ok) {
        const data = await myMemoryResponse.json();
        
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          console.log(`Translation successful: "${data.responseData.translatedText}"`);
          return new Response(
            JSON.stringify({ 
              translatedText: data.responseData.translatedText,
              source: 'MyMemory'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
    } catch (error) {
      console.warn('MyMemory API failed:', error);
    }

    // Fallback to LibreTranslate
    try {
      const libreResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (libreResponse.ok) {
        const data = await libreResponse.json();
        
        if (data.translatedText) {
          console.log(`Translation successful via LibreTranslate: "${data.translatedText}"`);
          return new Response(
            JSON.stringify({ 
              translatedText: data.translatedText,
              source: 'LibreTranslate'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
    } catch (error) {
      console.warn('LibreTranslate API failed:', error);
    }

    // If both APIs fail
    return new Response(
      JSON.stringify({ error: 'Translation services unavailable' }),
      { 
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});