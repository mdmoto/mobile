function getUni() {
  if (typeof uni !== "undefined") return uni;
  if (typeof window !== "undefined" && window.uni) return window.uni;
  return null;
}

function h5Fallback(url, replace = false) {
  if (typeof window === "undefined" || !url) return;
  const hashUrl = url.startsWith("/") ? `#${url}` : `#/${url}`;
  if (replace) {
    window.location.replace(hashUrl);
  } else {
    window.location.hash = hashUrl;
  }
}

export function uniCall(method, options) {
  const uniRef = getUni();
  if (uniRef && typeof uniRef[method] === "function") {
    // Explicit call with options
    return uniRef[method](options);
  }

  // Final fallback for critical navigation in case uni is still flaky
  if (method === "navigateTo" || method === "redirectTo" || method === "switchTab") {
    console.warn(`Fallback triggered for ${method} to ${options ? options.url : 'unknown'}`);
    h5Fallback(options && options.url, method === "redirectTo");
  }
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
