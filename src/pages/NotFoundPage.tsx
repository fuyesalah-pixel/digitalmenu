import { Link } from 'react-router-dom'
import { ArrowLeft, Utensils } from 'lucide-react'

export default function NotFoundPage() {
  return <div className="not-found"><div className="not-found-mark"><Utensils size={22} /></div><span className="eyebrow">A little off the menu</span><h1>That page has<br /><em>left the table.</em></h1><p>We couldn’t find what you were looking for, but there’s always something good on the next page.</p><Link className="primary-button" to="/"><ArrowLeft size={16} /> Back to the menu</Link></div>
}
