#!/usr/bin/env node
/**
 * Passport (login/register) regression checks.
 *
 * Goal: catch common UI/logic regressions without launching HBuilderX:
 * - Register step 2 (complete profile) must NOT be nested under step 1 (code input)
 * - Key methods must keep expected state transitions
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function between(text, startToken, endToken) {
  const start = text.indexOf(startToken);
  if (start === -1) return null;
  const end = text.indexOf(endToken, start + startToken.length);
  if (end === -1) return null;
  return text.slice(start + startToken.length, end);
}

function findDivBlock(html, predicate) {
  // Extremely small div-only "parser": finds the first <div ...> matching predicate
  // and returns its [startIndex, endIndex] range based on div nesting.
  const openRe = /<div\b[^>]*>/g;
  const closeRe = /<\/div>/g;

  const opens = [];
  let match;
  while ((match = openRe.exec(html))) {
    opens.push({ index: match.index, text: match[0] });
  }

  for (const o of opens) {
    if (!predicate(o.text)) continue;
    // Find matching closing </div> by scanning tokens after start
    let depth = 0;
    let pos = o.index;
    const tokenRe = /<div\b[^>]*>|<\/div>/g;
    tokenRe.lastIndex = pos;
    let token;
    while ((token = tokenRe.exec(html))) {
      if (token[0].startsWith("<div")) depth += 1;
      else depth -= 1;
      if (depth === 0) {
        return { start: o.index, end: tokenRe.lastIndex };
      }
    }
    throw new Error("Unbalanced <div> tags while scanning for block.");
  }
  return null;
}

function mustMatch(text, re, message) {
  assert(re.test(text), message);
}

function checkLoginVue(repoRoot) {
  const filePath = path.join(repoRoot, "src/pages/passport/login.vue");
  const sfc = read(filePath);

  const template = between(sfc, "<template>", "</template>");
  assert(template, "login.vue: missing <template> section.");

  const script = between(sfc, "<script>", "</script>");
  assert(script, "login.vue: missing <script> section.");

  const codeStep = findDivBlock(template, (tag) => tag.includes('v-show="current == 1"') && tag.includes('class="box-code"'));
  assert(codeStep, 'login.vue: missing `<div v-show="current == 1" class="box-code">` block.');

  const profileStep = findDivBlock(template, (tag) => tag.includes('v-show="current == 2"'));
  assert(profileStep, 'login.vue: missing `<div v-show="current == 2">` block.');

  assert(
    !(profileStep.start > codeStep.start && profileStep.start < codeStep.end),
    "login.vue: register step 2 (current==2) is nested inside step 1 (current==1)."
  );

  // Key state transitions
  mustMatch(
    script,
    /onRegisterCodeConfirm\s*\(\s*code\s*\)\s*\{[\s\S]*?\bthis\.code\s*=\s*code[\s\S]*?\bthis\.current\s*=\s*2[\s\S]*?\}/m,
    "login.vue: onRegisterCodeConfirm must set `this.code = code` and `this.current = 2`."
  );

  mustMatch(
    script,
    /toggleAccountMode\s*\(\)\s*\{[\s\S]*?\bthis\.current\s*=\s*0[\s\S]*?\bthis\.code\s*=\s*\"\"[\s\S]*?\bthis\.flage\s*=\s*false[\s\S]*?\bthis\.sliderVisible\s*=\s*false[\s\S]*?\}/m,
    "login.vue: toggleAccountMode must reset `current/code/flage/sliderVisible` to avoid mixed modes."
  );

  mustMatch(
    script,
    /handleNavBack\s*\(\)\s*\{[\s\S]*?\bif\s*\(\s*this\.current\s*>\s*0\s*\)[\s\S]*?\bthis\.current\s*=\s*this\.current\s*-\s*1/m,
    "login.vue: handleNavBack must step back within registration flow when current>0."
  );

  // Privacy gating (register and password login)
  mustMatch(
    script,
    /fetchCode\s*\(\)\s*\{[\s\S]*?\bif\s*\(\s*!this\.enablePrivacy\s*\)[\s\S]*?return\s+false/m,
    "login.vue: fetchCode must early-return when privacy is not agreed."
  );
  mustMatch(
    script,
    /passwordLogin\s*\(\)\s*\{[\s\S]*?\bif\s*\(\s*!this\.enablePrivacy\s*\)[\s\S]*?return\s+false/m,
    "login.vue: passwordLogin must early-return when privacy is not agreed."
  );

  return filePath;
}

function checkWechatLoginVue(repoRoot) {
  const filePath = path.join(repoRoot, "src/pages/passport/wechatMPLogin.vue");
  const sfc = read(filePath);
  const template = between(sfc, "<template>", "</template>") || "";

  // uview-plus single checkbox must be used-alone + v-model:checked
  assert(
    template.includes("used-alone") && /v-model:checked\s*=/.test(template),
    "wechatMPLogin.vue: u-checkbox should use `used-alone` and `v-model:checked` (uview-plus Vue3 binding)."
  );

  return filePath;
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const checked = [];

  checked.push(checkLoginVue(repoRoot));
  checked.push(checkWechatLoginVue(repoRoot));

  // eslint-disable-next-line no-console
  console.log("[passport-check] OK");
  // eslint-disable-next-line no-console
  console.log("[passport-check] Checked:");
  for (const f of checked) console.log(" - " + f);
}

main();

