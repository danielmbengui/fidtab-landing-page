'use client'

/** Téléphone compact latéral du hero — contenu placeholder, remplaçable facilement. */
export default function HeroSidePhone({ phone, className = '' }) {
  if (!phone) return null

  return (
    <div className={`hero-flank-phone ${className}`.trim()} aria-hidden="true">
      <div className="phone-device phone-device--compact">
        <div className="phone-notch" />
        <div className="phone-screen app-side-screen">
          <div className="app-status-bar app-status-bar--compact">
            <span>9:41</span>
            <span className="app-status-icons">●●●</span>
          </div>
          <div className="app-side-header">
            <div className="app-side-store">{phone.storeName}</div>
            <div className="app-side-sub">{phone.storeSub}</div>
          </div>
          <div className="app-side-title">{phone.screenTitle}</div>
          <ul className="app-side-list">
            {phone.items.map((item, i) => (
              <li className="app-side-row" key={i}>
                <span className="app-side-icon">{item.icon}</span>
                <span className="app-side-name">{item.name}</span>
                <span className="app-side-status">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="phone-reflection" />
      </div>
    </div>
  )
}
