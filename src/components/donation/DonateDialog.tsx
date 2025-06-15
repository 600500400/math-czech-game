
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";

const donationSchema = z.object({
  amount: z.number().min(50, "Minimální částka je 50 Kč.").max(10000, "Maximální částka je 10 000 Kč."),
  customAmount: z.string().optional(),
  currency: z.enum(["CZK", "EUR"]),
  donorName: z.string().optional(),
  donorEmail: z.string().email("Neplatný formát emailu.").optional().or(z.literal('')),
  message: z.string().max(500, "Zpráva může mít maximálně 500 znaků.").optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

const presetAmounts = {
  CZK: [100, 200, 500, 1000],
  EUR: [5, 10, 20, 50],
};

interface DonateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DonateDialog = ({ open, onOpenChange }: DonateDialogProps) => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 100,
      currency: "CZK",
      donorName: authState.userProfile?.full_name ?? "",
      donorEmail: authState.session?.user.email ?? "",
      message: "",
    },
  });
  
  const selectedCurrency = form.watch("currency");

  const onSubmit = async (values: DonationFormData) => {
    setLoading(true);
    let finalAmount = values.amount;
    
    if (values.customAmount) {
        const custom = parseInt(values.customAmount, 10);
        if (!isNaN(custom) && custom >= 50) {
            finalAmount = custom;
        } else {
            form.setError("customAmount", { type: "manual", message: "Zadejte platnou částku (min. 50)."});
            setLoading(false);
            return;
        }
    }

    const { data, error } = await supabase.functions.invoke("create-donation-session", {
      body: {
        amount: finalAmount * 100, // to cents
        currency: values.currency,
        message: values.message,
        donorName: values.donorName,
        donorEmail: values.donorEmail,
      },
    });

    if (error) {
      toast.error("Vytvoření platby selhalo", { description: error.message });
    } else if (data.url) {
      window.location.href = data.url;
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Heart className="text-red-500" /> Podpořte náš projekt</DialogTitle>
          <DialogDescription>
            Váš příspěvek nám pomůže pokračovat ve vývoji a provozu aplikace. Děkujeme!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs
              defaultValue="CZK"
              onValueChange={(value) => {
                const currency = value as "CZK" | "EUR";
                form.setValue("currency", currency);
                form.setValue("amount", presetAmounts[currency][0]);
                form.setValue("customAmount", "");
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="CZK">CZK</TabsTrigger>
                <TabsTrigger value="EUR">EUR</TabsTrigger>
              </TabsList>
            </Tabs>

            <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vyberte částku</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {presetAmounts[selectedCurrency].map((amount) => (
                                <Button
                                    key={amount}
                                    type="button"
                                    variant={field.value === amount && !form.watch('customAmount') ? "default" : "outline"}
                                    onClick={() => {
                                        field.onChange(amount)
                                        form.setValue('customAmount', '')
                                    }}
                                >
                                    {amount} {selectedCurrency}
                                </Button>
                            ))}
                        </div>
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="customAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nebo zadejte vlastní</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`Vlastní částka v ${selectedCurrency}`} type="number" min="50"
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue('amount', 0); // Deselect preset
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jméno (nepovinné)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Vaše jméno" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (nepovinné)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="vase@email.cz" type="email" />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Zpráva (nepovinné)</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Chci vám poděkovat za..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Odeslat dar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
