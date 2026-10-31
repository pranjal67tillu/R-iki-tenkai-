/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DomainStats {
  id: string;
  name: string;
  japaneseName: string;
  user: string;
  cursedEnergyOutput: number; // 1 - 100
  barrierRefinement: number; // 1 - 100
  barrierType: 'closed' | 'open' | 'compressed' | 'inverted' | 'incomplete';
  radiusMeters: number; // e.g. 5m - 200m
  sureHitType: 'instant_lethal' | 'information_overload' | 'continuous_slashes' | 'rule_based' | 'soul_touch' | 'summon_swarm';
  sureHitPower: number; // 1 - 100
  antiDomainActive?: 'none' | 'simple_domain' | 'falling_blossom' | 'domain_amplification' | 'hollow_wicker_basket';
  antiDomainIntegrity?: number; // 0 - 100
}

export interface ClashResult {
  winnerId: string | 'stalemate';
  dominanceRatio: number; // 0 to 1 (0.5 = dead equal)
  caster1Dominance: number; // percentage 0 - 100
  caster2Dominance: number; // percentage 0 - 100
  sureHitActive1: boolean;
  sureHitActive2: boolean;
  barrierIntegrity1: number; // 0 - 100
  barrierIntegrity2: number; // 0 - 100
  events: string[];
  tacticalAdvantage: string;
}

/**
 * Calculates raw domain power score based on output, refinement, and barrier properties.
 */
export function calculateDomainPower(stats: DomainStats): number {
  let power = (stats.cursedEnergyOutput * 0.4) + (stats.barrierRefinement * 0.5);

  // Barrier type adjustments
  if (stats.barrierType === 'open') {
    // Open barrier gains a 25% refinement bonus through binding vow of allowing an escape route
    power *= 1.25;
  } else if (stats.barrierType === 'compressed') {
    // Basketball sized barrier condenses cursed density, increasing exterior defense
    power *= 1.15;
  } else if (stats.barrierType === 'inverted') {
    // Inverted exterior durability resists external slashes but is standard inside
    power *= 1.05;
  } else if (stats.barrierType === 'incomplete') {
    // Incomplete domain lacks an innate barrier seal
    power *= 0.7;
  }

  return Number(power.toFixed(1));
}

/**
 * Resolves an active clash between two domains.
 * Models domain refinement tug-of-war, open-barrier exterior strikes, and anti-domain defenses.
 */
