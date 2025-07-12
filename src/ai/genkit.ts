import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {dotprompt} from 'dotprompt';

export const ai = genkit({
  plugins: [
    googleAI(),
    dotprompt(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
