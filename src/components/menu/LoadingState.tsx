export function MenuSkeleton() {
  return (
    <div className="menu-grid" aria-label="Loading menu" aria-busy="true">
      {Array.from({ length: 6 }).map((_, index) => <div className="menu-card skeleton-card" key={index}>
        <div className="skeleton skeleton-media" />
        <div className="skeleton-card-body">
          <div className="skeleton skeleton-line wide" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      </div>)}
    </div>
  )
}
