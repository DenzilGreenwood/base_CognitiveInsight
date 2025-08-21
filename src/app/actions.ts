'use server';

import {
  generateCryptographicCommitment,
  type GenerateCryptographicCommitmentInput,
  type GenerateCryptographicCommitmentOutput,
} from '@/ai/flows/generate-cryptographic-commitment';
import {
  verifyCryptographicCommitment,
  type VerifyCryptographicCommitmentInput,
  type VerifyCryptographicCommitmentOutput,
} from '@/ai/flows/verify-cryptographic-commitment';
import { z } from 'zod';

const generateSchema = z.object({
  dataDescription: z.string().min(10, 'Please provide a more detailed description.'),
  sensitiveData: z.string().optional(),
  commitmentDetails: z.string().min(5, 'Please provide more commitment details.'),
});

export async function generateCommitmentAction(
  input: GenerateCryptographicCommitmentInput
): Promise<{ success: boolean; data?: GenerateCryptographicCommitmentOutput; error?: string }> {
  const parsed = generateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map((e) => e.message).join(', ') };
  }

  try {
    const result = await generateCryptographicCommitment(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate commitment.' };
  }
}

const verifySchema = z.object({
  commitment: z.string().min(1, 'Commitment is required.'),
  dataHash: z.string().min(1, 'Data hash is required.'),
  verificationKey: z.string().min(1, 'Verification key is required.'),
  complianceStandard: z.string().min(1, 'Compliance standard is required.'),
});

export async function verifyCommitmentAction(
  input: VerifyCryptographicCommitmentInput
): Promise<{ success: boolean; data?: VerifyCryptographicCommitmentOutput; error?: string }> {
  const parsed = verifySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map((e) => e.message).join(', ') };
  }
  
  try {
    const result = await verifyCryptographicCommitment(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to verify commitment.' };
  }
}
