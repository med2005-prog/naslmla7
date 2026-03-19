import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
try {
  execSync('npm run build');
} catch (e) {
  writeFileSync('build_debug.txt', (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : ''));
}
