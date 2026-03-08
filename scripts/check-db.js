const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

// Load .env.local manually (Next.js doesn't do this for Node scripts)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, val] = m;
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('No DB connection string found in env');
  process.exit(1);
}

(async () => {
  const pool = new Pool({ connectionString });
  try {
    console.log('Connecting to', connectionString.split('@')[1]?.slice(0, 60) ?? connectionString);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        avatar text,
        phone text,
        address text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const adminEmail = 'sharaecosolutions@gmail.com';
    const expectedHash =
      'd04bc36d0d1113dcd390e6b79f5598f6:25b46867e65505c58b197852e0ee6e9e87b3478789979c727f0e716c0aae4cdcdd30e809aaf00c3046804385d606d4546b29f1bd8bebb02954828406a35b9bca';

    // Ensure we have an admin role column and set this user as admin
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'");
    await pool.query("UPDATE users SET role='admin' WHERE email=$1", [adminEmail]);

    const res = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email=$1',
      [adminEmail],
    );

    if (res.rowCount === 0) {
      console.log('Admin user not found in DB. Inserting with known password hash...');
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Shara Ecosolutions', adminEmail, expectedHash, 'admin'],
      );
      console.log('Inserted admin user.');
    } else {
      const row = res.rows[0];
      console.log('Admin user exists. id=', row.id);
      console.log('Stored hash matches expected:', row.password_hash === expectedHash);
      console.log('Role:', row.role);
      if (row.password_hash !== expectedHash) {
        console.log('Updating stored hash to expected value...');
        await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [expectedHash, row.id]);
        console.log('Updated hash.');
      }
      if (row.role !== 'admin') {
        console.log('Updating role to admin...');
        await pool.query("UPDATE users SET role='admin' WHERE id=$1", [row.id]);
        console.log('Updated role.');
      }
    }

    const all = await pool.query('SELECT id,email,created_at FROM users ORDER BY id LIMIT 5');
    console.log('Users:', all.rows);
  } catch (err) {
    console.error('DB error', err);
  } finally {
    await pool.end();
  }
})();
