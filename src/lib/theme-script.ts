// Plain string with no client code, so the server-rendered layout can inline it.

/**
 * Runs in <head> before first paint (see layout.tsx):
 * - applies the saved theme, or the device's preference, so there's no flash of the wrong theme;
 * - plays the intro curtain only on the first page view of a visit.
 */
export const headScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t)}catch(e){}try{if(sessionStorage.getItem("intro-seen"))d.setAttribute("data-intro","skip");else sessionStorage.setItem("intro-seen","1")}catch(e){d.setAttribute("data-intro","skip")}})()`;
