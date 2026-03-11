const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src', function(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  console.log('Processing', filePath);
  let text = fs.readFileSync(filePath, 'utf8');
  let original = text;
  
  // Base backgrounds
  text = text.replace(/bg-white\s+dark:bg-gray-800/g, 'bg-surface');
  text = text.replace(/bg-white\s+dark:bg-gray-700/g, 'bg-surface');
  
  // Surface hover
  text = text.replace(/bg-gray-50\s+dark:bg-gray-700\/50/g, 'bg-surface-hover');
  text = text.replace(/bg-gray-50\s+dark:bg-gray-700/g, 'bg-surface-hover');
  text = text.replace(/hover:bg-gray-100\s+dark:hover:bg-gray-700/g, 'hover:bg-surface-hover');
  text = text.replace(/hover:bg-gray-50\s+dark:hover:bg-gray-700/g, 'hover:bg-surface-hover');
  
  // Text main
  text = text.replace(/text-gray-800\s+dark:text-gray-100/g, 'text-text-main');
  text = text.replace(/text-gray-800\s+dark:text-white/g, 'text-text-main');
  text = text.replace(/text-gray-800\s+dark:text-gray-200/g, 'text-text-main');
  text = text.replace(/text-gray-700\s+dark:text-gray-200/g, 'text-text-main');
  text = text.replace(/text-gray-700\s+dark:text-gray-300/g, 'text-text-main');
  text = text.replace(/text-gray-900\s+dark:text-gray-100/g, 'text-text-main');
  
  // Text muted
  text = text.replace(/text-gray-600\s+dark:text-gray-400/g, 'text-text-muted');
  text = text.replace(/text-gray-600\s+dark:text-gray-300/g, 'text-text-muted');
  text = text.replace(/text-gray-500\s+dark:text-gray-400/g, 'text-text-muted');
  text = text.replace(/text-gray-500\s+dark:text-gray-300/g, 'text-text-muted');
  
  // Borders
  text = text.replace(/border-gray-200\s+dark:border-gray-700/g, 'border-border-main');
  text = text.replace(/border-gray-300\s+dark:border-gray-600/g, 'border-border-main');
  text = text.replace(/border-gray-100\s+dark:border-gray-600/g, 'border-border-main');
  
  // Accent buttons
  text = text.replace(/bg-indigo-600\s+dark:bg-purple-500/g, 'bg-accent');
  text = text.replace(/hover:bg-indigo-700\s+dark:hover:bg-purple-600/g, 'hover:bg-accent-hover');
  text = text.replace(/bg-green-600\s+dark:bg-green-500/g, 'bg-accent');
  text = text.replace(/hover:bg-green-700\s+dark:hover:bg-green-600/g, 'hover:bg-accent-hover');
  text = text.replace(/bg-orange-600\s+dark:bg-orange-500/g, 'bg-accent');
  text = text.replace(/hover:bg-orange-700\s+dark:hover:bg-orange-600/g, 'hover:bg-accent-hover');
  text = text.replace(/bg-blue-600\s+dark:bg-blue-500/g, 'bg-accent');
  text = text.replace(/hover:bg-blue-700\s+dark:hover:bg-blue-600/g, 'hover:bg-accent-hover');
  
  // Focus rings
  text = text.replace(/focus:ring-indigo-500\s+dark:focus:ring-purple-500/g, 'focus:ring-accent');
  text = text.replace(/focus:ring-green-500\s+dark:focus:ring-green-400/g, 'focus:ring-accent');
  text = text.replace(/focus:ring-orange-500\s+dark:focus:ring-orange-400/g, 'focus:ring-accent');
  text = text.replace(/focus:ring-blue-500\s+dark:focus:ring-blue-400/g, 'focus:ring-accent');

  // Specific tracker text accents
  text = text.replace(/text-green-700\s+dark:text-green-300/g, 'text-accent');
  text = text.replace(/text-orange-700\s+dark:text-orange-300/g, 'text-accent');
  text = text.replace(/text-indigo-700\s+dark:text-purple-300/g, 'text-accent');
  text = text.replace(/text-blue-800\s+dark:text-blue-300/g, 'text-accent');

  // Muted background surfaces (like alert boxes or "last logged" boxes)
  text = text.replace(/bg-green-50\s+dark:bg-green-900\/30/g, 'bg-surface border border-accent');
  text = text.replace(/bg-orange-50\s+dark:bg-orange-900\/30/g, 'bg-surface border border-accent');
  text = text.replace(/bg-blue-50\s+dark:bg-blue-900\/20/g, 'bg-surface border border-accent');
  text = text.replace(/bg-blue-50\s+dark:bg-blue-900\/30/g, 'bg-surface border border-accent');
  
  // Specific mood tracker styles
  text = text.replace(/border-indigo-600\s+dark:border-purple-500/g, 'border-accent');
  
  // Remove dark: prefix where it's redundant because tailwind classes were updated.
  // We'll leave the graph alone for now, but there are things like text-white inside buttons
  // `bg-accent text-white hover:bg-accent-hover` is what it boils down to.
  
  if (original !== text) {
    fs.writeFileSync(filePath, text);
    console.log('Updated', filePath);
  }
});
