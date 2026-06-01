/**
 * Inline SVG placeholder for the white "BATTRON" wordmark (~26px tall).
 * Swap this out for a real asset later without touching the header.
 */
export function Logo() {
  return (
    <svg
      height="26"
      viewBox="0 0 138 26"
      role="img"
      aria-label="Battron"
      className="h-[26px] w-auto block"
    >
      <text
        x="0"
        y="20"
        fill="#ffffff"
        fontFamily="-apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="1"
      >
        BATTRON
      </text>
    </svg>
  )
}
