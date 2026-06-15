import './style.css';
import confetti from 'canvas-confetti';

// ==========================================
// 1. ICONS PACK
// ==========================================

const ICONS = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-9 11h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
  room: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
  alert: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l18 18" /></svg>`,
  database: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  stats: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
};

// ==========================================
// 2. CLIENT APP STATE
// ==========================================

class AppState {
  constructor() {
    this.advisors = [];
    this.votes = [];
    this.selectedAdvisorId = null;
    this.activeTab = 'vote';
    this.searchQuery = '';
    this.votingOpen = true;

    // Cached inputs
    this.studentName = '';
    this.studentId = '';
  }

  getFilledSlots(advisorId) {
    return this.votes.filter(vote => vote.advisorId === advisorId).length;
  }

  getRemainingSlots(advisorId) {
    const advisor = this.advisors.find(a => a.id === advisorId);
    if (!advisor) return 0;
    return advisor.capacity - this.getFilledSlots(advisorId);
  }
}

const state = new AppState();

// ==========================================
// 3. BACKEND API INTEGRATIONS
// ==========================================

async function fetchState() {
  try {
    const advRes = await fetch('/api/advisors');
    const advData = await advRes.json();
    if (advData.success) {
      state.advisors = advData.data;
    }

    const votesRes = await fetch('/api/votes');
    const votesData = await votesRes.json();
    if (votesData.success) {
      state.votes = votesData.data;
    }

    const settingsRes = await fetch('/api/settings');
    const settingsData = await settingsRes.json();
    if (settingsData.success) {
      state.votingOpen = settingsData.data.voting_open;
    }
  } catch (error) {
    createToast("ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์กลางได้", "error");
    console.error("Fetch state error:", error);
  }
}

// ==========================================
// 4. UI RENDERING & COMPONENT BUILDERS
// ==========================================

function createToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = ICONS.checkCircle;
  if (type === 'error' || type === 'warning') icon = ICONS.alert;

  toast.innerHTML = `
    <span style="width: 1.25rem; height: 1.25rem; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;">
      ${icon}
    </span>
    <div style="flex-grow: 1;">${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
}

function renderAdvisorGrid() {
  const grid = document.getElementById('advisor-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filteredAdvisors = state.advisors.filter(advisor => {
    return advisor.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      advisor.engName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      advisor.interests.some(interest => interest.toLowerCase().includes(state.searchQuery.toLowerCase()));
  });

  if (filteredAdvisors.length === 0) {
    grid.innerHTML = `
      <div class="glass-panel" style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3>ไม่พบข้อมูลอาจารย์ที่ค้นหา</h3>
      </div>
    `;
    return;
  }

  filteredAdvisors.forEach(advisor => {
    const filled = state.getFilledSlots(advisor.id);
    const capacity = advisor.capacity;
    const remaining = capacity - filled;
    
    let statusClass = 'available';
    let statusText = `ว่าง ${remaining} ที่นั่ง`;
    if (remaining === 0) {
      statusClass = 'full';
      statusText = 'เต็มแล้ว';
    } else if (remaining <= 3) {
      statusClass = 'warning';
      statusText = `ใกล้เต็ม (เหลือ ${remaining})`;
    }

    const isSelected = state.selectedAdvisorId === advisor.id;
    const isFull = remaining === 0;

    const assignedStudents = state.votes.filter(v => v.advisorId === advisor.id);

    const card = document.createElement('div');
    card.className = `advisor-card ${isSelected ? 'selected' : ''} ${isFull ? 'full-slots' : ''}`;
    card.dataset.id = advisor.id;

    const nameWords = advisor.name.split(' ');
    const initials = nameWords[nameWords.length - 1] ? nameWords[nameWords.length - 1].charAt(0) : 'A';
    
    const avatarHtml = advisor.imageUrl 
      ? `<img class="advisor-avatar" src="${advisor.imageUrl}" alt="${advisor.name}" style="object-fit: cover;" />`
      : `<div class="advisor-avatar" style="background: ${advisor.avatarGradient};">${initials}</div>`;

    card.innerHTML = `
      <div class="advisor-header">
        ${avatarHtml}
        <div class="advisor-meta">
          <h3 class="advisor-name" title="${advisor.name}">${advisor.name}</h3>
          <span class="advisor-dept">${advisor.department}</span>
        </div>
      </div>
      <div class="advisor-body">
        <div class="advisor-details">
          <div class="advisor-detail-item">
            ${ICONS.mail}
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${advisor.email}">${advisor.email}</span>
          </div>
        </div>
        <div class="advisor-interests">
          ${advisor.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
        </div>
      </div>
      <div class="advisor-slots">
        <div class="slot-header">
          <span class="slot-status ${statusClass}">${statusText}</span>
          <span style="color: var(--text-secondary); font-size: 0.75rem;">${filled}/${capacity} คน</span>
        </div>
        <div class="slot-bar" style="margin-bottom: 0.75rem;">
          <div class="slot-bar-fill ${statusClass}" style="width: ${(filled / capacity) * 100}%"></div>
        </div>

        <!-- Collapsible Assigned Students List -->
        <div style="margin-top: 0.5rem; border-top: 1px dashed var(--border-subtle); padding-top: 0.5rem;">
          <button class="btn btn-secondary btn-sm toggle-student-list-btn" style="width: 100%; justify-content: space-between; padding: 0.25rem 0.5rem; font-size: 0.7rem;">
            รายชื่อนักศึกษา (${assignedStudents.length} คน)
            <span class="arrow-indicator">▼</span>
          </button>
          <div class="card-student-list-container" style="display: none; margin-top: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 0.5rem; border: 1px solid var(--border-subtle);">
            ${assignedStudents.length === 0 
              ? `<div style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">ยังไม่มีนักศึกษาลงโหวต</div>`
              : `<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.3rem; max-height: 100px; overflow-y: auto;">
                  ${assignedStudents.map((s, idx) => `
                    <li style="font-size: 0.7rem; display: flex; justify-content: space-between; color: var(--text-secondary);">
                      <span>${idx + 1}. ${s.studentName}</span>
                      <span style="font-family: monospace; color: var(--text-muted);">${s.studentId}</span>
                    </li>
                  `).join('')}
                 </ul>`
            }
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (!state.votingOpen) {
        createToast("ระบบลงทะเบียนปิดรับโหวตชั่วคราว", "warning");
        return;
      }

      if (isFull) {
        createToast(`ที่นั่งสำหรับ ${advisor.name} เต็มแล้ว กรุณาเลือกท่านอื่น`, 'warning');
        return;
      }

      if (state.selectedAdvisorId === advisor.id) {
        state.selectedAdvisorId = null;
      } else {
        state.selectedAdvisorId = advisor.id;
      }
      renderAdvisorGrid();
      updateSelectionDrawer();
    });

    const toggleBtn = card.querySelector('.toggle-student-list-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const listContainer = card.querySelector('.card-student-list-container');
        const isHidden = listContainer.style.display === 'none';
        listContainer.style.display = isHidden ? 'block' : 'none';
        toggleBtn.querySelector('.arrow-indicator').textContent = isHidden ? '▲' : '▼';
      });
    }

    grid.appendChild(card);
  });
}

function updateSelectionDrawer() {
  const drawer = document.getElementById('selection-drawer');
  if (!drawer) return;
  
  if (!state.selectedAdvisorId) {
    drawer.classList.remove('show');
    return;
  }

  const selectedAdvisor = state.advisors.find(a => a.id === state.selectedAdvisorId);
  if (!selectedAdvisor) return;

  state.studentName = document.getElementById('student-name').value.trim();
  state.studentId = document.getElementById('student-id').value.trim();

  const drawerAdvisorAvatar = drawer.querySelector('.drawer-advisor-avatar');
  if (selectedAdvisor.imageUrl) {
    drawerAdvisorAvatar.style.background = 'none';
    drawerAdvisorAvatar.innerHTML = `<img src="${selectedAdvisor.imageUrl}" alt="${selectedAdvisor.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;" />`;
  } else {
    drawerAdvisorAvatar.style.background = selectedAdvisor.avatarGradient;
    drawerAdvisorAvatar.innerHTML = '';
    const nameWords = selectedAdvisor.name.split(' ');
    drawerAdvisorAvatar.textContent = nameWords[nameWords.length - 1] ? nameWords[nameWords.length - 1].charAt(0) : 'A';
  }
  
  drawer.querySelector('.drawer-advisor-name').textContent = selectedAdvisor.name;
  drawer.querySelector('.drawer-advisor-dept').textContent = selectedAdvisor.department;

  const studentInfoContainer = drawer.querySelector('.drawer-student-info');
  if (state.studentName || state.studentId) {
    studentInfoContainer.style.display = 'block';
    drawer.querySelector('.drawer-student-name').textContent = state.studentName || '(ไม่ได้ระบุชื่อ)';
    drawer.querySelector('.drawer-student-id-val').textContent = state.studentId || '(ไม่ได้ระบุรหัส)';
  } else {
    studentInfoContainer.style.display = 'none';
  }

  drawer.classList.add('show');
}

