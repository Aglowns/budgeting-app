// Simple icon generator for UNCP Budgeting App
// This creates a basic app icon - you can replace with a proper design tool later

const fs = require('fs');
const path = require('path');

// Create resources directory if it doesn't exist
const resourcesDir = path.join(__dirname, 'resources');
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir);
}

// Create a simple SVG icon
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="#990000" rx="180"/>
  
  <!-- Gold accent circle -->
  <circle cx="512" cy="400" r="200" fill="#FFCC00" opacity="0.9"/>
  
  <!-- Dollar sign -->
  <text x="512" y="420" font-family="Arial, sans-serif" font-size="160" font-weight="bold" 
        text-anchor="middle" fill="#990000">$</text>
  
  <!-- UNCP text -->
  <text x="512" y="750" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        text-anchor="middle" fill="#FFCC00">UNCP</text>
        
  <!-- Budgeting text -->
  <text x="512" y="820" font-family="Arial, sans-serif" font-size="48" font-weight="normal" 
        text-anchor="middle" fill="#FFFFFF">Budgeting</text>
</svg>`;

// Write the SVG file
fs.writeFileSync(path.join(resourcesDir, 'icon.svg'), svgIcon);

console.log('✅ App icon generated at resources/icon.svg');
console.log('📱 To generate all required icon sizes, use: npx @capacitor/assets generate');
