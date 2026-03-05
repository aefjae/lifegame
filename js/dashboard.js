function refreshDashboard() {
  const p = STATE.player;
  document.getElementById('dash-avatar').textContent = p.avatar;
  document.getElementById('dash-name').textContent = p.name || 'Adventurer';
  document.getElementById('dash-class').textContent = p.class || '—';
  document.getElementById('dash-level').textContent = p.level;
  document.getElementById('dash-title').textContent = p.title;
  document.getElementById('dash-xp-text').textContent = `${p.xp} / ${p.xpMax}`;
  document.getElementById('dash-xp-fill').style.width = (p.xp / p.xpMax * 100) + '%';
  document.getElementById('dash-vision').textContent = p.vision ? `"${p.vision}"` : '—';
  document.getElementById('ds-craft').textContent = p.stats.craft;
  document.getElementById('ds-focus').textContent = p.stats.focus;
  document.getElementById('ds-grind').textContent = p.stats.grind;
  document.getElementById('ds-social').textContent = p.stats.social;
  document.getElementById('ds-mind').textContent = p.stats.mind;
  document.getElementById('ds-gold').textContent = p.gold;
  document.getElementById('dash-badges').innerHTML = p.badges.map(b =>
    `<span class="badge earned">${b}</span>`).join('') || '<span class="badge">No badges yet</span>';
}