function renderStatsPanel() {
  const totalVotes = state.votes.length;
  let totalCap = 0;
  state.advisors.forEach(a => totalCap += a.capacity);
  
  const filledPct = totalCap > 0 ? Math.round((totalVotes / totalCap) * 100) : 0;
  
  document.getElementById('stat-total-votes').textContent = `${totalVotes} คน`;
  document.getElementById('stat-capacity-pct').textContent = `${filledPct}%`;
  document.getElementById('stat-available-slots').textContent = `${totalCap - totalVotes} ที่นั่ง`;

  const chartContainer = document.getElementById('chart-container');
  if (!chartContainer) return;
  chartContainer.innerHTML = '';

  state.advisors.forEach(advisor => {
    const filled = state.getFilledSlots(advisor.id);
    const capacity = advisor.capacity;
    const pct = Math.round((filled / capacity) * 100);

    const row = document.createElement('div');
    row.className = 'chart-bar-row';

    let color = 'var(--color-primary)';
    if (pct >= 100) color = 'var(--color-danger)';
    else if (pct >= 80) color = 'var(--color-warning)';
    else if (filled > 0) color = 'var(--color-success)';

    row.innerHTML = `
      <div class="chart-bar-info">
        <span class="chart-bar-label">${advisor.name}</span>
        <span class="chart-bar-value">${filled} / ${capacity} คน (${pct}%)</span>
      </div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" style="width: ${pct}%; background: ${color}; box-shadow: 0 0 8px ${color}55;"></div>
      </div>
    `;
    chartContainer.appendChild(row);
  });

  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  historyList.innerHTML = '';

  if (state.votes.length === 0) {
    historyList.innerHTML = `
      <div class="no-data">
        ${ICONS.database}
        <p>ยังไม่มีประวัติการลงทะเบียนในฐานข้อมูล</p>
      </div>
    `;
    return;
  }

  state.votes.forEach(vote => {
    const advisor = state.advisors.find(a => a.id === vote.advisorId);
    const date = new Date(vote.timestamp);
    const timeStr = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-details">
        <div class="history-student-name" title="${vote.studentName}">${vote.studentName}</div>
        <div class="history-student-meta">รหัส ${vote.studentId}</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
        <span class="history-advisor" title="${advisor ? advisor.name : 'ไม่พบอาจารย์'}">
          ${advisor ? advisor.name : 'ไม่พบอาจารย์'}
        </span>
        <span class="history-time">${timeStr}</span>
      </div>
    `;
    historyList.appendChild(item);
  });
}

function handleVoteSubmit() {
  const nameInput = document.getElementById('student-name');
  const idInput = document.getElementById('student-id');

  const name = nameInput.value.trim();
  const id = idInput.value.trim();
  const advisorId = state.selectedAdvisorId;

  if (!name) {
    createToast("กรุณากรอก ชื่อ-นามสกุล ของท่าน", "error");
    nameInput.focus();
    return;
  }

  if (!id) {
    createToast("กรุณากรอก รหัสนักศึกษา ของท่าน", "error");
    idInput.focus();
    return;
  }

  const idRegex = /^[a-zA-Z0-9-]{8,15}$/;
  if (!idRegex.test(id)) {
    createToast("รหัสนักศึกษาไม่ถูกต้อง (กรอกรหัสนักศึกษา 8-15 หลัก เฉพาะตัวเลขและภาษาอังกฤษ)", "error");
    idInput.focus();
    return;
  }

  if (!advisorId) {
    createToast("กรุณาเลือกอาจารย์ที่ปรึกษาที่ต้องการจับคู่", "error");
    return;
  }

  const selectedAdvisor = state.advisors.find(a => a.id === advisorId);
  if (!selectedAdvisor) return;

  const modal = document.getElementById('confirm-modal');
  modal.querySelector('.modal-student-name').textContent = name;
  modal.querySelector('.modal-student-id').textContent = id;
  modal.querySelector('.modal-advisor-name').textContent = selectedAdvisor.name;
  modal.querySelector('.modal-advisor-dept').textContent = selectedAdvisor.department;

  modal.classList.add('show');
}

async function confirmVoteExecution() {
  const name = document.getElementById('student-name').value.trim();
  const id = document.getElementById('student-id').value.trim();
  const advisorId = state.selectedAdvisorId;

  try {
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentName: name,
        studentId: id,
        advisorId: advisorId
      })
    });

    const resData = await response.json();

    if (!resData.success) {
      throw new Error(resData.message);
    }

    const vote = resData.data;

    document.getElementById('confirm-modal').classList.remove('show');

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    });

    const successModal = document.getElementById('success-modal');
    successModal.querySelector('.success-student-name').textContent = vote.studentName;
    
    const advisor = state.advisors.find(a => a.id === vote.advisorId);
    successModal.querySelector('.success-advisor-name').textContent = advisor ? advisor.name : '';
    successModal.classList.add('show');

    document.getElementById('student-name').value = '';
    document.getElementById('student-id').value = '';
    state.selectedAdvisorId = null;

    await fetchState();
    updateSelectionDrawer();
    renderAdvisorGrid();
    renderStatsPanel();
  } catch (error) {
    document.getElementById('confirm-modal').classList.remove('show');
    createToast(error.message, "error");
  }
}

// ==========================================
// 5. MAIN HTML LAYOUT INITIALIZATION
// ==========================================

function initAppHTML() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- App Header -->
    <header class="app-header">
      <div class="brand">
        <span class="brand-logo">AdvisorSelect</span>
      </div>
      
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="nav-tabs">
          <button class="tab-btn active" id="tab-vote-btn">
            <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.checkCircle}</span>
            ลงคะแนนโหวต
          </button>
          <button class="tab-btn" id="tab-results-btn">
            <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.stats}</span>
            ผลคะแนนแบบสด
          </button>
        </div>
        
        <button class="btn-icon" id="theme-toggle-btn" style="border-radius: 12px; width: 38px; height: 38px; cursor: pointer; border: 1px solid var(--border-subtle); display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); color: var(--text-secondary);"></button>
      </div>
    </header>

    <!-- Main Container -->
    <main class="main-content">
      
      <!-- TAB 1: VOTING PANEL -->
      <section class="tab-panel active" id="panel-vote">
        <!-- Voting Closed Alert Banner -->
        <div id="voting-closed-banner" style="display: none; margin-bottom: 1.5rem; background: var(--color-danger-bg); border: 1px solid rgba(239, 68, 68, 0.3); padding: 1rem 1.25rem; border-radius: 12px; align-items: center; gap: 0.75rem;">
          <span style="width: 1.5rem; height: 1.5rem; color: var(--color-danger); display: inline-flex; flex-shrink: 0;">${ICONS.alert}</span>
          <div>
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.15rem; font-size: 0.9rem;">ระบบปิดรับลงคะแนนชั่วคราว</h4>
            <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0; line-height: 1.4;">ผู้ดูแลระบบได้ทำการปิดระบบลงทะเบียนชั่วคราว คุณไม่สามารถทำการเลือกอาจารย์หรือบันทึกข้อมูลได้ในขณะนี้</p>
          </div>
        </div>

        <div class="voting-grid">
          
          <!-- Student Details Form -->
          <div class="glass-panel" style="position: sticky; top: 1.5rem;">
            <h2 class="panel-title">
              <span style="width: 1.25rem; height: 1.25rem; display: inline-flex; color: var(--color-primary);">${ICONS.user}</span>
              ข้อมูลผู้ลงคะแนน
            </h2>
            
            <div class="form-group">
              <label for="student-name">ชื่อ - นามสกุล</label>
              <input type="text" id="student-name" class="form-input" placeholder="เช่น นายสมชาย รักเรียน" autocomplete="off" />
            </div>

            <div class="form-group">
              <label for="student-id">รหัสนักศึกษา</label>
              <input type="text" id="student-id" class="form-input" placeholder="เช่น 66010123" autocomplete="off" />
            </div>

            <div style="margin-top: 1.5rem; display: flex; align-items: flex-start; gap: 0.5rem; background: rgba(255, 255, 255, 0.02); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <span style="width: 1.2rem; height: 1.2rem; display: inline-flex; color: var(--text-muted); flex-shrink: 0;">${ICONS.info}</span>
              <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
                กรอกข้อมูลของท่านให้ครบถ้วน จากนั้นเลือกอาจารย์ที่ปรึกษาที่ต้องการทางขวา และกดยืนยันการลงคะแนน (โหวตได้เพียง 1 ครั้งเท่านั้น)
              </p>
            </div>
          </div>

          <!-- Advisor Selection Area -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Filters Header -->
            <div class="advisor-board-header">
              <div class="search-box" style="max-width: 100%;">
                <span class="search-icon">${ICONS.search}</span>
                <input type="text" id="advisor-search" class="search-input" placeholder="ค้นหาอาจารย์วิทยาการคอมพิวเตอร์ ด้วยชื่อหรือหัวข้องานวิจัย..." />
              </div>
            </div>

            <!-- Grid of Cards -->
            <div class="advisor-grid" id="advisor-grid"></div>

          </div>

        </div>
      </section>

      <!-- TAB 2: LIVE STATISTICS PANEL -->
      <section class="tab-panel" id="panel-results">
        
        <!-- Quick stats cards -->
        <div class="stats-header-grid">
          <div class="stat-card">
            <div class="stat-icon-container primary">${ICONS.user}</div>
            <div class="stat-info">
              <span class="stat-label">นักศึกษาลงทะเบียนแล้ว</span>
              <span class="stat-value" id="stat-total-votes">0 คน</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon-container success">${ICONS.checkCircle}</div>
            <div class="stat-info">
              <span class="stat-label">อัตราส่วนการจับคู่</span>
              <span class="stat-value" id="stat-capacity-pct">0%</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-container secondary">${ICONS.room}</div>
            <div class="stat-info">
              <span class="stat-label">ที่นั่งปรึกษาที่เหลือ</span>
              <span class="stat-value" id="stat-available-slots">0 ที่นั่ง</span>
            </div>
          </div>
        </div>

        <div class="stats-main-grid">
          
          <!-- Bar Chart Slots filled -->
          <div class="glass-panel chart-panel">
            <h2 class="panel-title" style="margin-bottom: 0.5rem;">
              <span style="width: 1.25rem; height: 1.25rem; display: inline-flex; color: var(--color-secondary);">${ICONS.stats}</span>
              สถานะสล็อตที่ปรึกษาของอาจารย์แต่ละท่าน (วิทยาการคอมพิวเตอร์)
            </h2>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">
              แสดงอัตราส่วนการครองสล็อตที่ปรึกษาแบบเรียลไทม์ (เมื่อเต็มแล้วจะไม่สามารถเลือกได้อีก)
            </p>
            <div class="chart-container" id="chart-container"></div>
          </div>

          <!-- Live Voting Feed -->
          <div class="glass-panel history-panel">
            <h2 class="panel-title" style="margin-bottom: 0.5rem;">
              <span style="width: 1.25rem; height: 1.25rem; display: inline-flex; color: var(--color-primary);">${ICONS.database}</span>
              กิจกรรมการลงทะเบียนสด
            </h2>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">
              ประวัติการเลือกที่ปรึกษาล่าสุดของนักศึกษา
            </p>
            <div class="history-list" id="history-list"></div>
          </div>

        </div>

      </section>

    </main>

    <!-- Floating Selection Drawer (Bottom) -->
    <div class="selection-drawer" id="selection-drawer">
      <div class="drawer-details">
        
        <!-- Left: Student info summary -->
        <div class="drawer-student-info">
          <div class="drawer-label">ผู้ลงคะแนน</div>
          <div class="drawer-value" style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="drawer-student-name"></span>
            <span style="color: var(--text-muted); font-weight: normal;">•</span>
            <span class="drawer-student-id-val" style="color: var(--text-secondary);"></span>
          </div>
        </div>

        <!-- Right: selected advisor summary -->
        <div class="drawer-advisor-info">
          <div class="drawer-advisor-avatar"></div>
          <div>
            <div class="drawer-label">อาจารย์ที่ปรึกษาที่เลือก</div>
            <div class="drawer-value" style="display: flex; align-items: center; gap: 0.4rem;">
              <span class="drawer-advisor-name" style="color: var(--color-primary); font-weight: 700;"></span>
              <span style="font-size: 0.8rem; background: rgba(255, 255, 255, 0.05); padding: 0.1rem 0.4rem; border-radius: 4px; color: var(--text-secondary);" class="drawer-advisor-dept"></span>
            </div>
          </div>
        </div>

      </div>

      <div>
        <button class="btn btn-primary" id="drawer-submit-btn">
          ลงคะแนนเลือก
          <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.check}</span>
        </button>
      </div>
    </div>

    <!-- Confirm Modal Overlay -->
    <div class="modal-overlay" id="confirm-modal">
      <div class="modal-content">
        <div class="modal-icon-container confirm">
          <span style="width: 2rem; height: 2rem; display: inline-flex;">${ICONS.alert}</span>
        </div>
        <h3 class="modal-title">ยืนยันการลงทะเบียน?</h3>
        <p class="modal-desc">
          ข้อมูลการโหวตเลือกที่ปรึกษาของท่านจะไม่สามารถแก้ไขหรือลงทะเบียนใหม่ได้อีกในภายหลัง กรุณาตรวจสอบข้อมูลด้านล่างให้ถูกต้อง
        </p>

        <div class="modal-summary-box">
          <div class="summary-row">
            <span class="summary-label">ชื่อ-นามสกุล:</span>
            <span class="summary-val modal-student-name"></span>
          </div>
          <div class="summary-row">
            <span class="summary-label">รหัสนักศึกษา:</span>
            <span class="summary-val modal-student-id"></span>
          </div>
          <div style="border-top: 1px solid var(--border-subtle); margin: 0.5rem 0; padding-top: 0.5rem;" class="summary-row">
            <span class="summary-label">อาจารย์ที่เลือก:</span>
            <span class="summary-val modal-advisor-name" style="color: var(--color-primary);"></span>
          </div>
          <div class="summary-row">
            <span class="summary-label">สาขาอาจารย์:</span>
            <span class="summary-val modal-advisor-dept" style="font-size: 0.8rem; color: var(--text-secondary);"></span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" id="confirm-cancel-btn">ยกเลิก</button>
          <button class="btn btn-primary" id="confirm-agree-btn">ยืนยันการโหวต</button>
        </div>
      </div>
    </div>

    <!-- Success Modal Overlay -->
    <div class="modal-overlay" id="success-modal">
      <div class="modal-content">
        <div class="modal-icon-container success">
          <span style="width: 2rem; height: 2rem; display: inline-flex;">${ICONS.checkCircle}</span>
        </div>
        <h3 class="modal-title">ลงทะเบียนสำเร็จ!</h3>
        <p class="modal-desc" style="margin-bottom: 1.5rem;">
          ระบบได้บันทึกคะแนนเลือกอาจารย์ที่ปรึกษาเรียบร้อยแล้ว ยินดีต้อนรับเข้าสู่การดูแลของอาจารย์
        </p>

        <div class="modal-summary-box" style="background: var(--color-success-bg); border-color: rgba(16,185,129,0.2);">
          <div class="summary-row">
            <span class="summary-label" style="color: var(--text-primary);">ผู้ลงคะแนน:</span>
            <span class="summary-val success-student-name"></span>
          </div>
          <div class="summary-row">
            <span class="summary-label" style="color: var(--text-primary);">อาจารย์ที่จับคู่:</span>
            <span class="summary-val success-advisor-name" style="color: var(--color-success); font-weight: 700;"></span>
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%;" id="success-close-btn">ตกลง</button>
      </div>
    </div>

    <!-- Toast Container (Top Right) -->
    <div class="toast-container" id="toast-container"></div>

    <!-- Page Footer -->
    <footer class="app-footer">
      <p>© 2026 AdvisorSelect. ระบบโหวตเลือกอาจารย์ที่ปรึกษาส่วนกลาง (วิทยาการคอมพิวเตอร์)</p>
      <p style="margin-top: 0.25rem;">พัฒนาโดย Antigravity AI Code Companion</p>
    </footer>
  `;
}

// ==========================================
// 6. EVENT LISTENERS & INITIALIZATION
// ==========================================

function setupEventListeners() {
  const tabVoteBtn = document.getElementById('tab-vote-btn');
  const tabResultsBtn = document.getElementById('tab-results-btn');
  const panelVote = document.getElementById('panel-vote');
  const panelResults = document.getElementById('panel-results');

  tabVoteBtn.addEventListener('click', () => {
    state.activeTab = 'vote';
    tabVoteBtn.classList.add('active');
    tabResultsBtn.classList.remove('active');
    panelVote.classList.add('active');
    panelResults.classList.remove('active');
    updateSelectionDrawer();
  });

  tabResultsBtn.addEventListener('click', async () => {
    state.activeTab = 'results';
    tabResultsBtn.classList.add('active');
    tabVoteBtn.classList.remove('active');
    panelResults.classList.add('active');
    panelVote.classList.remove('active');
    
    document.getElementById('selection-drawer').classList.remove('show');
    
    await fetchState();
    renderStatsPanel();
  });

  const nameInput = document.getElementById('student-name');
  const idInput = document.getElementById('student-id');

  const updateDrawerState = () => {
    state.studentName = nameInput.value;
    state.studentId = idInput.value;
    updateSelectionDrawer();
  };

  nameInput.addEventListener('input', updateDrawerState);
  idInput.addEventListener('input', updateDrawerState);

  const searchInput = document.getElementById('advisor-search');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderAdvisorGrid();
  });

  document.getElementById('drawer-submit-btn').addEventListener('click', handleVoteSubmit);
  document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.remove('show');
  });
  document.getElementById('confirm-agree-btn').addEventListener('click', confirmVoteExecution);
  document.getElementById('success-close-btn').addEventListener('click', () => {
    document.getElementById('success-modal').classList.remove('show');
  });
}

