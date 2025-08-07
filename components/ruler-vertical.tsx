export default function RulerVertical({ show, marginTopPx }: { show: boolean, marginTopPx: number }) {
  if (!show) return null
  const rulerStart = marginTopPx; // Start marks from where content begins
  const rulerEnd = 1123 - 20; // A4_HEIGHT_PX - bottom padding of ruler container
  const rulerHeight = rulerEnd - rulerStart;

  return (
    <div
      className="absolute left-0 w-[20px] bg-gray-100 border-r border-b border-gray-300 z-10 flex flex-col items-center py-2 text-xs text-gray-500 overflow-hidden"
      style={{ top: `${marginTopPx}px`, bottom: '20px' }} // Adjust top position based on margin
    >
      <div className="relative w-full" style={{ height: `${rulerHeight}px` }}>
        {Array.from({ length: Math.ceil(rulerHeight / 16) }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full border-t border-gray-400"
            style={{ top: `${i * 16}px` }} // Approx 16px per cm/inch
          >
            {i % 5 === 0 && <span className="absolute top-0 left-0 -translate-y-1/2">{Math.round(i * 16 / 37.8)}</span>} {/* Convert px to cm approx */}
          </div>
        ))}
      </div>
    </div>
  )
}
