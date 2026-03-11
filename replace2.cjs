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
  
  // Specific graph replacements
  text = text.replace(/className="stroke-gray-200 dark:stroke-gray-700"/g, 'className="stroke-border-main"');
  text = text.replace(/wrapperClassName="dark:!bg-gray-800 dark:!text-gray-100 dark:!border-gray-700"/g, 'wrapperClassName="!bg-surface !text-text-main !border-border-main"');
  text = text.replace(/className="fill-indigo-500 dark:fill-purple-400"/g, 'className="fill-accent"');
  text = text.replace(/className="fill-orange-500 dark:fill-orange-400"/g, 'className="fill-accent"');
  text = text.replace(/className="fill-green-500 dark:fill-green-400"/g, 'className="fill-accent"');
  text = text.replace(/className="stroke-indigo-500 dark:stroke-purple-400"/g, 'className="stroke-accent"');
  
  // Remaining texts
  text = text.replace(/text-red-500 dark:text-red-400/g, 'text-red-500');
  text = text.replace(/hover:text-red-700 dark:hover:text-red-300/g, 'hover:text-red-600');
  text = text.replace(/hover:bg-red-50 dark:hover:bg-red-900\/30/g, 'hover:bg-red-50'); // Keep red static maybe? Or transparent
  
  text = text.replace(/text-yellow-700 dark:text-yellow-200/g, 'text-accent');
  text = text.replace(/border-yellow-200 dark:border-yellow-800/g, 'border-accent');
  text = text.replace(/bg-yellow-50 dark:bg-yellow-900\/40/g, 'bg-surface border border-accent');
  
  text = text.replace(/text-green-600 dark:text-green-400/g, 'text-green-600');
  text = text.replace(/border-green-200 dark:border-green-800/g, 'border-green-300');
  
  text = text.replace(/text-blue-700 dark:text-blue-300/g, 'text-blue-600');
  text = text.replace(/border-blue-200 dark:border-blue-800/g, 'border-blue-300');
  text = text.replace(/bg-gray-600 dark:bg-gray-700/g, 'bg-surface-hover');
  text = text.replace(/hover:bg-gray-700 dark:hover:bg-gray-600/g, 'hover:bg-border-main');
  text = text.replace(/bg-white dark:bg-gray-900/g, 'bg-surface');
  
  text = text.replace(/bg-green-600 dark:bg-green-700/g, 'bg-green-600');
  text = text.replace(/bg-red-600 dark:bg-red-700/g, 'bg-red-600');
  text = text.replace(/hover:bg-red-700 dark:hover:bg-red-600/g, 'hover:bg-red-700');
  
  text = text.replace(/bg-red-50 dark:bg-red-900\/30/g, 'bg-red-50');
  text = text.replace(/border-red-200 dark:border-red-800/g, 'border-red-300');
  
  text = text.replace(/bg-gray-50 dark:bg-gray-900/g, 'bg-surface-hover');
  text = text.replace(/text-gray-800 dark:text-gray-300/g, 'text-text-main');
  text = text.replace(/border dark:border-gray-700/g, 'border border-border-main');
  
  // App.jsx and Lifestyle Suggestions
  text = text.replace(/border-indigo-100 dark:border-indigo-900/g, 'border-accent');
  text = text.replace(/border-l-indigo-500/g, 'border-l-accent');
  text = text.replace(/bg-indigo-50 dark:bg-indigo-900\/30/g, 'bg-surface-hover');
  text = text.replace(/border-gray-100 dark:border-gray-700/g, 'border-border-main');
  text = text.replace(/text-gray-400 dark:text-gray-500/g, 'text-text-muted');
  
  text = text.replace(/text-red-600 dark:text-red-400/g, 'text-red-600');
  text = text.replace(/text-indigo-600/g, 'text-accent');
  
  text = text.replace(/dark:hover:bg-gray-600/g, ''); // Leftovers
  text = text.replace(/dark:bg-gray-700/g, '');
  
  if (original !== text) {
    fs.writeFileSync(filePath, text);
    console.log('Updated', filePath);
  }
});
