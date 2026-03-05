const STORAGE_KEY = 'lifegame_state_v1';

const DEFAULT_STATE = {
  player: {
    name:'', job:'', vision:'', class:'', avatar:'🧑', title:'Novice',
    level:1, xp:0, xpMax:100, gold:0, streak:0, day:1,
    stats:{ craft:5, focus:5, grind:5, social:5, mind:5 },
    badges:[], log:[]
  },
  quests: [],
  chatHistory: [],
  characterReady: false,
  mood: '',
  communityStories: [
    {
      name: 'Rian D.',
      role: 'Self-taught Sound Engineer',
      start: 'High school grad, no music background',
      year: '3 years',
      excerpt: 'Started with a cracked copy of FL Studio and YouTube tutorials at 19. Got my first paid gig mixing for a local indie band for Rp 150K. Now I mix for labels.',
      quests: [
        { title: 'Learn One DAW for 30 Days Straight', xp:60, diff:'med' },
        { title: 'Mix a Track, Then Ask for Brutal Feedback', xp:50, diff:'med' },
        { title: 'Reach Out to 3 Local Artists This Week', xp:40, diff:'easy' },
      ]
    },
    {
      name: 'Citra M.',
      role: 'Freelance UI Designer',
      start: 'Marketing grad who hated marketing',
      year: '2 years',
      excerpt: 'Graduated in Marketing, hated every internship. Spent 6 months doing design challenges on Figma every morning before work. Quit my job at month 7 when I had 3 freelance clients.',
      quests: [
        { title: 'Complete a Design Challenge Every Morning for 2 Weeks', xp:70, diff:'hard' },
        { title: 'Redesign a Bad UI You Use Daily', xp:45, diff:'easy' },
        { title: 'Get One Stranger to Review Your Portfolio', xp:35, diff:'med' },
      ]
    },
    {
      name: 'Anonymous',
      role: 'Sober for 14 months',
      start: '3-year addiction, rock bottom moment',
      year: '14 months',
      excerpt: "I won't share details but I want others to know: you can gamify recovery too. I tracked every sober day like XP. Made it a streak. When I hit 30 days I cried.",
      quests: [
        { title: 'Track One Sober Day — Just One', xp:30, diff:'easy' },
        { title: 'Tell One Person About Your Goal', xp:40, diff:'hard' },
        { title: 'Find Your Trigger Pattern — Write It Down', xp:50, diff:'med' },
      ]
    }
  ]
};

// Deep merge: saved values override defaults, new default keys are preserved
function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const merged = deepMerge(DEFAULT_STATE, parsed);
    Object.assign(STATE, merged);
  } catch(e) {
    // Corrupt data — start fresh
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  } catch(e) {
    // Storage full or unavailable — continue without saving
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(STATE, JSON.parse(JSON.stringify(DEFAULT_STATE)));
}

// STATE is the live object all modules read and write
const STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));

// Rehydrate from localStorage on load
loadState();
