export default function RulerHorizontal({ show, marginLeftPx }: { show: boolean, marginLeftPx: number }) {
  if (!show) return null
  const rulerStart = marginLeftPx; // Start marks from where content begins
  const rulerEnd = 794 - 20; // A4_WIDTH_PX - right padding of ruler container
  const rulerWidth = rulerEnd - rulerStart;

  return (
    <div
      className="absolute top-0 h-[20px] bg-gray-100 border-b border-r border-gray-300 z-10 flex items-center px-2 text-xs text-gray-500 overflow-hidden"
      style={{ left: `${marginLeftPx}px`, right: '20px' }} // Adjust left position based on margin
    >
      <div className="relative h-full" style={{ width: `${rulerWidth}px` }}>
        {Array.from({ length: Math.ceil(rulerWidth / 16) }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full border-l border-gray-400"
            style={{ left: `${i * 16}px` }} // Approx 16px per cm/inch
          >
            {i % 5 === 0 && <span className="absolute top-0 left-0 -translate-x-1/2">{Math.round(i * 16 / 37.8)}</span>} {/* Convert px to cm approx */}
          </div>
        ))}
      </div>
    </div>
  )
}
