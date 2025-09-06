import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend_tapon');

// Function to start a process
function startProcess(command, args, cwd, name) {
  console.log(`Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`[${name} ERROR] ${data}`);
  });

  process.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });

  return process;
}

// Start backend server
const backendProcess = startProcess('npm', ['run', 'dev'], backendDir, 'Backend');

// Start frontend server
const frontendProcess = startProcess('npm', ['run', 'dev'], rootDir, 'Frontend');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});

console.log('\nServers started! Press Ctrl+C to stop all servers.\n');
console.log('Backend running at: http://localhost:5001');
console.log('Frontend running at: http://localhost:3000');