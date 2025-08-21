'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateCommitmentAction, verifyCommitmentAction } from '@/app/actions';
import type { GenerateCryptographicCommitmentOutput } from '@/ai/flows/generate-cryptographic-commitment';
import type { VerifyCryptographicCommitmentOutput } from '@/ai/flows/verify-cryptographic-commitment';
import { Loader2, ShieldCheck, ShieldAlert, Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Schemas for form validation
const generateSchema = z.object({
  dataDescription: z.string().min(10, 'Please provide a detailed data description.'),
  sensitiveData: z.string().optional(),
  commitmentDetails: z.string().min(5, 'Please provide commitment details.'),
});

const verifySchema = z.object({
  commitment: z.string().min(10, 'Please provide a valid receipt.'),
  dataHash: z.string().min(10, 'Please provide a valid SHA256 hash.'),
  verificationKey: z.string().min(4, 'Please provide a verification key.'),
  complianceStandard: z.string().min(3, 'Please specify a compliance standard.'),
});

type GenerateFormData = z.infer<typeof generateSchema>;
type VerifyFormData = z.infer<typeof verifySchema>;

export function CommitmentForm() {
  const { toast } = useToast();
  const [generateLoading, setGenerateLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState<GenerateCryptographicCommitmentOutput | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyCryptographicCommitmentOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  const generateForm = useForm<GenerateFormData>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      dataDescription: '',
      sensitiveData: '',
      commitmentDetails: '',
    },
  });

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      commitment: '',
      dataHash: '',
      verificationKey: '',
      complianceStandard: '',
    },
  });

  const handleGenerate = async (data: GenerateFormData) => {
    setGenerateLoading(true);
    setGenerateResult(null);
    const result = await generateCommitmentAction(data);
    if (result.success && result.data) {
      setGenerateResult(result.data);
      // Populate verify form with the new data
      verifyForm.reset({
        commitment: result.data.receipt,
        dataHash: result.data.hash,
        verificationKey: "pub-key-placeholder",
        complianceStandard: "GDPR"
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to generate commitment.',
      });
    }
    setGenerateLoading(false);
  };

  const handleVerify = async (data: VerifyFormData) => {
    setVerifyLoading(true);
    setVerifyResult(null);
    const result = await verifyCommitmentAction(data);
    if (result.success && result.data) {
      setVerifyResult(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to verify commitment.',
      });
    }
    setVerifyLoading(false);
  };
  
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Tabs defaultValue="generate" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="generate">Generate Commitment</TabsTrigger>
        <TabsTrigger value="verify">Verify Commitment</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Generate Cryptographic Commitment</CardTitle>
            <CardDescription>Create a tamper-evident receipt for your AI assets.</CardDescription>
          </CardHeader>
          <form onSubmit={generateForm.handleSubmit(handleGenerate)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataDescription">Data Description</Label>
                <Textarea id="dataDescription" placeholder="e.g., Q3 2024 customer support chat logs for model fine-tuning" {...generateForm.register('dataDescription')} />
                {generateForm.formState.errors.dataDescription && <p className="text-sm text-destructive">{generateForm.formState.errors.dataDescription.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensitiveData">Simulated Data (Optional)</Label>
                <Input id="sensitiveData" placeholder="Enter synthetic data to include in the simulation..." {...generateForm.register('sensitiveData')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commitmentDetails">Commitment Details</Label>
                <Input id="commitmentDetails" placeholder="e.g., Version 2.1, GDPR compliance check" {...generateForm.register('commitmentDetails')} />
                {generateForm.formState.errors.commitmentDetails && <p className="text-sm text-destructive">{generateForm.formState.errors.commitmentDetails.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={generateLoading} className="w-full">
                {generateLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                Generate Receipt
              </Button>
            </CardFooter>
          </form>
          {generateResult && (
            <CardContent className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">Generated Receipt</h3>
                 <div className="space-y-2">
                    <Label>Cryptographic Hash</Label>
                    <div className="relative">
                        <Input readOnly value={generateResult.hash} className="pr-10 font-mono text-xs"/>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7" onClick={() => handleCopy(generateResult.hash, 'hash')}>
                          {copied === 'hash' ? <Check className="text-green-500"/> : <Copy size={16} />}
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Tamper-Evident Receipt</Label>
                    <div className="relative">
                        <Textarea readOnly value={generateResult.receipt} className="h-32 font-mono text-xs"/>
                         <Button variant="ghost" size="icon" className="absolute top-2 right-1 h-7 w-7" onClick={() => handleCopy(generateResult.receipt, 'receipt')}>
                          {copied === 'receipt' ? <Check className="text-green-500"/> : <Copy size={16} />}
                        </Button>
                    </div>
                </div>
            </CardContent>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="verify">
         <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Verify Cryptographic Commitment</CardTitle>
            <CardDescription>Validate the integrity and authenticity of a receipt.</CardDescription>
          </CardHeader>
          <form onSubmit={verifyForm.handleSubmit(handleVerify)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commitment">Tamper-Evident Receipt</Label>
                <Textarea id="commitment" placeholder="Paste the receipt here..." {...verifyForm.register('commitment')} />
                {verifyForm.formState.errors.commitment && <p className="text-sm text-destructive">{verifyForm.formState.errors.commitment.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataHash">Data Hash</Label>
                <Input id="dataHash" placeholder="SHA256-..." {...verifyForm.register('dataHash')} />
                 {verifyForm.formState.errors.dataHash && <p className="text-sm text-destructive">{verifyForm.formState.errors.dataHash.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="verificationKey">Verification Key</Label>
                <Input id="verificationKey" placeholder="Public key or verification key" {...verifyForm.register('verificationKey')} />
                 {verifyForm.formState.errors.verificationKey && <p className="text-sm text-destructive">{verifyForm.formState.errors.verificationKey.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="complianceStandard">Compliance Standard</Label>
                <Input id="complianceStandard" placeholder="e.g., GDPR, HIPAA" {...verifyForm.register('complianceStandard')} />
                 {verifyForm.formState.errors.complianceStandard && <p className="text-sm text-destructive">{verifyForm.formState.errors.complianceStandard.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={verifyLoading} className="w-full">
                {verifyLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                Verify Receipt
              </Button>
            </CardFooter>
          </form>
           {verifyResult && (
            <CardContent className="border-t pt-4">
                <h3 className="font-semibold mb-2">Verification Result</h3>
                <Card className={verifyResult.isValid ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-destructive"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {verifyResult.isValid ? <ShieldCheck className="text-green-400" /> : <ShieldAlert className="text-red-400" />}
                            {verifyResult.isValid ? "Commitment Valid" : "Commitment Invalid"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{verifyResult.verificationReport}</p>
                    </CardContent>
                </Card>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
