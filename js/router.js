function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  if (id === 's-dashboard') refreshDashboard();
  if (id === 's-checkin') refreshCheckin();
  if (id === 's-quests') refreshQuestBoard();
  if (id === 's-community') renderCommunity();
  if (id === 's-chat' && STATE.chatHistory.length === 0) initChat();
}

function switchTab(el, tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['tab-browse','tab-submit'].forEach(id => {
    document.getElementById(id).style.display = (id === tabId) ? 'block' : 'none';
  });
}
