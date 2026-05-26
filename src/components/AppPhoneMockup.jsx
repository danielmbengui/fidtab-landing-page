'use client'

import { getBrandLogoParts } from '@/context/constants/constants_app'

export default function AppPhoneMockup({ hero, phoneItems, storeSub }) {
  const { primary, accent } = getBrandLogoParts()

  return (
    <div className="phone-device">
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen app-home">
        <div className="app-status-bar">
          <span>9:41</span>
          <span className="app-status-icons">●●●</span>
        </div>

        <div className="app-header">
          <div className="app-header-left">
            <div className="app-avatar">🌿</div>
            <div>
              <div className="app-store-name">{hero.appStoreName}</div>
              <div className="app-store-meta">
                <span className="app-open-dot" />
                {hero.appOpen}
                <span className="app-store-sub">{storeSub}</span>
              </div>
            </div>
          </div>
          <button type="button" className="app-cart-btn" aria-label="Cart">
            🛒
            <span className="app-cart-badge">2</span>
          </button>
        </div>

        <div className="app-loyalty">
          <div className="app-loyalty-top">
            <span className="app-loyalty-label">{hero.phoneLoyaltyLabel}</span>
            <span className="app-brand-tag">{primary}{accent}</span>
          </div>
          <div className="app-loyalty-points">
            680
            <span>{hero.phonePointsSuffix}</span>
          </div>
          <div className="app-loyalty-bar">
            <div className="app-loyalty-bar-fill" />
          </div>
          <p className="app-loyalty-next">{hero.phoneNextReward}</p>
          <div className="app-loyalty-reward">
            <span>🎁</span>
            <span>{hero.appNextRewardLabel}</span>
          </div>
        </div>

        <div className="app-section-head">
          <span className="app-section-title">{hero.appOrderTitle}</span>
          <span className="app-section-link">{hero.appSeeAll}</span>
        </div>

        <div className="app-products">
          {phoneItems.map((item, i) => (
            <div className="app-product-row" key={i}>
              <div className="app-product-icon">{item.icon}</div>
              <div className="app-product-info">
                <span className="app-product-name">{item.name}</span>
                <span className="app-product-price">{item.price}</span>
              </div>
              <button type="button" className="app-product-add" aria-label="Add">+</button>
            </div>
          ))}
        </div>

        <div className="app-tabbar">
          {[
            { icon: '🏠', label: hero.appTabHome, active: true },
            { icon: '🛍', label: hero.appTabShop, active: false },
            { icon: '💳', label: hero.appTabLoyalty, active: false },
            { icon: '👤', label: hero.appTabAccount, active: false },
          ].map((tab) => (
            <div key={tab.label} className={`app-tab ${tab.active ? 'active' : ''}`}>
              <span className="app-tab-icon">{tab.icon}</span>
              <span className="app-tab-label">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="phone-reflection" aria-hidden="true" />
    </div>
  )
}
