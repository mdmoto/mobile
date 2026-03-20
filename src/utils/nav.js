function getUni() {
  const u = typeof uni !== "undefined" ? uni : (typeof window !== "undefined" ? window.uni : null);
  console.log("NAV_DIAGNOSTIC: getUni call", { 
    exists: !!u, 
    type: typeof u, 
    keys: u ? Object.keys(u).filter(k => typeof u[k] === "function").slice(0, 5) : [] 
  });
  return u;
}

function h5Fallback(url, replace = false) {
  if (typeof window === "undefined") return;
  if (!url) return;
  const hashUrl = url.startsWith("/") ? `#${url}` : `#/${url}`;
  if (replace) {
    window.location.replace(hashUrl);
  } else {
    window.location.hash = hashUrl;
  }
}

export function uniCall(method, options) {
  const uniRef = getUni();
  const fn =
    (uniRef && typeof uniRef[method] === "function" && uniRef[method]) ||
    (uniRef && typeof uniRef.navigateTo === "function" && uniRef.navigateTo) ||
    null;

  if (fn) return fn(options);

  if (method === "redirectTo") {
    h5Fallback(options && options.url, true);
    return;
  }
  h5Fallback(options && options.url, false);
}

export function uniNavigateTo(url) {
  return uniCall("navigateTo", { url });
}

export function uniRedirectTo(url) {
  return uniCall("redirectTo", { url });
}

export function uniSwitchTab(url) {
  return uniCall("switchTab", { url });
}
