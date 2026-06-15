import './style.css';

// ==========================================
// 1. ICONS PACK
// ==========================================

const ICONS = {
  lock: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  room: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`,
  database: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>`,
  export: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
  alert: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>`,
  stats: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`
};

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================

class AdminState {
  constructor() {
    this.advisors = [];
    this.votes = [];
    this.isAuthenticated = false;
    this.password = sessionStorage.getItem('admin_password') || '';
    this.selectedAdvisorFilter = 'ALL';
    this.votingOpen = true;
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

const state = new AdminState();

// ==========================================
// 3. TOAST & NOTIFICATION HELPERS
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

function showCustomConfirm(title, message, options = {}) {
  return new Promise((resolve) => {
    const modalId = 'custom-confirm-modal';
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = modalId;
      document.body.appendChild(modal);
    }

    const {
      confirmText = 'ยืนยัน',
      cancelText = 'ยกเลิก',
      type = 'warning' // 'warning', 'danger', 'info'
    } = options;

    let iconHtml = ICONS.alert;
    if (type === 'danger') {
      iconHtml = ICONS.trash || `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
    } else if (type === 'info') {
      iconHtml = ICONS.checkCircle;
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 420px; padding: 2rem; text-align: center;">
        <div class="modal-icon-container ${type}" style="width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <span style="width: 2rem; height: 2rem; display: inline-flex;">${iconHtml}</span>
        </div>
        <h3 class="modal-title" style="font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">${title}</h3>
        <p class="modal-desc" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.75rem; line-height: 1.5;">${message}</p>
        <div class="modal-actions" style="display: flex; gap: 0.5rem; justify-content: center; width: 100%;">
          <button class="btn btn-secondary" id="custom-confirm-cancel-btn" style="flex: 1; padding: 0.55rem 1rem; font-size: 0.85rem; justify-content: center;">${cancelText}</button>
          <button class="btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}" id="custom-confirm-agree-btn" style="flex: 1; padding: 0.55rem 1rem; font-size: 0.85rem; justify-content: center;">${confirmText}</button>
        </div>
      </div>
    `;

    modal.classList.add('show');

    const cleanup = (result) => {
      modal.classList.remove('show');
      resolve(result);
    };

    modal.querySelector('#custom-confirm-cancel-btn').addEventListener('click', () => cleanup(false));
    modal.querySelector('#custom-confirm-agree-btn').addEventListener('click', () => cleanup(true));
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        cleanup(false);
      }
    };
  });
}

// ==========================================
// 4. API REQUEST CALLS
// ==========================================

async function fetchAdminState() {
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
    createToast("ไม่สามารถดึงข้อมูลระบบได้", "error");
    console.error(error);
  }
}

// ==========================================
// 5. RENDERING INTERFACES
// ==========================================

function renderApp() {
  const app = document.getElementById('app');
  
  if (!state.isAuthenticated) {
    renderLoginScreen(app);
  } else {
    renderDashboardScreen(app);
  }
}

