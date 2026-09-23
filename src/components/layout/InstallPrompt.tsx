import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onPrompt = (next: Event) => { event?.preventDefault?.(); setEvent(next as BeforeInstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!event || dismissed) return null
  return <div className="install-prompt"><span className="install-icon"><Download size={15} /></span><span><strong>Keep the menu close</strong><small>Install for offline access</small></span><button onClick={async () => { await event.prompt(); await event.userChoice; setDismissed(true) }}>Install</button><button className="install-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss install prompt"><X size={14} /></button></div>
}
