'use server';

/**
 * @fileOverview Generates tamper-evident receipts for AI development process using GenAI.
 *
 * - generateCryptographicCommitment - A function that generates the cryptographic commitment.
 * - GenerateCryptographicCommitmentInput - The input type for the generateCryptographicCommitment function.
 * - GenerateCryptographicCommitmentOutput - The return type for the generateCryptographicCommitment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCryptographicCommitmentInputSchema = z.object({
  dataDescription: z
    .string()
    .describe(
      'Description of the data, model configurations, or compliance events to be committed.'
    ),
  sensitiveData: z.string().optional().describe('The sensitive data to be committed (optional).'),
  commitmentDetails: z
    .string()
    .describe(
      'Additional details or context for the commitment, such as timestamps or version numbers.'
    ),
});
export type GenerateCryptographicCommitmentInput = z.infer<
  typeof GenerateCryptographicCommitmentInputSchema
>;

const GenerateCryptographicCommitmentOutputSchema = z.object({
  receipt: z.string().describe('The tamper-evident receipt.'),
  hash: z.string().describe('The cryptographic hash of the data.'),
});
export type GenerateCryptographicCommitmentOutput = z.infer<
  typeof GenerateCryptographicCommitmentOutputSchema
>;

export async function generateCryptographicCommitment(
  input: GenerateCryptographicCommitmentInput
): Promise<GenerateCryptographicCommitmentOutput> {
  return generateCryptographicCommitmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCryptographicCommitmentPrompt',
  input: {schema: GenerateCryptographicCommitmentInputSchema.extend({ hash: z.string() })},
  output: {schema: GenerateCryptographicCommitmentOutputSchema},
  prompt: `You are an expert in cryptographic commitments and AI compliance.

  Your task is to generate a tamper-evident receipt for the provided AI training data, model configuration, or compliance event. The receipt should include a cryptographic hash of the data and a human-readable summary of the commitment details.

  Data Description: {{{dataDescription}}}
  Sensitive Data (if any): {{{sensitiveData}}}
  Commitment Details: {{{commitmentDetails}}}
  Hash: {{{hash}}}

  Generate a receipt that clearly proves the integrity of the AI development process to regulators.

  Ensure that the receipt includes:
  - A cryptographic hash of the data (using SHA-256).
  - A summary of the data description.
  - The commitment details, including any relevant timestamps or version numbers.

  Return the receipt and the cryptographic hash in the specified JSON format.
`,
});

const generateCryptographicCommitmentFlow = ai.defineFlow(
  {
    name: 'generateCryptographicCommitmentFlow',
    inputSchema: GenerateCryptographicCommitmentInputSchema,
    outputSchema: GenerateCryptographicCommitmentOutputSchema,
  },
  async input => {
    // In a real implementation, we would hash the sensitiveData here using SHA-256.
    // For this example, we'll just return a placeholder hash.
    const hash = 'SHA256-PLACEHOLDER-' + Math.random().toString(36).substring(7);

    const {output} = await prompt({
      dataDescription: input.dataDescription,
      sensitiveData: input.sensitiveData,
      commitmentDetails: input.commitmentDetails,
      hash
    });
    return output!;
  }
);
