// Recadrage du portrait, partagé par la conversion des images (portrait-*.webp)
// et par le générateur des traits (scripts/portrait-lines.mjs) : les deux doivent
// tomber pixel pour pixel au même endroit pour que traits et photo se superposent.
export const PORTRAIT_CROP = { left: 40, top: 270, width: 1000, height: 1170 }
