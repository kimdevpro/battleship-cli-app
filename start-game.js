import { execSync } from 'child_process';
import path from 'path';

// List required modules
const requiredModules = ['chalk', 'cli-table3', 'readline-sync'];

function isModuleInstalled(module) {
  try {
    require.resolve(module);
    return true;
  } catch {
    return false;
  }
}

// Install missing modules
const missingModules = requiredModules.filter(m => !isModuleInstalled(m));
if (missingModules.length > 0) {
  console.log(`📦 Installing missing modules: ${missingModules.join(', ')}`);
  execSync(`npm install ${missingModules.join(' ')}`, { stdio: 'inherit' });
}

// Run the actual game
const gamePath = path.resolve('./main.js');
const gameCommand = `node ${gamePath}`;
execSync(gameCommand, { stdio: 'inherit' });
