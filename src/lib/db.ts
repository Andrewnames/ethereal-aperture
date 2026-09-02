import pg from "pg";

let pool: pg.Pool | null = null;
let ready: Promise<void> | null = null;

export function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    pool = new pg.Pool({
      connectionString: url,
      ssl: /render\.com|onrender\.com/.test(url)
        ? { rejectUnauthorized: false }
        : undefined,
      max: 4,
    });
  }
  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  await ensureSchema();
  return getPool().query<T>(text, params);
}

export async function ensureSchema() {
  if (!ready) ready = migrate();
  await ready;
}

async function migrate() {
  const client = getPool();
  await client.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      year TEXT NOT NULL,
      headline TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      flag TEXT,
      link_label TEXT,
      link_href TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      cta_label TEXT,
      cta_href TEXT,
      dates TEXT,
      time TEXT,
      location TEXT,
      level TEXT,
      bring TEXT,
      cost TEXT,
      term TEXT,
      note TEXT,
      photos_href TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      gallery TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      alt TEXT NOT NULL DEFAULT '',
      index_label TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      mime TEXT,
      bytes BYTEA
    );
  `);
}
