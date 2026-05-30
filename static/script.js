// ── PAGE NAVIGATION ───────────────────────────────────
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── CHAT ──────────────────────────────────────────────
let chatHistory = [];

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;

  appendMsg(msg, 'user');
  input.value = '';

  chatHistory.push({ role: 'user', content: msg });

  // Typing indicator
  const typingId = appendTyping();

  try {
    const res  = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: chatHistory.slice(-10) })
    });
    const data = await res.json();
    removeTyping(typingId);
    appendMsg(data.reply, 'bot');
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch {
    removeTyping(typingId);
    appendMsg('Error connecting to server. Make sure Flask is running!', 'bot');
  }
}

function appendMsg(text, role) {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar">${role === 'bot' ? 'AI' : 'YOU'}</div>
    <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function appendTyping() {
  const box = document.getElementById('chatMessages');
  const id  = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = id;
  div.innerHTML = `
    <div class="msg-avatar">AI</div>
    <div class="msg-bubble typing"><span></span><span></span><span></span></div>
  `;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── SENTIMENT ─────────────────────────────────────────
async function analyzeSentiment() {
  const text = document.getElementById('sentimentInput').value.trim();
  if (!text) return;

  const btn = document.querySelector('#page-sentiment .analyze-btn');
  btn.innerHTML = '<div class="loading"></div> Analyzing...';
  btn.disabled  = true;

  try {
    const res  = await fetch('/api/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();

    const label = data.sentiment.toLowerCase();
    const badge = document.getElementById('sentimentBadge');
    badge.textContent  = data.sentiment.toUpperCase();
    badge.className    = `sentiment-badge ${label}`;

    document.getElementById('sentimentText').textContent = `"${data.text}"`;
    document.getElementById('sentimentResult').style.display = 'block';
  } catch {
    alert('Error! Make sure Flask server is running.');
  } finally {
    btn.innerHTML = 'Analyze Sentiment <span class="btn-arrow">→</span>';
    btn.disabled  = false;
  }
}

function setExample(text) {
  document.getElementById('sentimentInput').value = text;
}

// ── FLOWER ────────────────────────────────────────────
function previewFlower(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('flowerPreview').style.display = 'flex';
    document.getElementById('flowerResult').style.display  = 'none';
    document.getElementById('uploadZone').style.display    = 'none';
  };
  reader.readAsDataURL(file);
}

function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const dt = new DataTransfer();
  dt.items.add(file);
  document.getElementById('flowerInput').files = dt.files;

  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('flowerPreview').style.display = 'flex';
    document.getElementById('flowerResult').style.display  = 'none';
    document.getElementById('uploadZone').style.display    = 'none';
  };
  reader.readAsDataURL(file);
}

async function predictFlower() {
  const fileInput = document.getElementById('flowerInput');
  if (!fileInput.files[0]) return;

  const btn = document.querySelector('#page-flower .analyze-btn');
  btn.innerHTML = '<div class="loading"></div> Identifying...';
  btn.disabled  = true;

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);

  try {
    const res  = await fetch('/api/flower', { method: 'POST', body: formData });
    const data = await res.json();

    // Flower name
    document.getElementById('flowerName').textContent =
      data.flower.charAt(0).toUpperCase() + data.flower.slice(1);

    // Confidence bars
    const barsDiv = document.getElementById('confBars');
    barsDiv.innerHTML = '';
    Object.entries(data.all_probs).forEach(([name, prob]) => {
      const row = document.createElement('div');
      row.className = 'conf-row';
      row.innerHTML = `
        <div class="conf-label">
          <span>${name.charAt(0).toUpperCase() + name.slice(1)}</span>
          <span>${prob}%</span>
        </div>
        <div class="conf-track">
          <div class="conf-fill" style="width:0%" data-width="${prob}%"></div>
        </div>
      `;
      barsDiv.appendChild(row);
    });

    document.getElementById('flowerResult').style.display = 'block';

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.conf-fill').forEach(el => {
        el.style.width = el.dataset.width;
      });
    }, 50);

  } catch {
    alert('Error! Make sure Flask server is running.');
  } finally {
    btn.innerHTML = 'Identify Flower <span class="btn-arrow">→</span>';
    btn.disabled  = false;
  }
}
