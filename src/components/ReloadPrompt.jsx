import './ReloadPrompt.css'
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line-no-console
      console.log(`SW Registered: ${r}`)
    },
    onRegisterError(error) {
      // eslint-disable-next-line-no-console
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="ReloadPrompt-container">
      { (offlineReady || needRefresh)
        && <div className="ReloadPrompt-toast">
            <div className="ReloadPrompt-message">
              { offlineReady
                ? <span>App ready to work offline</span>
                : <span>New content available, click on reload button to update.</span>
              }
            </div>
            { needRefresh && <button className="ReloadPrompt-refresh-button" onClick={() => updateServiceWorker(true)}>Reload</button> }
            <button className="ReloadPrompt-close-button" onClick={() => close()}>Close</button>
        </div>
      }
    </div>
  )
}

export default ReloadPrompt
