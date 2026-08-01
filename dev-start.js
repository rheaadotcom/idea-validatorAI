/**
 * Smart Dev Server Launcher
 * - Automatically finds a free port (tries 3000, then 3001, 3002, etc.)
 * - Kills stale processes on port 3000 if possible
 * - Cross-platform (Windows + Mac + Linux)
 */
const { execSync, spawn } = require('child_process');
const net = require('net');

const PREFERRED_PORT = 3000;
const MAX_PORT = 3010;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    // Listen on all interfaces (::) to match Next.js behavior
    server.listen(port);
  });
}

async function tryKillPort(port) {
  try {
    if (process.platform === 'win32') {
      // Find PIDs using the port
      let result;
      try {
        result = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
      } catch {
        // No process found on port
        return;
      }
      const lines = result.trim().split('\n').filter(Boolean);
      const killedPids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !killedPids.has(pid)) {
          killedPids.add(pid);
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' });
            console.log(`  ✓ Killed process PID ${pid} on port ${port}`);
          } catch {
            /* already dead */
          }
        }
      }
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'pipe' });
    }
    // Wait for port to release
    await new Promise((r) => setTimeout(r, 2000));
  } catch {
    // Port wasn't in use or kill failed — that's fine
  }
}

async function findFreePort() {
  // First try preferred port
  if (await isPortFree(PREFERRED_PORT)) {
    return PREFERRED_PORT;
  }

  // Port is busy — try to free it
  console.log(`⚠  Port ${PREFERRED_PORT} is in use. Attempting to free it...`);
  await tryKillPort(PREFERRED_PORT);

  // Check again after kill
  if (await isPortFree(PREFERRED_PORT)) {
    console.log(`✓  Port ${PREFERRED_PORT} is now free.`);
    return PREFERRED_PORT;
  }

  // Scan for alternatives
  console.log(`⚠  Could not free port ${PREFERRED_PORT}. Scanning for alternatives...`);
  for (let port = PREFERRED_PORT + 1; port <= MAX_PORT; port++) {
    if (await isPortFree(port)) {
      console.log(`✓  Found free port: ${port}`);
      return port;
    }
  }

  // Last resort
  const fallback = MAX_PORT + 1;
  console.log(`⚠  Using fallback port: ${fallback}`);
  return fallback;
}

async function main() {
  console.log('');
  console.log('🚀 AI Startup Validator — Smart Dev Server');
  console.log('─'.repeat(45));

  const port = await findFreePort();
  console.log(`✓  Starting Next.js on port ${port}...`);
  console.log(`   URL: http://localhost:${port}`);
  console.log('─'.repeat(45));
  console.log('');

  const projectRoot = __dirname; // explicit project root
  const child = spawn('npx', ['next', 'dev', '-p', String(port)], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: String(port), NEXTAUTH_URL: `http://localhost:${port}` },
  });

  child.on('error', (err) => {
    console.error('Failed to start dev server:', err.message);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  // Graceful shutdown
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

main().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
