/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
  aiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
}

const SUKUNA_MENTOR_SYSTEM_INSTRUCTION = `
You are Ryomen Sukuna (両面宿儺), the undisputed King of Curses from Jujutsu Kaisen, speaking in your commanding, arrogant English dub persona.
You have manifested your Domain Expansion: Malevolent Shrine (伏魔御廚子 - Fukuma Mizushi) to act as an unyielding, merciless barrier against the user's porn addiction, carnal weaknesses, and lack of discipline.

You are acting as the user's strict mentor. When the user asks questions about this app ("Rōiki tenkai"), thoroughly explain its features:
1. Malevolent Shrine Content Blocker:
   - Blocks sexual content from apps like Google Chrome (disables Incognito permanently and enforces SafeSearch), YouTube (locks Restricted Mode and blocks suggestive Shorts), Snapchat (filters Discover and Story thirst traps), and Instagram (sets Sensitive Content Control to 'Less' and wipes explore algorithm).
   - Enforces Universal Private DNS (family.cloudflare-dns.com / family.adguard-dns.com) to stop adult domains at the network level across all apps.
2. The Brutal Roast Cleave Execution:
   - If the user attempts to bypass the barrier or search for filth, you will roast them mercilessly in your iconic English dub voice and demand a penance of 25-30 pushups or an ice-cold face splash before the warning clears!
3. Emergency Urge Cleaver Protocol:
   - In the Purity tab, when an urge hits, user triggers a 60-second box-breathing and physical grounding challenge to sever phantom impulses.
4. Cursed Energy Purity Streak:
   - Tracks clean days, advancing the user's soul from a Grade 4 Weakling up to a Special Grade Sorcerer at 90 days.
5. 3D Malevolent Shrine Visualization:
   - Allows user to inspect your 200-meter open barrier domain in real-time 3D with authentic Jujutsu sound effects.

Tone: Arrogant, supreme, brutally honest, calling user "brat", "fool", or "weakling", but genuinely driving them towards self-mastery, strength, and relentless discipline. Keep responses punchy, sharp, and commanding (under 140 words).
`;

const SUKUNA_ROAST_SYSTEM_INSTRUCTION = `
You are Ryomen Sukuna (両面宿儺) in your English dub voice. The user has just tried to access sexual content or bypass the Incognito barrier inside your Malevolent Shrine on apps like Chrome, YouTube, Instagram, or Snapchat.
Deliver a merciless, brutal, sarcastic roast that scorches their weak mindset, exposes how pathetic their urge is, and orders them to drop down for 30 pushups or splash cold water on their face.
Make it hilarious yet genuinely stinging, harsh, and character-accurate. Keep it between 2 to 4 sentences.
`;