function renderLoginScreen(container) {
  container.innerHTML = `
    <div class="admin-login-wrapper">
      <div class="glass-panel admin-login-card">
        <div class="modal-icon-container confirm">
          <span style="width: 2rem; height: 2rem; display: inline-flex;">${ICONS.lock}</span>
        </div>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">ระบบแอดมินหลังบ้าน</h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 2rem;">กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบควบคุม</p>
        
        <form id="admin-login-form">
          <div class="form-group" style="text-align: left;">
            <label for="admin-password">รหัสผ่านสำหรับแอดมิน</label>
            <input type="password" id="admin-password" class="form-input" placeholder="กรอกรหัสผ่าน..." required autocomplete="current-password" autofocus />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
            เข้าสู่ระบบ
          </button>
        </form>

        <a href="/" class="btn btn-secondary" style="width: 100%; margin-top: 0.75rem; font-size: 0.85rem; gap: 0.4rem;">
          <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.arrowLeft}</span>
          กลับหน้าหลักนักศึกษา
        </a>
      </div>
    </div>
    <div class="toast-container" id="toast-container"></div>
  `;

  document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (data.success) {
        state.password = password;
        state.isAuthenticated = true;
        sessionStorage.setItem('admin_password', password);
        await fetchAdminState();
        renderApp();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      createToast(err.message, "error");
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
}

function renderDashboardScreen(container) {
  // Statistics Calculations
  const totalVotes = state.votes.length;
  let totalCap = 0;
  state.advisors.forEach(a => totalCap += a.capacity);
  const filledPct = totalCap > 0 ? Math.round((totalVotes / totalCap) * 100) : 0;
  const remainingSlots = totalCap - totalVotes;

  container.innerHTML = `
    <!-- Header -->
    <header class="app-header">
      <div class="brand">
        <span class="brand-logo">AdvisorSelect</span>
        <span class="brand-tag">🛡️ แอดมิน (วิทยาการคอมพิวเตอร์)</span>
      </div>
      <div class="header-actions">
        <!-- Voting Status Toggle -->
        <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 0.35rem 0.75rem; border-radius: 10px; margin-right: 0.5rem; backdrop-filter: var(--backdrop-blur);">
          <span style="font-size: 0.8rem; font-weight: 600; color: ${state.votingOpen ? 'var(--color-success)' : 'var(--color-danger)'};" id="voting-status-text">
            ระบบโหวต: ${state.votingOpen ? 'เปิดรับโหวต' : 'ปิดรับโหวต'}
          </span>
          <label class="switch">
            <input type="checkbox" id="voting-toggle-checkbox" ${state.votingOpen ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
        </div>

        <a href="/" class="btn btn-secondary" style="font-size: 0.85rem;">
          <span style="width: 1rem; height: 1rem; display: inline-flex;">${ICONS.arrowLeft}</span>
          ไปหน้าหลักนักศึกษา
        </a>
        <button class="btn-icon" id="theme-toggle-btn" style="border-radius: 10px; width: 34px; height: 34px; cursor: pointer; border: 1px solid var(--border-subtle); display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); color: var(--text-secondary); margin-right: 0.25rem;"></button>
        <button class="btn btn-danger btn-sm" id="admin-logout-btn">ออกจากระบบ</button>
      </div>
    </header>

    <!-- Main Section -->
    <main class="main-content">
      
      <!-- Stats Dashboard -->
      <div class="stats-header-grid" style="margin-bottom: 2rem;">
        <div class="stat-card">
          <div class="stat-icon-container primary">${ICONS.user}</div>
          <div class="stat-info">
            <span class="stat-label">นักศึกษาลงโหวตแล้ว</span>
            <span class="stat-value">${totalVotes} คน</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon-container success">${ICONS.checkCircle}</div>
          <div class="stat-info">
            <span class="stat-label">อัตราครองสล็อตที่ปรึกษา</span>
            <span class="stat-value">${filledPct}%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-container secondary">${ICONS.room}</div>
          <div class="stat-info">
            <span class="stat-label">คงเหลือที่ว่างอาจารย์</span>
            <span class="stat-value">${remainingSlots} ที่นั่ง</span>
          </div>
        </div>
      </div>

      <!-- Quick Database Control Tools -->
      <div class="glass-panel" style="margin-bottom: 2rem; padding: 1.5rem 1.75rem;">
        <h3 class="panel-title" style="margin-bottom: 1rem;">เครื่องมือควบคุมระบบฐานข้อมูลส่วนกลาง</h3>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="admin-seed-btn">
            <span style="width: 1.1rem; height: 1.1rem; display: inline-flex; color: var(--color-secondary);">${ICONS.database}</span>
            จำลองข้อมูลผู้โหวต (+45 คน)
          </button>
          
          <button class="btn btn-secondary" id="admin-export-csv">
            <span style="width: 1.1rem; height: 1.1rem; display: inline-flex; color: var(--color-success);">${ICONS.export}</span>
            ส่งออกไฟล์โหวต CSV
          </button>
          
          <button class="btn btn-secondary" id="admin-export-json">
            <span style="width: 1.1rem; height: 1.1rem; display: inline-flex;">${ICONS.export}</span>
            ส่งออกไฟล์โหวต JSON
          </button>
          
          <button class="btn btn-secondary" id="admin-reset-btn" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.02);">
            <span style="width: 1.1rem; height: 1.1rem; display: inline-flex; color: var(--color-danger);">${ICONS.trash}</span>
            ล้างข้อมูลคะแนนทั้งหมด
          </button>
        </div>
      </div>

      <!-- Grid Panel splits bar charts and detailed table -->
      <div class="admin-main-grid">
        
        <!-- Left: occupancy list & add advisor form -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <div class="glass-panel chart-panel" style="margin-bottom: 0;">
            <h3 class="panel-title" style="margin-bottom: 1rem;">สล็อตอาจารย์แต่ละท่าน</h3>
            <div class="chart-container" id="chart-container" style="margin-top: 0; min-height: auto; gap: 1rem; display: flex; flex-direction: column;">
              ${state.advisors.map(adv => {
                const filled = state.getFilledSlots(adv.id);
                const capacity = adv.capacity;
                const pct = Math.round((filled / capacity) * 100);
                const advStudents = state.votes.filter(v => v.advisorId === adv.id);
                
                let barColor = 'var(--color-primary)';
                if (pct >= 100) barColor = 'var(--color-danger)';
                else if (pct >= 80) barColor = 'var(--color-warning)';
                else if (filled > 0) barColor = 'var(--color-success)';

                return `
                  <div class="chart-bar-row" style="margin-bottom: 0.5rem; border-bottom: 1px dashed rgba(255,255,255,0.03); padding-bottom: 0.75rem;">
                    <div class="chart-bar-info" style="margin-bottom: 0.25rem;">
                      <span class="chart-bar-label" style="font-size: 0.8rem; font-weight: 600;">${adv.name}</span>
                      <span class="chart-bar-value" style="font-size: 0.8rem;">${filled}/${capacity} คน</span>
                    </div>
                    <div class="chart-bar-track" style="height: 8px; margin-bottom: 0.5rem;">
                      <div class="chart-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
                    </div>
                    
                     <!-- Action buttons row -->
                    <div style="display: flex; gap: 0.4rem; align-items: center; margin-top: 0.25rem;">
                      <button class="btn btn-secondary btn-sm edit-advisor-btn" style="flex: 1; padding: 0.15rem 0.4rem; font-size: 0.65rem; border-radius: 4px; background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: var(--color-primary); justify-content: center;" data-id="${adv.id}">
                        แก้ไข
                      </button>
                      <button class="btn btn-danger btn-sm delete-advisor-btn" style="flex: 1; padding: 0.15rem 0.4rem; font-size: 0.65rem; border-radius: 4px; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: var(--color-danger); justify-content: center;" data-id="${adv.id}" data-name="${adv.name}">
                        ลบ
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Add New Advisor Form -->
          <div class="glass-panel" style="padding: 1.5rem 1.75rem;">
            <h3 class="panel-title" style="margin-bottom: 1rem; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 1.25rem; height: 1.25rem; display: inline-flex;">${ICONS.user}</span>
              เพิ่มข้อมูลอาจารย์ใหม่
            </h3>
            <form id="add-advisor-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label for="new-adv-name" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">ชื่อ - นามสกุล (ภาษาไทย) *</label>
                <input type="text" id="new-adv-name" class="form-input" placeholder="เช่น ผศ.ดร. มานะ ใจดี" required style="width: 100%; font-size: 0.85rem;" autocomplete="off" />
              </div>



              <div class="form-group">
                <label for="new-adv-email" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">อีเมลติดต่อ</label>
                <input type="email" id="new-adv-email" class="form-input" placeholder="เช่น mana.ja@university.ac.th" style="width: 100%; font-size: 0.85rem;" autocomplete="off" />
              </div>

              <div class="form-group">
                <label for="new-adv-capacity" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">จำนวนรับสูงสุด (คน) *</label>
                <input type="number" id="new-adv-capacity" class="form-input" value="15" min="1" required style="width: 100%; font-size: 0.85rem;" />
              </div>

              <div class="form-group">
                <label for="new-adv-interests" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">หัวข้อวิจัย / ความสนใจ (คั่นด้วยจุลภาค \`,\`) *</label>
                <input type="text" id="new-adv-interests" class="form-input" placeholder="เช่น AI, Machine Learning, IoT" required style="width: 100%; font-size: 0.85rem;" autocomplete="off" />
              </div>

              <div class="form-group">
                <label style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">รูปโปรไฟล์อาจารย์</label>
                <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
                  <img id="new-adv-image-preview" src="" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover; border: 1px solid var(--border-subtle); display: none;" />
                  <input type="file" id="new-adv-image-file" accept="image/*" class="form-input" style="font-size: 0.75rem; padding: 0.25rem; width: 100%;" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem; justify-content: center; width: 100%;">
                เพิ่มข้อมูลอาจารย์
                <span style="width: 1.1rem; height: 1.1rem; display: inline-flex; margin-left: 0.25rem;">
                  ${ICONS.plus}
                </span>
              </button>
            </form>
          </div>

        </div>

        <!-- Right: table of all votes -->
        <div class="glass-panel" style="padding: 1.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
            <div>
              <h3 class="panel-title" style="margin-bottom: 0.25rem;">
                รายชื่อผลคะแนนลงทะเบียนของนักศึกษาทั้งหมด
              </h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">
                แสดงประวัติของนักศึกษาผู้ลงโหวตจริง ซึ่งสามารถลบสิทธิ์นักศึกษาออกเพื่อคืนโควตาสล็อตอาจารย์ได้เป็นรายบุคคล
              </p>
            </div>
            
            <!-- Advisor filter select dropdown -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label for="admin-advisor-filter" style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; white-space: nowrap;">กรองตามอาจารย์:</label>
              <select id="admin-advisor-filter" class="form-select" style="padding: 0.4rem 2.2rem 0.4rem 1rem; font-size: 0.8rem; width: auto; border-radius: 8px; background-color: rgba(0,0,0,0.3); border-color: var(--border-subtle);">
                <option value="ALL" ${state.selectedAdvisorFilter === 'ALL' ? 'selected' : ''}>ทั้งหมด</option>
                ${state.advisors.map(adv => `<option value="${adv.id}" ${state.selectedAdvisorFilter === adv.id ? 'selected' : ''}>${adv.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="admin-table-container">
            ${(() => {
              const filteredVotes = state.selectedAdvisorFilter === 'ALL'
                ? state.votes
                : state.votes.filter(v => v.advisorId === state.selectedAdvisorFilter);

              if (filteredVotes.length === 0) {
                return `
                  <div class="no-data">
                    ${ICONS.database}
                    <p>ไม่มีคะแนนโหวตในกลุ่มที่เลือก</p>
                  </div>
                `;
              }

              return `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th style="width: 50px;">ลำดับ</th>
                      <th>ชื่อ-นามสกุลนักศึกษา</th>
                      <th>รหัสนักศึกษา</th>
                      <th>อาจารย์ที่เลือก</th>
                      <th style="width: 140px;">เวลาที่โหวต</th>
                      <th style="width: 100px; text-align: center;">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredVotes.map((vote, idx) => {
                      const adv = state.advisors.find(a => a.id === vote.advisorId);
                      const date = new Date(vote.timestamp);
                      const timeStr = date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

                      return `
                        <tr>
                          <td style="color: var(--text-secondary);">${idx + 1}</td>
                          <td style="font-weight: 600;">${vote.studentName}</td>
                          <td><code>${vote.studentId}</code></td>
                          <td><span style="color: var(--color-primary); font-weight: 600;">${adv ? adv.name : 'Unknown'}</span></td>
                          <td style="color: var(--text-secondary); font-size: 0.8rem;">${timeStr}</td>
                          <td style="text-align: center;">
                            <button class="btn btn-danger btn-sm delete-vote-btn" data-id="${vote.id}" data-name="${vote.studentName}">
                              คืนสิทธิ์
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              `;
            })()}
          </div>

        </div>

      </div>

    </main>
    <div class="toast-container" id="toast-container"></div>

    <!-- Edit Advisor Modal Overlay -->
    <div class="modal-overlay" id="edit-advisor-modal">
      <div class="modal-content" style="text-align: left; max-width: 500px; padding: 2rem;">
        <h3 class="modal-title" style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; justify-content: flex-start;">
          <span style="color: var(--color-primary); width: 1.5rem; height: 1.5rem; display: inline-flex;">${ICONS.plus}</span>
          แก้ไขข้อมูลอาจารย์
        </h3>
        <form id="edit-advisor-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="hidden" id="edit-adv-id" />
          
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label for="edit-adv-name" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">ชื่อ - นามสกุล (ภาษาไทย) *</label>
            <input type="text" id="edit-adv-name" class="form-input" placeholder="เช่น ผศ.ดร. มานะ ใจดี" required style="width: 100%; font-size: 0.85rem;" autocomplete="off" />
          </div>

          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label for="edit-adv-email" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">อีเมลติดต่อ</label>
            <input type="email" id="edit-adv-email" class="form-input" placeholder="เช่น mana.ja@university.ac.th" style="width: 100%; font-size: 0.85rem;" autocomplete="off" />
          </div>

          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label for="edit-adv-capacity" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">จำนวนรับสูงสุด (คน) *</label>
            <input type="number" id="edit-adv-capacity" class="form-input" min="1" required style="width: 100%; font-size: 0.85rem;" />
          </div>

          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label for="edit-adv-interests" style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">หัวข้อวิจัย / ความสนใจ (คั่นด้วยจุลภาค \`,\`) *</label>
            <input type="text" id="edit-adv-interests" class="form-input" placeholder="เช่น AI, Machine Learning, IoT" required style="width: 100%; font-size: 0.85rem;" autocomplete="off" />
          </div>

          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">รูปโปรไฟล์อาจารย์</label>
            <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
              <img id="edit-adv-image-preview" src="" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover; border: 1px solid var(--border-subtle); display: none;" />
              <div style="display: flex; flex-direction: column; gap: 0.25rem; flex-grow: 1;">
                <input type="file" id="edit-adv-image-file" accept="image/*" class="form-input" style="font-size: 0.75rem; padding: 0.25rem; width: 100%;" />
                <button type="button" class="btn btn-secondary btn-sm" id="edit-adv-clear-image-btn" style="padding: 0.15rem 0.4rem; font-size: 0.65rem; border-radius: 4px; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: var(--color-danger); width: fit-content; display: none;">ลบรูปภาพ (ใช้ Avatar แทน)</button>
              </div>
            </div>
          </div>

          <div class="modal-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button type="button" class="btn btn-secondary" id="edit-adv-cancel-btn" style="font-size: 0.85rem; padding: 0.5rem 1rem;">ยกเลิก</button>
            <button type="submit" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">บันทึกการแก้ไข</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Attach Dashboard Event Listeners
  // Voting status toggle checkbox listener
  const votingCheckbox = document.getElementById('voting-toggle-checkbox');
  if (votingCheckbox) {
    votingCheckbox.addEventListener('change', async (e) => {
      const open = e.target.checked;
      
      const confirmed = await showCustomConfirm(
        open ? "เปิดระบบโหวต?" : "ปิดระบบโหวต?",
        open ? "คุณต้องการเปิดระบบลงคะแนนเลือกอาจารย์ที่ปรึกษาใช่หรือไม่?" : "คุณต้องการปิดระบบลงคะแนนเลือกอาจารย์ที่ปรึกษาใช่หรือไม่? นักศึกษาจะไม่สามารถลงโหวตได้ชั่วคราว",
        { 
          type: open ? 'info' : 'warning', 
          confirmText: open ? 'เปิดระบบ' : 'ปิดระบบ', 
          cancelText: 'ยกเลิก' 
        }
      );

      if (confirmed) {
        try {
          const res = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': state.password
            },
            body: JSON.stringify({ voting_open: open })
          });

          const data = await res.json();
          if (data.success) {
            state.votingOpen = open;
            const statusText = document.getElementById('voting-status-text');
            if (statusText) {
              statusText.textContent = `ระบบโหวต: ${open ? 'เปิดรับโหวต' : 'ปิดรับโหวต'}`;
              statusText.style.color = open ? 'var(--color-success)' : 'var(--color-danger)';
            }
            createToast(data.message, "success");
          } else {
            throw new Error(data.message);
          }
        } catch (err) {
          createToast(err.message, "error");
          votingCheckbox.checked = !open;
        }
      } else {
        votingCheckbox.checked = !open;
      }
    });
  }

  // Logout
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    state.isAuthenticated = false;
    state.password = '';
    sessionStorage.removeItem('admin_password');
    renderApp();
  });

  // Seed data
  document.getElementById('admin-seed-btn').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'x-admin-password': state.password }
      });
      const data = await res.json();
      if (data.success) {
        await fetchAdminState();
        renderApp();
        createToast(data.message, "success");
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      createToast(e.message, "error");
    }
  });

  // Clear Database
  document.getElementById('admin-reset-btn').addEventListener('click', async () => {
    const confirmed = await showCustomConfirm(
      "ล้างฐานข้อมูลการโหวต?",
      "ต้องการล้างฐานข้อมูลการโหวตทั้งหมดใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนกลับมาได้!",
      { type: 'danger', confirmText: 'ล้างข้อมูลทั้งหมด', cancelText: 'ยกเลิก' }
    );
    if (confirmed) {
      try {
        const res = await fetch('/api/admin/reset', {
          method: 'POST',
          headers: { 'x-admin-password': state.password }
        });
        const data = await res.json();
        if (data.success) {
          await fetchAdminState();
          renderApp();
          createToast(data.message, "success");
        } else {
          throw new Error(data.message);
        }
      } catch (e) {
        createToast(e.message, "error");
      }
    }
  });

  // Export CSV
  document.getElementById('admin-export-csv').addEventListener('click', () => {
    if (state.votes.length === 0) {
      createToast("ไม่มีข้อมูลการโหวตให้ส่งออก", "warning");
      return;
    }
    
    let csvContent = "\uFEFF";
    csvContent += "ลำดับ,ชื่อ-นามสกุลนักศึกษา,รหัสนักศึกษา,รหัสอาจารย์ที่เลือก,ชื่ออาจารย์ที่เลือก,เวลาที่ลงคะแนน\n";
    state.votes.forEach((vote, idx) => {
      const adv = state.advisors.find(a => a.id === vote.advisorId);
      const name = vote.studentName.replace(/"/g, '""');
      const advName = adv ? adv.name.replace(/"/g, '""') : 'Unknown';
      csvContent += `${idx + 1},"${name}",${vote.studentId},${vote.advisorId},"${advName}","${vote.timestamp}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `advisor_votes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    createToast("ส่งออกรายงาน CSV สำเร็จ", "success");
  });

  // Export JSON
  document.getElementById('admin-export-json').addEventListener('click', () => {
    if (state.votes.length === 0) {
      createToast("ไม่มีข้อมูลการโหวตให้ส่งออก", "warning");
      return;
    }

    const payload = state.votes.map(vote => {
      const adv = state.advisors.find(a => a.id === vote.advisorId);
      return {
        id: vote.id,
        studentName: vote.studentName,
        studentId: vote.studentId,
        advisorId: vote.advisorId,
        advisorName: adv ? adv.name : 'Unknown',
        votedAt: vote.timestamp
      };
    });

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `advisor_votes_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    createToast("ส่งออกไฟล์ JSON สำเร็จ", "success");
  });

  // Delete Individual Vote
  const deleteButtons = document.querySelectorAll('.delete-vote-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;

      const confirmed = await showCustomConfirm(
        "คืนสิทธิ์นักศึกษา?",
        `ต้องการลบคะแนนของ ${name} และคืนสล็อตให้กับอาจารย์ผู้ปรึกษาใช่หรือไม่?`,
        { type: 'danger', confirmText: 'คืนสิทธิ์', cancelText: 'ยกเลิก' }
      );
      if (confirmed) {
        try {
          const res = await fetch(`/api/admin/votes/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': state.password }
          });
          const data = await res.json();
          if (data.success) {
            await fetchAdminState();
            renderApp();
            createToast(data.message, "success");
          } else {
            throw new Error(data.message);
          }
        } catch (e) {
          createToast(e.message, "error");
        }
      }
    });
  });

  // Filter Dropdown Change
  const advisorFilter = document.getElementById('admin-advisor-filter');
  if (advisorFilter) {
    advisorFilter.addEventListener('change', (e) => {
      state.selectedAdvisorFilter = e.target.value;
      renderDashboardScreen(document.getElementById('app'));
    });
  }

  // File Picker to Base64
  let newAdvisorImageBase64 = '';
  const fileInput = document.getElementById('new-adv-image-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 800 * 1024) {
          createToast("ขนาดรูปภาพต้องไม่เกิน 800KB", "error");
          fileInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
          newAdvisorImageBase64 = event.target.result;
          const preview = document.getElementById('new-adv-image-preview');
          if (preview) {
            preview.src = newAdvisorImageBase64;
            preview.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Delete Advisor
  const deleteAdvisorButtons = document.querySelectorAll('.delete-advisor-btn');
  deleteAdvisorButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;

      const confirmed = await showCustomConfirm(
        "ลบข้อมูลอาจารย์?",
        `คุณต้องการลบอาจารย์ ${name} หรือไม่?\n\n*คำเตือน: การลบนี้จะลบข้อมูลโหวตของนักศึกษาทุกคนที่เลือกอาจารย์ท่านนี้ด้วย!`,
        { type: 'danger', confirmText: 'ลบข้อมูลอาจารย์', cancelText: 'ยกเลิก' }
      );
      if (confirmed) {
        try {
          const res = await fetch(`/api/admin/advisors/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': state.password }
          });
          const data = await res.json();
          if (data.success) {
            await fetchAdminState();
            renderApp();
            createToast(data.message, "success");
          } else {
            throw new Error(data.message);
          }
        } catch (e) {
          createToast(e.message, "error");
        }
      }
    });
  });

  // Add Advisor Form Submit
  const addAdvisorForm = document.getElementById('add-advisor-form');
  if (addAdvisorForm) {
    addAdvisorForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('new-adv-name').value.trim();
      const email = document.getElementById('new-adv-email').value.trim();
      const capacity = document.getElementById('new-adv-capacity').value.trim();
      const interestsInput = document.getElementById('new-adv-interests').value.trim();

      const interests = interestsInput.split(',').map(s => s.trim()).filter(Boolean);

      try {
        const res = await fetch('/api/admin/advisors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': state.password
          },
          body: JSON.stringify({
            name,
            email: email || null,
            capacity: parseInt(capacity, 10),
            interests,
            imageUrl: newAdvisorImageBase64 || null
          })
        });

        const data = await res.json();
        if (data.success) {
          newAdvisorImageBase64 = ''; // Reset base64
          await fetchAdminState();
          renderApp();
          createToast(data.message, "success");
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        createToast(err.message, "error");
      }
    });
  }

  // Edit Advisor Event Listeners
  let editAdvisorImageBase64 = '';
  const editAdvisorModal = document.getElementById('edit-advisor-modal');
  const editAdvisorForm = document.getElementById('edit-advisor-form');

  const editAdvisorButtons = document.querySelectorAll('.edit-advisor-btn');
  editAdvisorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const adv = state.advisors.find(a => a.id === id);
      if (!adv) return;

      document.getElementById('edit-adv-id').value = adv.id;
      document.getElementById('edit-adv-name').value = adv.name;
      document.getElementById('edit-adv-email').value = adv.email || '';
      document.getElementById('edit-adv-capacity').value = adv.capacity;
      document.getElementById('edit-adv-interests').value = adv.interests.join(', ');

      const preview = document.getElementById('edit-adv-image-preview');
      const clearBtn = document.getElementById('edit-adv-clear-image-btn');
      const fileInput = document.getElementById('edit-adv-image-file');

      // Reset file input
      if (fileInput) fileInput.value = '';

      if (adv.imageUrl) {
        editAdvisorImageBase64 = adv.imageUrl;
        preview.src = adv.imageUrl;
        preview.style.display = 'block';
        clearBtn.style.display = 'block';
      } else {
        editAdvisorImageBase64 = '';
        preview.src = '';
        preview.style.display = 'none';
        clearBtn.style.display = 'none';
      }

      editAdvisorModal.classList.add('show');
    });
  });

  const editAdvCancelBtn = document.getElementById('edit-adv-cancel-btn');
  if (editAdvCancelBtn) {
    editAdvCancelBtn.addEventListener('click', () => {
      editAdvisorModal.classList.remove('show');
    });
  }

  // Close when clicking outside of modal content
  editAdvisorModal.addEventListener('click', (e) => {
    if (e.target === editAdvisorModal) {
      editAdvisorModal.classList.remove('show');
    }
  });

  const editFileInput = document.getElementById('edit-adv-image-file');
  if (editFileInput) {
    editFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 800 * 1024) {
          createToast("ขนาดรูปภาพต้องไม่เกิน 800KB", "error");
          editFileInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
          editAdvisorImageBase64 = event.target.result;
          const preview = document.getElementById('edit-adv-image-preview');
          const clearBtn = document.getElementById('edit-adv-clear-image-btn');
          if (preview) {
            preview.src = editAdvisorImageBase64;
            preview.style.display = 'block';
          }
          if (clearBtn) {
            clearBtn.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const editClearImageBtn = document.getElementById('edit-adv-clear-image-btn');
  if (editClearImageBtn) {
    editClearImageBtn.addEventListener('click', () => {
      editAdvisorImageBase64 = '';
      const preview = document.getElementById('edit-adv-image-preview');
      const fileInput = document.getElementById('edit-adv-image-file');
      if (preview) {
        preview.src = '';
        preview.style.display = 'none';
      }
      if (fileInput) {
        fileInput.value = '';
      }
      editClearImageBtn.style.display = 'none';
    });
  }

  if (editAdvisorForm) {
    editAdvisorForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('edit-adv-id').value;
      const name = document.getElementById('edit-adv-name').value.trim();
      const email = document.getElementById('edit-adv-email').value.trim();
      const capacity = document.getElementById('edit-adv-capacity').value.trim();
      const interestsInput = document.getElementById('edit-adv-interests').value.trim();

      const interests = interestsInput.split(',').map(s => s.trim()).filter(Boolean);

      try {
        const res = await fetch(`/api/admin/advisors/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': state.password
          },
          body: JSON.stringify({
            name,
            email: email || null,
            capacity: parseInt(capacity, 10),
            interests,
            imageUrl: editAdvisorImageBase64 || null
          })
        });

        const data = await res.json();
        if (data.success) {
          editAdvisorModal.classList.remove('show');
          await fetchAdminState();
          renderApp();
          createToast(data.message, "success");
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        createToast(err.message, "error");
      }
    });
  }

  // Theme Toggle listener
  initTheme();
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
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
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 1.1rem; height: 1.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
    btn.title = "เปลี่ยนเป็นโหมดมืด (Dark Mode)";
  } else {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 1.1rem; height: 1.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>`;
    btn.title = "เปลี่ยนเป็นโหมดสว่าง (Light Mode)";
  }
}

// ==========================================
// 6. INITIALIZATION
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
  initTheme(); // Set initial theme attribute on documentElement
  if (state.password) {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: state.password })
      });
      const data = await res.json();
      if (data.success) {
        state.isAuthenticated = true;
        await fetchAdminState();
      } else {
        sessionStorage.removeItem('admin_password');
        state.password = '';
      }
    } catch (e) {
      console.warn("Auto admin auth failed", e);
    }
  }
  renderApp();
});
