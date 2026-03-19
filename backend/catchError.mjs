import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
try {
  execSync('node server.js');
} catch (e) {
  writeFileSync('debug.txt', e.stderr.toString());
}
