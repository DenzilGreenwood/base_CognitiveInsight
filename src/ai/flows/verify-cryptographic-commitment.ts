'use server';

/**
 * @fileOverview A flow that verifies the authenticity and integrity of cryptographic commitments.
 *
 * - verifyCryptographicCommitment - A function that handles the verification process.
 * - VerifyCryptographicCommitmentInput - The input type for the verifyCryptographicCommitment function.
 * - VerifyCryptographicCommitmentOutput - The return type for the verifyCryptographicCommitment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyCryptographicCommitmentInputSchema = z.object({
  commitment: z
    .string()
    .describe("The cryptographic commitment to be verified."),
  dataHash: z.string().describe("The hash of the original data."),
  verificationKey: z
    .string()
    .describe("The public key or verification key associated with the commitment."),
  complianceStandard: z
    .string()
    .describe("The compliance standard or policy being assessed."),
});

export type VerifyCryptographicCommitmentInput = z.infer<
  typeof VerifyCryptographicCommitmentInputSchema
>;

const VerifyCryptographicCommitmentOutputSchema = z.object({
  isValid: z.boolean().describe("Whether the commitment is valid."),
  verificationReport: z
    .string()
    .describe("A report detailing the verification process and results."),
});

export type VerifyCryptographicCommitmentOutput = z.infer<
  typeof VerifyCryptographicCommitmentOutputSchema
>;

export async function verifyCryptographicCommitment(
  input: VerifyCryptographicCommitmentInput
): Promise<VerifyCryptographicCommitmentOutput> {
  return verifyCryptographicCommitmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyCryptographicCommitmentPrompt',
  input: {schema: VerifyCryptographicCommitmentInputSchema},
  output: {schema: VerifyCryptographicCommitmentOutputSchema},
  prompt: `You are an expert auditor specializing in verifying cryptographic commitments for AI compliance.

You will receive a cryptographic commitment, the hash of the original data, a verification key, and the relevant compliance standard.

Your task is to determine if the commitment is valid and generate a detailed verification report.

Commitment: {{{commitment}}}
Data Hash: {{{dataHash}}}
Verification Key: {{{verificationKey}}}
Compliance Standard: {{{complianceStandard}}}

Based on this information, is the commitment valid? Explain your reasoning in the verification report.
`,
});

const verifyCryptographicCommitmentFlow = ai.defineFlow(
  {
    name: 'verifyCryptographicCommitmentFlow',
    inputSchema: VerifyCryptographicCommitmentInputSchema,
    outputSchema: VerifyCryptographicCommitmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
