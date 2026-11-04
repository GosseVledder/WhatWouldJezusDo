// Build flavour. `wxt build|zip --mode store` makes the Chrome Web Store / Edge Add-ons build:
// those stores update the extension themselves, so the GitHub update check (and the
// api.github.com permission, see wxt.config.ts) is left out. The GitHub zip is the normal
// production build.
export const STORE_BUILD: boolean = import.meta.env.MODE === 'store';
