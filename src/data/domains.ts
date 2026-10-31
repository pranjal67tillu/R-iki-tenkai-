/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DomainDefinition {
  id: string;
  name: string;
  japaneseName: string;
  kanji: string;
  user: string;
  epithet: string;
  chant: string;
  handSign: {
    name: string;
    origin: string;
    gesture: string;
  };
  barrierType: 'closed' | 'open' | 'compressed' | 'inverted' | 'incomplete';
  radiusMeters: number;
  cursedEnergyOutput: number;
  barrierRefinement: number;
  sureHit: {
    name: string;
    type: 'information_overload' | 'continuous_slashes' | 'summon_swarm' | 'soul_touch' | 'rule_based' | 'element_magma' | 'infinite_blades' | 'pachinko_jackpot';
    description: string;
    power: number;
  };
  palette: {
    primary: string; // Hex
    accent: string;  // Hex
    ambient: string; // Hex
    textClass: string;
  };
  preset3D: 'unlimited_void' | 'malevolent_shrine' | 'shadow_garden' | 'mutual_love' | 'embodiment_perfection' | 'iron_mountain' | 'deadly_sentencing';
  quote: string;
  lore: string;
  isCustom?: boolean;
}

export const CANON_DOMAINS: DomainDefinition[] = [
  {
    id: 'unlimited_void',
    name: 'Unlimited Void',
    japaneseName: 'Muryōkūsho',
    kanji: '無量空処',
    user: 'Satoru Gojo',
    epithet: 'The Strongest Jujutsu Sorcerer',
    chant: 'Phase, Twilight, Eyes of Wisdom... Ryōiki Tenkai: Muryōkūsho.',
    handSign: {
      name: 'Taishakuten Mudra (Śakra)',
      origin: 'Vedic-Buddhist deity Indra / Lord of Heavens',
      gesture: 'Crossed right index finger over middle finger while thumb rests on palm'
    },
    barrierType: 'closed',
    radiusMeters: 25,
    cursedEnergyOutput: 100,
    barrierRefinement: 99,
    sureHit: {
      name: 'Infinite Information Infusion',
      type: 'information_overload',
      description: 'Forces the recipient into the inner center of the Limitless, flooding their brain with endless repeating sensations and knowledge, causing catatonic sensory paralysis.',
      power: 100
    },
    palette: {
      primary: '#38bdf8',
      accent: '#818cf8',
      ambient: '#030712',
      textClass: 'text-sky-400'
    },
    preset3D: 'unlimited_void',
    quote: 'To be inside the Limitless is to be granted everything, yet unable to do anything. You will slowly witness your own death.',
    lore: 'The apex of the Gojo clan’s hereditary Limitless technique. Satoru Gojo can manipulate the barrier conditions at will—compressing it into the size of a basketball or inverting outer and inner durability.'
  },
  {
    id: 'malevolent_shrine',
    name: 'Malevolent Shrine',
    japaneseName: 'Fukuma Mizushi',
    kanji: '伏魔御廚子',
    user: 'Ryomen Sukuna',
    epithet: 'The King of Curses',
    chant: 'Under the canopy of severance and flaying... Ryōiki Tenkai: Fukuma Mizushi.',
    handSign: {
      name: 'Enmaten Seal (Yama)',
      origin: 'Buddhist God of Death & Underworld Judge',
      gesture: 'Interlocked fingers creating a hollow shrine gate with thumbs elevated'
    },
    barrierType: 'open',
    radiusMeters: 200,
    cursedEnergyOutput: 100,
    barrierRefinement: 100,
    sureHit: {
      name: 'Relentless Cleave & Dismantle',
      type: 'continuous_slashes',
      description: 'Dismantle (解) rains continuously on inanimate matter, while Cleave (捌) automatically adjusts to the target’s cursed energy density to bisect them in a single stroke.',
      power: 100
    },
    palette: {
      primary: '#ef4444',
      accent: '#f97316',
      ambient: '#180404',
      textClass: 'text-red-500'
    },
    preset3D: 'malevolent_shrine',
    quote: 'A divine technique born from the absence of a barrier. Like painting a masterpiece directly upon empty air.',
    lore: 'Unlike standard domains that enclose space within a separate pocket dimension, Sukuna manifests his innate domain directly in the real world without a barrier, enabling a 200-meter radius of absolute destruction.'
  },
  {
    id: 'chimera_shadow_garden',
    name: 'Chimera Shadow Garden',
    japaneseName: 'Kangō An’eitei',
    kanji: '嵌合暗翳庭',
    user: 'Megumi Fushiguro',
    epithet: 'Heir of the Zen’in Clan',
    chant: 'Depth of the abyss, birth from the void... Ryōiki Tenkai: Kangō An’eitei.',
    handSign: {
      name: 'Ten Shadows Mudra',
      origin: 'Clasped shadow puppet formation',
      gesture: 'Clasped hands forming wings and predatory jaws'
    },
    barrierType: 'incomplete',
    radiusMeters: 18,
    cursedEnergyOutput: 78,
    barrierRefinement: 72,
    sureHit: {
      name: 'Endless Shadow Proliferation',
      type: 'summon_swarm',
      description: 'Floods the floor with an infinite fluid shadow lake. Megumi can summon multiple copies of Toad, Nue, and Divine Dogs without cursed energy limits, while sinking into his own shadow.',
      power: 76
    },
    palette: {
      primary: '#3b82f6',
      accent: '#6366f1',
      ambient: '#020617',
      textClass: 'text-blue-400'
    },
    preset3D: 'shadow_garden',
    quote: 'Bring out 120% of your potential! Do not imagine a neat box—imagine darkness overflowing with no bounds!',
    lore: 'An incomplete domain lacking a constructed external shell. Megumi relies on existing physical structures (such as buildings or gymnasiums) to act as a pseudo-barrier.'
  },
  {
    id: 'authentic_mutual_love',
    name: 'Authentic Mutual Love',
    japaneseName: 'Shingan Sōai',
    kanji: '真贋相愛',
    user: 'Yuta Okkotsu',
    epithet: 'The Prodigy Special Grade',
    chant: 'Ties of eternity, devotion unbound... Ryōiki Tenkai: Shingan Sōai.',
    handSign: {
      name: 'Intertwined Ring Mudra',
      origin: 'Vow of Eternal Devotion & Rika’s Engagement',
      gesture: 'Intertwined pinky and ring fingers forming a sacred clasp'
    },
    barrierType: 'closed',
    radiusMeters: 28,
    cursedEnergyOutput: 96,
    barrierRefinement: 94,
    sureHit: {
      name: 'Copied Technique Infusion & Infinite Blades',
      type: 'infinite_blades',
      description: 'One copied technique is selected as the sure-hit. Countless katanas litter the battlefield, each imbued with a randomized copied technique (Sky Manipulation, Thin Ice, Cursed Speech, Dhruv).',
      power: 95
    },
    palette: {
      primary: '#a855f7',
      accent: '#ec4899',
      ambient: '#090214',
      textClass: 'text-purple-400'
    },
    preset3D: 'mutual_love',
    quote: 'This is the shape of my soul and our unyielding promise. Every blade here is a piece of our bond.',
    lore: 'Manifests as sunken sacred ruins adorned with endless knotted cords. Yuta holds the rare ability to selectively exclude allies from the domain’s sure-hit effect.'
  },
  {
    id: 'embodiment_perfection',
    name: 'Self-Embodiment of Perfection',
    japaneseName: 'Jibai Enten',
    kanji: '自閉円頓裹',
    user: 'Mahito',
    epithet: 'The Incarnation of Human Malice',
    chant: 'Soul before flesh, true shape revealed... Ryōiki Tenkai: Jibai Enten.',
    handSign: {
      name: 'Internal Throat Mudra',
      origin: 'Manifestation of hands within the mouth',
      gesture: 'Two tiny hands emerging from inside the tongue'
    },
    barrierType: 'compressed',
    radiusMeters: 20,
    cursedEnergyOutput: 90,
    barrierRefinement: 89,
    sureHit: {
      name: 'Guaranteed Idle Transfiguration',
      type: 'soul_touch',
      description: 'Traps the opponent directly in the palm of Mahito’s soul. Idle Transfiguration touches the victim’s soul without needing physical contact, mutating flesh in milliseconds.',
      power: 92
    },
    palette: {
      primary: '#10b981',
      accent: '#06b6d4',
      ambient: '#021812',
      textClass: 'text-emerald-400'
    },
    preset3D: 'embodiment_perfection',
    quote: 'Inside my domain, I am already touching your soul. Your shape is entirely mine to rewrite.',
    lore: 'Formed from an intricate spherical lattice of interwoven colossal hands. Mahito’s 0.2-second domain expansion activated and retracted before Sukuna could counterattack.'
  },
  {
    id: 'coffin_iron_mountain',
    name: 'Coffin of the Iron Mountain',
    japaneseName: 'Gaikan Tetchizan',
    kanji: '蓋棺鉄囲山',
    user: 'Jogo',
    epithet: 'Disaster Curse of the Earth & Fire',
    chant: 'Flames that slumber in the earth... Ryōiki Tenkai: Gaikan Tetchizan.',
    handSign: {
      name: 'Daigensui Mudra',
      origin: 'Great Marshal of Wisdom and Subterranean Fires',
      gesture: 'Clenched fists pressed together forming a volcanic crater apex'
    },
    barrierType: 'closed',
    radiusMeters: 22,
    cursedEnergyOutput: 88,
    barrierRefinement: 82,
    sureHit: {
      name: 'Igneous Magma Geyser Barrage',
      type: 'element_magma',
      description: 'The intense thermal environment vaporizes average sorcerers upon entry. Giant volcanic rocks and molten magma jets track targets infallibly.',
      power: 84
    },
    palette: {
      primary: '#f59e0b',
      accent: '#ef4444',
      ambient: '#1c0c02',
      textClass: 'text-amber-500'
    },
    preset3D: 'iron_mountain',
    quote: 'Welcome to the stomach of the volcano. The very heat in this air will reduce flesh to ash.',
    lore: 'A subterranean volcanic chamber with molten basalt flows and fiery spires. Demonstrates standard high-grade domain barrier construction.'
  },
  {
    id: 'deadly_sentencing',
    name: 'Deadly Sentencing',
    japaneseName: 'Chūfuku Shishi',
    kanji: '誅伏賜死',
    user: 'Hiromi Higuruma',
    epithet: 'The Genius Defense Attorney',
    chant: 'Order in the hall of souls... Ryōiki Tenkai: Chūfuku Shishi.',
    handSign: {
      name: 'Gavel Clasp Mudra',
      origin: 'Judicial Balance & Law',
      gesture: 'Two hands clasping an invisible magistrate gavel at chest level'
    },
    barrierType: 'closed',
    radiusMeters: 16,
    cursedEnergyOutput: 84,
    barrierRefinement: 86,
    sureHit: {
      name: 'Rule-Based Trial & Confiscation',
      type: 'rule_based',
      description: 'Violence is strictly prohibited by domain law. The shikigami Judgeman presents past crimes, and guilty verdicts lead to confiscation of cursed technique or the Death Penalty.',
      power: 88
    },
    palette: {
      primary: '#eab308',
      accent: '#94a3b8',
      ambient: '#0b0f17',
      textClass: 'text-yellow-400'
    },
    preset3D: 'deadly_sentencing',
    quote: 'Under the law of this court, physical violence is a contempt of justice. The trial begins now.',
    lore: 'An old-style non-lethal domain rooted in binding vows and judicial rules. Because it lacks an instant-kill sure hit, its barrier is extraordinarily fast to deploy and difficult to break.'
  }
];

