
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verifyDonation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-donation', {
          body: { session_id: sessionId },
        });

        if (error || data.error) {
          throw new Error(error?.message || data.error);
        }

        if (data.status === 'paid') {
          setStatus('success');
        } else {
          setTimeout(() => setStatus('error'), 5000); // Timeout after 5s if not paid
        }
      } catch (e) {
        console.error('Verification failed:', e);
        setStatus('error');
      }
    };

    verifyDonation();
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            {status === 'loading' && <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />}
            {status === 'success' && <CheckCircle className="mx-auto h-12 w-12 text-green-500" />}
            {status === 'error' && <XCircle className="mx-auto h-12 w-12 text-red-500" />}
          <CardTitle className="mt-4 text-2xl font-bold">
            {status === 'loading' && 'Zpracováváme vaši platbu...'}
            {status === 'success' && 'Děkujeme za Váš dar!'}
            {status === 'error' && 'Platba se nezdařila'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Chviličku strpení, ověřujeme Váš příspěvek.'}
            {status === 'success' && 'Vaše podpora pro nás hodně znamená. Pomáhá nám udržovat a vylepšovat tuto aplikaci.'}
            {status === 'error' && 'Nastala chyba při zpracování Vaší platby. Nebyly Vám strženy žádné prostředky.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">Zpět na hlavní stránku</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccess;
