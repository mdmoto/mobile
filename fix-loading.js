const fs = require('fs');
const file = 'static/js/index.ab8f9524.js';
let content = fs.readFileSync(file, 'utf-8');
const regex = /uni\.showLoading\(\)&&uni\.hideLoading\(\)/g;
content = content.replace(regex, "uni.hideLoading()");
fs.writeFileSync(file, content);
console.log('Done');
