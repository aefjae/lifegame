function renderCommunity() {
  const list = document.getElementById('community-list');
  list.innerHTML = STATE.communityStories.map((s,i) => `
    <div class="story-card">
      <div class="story-card-name">${s.name}</div>
      <div class="story-card-meta">${s.role} · Started as: ${s.start} · ${s.year} journey</div>
      <div class="story-card-excerpt">"${s.excerpt}"</div>
      <div class="flex" style="gap:6px;flex-wrap:wrap;margin-bottom:10px;">
        ${s.quests.map(q=>`<span class="tag tag-xp" style="font-size:0.58rem;">${q.title}</span>`).join('')}
      </div>
      <button class="btn btn-sm" onclick="loadCommunityQuests(${i})">
        Use This Roadmap →
      </button>
    </div>
  `).join('');
}

function loadCommunityQuests(idx) {
  const s = STATE.communityStories[idx];
  STATE.quests = s.quests.map((q,i) => ({
    id: i+1,
    title: q.title,
    type: 'main',
    difficulty: q.diff || 'medium',
    description: `Based on ${s.name}'s actual journey as ${s.role}.`,
    why: `${s.name} said this was a turning point.`,
    xp: q.xp,
    gold: Math.floor(q.xp/3),
    skill: 'Craft +1',
    done: false
  }));
  STATE.player.vision = STATE.player.vision || `Become a ${s.role}`;
  STATE.characterReady = true;
  saveState();
  toast(`Loaded ${s.name}'s roadmap!`);
  go('s-quests');
}

async function submitStory() {
  const name = document.getElementById('contrib-name').value.trim();
  const role = document.getElementById('contrib-role').value.trim();
  const start = document.getElementById('contrib-start').value.trim();
  const story = document.getElementById('contrib-story').value.trim();

  if (!role || !story || story.length < 80) {
    toast('⚠ Write more of your story — the more detail, the better the quests!');
    return;
  }

  const resultEl = document.getElementById('story-result');
  resultEl.innerHTML = '<div style="text-align:center;padding:20px;"><div class="spinner"></div><div style="margin-top:10px;font-size:0.8rem;color:var(--muted);">Extracting quests from your journey...</div></div>';

  try {
    const result = await apiExtractStoryQuests(name, role, start, story);

    STATE.communityStories.push({
      name: name || 'Anonymous',
      role, start: start || 'Unknown',
      year: 'Unknown',
      excerpt: story.substring(0, 180) + '...',
      quests: result.quests.map(q => ({ title: q.title, xp: q.xp, diff: q.diff }))
    });

    STATE.player.gold += 50;
    if (!STATE.player.badges.includes('🗺️ Pathfinder')) STATE.player.badges.push('🗺️ Pathfinder');

    saveState();

    resultEl.innerHTML = `
      <div class="notice" style="border-left-color:var(--green2);">
        <strong>✦ ${result.quests.length} quests extracted from your story!</strong><br>
        <span class="dim">Your roadmap has been added to the community. You earned +50 Gold and the Pathfinder badge.</span>
        <div style="margin-top:10px;">
          ${result.quests.map(q=>`<div style="padding:4px 0;font-size:0.82rem;">⚔️ ${q.title}</div>`).join('')}
        </div>
      </div>`;

    refreshDashboard();
    toast('✦ Story submitted! +50 Gold earned');
  } catch(e) {
    resultEl.innerHTML = '<div class="notice">Failed to extract quests. Try again.</div>';
  }
}