function updateVotingStatusUI() {
  const banner = document.getElementById('voting-closed-banner');
  const nameInput = document.getElementById('student-name');
  const idInput = document.getElementById('student-id');
  const submitBtn = document.getElementById('drawer-submit-btn');

  if (!state.votingOpen) {
    if (banner) banner.style.display = 'flex';
    if (nameInput) nameInput.disabled = true;
    if (idInput) idInput.disabled = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `ปิดรับลงทะเบียน <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.alert}</span>`;
      submitBtn.style.background = 'var(--text-muted)';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.style.boxShadow = 'none';
    }
  } else {
    if (banner) banner.style.display = 'none';
    if (nameInput) nameInput.disabled = false;
    if (idInput) idInput.disabled = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `ลงคะแนนเลือก <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.check}</span>`;
      submitBtn.style.background = '';
      submitBtn.style.cursor = '';
      submitBtn.style.boxShadow = '';
    }
  }
}

// Theme Toggle Logic
function initTheme() {
  const savedTheme = localStorage.getItem('app-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleButtonUI(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('app-theme', newTheme);
  updateThemeToggleButtonUI(newTheme);
}

function updateThemeToggleButtonUI(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  if (theme === 'light') {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 1.2rem; height: 1.2rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
    btn.title = "เปลี่ยนเป็นโหมดมืด (Dark Mode)";
  } else {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 1.2rem; height: 1.2rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>`;
    btn.title = "เปลี่ยนเป็นโหมดสว่าง (Light Mode)";
  }
}

// ==========================================
// 7. APPLICATION START
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
  initAppHTML();
  initTheme();
  setupEventListeners();

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  const grid = document.getElementById('advisor-grid');
  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
        <div style="font-size: 1.5rem; font-weight: 500;">กำลังโหลดข้อมูลจากฐานข้อมูล...</div>
      </div>
    `;
  }
  
  await fetchState();
  renderAdvisorGrid();
  renderStatsPanel();
  updateVotingStatusUI();
});
