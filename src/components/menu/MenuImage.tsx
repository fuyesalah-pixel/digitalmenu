import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { cn } from '../../lib/utils'

type MenuImageProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

const lqip = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PGZpbHRlciBpZD0iYiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNkOTk1NGEiIGZpbHRlcj0idXJsKCNiKSIgb3BhY2l0eT0iLjY1Ii8+PC9zdmc+'

export function MenuImage({ src, alt, className, priority = false, sizes = '(max-width: 768px) 100vw, 33vw' }: MenuImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const responsiveSrcSet = src.includes('images.unsplash.com')
    ? [480, 768, 1200, 1600].map((width) => {
      const resized = /[?&]w=\d+/.test(src) ? src.replace(/([?&])w=\d+/, `$1w=${width}`) : `${src}${src.includes('?') ? '&' : '?'}w=${width}`
      return `${resized} ${width}w`
    }).join(', ')
    : undefined

  return (
    <div className={cn('menu-image', className)}>
      <div className="image-lqip" style={{ backgroundImage: `url("${lqip}")` }} aria-hidden="true" />
      {!failed && (
        <motion.img
          initial={{ opacity: 0, scale: 0.97 }}
          animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          src={src}
          srcSet={responsiveSrcSet}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          {...(priority ? { fetchpriority: 'high' } : {})}
          decoding="async"
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {failed && <div className="image-fallback"><ImageOff size={20} /><span>Image unavailable</span></div>}
      {!loaded && !failed && <div className="image-loading" aria-label="Loading image" />}
    </div>
  )
}
