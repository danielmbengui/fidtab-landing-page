export const IMAGES = {
  hero: {
    /** Intérieur tabac / épicerie de proximité */
    shop: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=640&q=85&auto=format&fit=crop',
    /** Paiement en caisse — fidélisation client */
    counter: 'https://images.unsplash.com/photo-1556745753-b290719bb967?w=640&q=85&auto=format&fit=crop',
  },
  features: {
    shop: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80&auto=format&fit=crop',
    loyalty: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    push: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
    dashboard: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=520&fit=crop&crop=entropy&q=80&auto=format',
    pickup: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80&auto=format&fit=crop',
    stocks: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85&auto=format&fit=crop',
    launch: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
  },
  stores: [
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&q=80&auto=format&fit=crop',
  ],
  loyalty: 'https://images.unsplash.com/photo-1556740758-90de374c12ef?w=900&q=85&auto=format&fit=crop',
  cta: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=85&auto=format&fit=crop',
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
  { span: 'bento-wide', image: 'shop', imageMode: 'side' },
  { span: '', image: 'loyalty', imageMode: 'background' },
  { span: '', image: 'dashboard', imageMode: 'background' },
  { span: '', image: 'pickup', imageMode: 'background', comingSoon: true },
  { span: '', image: 'push', imageMode: 'background' },
  { span: 'bento-wide', image: 'stocks', imageMode: 'full' },
  { span: '', image: 'launch', imageMode: 'background' },
]
