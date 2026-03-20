
const fs = require('fs');
const path = require('path');

// 1. Fix uview-plus u-navbar props for legacy compatibility
const navbarPropsPath = 'node_modules/uview-plus/components/u-navbar/props.js';
if (fs.existsSync(navbarPropsPath)) {
    let content = fs.readFileSync(navbarPropsPath, 'utf8');
    if (!content.includes('isBack')) {
        // Add is-back alias
        content = content.replace('props: {', 'props: {\n\t\tisBack: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: true\n\t\t},');
        // Add is-fixed alias
        content = content.replace('props: {', 'props: {\n\t\tisFixed: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: true\n\t\t},');
        fs.writeFileSync(navbarPropsPath, content);
        console.log('Added legacy prop aliases to u-navbar props.js');
    }
}

const navbarVuePath = 'node_modules/uview-plus/components/u-navbar/u-navbar.vue';
if (fs.existsSync(navbarVuePath)) {
    let content = fs.readFileSync(navbarVuePath, 'utf8');
    
    // Fix is-fixed usage
    content = content.replace(":class=\"[fixed && 'u-navbar--fixed']\"", ":class=\"[(fixed || isFixed) && 'u-navbar--fixed']\"");
    
    // Fix is-back usage
    // We want to hide the icon if isBack is false OR if leftIcon is explicitly empty
    content = content.replace('v-if="leftIcon"', 'v-if="leftIcon && (isBack !== false)"');
    
    // FORCE placeholder = true for H5 by default if fixed
    content = content.replace('v-if="fixed && placeholder"', 'v-if="(fixed || isFixed) && (placeholder || true)"');
    
    fs.writeFileSync(navbarVuePath, content);
    console.log('Applied logic fixes to u-navbar.vue');
}

console.log('u-navbar compatibility patch complete.');
