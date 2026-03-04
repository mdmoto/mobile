const fs = require('fs');
const path = require('path');
const dir = '/Users/adam/0.9/m/static/js/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const regex = /uni\.showLoading\(\)&&uni\.hideLoading\(\)/g;
for (const f of files) {
  const file = path.join(dir, f);
  let content = fs.readFileSync(file, 'utf-8');
  if (regex.test(content)) {
    content = content.replace(regex, "uni.hideLoading()");
    fs.writeFileSync(file, content);
    console.log('Patched', f);
  }
}
