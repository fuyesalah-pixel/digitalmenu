import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State { return { hasError: true } }

  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Digital menu error boundary', error, info) }

  render() {
    if (this.state.hasError) return <div className="error-boundary"><div className="error-boundary-mark"><AlertTriangle size={22} /></div><span className="eyebrow">A small kitchen pause</span><h1>Something went<br /><em>a little sideways.</em></h1><p>Refresh the page and we’ll have the menu back on the table.</p><button className="primary-button" onClick={() => window.location.reload()}><RotateCcw size={16} /> Try again</button></div>
    return this.props.children
  }
}
