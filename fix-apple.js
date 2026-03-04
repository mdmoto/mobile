const fs = require('fs');
const file = 'static/js/pages-passport-login.f3263395.js';
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(/"Apple"/g, '"APPLE"');
fs.writeFileSync(file, content);
console.log('Done');