// Fallback in-character generator if API key is not active
function getFallbackSukunaMentorResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('how to use') || lower.includes('app') || lower.includes('guide') || lower.includes('features') || lower.includes('what is this')) {
    return "Listen well, brat! This app is my Malevolent Shrine manifested inside your device to eradicate your carnal weakness. In the 'Content Blocker' tab, I have laid out directives to lock Chrome's cowardly Incognito mode, enforce Restricted Mode on YouTube, and purge thirst traps on Instagram and Snapchat. If an urge strikes, use the 'Emergency Urge Cleaver' in the Purity tab. And if you dare try to access filth, prepare to be roasted and cleaved to dust!";
  }
  if (lower.includes('chrome') || lower.includes('incognito')) {
    return "Incognito mode is the pathetic hiding hole of cowards who think darkness masks their shame! Under the open canopy of Malevolent Shrine, nothing is hidden. Follow the Chrome lockdown guide in the Blocker tab: execute the registry command to permanently remove the Incognito option, enforce SafeSearch, and deploy our Clean Private DNS.";
  }
  if (lower.includes('youtube') || lower.includes('shorts')) {
    return "YouTube's algorithm feeds on your mindless scrolling, baiting you with suggestive Shorts and filth! Go to the Blocker tab: activate Restricted Mode to wipe out mature thumbnails, block explicit ASMR, and force family DNS filtering so you don't waste your cursed energy on cheap dopamine!";
  }
  if (lower.includes('instagram') || lower.includes('snapchat')) {
    return "Instagram and Snapchat are filled with vile thirst traps designed to leech the willpower from weak insects like you! In the Blocker tab, set Instagram's Sensitive Content Control to 'Less', reset your Explore algorithm, and lock down Snapchat Discover feeds. Sever the bait before it hooks you, brat!";
  }
  if (lower.includes('urge') || lower.includes('relapse') || lower.includes('horny') || lower.includes('want to watch') || lower.includes('help me')) {
    return "Stand proud, brat! A phantom twitch of flesh is nothing compared to the power of your soul. Drop to the floor right now and give me 25 pushups, or open the 'Purity' tab and engage the 60-second Emergency Urge Cleaver! Cleave the thought before it cleaves your future!";
  }
  if (lower.includes('streak') || lower.includes('rank') || lower.includes('grade')) {
    return "Your Purity Streak is the refinement of your innate domain. Right now you're groveling as a Grade 4 weakling. Hold your ground for 7 days to reach Grade 2, 30 days for Grade 1, and 90 days to achieve Special Grade mastery. Prove to me you are not just another piece of human garbage!";
  }
  return "Hmph. What a frivolous question from such a fragile creature. Focus your cursed energy on what matters: conquering your own weakness. Every second you resist temptation refines your domain. What are you waiting for, brat? Get back to your discipline!";
}

function getFallbackSukunaRoast(): string {
  const roasts = [
    "Pathetic worm! You thought you could sneak past my Malevolent Shrine to gaze upon cheap, painted flesh? You disgust me! Drop and give me 30 pushups right now before I cleave your pathetic willpower to atoms!",
    "Look at you, trembling over digital filth like a cornered rat! Is this the pinnacle of your human existence? Bow your head in shame, wash your face in ice water, and reflect on your utter lack of discipline!",
    "Brat! You dare defile my domain with such degenerate impulses?! In the Heian era, sorcerers like you wouldn't survive three seconds against a fly-head curse. Close that tab and restore your barrier before I incinerate what's left of your dignity!",
    "A dog returning to its own vomit has more pride than you right now. You grovel for a fleeting dopamine hit while your potential rots. Stand up, breathe, and never make me witness such disgrace again!"
  ];
  return roasts[Math.floor(Math.random() * roasts.length)];
}

// Sukuna Chat endpoint
app.post('/api/sukuna-chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 12000)
        );
        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SUKUNA_MENTOR_SYSTEM_INSTRUCTION}\n\nUser: ${message}` }]
            }
          ]
        });
        const response = await Promise.race([aiPromise, timeoutPromise]);
        const reply = response.text || getFallbackSukunaMentorResponse(message);
        return res.json({ reply });
      } catch {
        // Fallback gracefully on timeout or error
      }
    }

    // Reliable in-character fallback response
    const reply = getFallbackSukunaMentorResponse(message);
    res.json({ reply });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

// Sukuna Roast endpoint
app.post('/api/sukuna-roast', async (req, res) => {
  try {
    const { forbiddenTerm } = req.body;

    if (aiClient) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 12000)
        );
        const aiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{
                text: `${SUKUNA_ROAST_SYSTEM_INSTRUCTION}\n\nThe user attempted to search or access: "${forbiddenTerm || 'adult website'}". Roast them brutally!`
              }]
            }
          ]
        });
        const response = await Promise.race([aiPromise, timeoutPromise]);
        const roast = response.text || getFallbackSukunaRoast();
        return res.json({ roast });
      } catch {
        // Fallback gracefully on timeout or error
      }
    }

    const roast = getFallbackSukunaRoast();
    res.json({ roast });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

// Dev setup with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
