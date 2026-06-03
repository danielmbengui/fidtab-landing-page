export const IMAGES = {
  hero: {
    /** Commerce de proximité — gauche du hero */
    shop: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=520&h=720&q=85&auto=format&fit=crop',
    /** Salon de coiffure — droite du hero */
    side: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?w=520&h=720&q=85&auto=format&fit=crop',
    /** Paiement mobile — fidélisation client */
    counter: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&q=85&auto=format&fit=crop',
  },
  features: {
    /** Disponibilité en direct */
    available: '/images/features/available.png',
    /** Alertes stock */
    alerts: '/images/features/alerts.png',
    /** Commander en ligne */
    online: '/images/features/online.png',
    /** Carte de fidélité digitale */
    loyalty: '/images/features/fidelite.png',
    /** Click & collect */
    pickup: '/images/features/click-and-collect.png',
    /** Multi-tabacs */
    multi: '/images/features/multi.png',
    /** 100 % gratuit */
    free: '/images/features/free.png',
    dashboard: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=520&fit=crop&crop=entropy&q=80&auto=format',
  },
  stores: [
    'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop',
  ],
  loyalty: '/images/loyalty/card.png',
  cta: '/images/cta/download.png',
}

/**
 * imageMode:
 * - side: image à droite, texte à gauche (cartes larges)
 * - background: image en fond avec dégradé
 * - full: image pleine carte (largeur + hauteur)
 */
export const FEATURE_LAYOUT = [
  { span: 'bento-wide', image: 'available', imageMode: 'side' },
  { span: '', image: 'alerts', imageMode: 'background' },
  { span: '', image: 'loyalty', imageMode: 'background' },
  { span: 'bento-wide', image: 'multi', imageMode: 'background' },
  { span: '', image: 'free', imageMode: 'background' },
  { span: '', image: 'online', imageMode: 'background', comingSoon: true },
  { span: '', image: 'pickup', imageMode: 'background', comingSoon: true },
]
