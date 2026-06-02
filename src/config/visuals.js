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
    /** Rayons produits — disponibilité stock */
    stocks: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85&auto=format&fit=crop',
    /** Smartphone — alertes */
    push: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
    /** Paiement / commande mobile */
    shop: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    /** Récompenses / fidélité */
    loyalty: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80&auto=format&fit=crop',
    /** Sac prêt au retrait — click & collect */
    pickup: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80&auto=format&fit=crop',
    /** Boutique — multi-commerces */
    launch: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85&auto=format&fit=crop',
    /** Célébration — 100 % gratuit */
    free: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    dashboard: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=520&fit=crop&crop=entropy&q=80&auto=format',
  },
  stores: [
    'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop',
  ],
  loyalty: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85&auto=format&fit=crop',
  cta: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1400&q=85&auto=format&fit=crop',
  avatars: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format&fit=crop',
  ],
}

/**
 * imageMode:
 * - side: image à droite, texte à gauche (cartes larges)
 * - background: image en fond avec dégradé
 * - full: image pleine carte (largeur + hauteur)
 */
export const FEATURE_LAYOUT = [
  { span: 'bento-wide', image: 'stocks', imageMode: 'side' },
  { span: '', image: 'push', imageMode: 'background' },
  { span: '', image: 'shop', imageMode: 'background', comingSoon: true },
  { span: '', image: 'loyalty', imageMode: 'background' },
  { span: '', image: 'pickup', imageMode: 'background', comingSoon: true },
  { span: 'bento-wide', image: 'launch', imageMode: 'full' },
  { span: '', image: 'free', imageMode: 'background' },
]
