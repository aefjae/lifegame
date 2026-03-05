async function generateQuests(regenReason) {
  regenReason = regenReason || null;

  const result = await apiGenerateQuests(STATE.chatHistory, regenReason);

  if (result) {
    STATE.player.class = result.characterClass || 'Wanderer';
    STATE.player.avatar = result.avatar || '🧑';
    STATE.player.title = result.title || 'Seeker';
    if (result.vision) STATE.player.vision = result.vision;
    STATE.quests = result.quests || [];
    STATE.characterReady = true;
    if (!STATE.player.badges.includes('🆕 Day One')) {
      STATE.player.badges = ['🆕 Day One', '💭 Visionary'];
    }
  } else {
    // Fallback quests if API unavailable
    STATE.quests = [
      { id:1, title:'Write Your "Level 10" Vision', type:'side', difficulty:'easy', description:'Spend 20 minutes writing what your ideal life looks like in detail. Be specific about what you do, feel, and earn.', why:'Clarity of vision is the first skill of every successful person.', xp:25, gold:8, skill:'Mindset +1' },
      { id:2, title:'Find One Person Already Living Your Dream', type:'main', difficulty:'easy', description:'Research one person 5 years ahead of you on your path. Study their journey for 30 minutes.', why:"Someone already solved the puzzle you're working on.", xp:30, gold:10, skill:'Focus +1' },
      { id:3, title:'Take One Concrete Action Today', type:'main', difficulty:'medium', description:'Based on your goal, do one specific thing today. Not research — a real action.', why:'Action beats preparation. Always.', xp:50, gold:15, skill:'Craft +1' }
    ];
    STATE.characterReady = true;
  }

  saveState();
  go('s-quests');
  toast('✦ Quest board ready!');
}

function refreshQuestBoard() {
  const p = STATE.player;
  document.getElementById('quest-kicker').textContent = `${p.class || 'Your'} Quest Board`;
  document.getElementById('quest-headline').textContent = p.name ? `${p.name}'s Quests` : 'Your Quests';
  document.getElementById('quest-subhead').textContent = p.vision ? `"${p.vision}"` : '';

  const list = document.getElementById('quest-list');
  if (!STATE.quests.length) {
    list.innerHTML = '<div class="notice">No quests yet. Complete onboarding to generate your quest board.</div>';
    return;
  }

  list.innerHTML = STATE.quests.map(q => {
    const typeLabel = q.type === 'main' ? 'MAIN QUEST' : q.type === 'daily' ? 'DAILY' : 'SIDE QUEST';
    const diffClass = q.difficulty === 'easy' ? 'tag-diff-easy' : q.difficulty === 'hard' ? 'tag-diff-hard' : 'tag-diff-med';
    const doneStyle = q.done ? 'opacity:0.5;' : '';
    const doneLabel = q.done ? '<span style="float:right;font-size:0.8rem;">✅</span>' : '';
    return `
    <div class="quest-col" style="${doneStyle}">
      ${doneLabel}
      <div class="quest-col-type">${typeLabel}</div>
      <div class="quest-col-title">${q.title}</div>
      <div class="quest-col-desc">${q.description}</div>
      <div class="dim" style="font-size:0.78rem;font-style:italic;margin-bottom:10px;border-left:2px solid var(--border);padding-left:8px;">${q.why}</div>
      <div class="quest-col-footer">
        <span class="tag tag-xp">+${q.xp} XP</span>
        <span class="tag tag-gold">+${q.gold}G</span>
        <span class="tag tag-skill">${q.skill}</span>
        <span class="tag ${diffClass}">${q.difficulty.toUpperCase()}</span>
      </div>
    </div>`;
  }).join('');

  // Fill checkin select
  const sel = document.getElementById('ci-quest');
  if (sel) sel.innerHTML = STATE.quests.map(q => `<option value="${q.id}">${q.title}</option>`).join('');
}

function openRegenModal() {
  document.getElementById('regen-modal').classList.add('open');
}

function closeRegenModal() {
  document.getElementById('regen-modal').classList.remove('open');
  document.getElementById('regen-reason').value = '';
}

async function confirmRegen() {
  const reason = document.getElementById('regen-reason').value.trim();
  if (!reason) { toast('⚠ Tell us why first'); return; }
  closeRegenModal();
  toast('Regenerating quests...');
  document.getElementById('quest-list').innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);"><div class="spinner"></div><div style="margin-top:12px;font-size:0.82rem;">Generating new quests...</div></div>';
  await generateQuests(reason);
  refreshQuestBoard();
  toast('✦ New quests generated!');
}
