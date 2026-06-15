import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

// Enable CORS and JSON body parser with increased limit for base64 images
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==========================================
// 1. DATABASE SETUP
// ==========================================

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.db');
// Ensure the directory for the database file exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS advisors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    avatarGradient TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    interests TEXT NOT NULL, -- JSON array of tags
    email TEXT,
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    studentName TEXT NOT NULL,
    studentId TEXT NOT NULL UNIQUE,
    advisorId TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(advisorId) REFERENCES advisors(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Initialize default settings
const checkSettings = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key = 'voting_open'").get();
if (checkSettings.count === 0) {
  db.prepare("INSERT INTO settings (key, value) VALUES ('voting_open', 'true')").run();
}

// Insert default advisors if table is empty
const checkAdvisors = db.prepare('SELECT COUNT(*) as count FROM advisors').get();
if (checkAdvisors.count === 0) {
  const insertAdvisor = db.prepare(`
    INSERT INTO advisors (id, name, department, avatarGradient, capacity, interests, email, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const DEFAULT_ADVISORS = [
    {
      id: "adv-1",
      name: "นายวรกฤต แสนโภชน์",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "worrakit.sa@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-111-202312121702354263_69993_44.jpg"
    },
    {
      id: "adv-2",
      name: "ผู้ช่วยศาสตราจารย์ ดร.สุรางคนา ระวังยศ",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "surangkana.ra@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-108-202312121702354252_33941_44.jpg"
    },
    {
      id: "adv-3",
      name: "ผู้ช่วยศาสตราจารย์ ดร.วงษ์ปัญญา นวนแก้ว",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "wongpanya.nu@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-114-202312121702354316_26739_44.jpg"
    },
    {
      id: "adv-4",
      name: "นายธนวัฒน์ แซ่เอียบ",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "thanawat.sa@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-110-202405091725503052_81868_44.png"
    },
    {
      id: "adv-5",
      name: "นายเกียรติกุล สุขสมสถาน",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "kiattikul.so@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-109-202508091757322438_68410_44.png"
    },
    {
      id: "adv-6",
      name: "นายธรรมรัตน์ ธรรมา",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "thammarat.th@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-113-202312121702354288_59768_44.jpg"
    },
    {
      id: "adv-7",
      name: "นางสาวปวีณา อุ่นลี",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "paweena.un@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-1601-202511061749625693_40616_47.jfif"
    },
    {
      id: "adv-8",
      name: "ดร.ศริทธิ์ พร้อมเทพ",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "sarit.pr@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-1641-202520061750409243_96478_47.jfif"
    },
    {
      id: "adv-9",
      name: "นายศักดิ์พันธุ์ แดงมณี (ลาศึกษาต่อ)",
      department: "วิทยาการคอมพิวเตอร์",
      avatarGradient: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
      capacity: 15,
      interests: JSON.stringify([]),
      email: "sakpan.da@up.ac.th",
      imageUrl: "https://ict.up.ac.th/upload/mem/pictures/pic-202320061687237066_73134_40-2439.jpg"
    }
  ];

  const insertTransaction = db.transaction((advisorsList) => {
    for (const adv of advisorsList) {
      insertAdvisor.run(
        adv.id,
        adv.name,
        adv.department,
        adv.avatarGradient,
        adv.capacity,
        adv.interests,
        adv.email,
        adv.imageUrl
      );
    }
  });

  insertTransaction(DEFAULT_ADVISORS);
  console.log("Database initialized with default advisors.");
}

// ==========================================
// 2. ADMIN AUTH MIDDLEWARE
// ==========================================

const checkAdminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ success: false, message: "สิทธิ์การเข้าถึงไม่ถูกต้อง (รหัสผ่านผิดพลาด)" });
  }
};

// ==========================================
// 3. API ENDPOINTS
// ==========================================

// Get system settings
app.get('/api/settings', (req, res) => {
  try {
    const settingsList = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    settingsList.forEach(s => {
      settingsObj[s.key] = s.value === 'true' ? true : (s.value === 'false' ? false : s.value);
    });
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update system settings (Protected)
app.put('/api/admin/settings', checkAdminAuth, (req, res) => {
  const { voting_open } = req.body;

  if (voting_open === undefined) {
    return res.status(400).json({ success: false, message: "กรุณาระบุข้อมูลที่ต้องการแก้ไข" });
  }

  try {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('voting_open', ?)")
      .run(voting_open ? 'true' : 'false');

    res.json({ 
      success: true, 
      message: `ระบบลงทะเบียนถูก${voting_open ? 'เปิด' : 'ปิด'}เรียบร้อยแล้ว`,
      data: { voting_open } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all advisors with live vote counts
app.get('/api/advisors', (req, res) => {
  try {
    const statement = db.prepare(`
      SELECT a.*, COUNT(v.id) AS filled
      FROM advisors a
      LEFT JOIN votes v ON a.id = v.advisorId
      GROUP BY a.id
    `);
    const advisors = statement.all().map(adv => ({
      ...adv,
      interests: JSON.parse(adv.interests)
    }));
    res.json({ success: true, data: advisors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all votes (for live activity log)
app.get('/api/votes', (req, res) => {
  try {
    const statement = db.prepare('SELECT * FROM votes ORDER BY timestamp DESC');
    const votes = statement.all();
    res.json({ success: true, data: votes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit a student's vote (Transaction to prevent race conditions)
app.post('/api/votes', (req, res) => {
  // Check if voting is open
  const votingOpenSetting = db.prepare("SELECT value FROM settings WHERE key = 'voting_open'").get();
  if (!votingOpenSetting || votingOpenSetting.value !== 'true') {
    return res.status(403).json({ success: false, message: "ขออภัย ระบบลงทะเบียนปิดรับโหวตชั่วคราว" });
  }

  const { studentName, studentId, advisorId } = req.body;

  if (!studentName || !studentId || !advisorId) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบถ้วน กรุณากรอกข้อมูลให้ครบ" });
  }

  // Regex validation for student ID format
  const idRegex = /^[a-zA-Z0-9-]{8,15}$/;
  if (!idRegex.test(studentId)) {
    return res.status(400).json({ success: false, message: "รหัสนักศึกษาไม่ถูกต้อง (ระบุได้เฉพาะ 8-15 ตัวอักษรและตัวเลข)" });
  }

  // Execute database transaction to guarantee slot checks and duplicate prevention are atomic
  const submitVoteTransaction = db.transaction(() => {
    // 1. Check if student has already voted
    const existingVote = db.prepare('SELECT id FROM votes WHERE studentId = ?').get(studentId.trim());
    if (existingVote) {
      throw new Error(`รหัสนักศึกษา ${studentId} ได้ลงทะเบียนไปแล้ว ไม่สามารถลงคะแนนซ้ำได้`);
    }

    // 2. Get advisor capacity and current votes
    const advisor = db.prepare('SELECT name, capacity FROM advisors WHERE id = ?').get(advisorId);
    if (!advisor) {
      throw new Error("ไม่พบข้อมูลอาจารย์ที่เลือก");
    }

    const filledCountObj = db.prepare('SELECT COUNT(*) as count FROM votes WHERE advisorId = ?').get(advisorId);
    const filled = filledCountObj.count;

    if (filled >= advisor.capacity) {
      throw new Error(`ขออภัย สล็อตคำปรึกษาของ ${advisor.name} เต็มแล้ว กรุณาเลือกท่านอื่น`);
    }

    // 3. Insert vote
    const voteId = 'vote-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const timestamp = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO votes (id, studentName, studentId, advisorId, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      voteId,
      studentName.trim(),
      studentId.trim(),
      advisorId,
      timestamp
    );

    return {
      id: voteId,
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      advisorId,
      timestamp
    };
  });

  try {
    const result = submitVoteTransaction();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin Log in Authentication Gate
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
  } else {
    res.status(401).json({ success: false, message: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" });
  }
});

// Admin endpoint: Add advisor (Protected)
app.post('/api/admin/advisors', checkAdminAuth, (req, res) => {
  const { name, capacity, interests, email, imageUrl } = req.body;

  if (!name || !capacity) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบถ้วน กรุณากรอกชื่อและจำนวนที่รับเป็นอย่างน้อย" });
  }

  // Predefined gorgeous gradient patterns to assign randomly
  const GRADIENTS = [
    "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)",
    "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
    "linear-gradient(135deg, #f97316 0%, #eab308 100%)"
  ];
  const avatarGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

  // Parse interests (comma-separated or array)
  let parsedInterests = [];
  if (Array.isArray(interests)) {
    parsedInterests = interests;
  } else if (typeof interests === 'string') {
    parsedInterests = interests.split(',').map(s => s.trim()).filter(Boolean);
  }

  const advisorId = 'adv-' + Date.now();
  const department = "วิทยาการคอมพิวเตอร์";

  try {
    db.prepare(`
      INSERT INTO advisors (id, name, department, avatarGradient, capacity, interests, email, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      advisorId,
      name.trim(),
      department,
      avatarGradient,
      parseInt(capacity, 10),
      JSON.stringify(parsedInterests),
      email ? email.trim() : null,
      imageUrl ? imageUrl.trim() : null
    );

    res.json({
      success: true,
      message: `เพิ่มข้อมูลอาจารย์ ${name} สำเร็จ`,
      data: {
        id: advisorId,
        name: name.trim(),
        department,
        avatarGradient,
        capacity: parseInt(capacity, 10),
        interests: parsedInterests,
        email: email ? email.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint: Update advisor (Protected)
app.put('/api/admin/advisors/:id', checkAdminAuth, (req, res) => {
  const advisorId = req.params.id;
  const { name, capacity, interests, email, imageUrl } = req.body;

  if (!name || !capacity) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบถ้วน กรุณากรอกชื่อและจำนวนที่รับเป็นอย่างน้อย" });
  }

  // Parse interests (comma-separated or array)
  let parsedInterests = [];
  if (Array.isArray(interests)) {
    parsedInterests = interests;
  } else if (typeof interests === 'string') {
    parsedInterests = interests.split(',').map(s => s.trim()).filter(Boolean);
  }

  try {
    // Check if advisor exists
    const advisor = db.prepare('SELECT imageUrl FROM advisors WHERE id = ?').get(advisorId);
    if (!advisor) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลอาจารย์ที่ต้องการแก้ไข" });
    }

    let updatedImageUrl = imageUrl;
    if (imageUrl === undefined) {
      updatedImageUrl = advisor.imageUrl;
    }

    db.prepare(`
      UPDATE advisors
      SET name = ?, capacity = ?, interests = ?, email = ?, imageUrl = ?
      WHERE id = ?
    `).run(
      name.trim(),
      parseInt(capacity, 10),
      JSON.stringify(parsedInterests),
      email ? email.trim() : null,
      updatedImageUrl ? updatedImageUrl.trim() : null,
      advisorId
    );

    res.json({
      success: true,
      message: `แก้ไขข้อมูลอาจารย์ ${name} สำเร็จ`,
      data: {
        id: advisorId,
        name: name.trim(),
        capacity: parseInt(capacity, 10),
        interests: parsedInterests,
        email: email ? email.trim() : null,
        imageUrl: updatedImageUrl ? updatedImageUrl.trim() : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint: Delete advisor (Protected)
app.delete('/api/admin/advisors/:id', checkAdminAuth, (req, res) => {
  const advisorId = req.params.id;
  try {
    const deleteTransaction = db.transaction(() => {
      // Delete votes for this advisor first
      db.prepare('DELETE FROM votes WHERE advisorId = ?').run(advisorId);
      // Delete advisor
      const info = db.prepare('DELETE FROM advisors WHERE id = ?').run(advisorId);
      return info.changes;
    });

    const changes = deleteTransaction();
    if (changes > 0) {
      res.json({ success: true, message: "ลบข้อมูลอาจารย์และคืนโควตาผู้โหวตเรียบร้อยแล้ว" });
    } else {
      res.status(404).json({ success: false, message: "ไม่พบข้อมูลอาจารย์ที่ต้องการลบ" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint: Clear all votes (Protected)
app.post('/api/admin/reset', checkAdminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM votes').run();
    res.json({ success: true, message: "ล้างข้อมูลการจับคู่โหวตทั้งหมดแล้ว" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint: Delete a specific student vote (Protected)
app.delete('/api/admin/votes/:id', checkAdminAuth, (req, res) => {
  const voteId = req.params.id;
  try {
    const info = db.prepare('DELETE FROM votes WHERE id = ?').run(voteId);
    if (info.changes > 0) {
      res.json({ success: true, message: "ลบคะแนนโหวตนักศึกษาสำเร็จ (คืนสล็อตอาจารย์)" });
    } else {
      res.status(404).json({ success: false, message: "ไม่พบข้อมูลคะแนนโหวตที่ต้องการลบ" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint: Seed mock votes for testing (Protected)
app.post('/api/admin/seed', checkAdminAuth, (req, res) => {
  const THAI_NAMES = [
    "นายสมศักดิ์ รักไทย", "นางสาวสมศรี มีสุข", "นายกิตติพงษ์ แก้วเกตุ", "นายวีระศักดิ์ รุ่งเรือง",
    "นางสาวพัชราภรณ์ แสนดี", "นายณัฐพล บุญส่ง", "นางสาวชลดา นามวิเศษ", "นายปิยะ เจริญผล",
    "นางสาววิภาดา เลิศวิไล", "นายธนพล มั่นคง", "นางสาวอารียา ปรีดา", "นายอนุชา สุขใจ",
    "นางสาวสิรินทรา มีธรรม", "นายจิรายุ ทองแท้", "นางสาวนิภาวรรณ ยอดรัก", "นายเกียรติศักดิ์ พรหมมา",
    "นายธีรเดช เจริญดี", "นางสาวสโรชา พรหมสุข", "นายรณชัย ศิริวรรณ", "นางสาวพรทิพย์ สุวรรณ"
  ];

  try {
    // Clear votes first
    db.prepare('DELETE FROM votes').run();

    const advisors = db.prepare('SELECT id, capacity FROM advisors').all();
    let seeded = 0;
    let studentIdCounter = 66010001;

    for (let i = 0; i < 45; i++) {
      const name = THAI_NAMES[Math.floor(Math.random() * THAI_NAMES.length)] + ` (จำลอง ${i + 1})`;
      const idStr = String(studentIdCounter + i);

      const availableAdvisors = [];
      for (const adv of advisors) {
        const filledObj = db.prepare('SELECT COUNT(*) as count FROM votes WHERE advisorId = ?').get(adv.id);
        if (filledObj.count < adv.capacity) {
          availableAdvisors.push(adv);
        }
      }

      if (availableAdvisors.length === 0) break;
      const adv = availableAdvisors[Math.floor(Math.random() * availableAdvisors.length)];
      
      const voteId = 'vote-' + Date.now() + '-' + i;
      db.prepare(`
        INSERT INTO votes (id, studentName, studentId, advisorId, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).run(voteId, name, idStr, adv.id, new Date(Date.now() - i * 60000).toISOString());
      
      seeded++;
    }

    res.json({ success: true, message: `จำลองข้อมูลสำเร็จ ${seeded} รายการ` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. STATIC FILES & ROUTING (PRODUCTION)
// ==========================================

// Serve compiled static files
app.use(express.static(path.join(__dirname, 'dist')));

// Serve admin.html directly at /admin path
app.get('/admin', (req, res) => {
  const adminPath = path.join(__dirname, 'dist', 'admin.html');
  if (fs.existsSync(adminPath)) {
    res.sendFile(adminPath);
  } else {
    // Dev fallback if dist is empty
    res.send("รัน 'npm run build' ก่อนเริ่มใช้งานหน้าระบบแอดมิน");
  }
});

// Fallback all other GET requests to index.html
app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send("เซิร์ฟเวอร์รันสำเร็จ! กรุณารัน 'npm run build' ก่อนเปิดระบบใช้งานจริงเพื่อสร้างไฟล์หน้าบ้าน");
    }
  } else {
    res.status(404).json({ success: false, message: "Not Found" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`🚀 AdvisorSelect Server is running!`);
  console.log(`🔗 Main Student App: http://localhost:${PORT}`);
  console.log(`🔒 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📌 Database file: ${dbPath}`);
  console.log(`==========================================`);
});
