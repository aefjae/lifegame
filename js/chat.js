async function initChat() {
  await addAIMsg("Hey. No forms here. Just tell me — what do you want to become? Dream big, don't filter yourself.");
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

async function sendMessage() {
  const inp = document.getElementById('chat-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = ''; inp.style.height = 'auto';
  document.getElementById('send-btn').disabled = true;

  addUserMsg(text);
  STATE.chatHistory.push({ role: 'user', content: text });

  showTyping();
  const reply = await apiChatOnboarding(STATE.chatHistory);
  hideTyping();

  document.getElementById('send-btn').disabled = false;
  saveState();

  if (reply.done) {
    await addAIMsg(reply.message);
    addSystemMsg('✦ Character profile complete. Generating your quest board...');
    if (reply.name) STATE.player.name = reply.name;
    if (reply.job) STATE.player.job = reply.job;
    if (reply.vision) STATE.player.vision = reply.vision;
    setTimeout(() => generateQuests(), 1200);
  } else {
    await addAIMsg(reply.message);
    if (reply.name) STATE.player.name = reply.name;
    if (reply.job) STATE.player.job = reply.job;
    if (reply.vision) STATE.player.vision = reply.vision;
    STATE.chatHistory.push({ role: 'assistant', content: reply.message });
  }
}

// ── CHAT UI HELPERS ───────────────────────────────────────

function addUserMsg(text) {
  const area = document.getElementById('chat-area');
  const el = document.createElement('div');
  el.className = 'msg msg-user';
  el.innerHTML = `<div class="bubble">${escHtml(text)}</div>`;
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
}

async function addAIMsg(text) {
  const area = document.getElementById('chat-area');
  const el = document.createElement('div');
  el.className = 'msg msg-ai';
  el.innerHTML = `<div class="sender">LIFEGAME AI</div><div class="bubble"></div>`;
  area.appendChild(el);
  const bubble = el.querySelector('.bubble');
  for (let i = 0; i < text.length; i++) {
    bubble.textContent += text[i];
    area.scrollTop = area.scrollHeight;
    await sleep(18);
  }
}

function addSystemMsg(text) {
  const area = document.getElementById('chat-area');
  const el = document.createElement('div');
  el.className = 'msg msg-system';
  el.innerHTML = `<div class="bubble">${escHtml(text)}</div>`;
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
}

let typingEl = null;
function showTyping() {
  const area = document.getElementById('chat-area');
  typingEl = document.createElement('div');
  typingEl.className = 'msg msg-ai typing';
  typingEl.innerHTML = `<div class="bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
  area.appendChild(typingEl);
  area.scrollTop = area.scrollHeight;
}

function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}