export function resolveDomainClash(caster1: DomainStats, caster2: DomainStats): ClashResult {
  const events: string[] = [];
  
  const power1 = calculateDomainPower(caster1);
  const power2 = calculateDomainPower(caster2);

  events.push(`Barrier manifestation: ${caster1.name} [Power: ${power1}] vs ${caster2.name} [Power: ${power2}].`);

  // Open barrier vs Closed barrier special interaction:
  // An open domain's guaranteed hit extends outside the closed barrier, attacking the external boundary
  let exteriorStrikeDamage1 = 0;
  let exteriorStrikeDamage2 = 0;

  if (caster1.barrierType === 'open' && caster2.barrierType !== 'open') {
    if (caster2.barrierType === 'compressed' || caster2.barrierType === 'inverted') {
      exteriorStrikeDamage1 = 20; // Resisted somewhat by condensed/inverted shell
      events.push(`${caster1.name}'s open barrier attacks the exterior, but ${caster2.name}'s reinforced shell withstands the initial barrage!`);
    } else {
      exteriorStrikeDamage1 = 55; // Devastating damage to standard closed shell from outside
      events.push(`${caster1.name}'s open barrier extends beyond ${caster2.name}'s boundary, directly shredding the vulnerable outer shell!`);
    }
  }

  if (caster2.barrierType === 'open' && caster1.barrierType !== 'open') {
    if (caster1.barrierType === 'compressed' || caster1.barrierType === 'inverted') {
      exteriorStrikeDamage2 = 20;
      events.push(`${caster2.name}'s open barrier attacks the exterior, but ${caster1.name}'s reinforced shell holds firm!`);
    } else {
      exteriorStrikeDamage2 = 55;
      events.push(`${caster2.name}'s open barrier extends beyond ${caster1.name}'s boundary, directly shredding the vulnerable outer shell!`);
    }
  }

  // Refinement clash: when domains overlap, sure-hits cancel each other in the shared space
  const refinementDelta = caster1.barrierRefinement - caster2.barrierRefinement;
  let ratio = 0.5;

  const totalEffectivePower = (power1 - exteriorStrikeDamage2) + (power2 - exteriorStrikeDamage1);
  if (totalEffectivePower <= 0) {
    ratio = 0.5;
  } else {
    const p1Eff = Math.max(0, power1 - exteriorStrikeDamage2);
    ratio = p1Eff / (p1Eff + Math.max(0, power2 - exteriorStrikeDamage1));
  }

  const c1Dominance = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  const c2Dominance = 100 - c1Dominance;

  let winnerId: string | 'stalemate' = 'stalemate';
  let sureHitActive1 = false;
  let sureHitActive2 = false;

  // Determine winner or stalemate
  if (Math.abs(c1Dominance - c2Dominance) <= 6 && Math.abs(refinementDelta) <= 4 && exteriorStrikeDamage1 === exteriorStrikeDamage2) {
    winnerId = 'stalemate';
    events.push("Equal refinement: Innate domains perfectly overlap! Sure-hit effects nullify each other in the contested territory.");
  } else if (c1Dominance > c2Dominance) {
    winnerId = caster1.id;
    events.push(`${caster1.name} overpowers ${caster2.name}'s barrier with superior refinement and density.`);
    if (c1Dominance >= 60) {
      sureHitActive1 = true;
      events.push(`${caster1.name}'s sure-hit effect breaks through and targets ${caster2.user}!`);
    }
  } else {
    winnerId = caster2.id;
    events.push(`${caster2.name} overpowers ${caster1.name}'s barrier with superior refinement and density.`);
    if (c2Dominance >= 60) {
      sureHitActive2 = true;
      events.push(`${caster2.name}'s sure-hit effect breaks through and targets ${caster1.user}!`);
    }
  }

  // Check anti-domain techniques (e.g. Simple Domain)
  if (sureHitActive1 && caster2.antiDomainActive && caster2.antiDomainActive !== 'none') {
    const defense = caster2.antiDomainActive;
    if (defense === 'simple_domain') {
      sureHitActive1 = false;
      events.push(`${caster2.user} deploys Simple Domain (簡易領域)! The incoming sure-hit is stripped away.`);
    } else if (defense === 'falling_blossom') {
      events.push(`${caster2.user} activates Falling Blossom Emotion (落花の情) to deflect cursed energy slashes on contact.`);
    } else if (defense === 'hollow_wicker_basket') {
      sureHitActive1 = false;
      events.push(`${caster2.user} maintains Hollow Wicker Basket (彌虚葛籠) mudra, neutralizing the barrier's coordination.`);
    }
  }

  if (sureHitActive2 && caster1.antiDomainActive && caster1.antiDomainActive !== 'none') {
    const defense = caster1.antiDomainActive;
    if (defense === 'simple_domain') {
      sureHitActive2 = false;
      events.push(`${caster1.user} deploys Simple Domain (簡易領域)! The incoming sure-hit is stripped away.`);
    } else if (defense === 'falling_blossom') {
      events.push(`${caster1.user} activates Falling Blossom Emotion (落花の情) to deflect cursed energy slashes on contact.`);
    } else if (defense === 'hollow_wicker_basket') {
      sureHitActive2 = false;
      events.push(`${caster1.user} maintains Hollow Wicker Basket (彌虚葛籠) mudra, neutralizing the barrier's coordination.`);
    }
  }

  // Calculate remaining barrier integrity
  const barrierIntegrity1 = Math.max(0, Math.min(100, Math.round(100 - exteriorStrikeDamage2 - ((c2Dominance / 100) * 40))));
  const barrierIntegrity2 = Math.max(0, Math.min(100, Math.round(100 - exteriorStrikeDamage1 - ((c1Dominance / 100) * 40))));

  let tacticalAdvantage = "Evenly matched territorial struggle.";
  if (caster1.barrierType === 'open' && caster2.barrierType !== 'open') {
    tacticalAdvantage = `${caster1.name}'s open barrier possesses overwhelming structural leverage over standard closed barriers.`;
  } else if (caster2.barrierType === 'open' && caster1.barrierType !== 'open') {
    tacticalAdvantage = `${caster2.name}'s open barrier possesses overwhelming structural leverage over standard closed barriers.`;
  } else if (c1Dominance >= 65) {
    tacticalAdvantage = `${caster1.name} holds dominant spatial control and barrier refinement.`;
  } else if (c2Dominance >= 65) {
    tacticalAdvantage = `${caster2.name} holds dominant spatial control and barrier refinement.`;
  }

  return {
    winnerId,
    dominanceRatio: ratio,
    caster1Dominance: c1Dominance,
    caster2Dominance: c2Dominance,
    sureHitActive1,
    sureHitActive2,
    barrierIntegrity1,
    barrierIntegrity2,
    events,
    tacticalAdvantage
  };
}
