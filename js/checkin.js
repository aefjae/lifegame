function pickMood(btn, val) {
  document.querySelectorAll('#mood-btns .btn').forEach(b => b.classList.remove('btn-fill'));
  btn.classList.add('btn-fill');
  STATE.mood = val;
}

function refreshCheckin() {
  document.getElementById('checkin-day-num').textContent = STATE.player.day;
  document.getElementById('streak-count').textContent = STATE.player.streak;
  const dots = document.getElementById('streak-dots');
  dots.innerHTML = Array.from({length:7}, (_,i) =>
    `<div class="sd ${i < STATE.player.streak ? 'lit' : ''}">${i+1}</div>`).join('');
  const sel = document.getElementById('ci-quest');
  sel.innerHTML = STATE.quests.map(q => `<option value="${q.id}">${q.title}</option>`).join('');
}

async function submitCheckin() {
  const qid = parseInt(document.getElementById('ci-quest').value);
  const action = document.getElementById('ci-action').value.trim();
  const learn = document.getElementById('ci-learn').value.trim();
  if (!action) { toast('⚠ Tell us what you did!'); return; }
  if (!STATE.mood) { toast('⚠ Pick a mood!'); return; }

  const q = STATE.quests.find(x => x.id === qid);
  const xpGain = q ? Math.floor(q.xp * 0.55) : 20;
  const goldGain = q ? Math.floor(q.gold * 0.5) : 5;

  STATE.player.xp += xpGain;
  STATE.player.gold += goldGain;
  STATE.player.streak++;
  STATE.player.day++;

  // Level up
  while (STATE.player.xp >= STATE.player.xpMax) {
    STATE.player.xp -= STATE.player.xpMax;
    STATE.player.level++;
    STATE.player.xpMax = Math.floor(STATE.player.xpMax * 1.5);
    const keys = Object.keys(STATE.player.stats);
    STATE.player.stats[keys[Math.floor(Math.random() * keys.length)]]++;
  }

  if (q) { q._count = (q._count||0)+1; if(q._count >= (q.difficulty==='easy'?1:2)) q.done=true; }

  // Streak badges
  if (STATE.player.streak === 3 && !STATE.player.badges.includes('🔥 3-Day Streak')) {
    STATE.player.badges.push('🔥 3-Day Streak');
  }
  if (STATE.player.streak === 7 && !STATE.player.badges.includes('⚡ Week Warrior')) {
    STATE.player.badges.push('⚡ Week Warrior');
  }

  STATE.player.log.push({ day:STATE.player.day, quest:q?.title, action, learn, mood:STATE.mood });

  // Get AI insight
  const insight = await apiCheckinInsight(action, learn, STATE.mood, q?.title);

  // Reset form
  document.getElementById('ci-action').value = '';
  document.getElementById('ci-learn').value = '';
  document.querySelectorAll('#mood-btns .btn').forEach(b => b.classList.remove('btn-fill'));
  STATE.mood = '';

  saveState();
  toast(`+${xpGain} XP · +${goldGain}G earned!`);
  refreshDashboard();

  go('s-quests');
  refreshQuestBoard();

  // Append insight to quest board
  const insightEl = document.createElement('div');
  insightEl.className = 'notice';
  insightEl.style.marginTop = '16px';
  insightEl.style.borderLeft = '3px solid var(--green2)';
  insightEl.innerHTML = `<strong style="font-size:0.72rem;font-family:'Syne Mono',monospace;letter-spacing:0.1em;">TODAY'S INSIGHT</strong><br><span style="font-family:'Instrument Serif',serif;font-style:italic;">${insight}</span>`;
  document.getElementById('quest-list').prepend(insightEl);
}
