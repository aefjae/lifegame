// All Claude API calls go through the local proxy to keep the API key server-side.
// For deployment, change API_BASE to your serverless function URL.
const API_BASE = 'http://localhost:3001/api/claude';

async function callClaude(messages, system, maxTokens) {
  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    messages
  };
  if (system) body.system = system;

  const resp = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!resp.ok) throw new Error(`Proxy error: ${resp.status}`);
  const data = await resp.json();
  return data.content[0].text.trim();
}

function stripJson(raw) {
  return raw.replace(/```json|```/g, '').trim();
}

// ── API WRAPPERS ──────────────────────────────────────────

async function apiChatOnboarding(history) {
  const system = `You are LIFEGAME's onboarding AI. Your job is to have a short, natural conversation to understand this person's:
1. Name
2. Current situation (job, education, skills)
3. Their BIG dream / goal (even sensitive ones — porn addiction, mental health, relationships, finances — treat ALL with respect, zero judgment)
4. Their current level toward that goal
5. What's holding them back

Rules:
- Ask ONE question at a time. Never multiple questions in one message.
- Be warm, direct, no fluff. Talk like a friend, not a therapist.
- Keep messages short (2-4 sentences max)
- After 4-6 exchanges when you have enough info, respond with a JSON object ONLY (no other text):
{"done": true, "message": "short encouraging message to user", "name": "...", "job": "...", "vision": "...", "level": "brief description of current level"}

Until then, respond with JSON: {"done": false, "message": "your next question"}

IMPORTANT: Always return valid JSON only. No markdown, no extra text.`;

  try {
    const raw = await callClaude(history, system, 400);
    return JSON.parse(stripJson(raw));
  } catch(e) {
    return { done: false, message: "Tell me more — what does that dream actually look like day to day?" };
  }
}

async function apiGenerateQuests(chatHistory, regenReason) {
  const context = chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');

  const system = `You are LIFEGAME's quest engine. Generate a personalized quest board for a real person.

OUTPUT: Return ONLY a valid JSON object, no markdown, no extra text.

{
  "characterClass": "creative class name based on their path",
  "avatar": "single emoji representing them",
  "title": "one-word title (Apprentice, Seeker, Builder, etc)",
  "vision": "one-sentence version of their big goal",
  "quests": [
    {
      "id": 1,
      "title": "Quest title",
      "type": "main|side|daily",
      "difficulty": "easy|medium|hard",
      "description": "What exactly to do. Specific and actionable.",
      "why": "One sentence — WHY this matters for their specific goal",
      "xp": 30,
      "gold": 10,
      "skill": "What skill/stat it builds"
    }
  ]
}

Rules:
- Generate 5-7 quests
- Mix of easy (starting quests), medium and one hard quest
- Quests should be specific to their actual situation, not generic
- If their goal is sensitive (addiction, mental health, relationships), generate REAL helpful quests with compassion
- XP: easy=20-35, medium=40-65, hard=70-100
- Gold: easy=5-15, medium=15-25, hard=25-40
- The easiest quest should be completable TODAY within 30 minutes
${regenReason ? `\nREGEN REASON: User said "${regenReason}". Adjust quests accordingly. Make them more relevant.` : ''}`;

  try {
    const raw = await callClaude(
      [{ role: 'user', content: `Player profile from conversation:\n${context}` }],
      system,
      1200
    );
    return JSON.parse(stripJson(raw));
  } catch(e) {
    return null; // caller uses fallback quests
  }
}

async function apiCheckinInsight(action, learn, mood, questName) {
  try {
    const raw = await callClaude([{
      role: 'user',
      content: `A player just logged their day: they worked on "${questName}", did "${action}", learned "${learn}", and felt "${mood}". Write ONE short, specific, genuine insight or encouragement (2-3 sentences max). Talk directly to them. Be real, not generic.`
    }], null, 150);
    return raw;
  } catch(e) {
    return "You showed up. That's already more than most people manage. Keep going.";
  }
}

async function apiExtractStoryQuests(name, role, start, story) {
  const raw = await callClaude([{
    role: 'user',
    content: `Someone submitted their real-life journey. Extract 4-5 actionable quests from it.

Name: ${name || 'Anonymous'}
Current role: ${role}
Started from: ${start}
Their story: ${story}

Return ONLY valid JSON:
{
  "quests": [
    {"title":"quest title","description":"specific action","xp":40,"diff":"easy|medium|hard","insight":"one sentence from their story"}
  ]
}

Make quests specific, based on what they actually did. Use their language.`
  }], null, 800);
  return JSON.parse(stripJson(raw));
}