export const INITIAL_CUSTOM_DOMAIN: DomainDefinition = {
  id: 'custom_abyssal_resonance',
  name: 'Abyssal Harmonic Event',
  japaneseName: 'Shinen Kyōmei',
  kanji: '深淵共鳴',
  user: 'Custom Sorcerer',
  epithet: 'Special Grade Spatial Architect',
  chant: 'Frequency of the void, echo of forgotten stars... Ryōiki Tenkai: Shinen Kyōmei.',
  handSign: {
    name: 'Celestial Tuning Fork',
    origin: 'Acoustic Singularity Mudra',
    gesture: 'Extended index and pinky fingers in resonance formation'
  },
  barrierType: 'inverted',
  radiusMeters: 30,
  cursedEnergyOutput: 88,
  barrierRefinement: 91,
  sureHit: {
    name: 'Harmonic Molecular Shatter',
    type: 'information_overload',
    description: 'Resonates all cursed energy frequencies inside the domain to absolute cancellation, fracturing physical bonds.',
    power: 90
  },
  palette: {
    primary: '#06b6d4',
    accent: '#a855f7',
    ambient: '#041017',
    textClass: 'text-cyan-400'
  },
  preset3D: 'unlimited_void',
  quote: 'In this frequency, even thoughts oscillate into silence.',
  lore: 'A modern experimental domain using inverted barrier geometry for maximum exterior fortification.',
  isCustom: true
};
