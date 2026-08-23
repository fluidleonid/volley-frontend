const fs = require('fs');
const path = require('path');

function toSentenceCase(str) {
  return str.split(' ').map((word, i) => {
    if (i === 0) return word;
    if (/^[A-Z][a-z]+$/.test(word)) {
      return word.charAt(0).toLowerCase() + word.slice(1);
    }
    return word;
  }).join(' ');
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      content = content.replace(/t\('([^']+)',\s*'([^']+)'\)/g, (match, key, text) => {
        return `t('${key}', '${toSentenceCase(text)}')`;
      });
      
      content = content.replace(/title="([^"]+)"/g, (match, text) => {
        return `title="${toSentenceCase(text)}"`;
      });
      
      content = content.replace(/title=\{'([^']+)'\}/g, (match, text) => {
        return `title={'${toSentenceCase(text)}'}`;
      });
      
      content = content.replace(/>([A-Z][a-zA-Z0-9\s]+)</g, (match, text) => {
        if (text.includes(' ') && text.trim().length > 0) {
          return `>${toSentenceCase(text)}<`;
        }
        return match;
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir('./src');
