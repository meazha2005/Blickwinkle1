import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export const dbConfig = {
  host: process.env.DB_HOST || "192.169.147.255",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "MEAZHA",
  password: process.env.DB_PASS || "dZYRYi(o(0*U",
  database: process.env.DB_NAME || "le_test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 25000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

export function getPool(): mysql.Pool {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool(dbConfig);
  }
  return globalForDb.mysqlPool;
}

export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T> {
  const p = getPool();
  try {
    const [results] = await p.query(sql, params);
    return results as T;
  } catch (err: unknown) {
    console.error("[Database Query Error]:", err);
    throw err;
  }
}

export async function initDatabase() {
  const p = getPool();

  // 1. Admin Users Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(191) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) DEFAULT 'Admin',
      role VARCHAR(50) DEFAULT 'superadmin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Service Enquiries Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_service_enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(50) NULL,
      service_name VARCHAR(150) NOT NULL,
      message TEXT NULL,
      status ENUM('pending', 'contacted', 'in_progress', 'closed') DEFAULT 'pending',
      notes TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_service_status (status),
      INDEX idx_service_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Course Enrollments Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_course_enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      course_name VARCHAR(150) NOT NULL,
      background VARCHAR(150) NULL,
      mode VARCHAR(100) DEFAULT 'Online Live',
      status ENUM('pending', 'contacted', 'enrolled', 'rejected') DEFAULT 'pending',
      notes TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_course_status (status),
      INDEX idx_course_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Newsletter Subscribers Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(191) NOT NULL UNIQUE,
      status ENUM('active', 'unsubscribed') DEFAULT 'active',
      confirmation_sent TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_sub_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Contact Messages Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(50) NULL,
      inquiry_type VARCHAR(150) NOT NULL,
      preferred_contact VARCHAR(50) DEFAULT 'Email',
      message TEXT NOT NULL,
      status ENUM('new', 'in_review', 'replied', 'resolved') DEFAULT 'new',
      notes TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_contact_status (status),
      INDEX idx_contact_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 6. Chatbot (SHIYA) Leads Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_chatbot_leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(150) NULL,
      phone VARCHAR(50) NULL,
      email VARCHAR(191) NULL,
      course_name VARCHAR(150) NULL,
      interested ENUM('yes', 'no', 'pending') DEFAULT 'pending',
      conversation LONGTEXT NOT NULL,
      status ENUM('new', 'contacted', 'enrolled', 'closed') DEFAULT 'new',
      notes TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_chatbot_status (status),
      INDEX idx_chatbot_course (course_name),
      INDEX idx_chatbot_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 7. Articles Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      image_url LONGTEXT NOT NULL,
      content LONGTEXT NOT NULL,
      summary TEXT NULL,
      author VARCHAR(100) DEFAULT 'Blickwinkle Team',
      status ENUM('published', 'draft') DEFAULT 'published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_article_slug (slug),
      INDEX idx_article_status (status),
      INDEX idx_article_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default admin if none exists
  const [rows] = await p.query<mysql.RowDataPacket[]>(
    "SELECT id FROM blickwinkle_website_admins LIMIT 1;"
  );
  if (!rows || rows.length === 0) {
    const defaultEmail = process.env.ADMIN_DEFAULT_USER || "admin@blickwinkle.com";
    const defaultPass = process.env.ADMIN_DEFAULT_PASS || "Blickwinkle@2026";
    const hashed = await bcrypt.hash(defaultPass, 10);
    await p.query(
      "INSERT INTO blickwinkle_website_admins (email, password_hash, name, role) VALUES (?, ?, 'Blickwinkle Admin', 'superadmin');",
      [defaultEmail, hashed]
    );
    console.log(`[DB] Default admin seeded: ${defaultEmail} / ${defaultPass}`);
  }
}

let articlesTableChecked = false;
export async function ensureArticlesTable() {
  if (articlesTableChecked) return;
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS blickwinkle_website_articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      image_url LONGTEXT NOT NULL,
      content LONGTEXT NOT NULL,
      summary TEXT NULL,
      author VARCHAR(100) DEFAULT 'Blickwinkle Team',
      status ENUM('published', 'draft') DEFAULT 'published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_article_slug (slug),
      INDEX idx_article_status (status),
      INDEX idx_article_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  articlesTableChecked = true;
}
