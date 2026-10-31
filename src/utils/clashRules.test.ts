/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDomainPower, resolveDomainClash, DomainStats } from './clashRules';

test('calculateDomainPower correctly weights output and refinement with open barrier bonus', () => {
  const sukuna: DomainStats = {
    id: 'malevolent_shrine',
    name: 'Malevolent Shrine',
    japaneseName: '伏魔御廚子',
    user: 'Ryomen Sukuna',
    cursedEnergyOutput: 100,
    barrierRefinement: 100,
    barrierType: 'open',
    radiusMeters: 200,
    sureHitType: 'continuous_slashes',
    sureHitPower: 100
  };

  const power = calculateDomainPower(sukuna);
  // (100*0.4 + 100*0.5) * 1.25 = 90 * 1.25 = 112.5
  assert.equal(power, 112.5);
});

test('calculateDomainPower applies incomplete domain penalty', () => {
  const megumi: DomainStats = {
    id: 'chimera_shadow_garden',
    name: 'Chimera Shadow Garden',
    japaneseName: '嵌合暗翳庭',
    user: 'Megumi Fushiguro',
    cursedEnergyOutput: 70,
    barrierRefinement: 55,
    barrierType: 'incomplete',
    radiusMeters: 15,
    sureHitType: 'summon_swarm',
    sureHitPower: 70
  };

  const power = calculateDomainPower(megumi);
  // (70*0.4 + 55*0.5) * 0.7 = 55.5 * 0.7 = 38.85 -> 38.8
  assert.equal(power, 38.8);
});

test('resolveDomainClash identifies open barrier exterior advantage against closed barrier', () => {
  const sukuna: DomainStats = {
    id: 'sukuna',
    name: 'Malevolent Shrine',
    japaneseName: '伏魔御廚子',
    user: 'Ryomen Sukuna',
    cursedEnergyOutput: 100,
    barrierRefinement: 100,
    barrierType: 'open',
    radiusMeters: 200,
    sureHitType: 'continuous_slashes',
    sureHitPower: 100
  };

  const standardSorcerer: DomainStats = {
    id: 'sorcerer',
    name: 'Standard Domain',
    japaneseName: '領域',
    user: 'Grade 1 Sorcerer',
    cursedEnergyOutput: 75,
    barrierRefinement: 75,
    barrierType: 'closed',
    radiusMeters: 20,
    sureHitType: 'instant_lethal',
    sureHitPower: 75
  };

  const result = resolveDomainClash(sukuna, standardSorcerer);
  assert.equal(result.winnerId, 'sukuna');
  assert.ok(result.caster1Dominance > result.caster2Dominance);
  assert.ok(result.events.some(e => e.includes('open barrier extends beyond')));
});

test('resolveDomainClash neutralizes sure-hit when Simple Domain is active', () => {
  const gojo: DomainStats = {
    id: 'gojo',
    name: 'Unlimited Void',
    japaneseName: '無量空処',
    user: 'Satoru Gojo',
    cursedEnergyOutput: 100,
    barrierRefinement: 98,
    barrierType: 'closed',
    radiusMeters: 25,
    sureHitType: 'information_overload',
    sureHitPower: 100
  };

  const target: DomainStats = {
    id: 'opponent',
    name: 'Opponent Domain',
    japaneseName: '領域',
    user: 'Kusakabe',
    cursedEnergyOutput: 60,
    barrierRefinement: 60,
    barrierType: 'closed',
    radiusMeters: 10,
    sureHitType: 'instant_lethal',
    sureHitPower: 50,
    antiDomainActive: 'simple_domain',
    antiDomainIntegrity: 100
  };

  const result = resolveDomainClash(gojo, target);
  assert.equal(result.winnerId, 'gojo');
  // Simple domain neutralizes the sure-hit
  assert.equal(result.sureHitActive1, false);
  assert.ok(result.events.some(e => e.includes('Simple Domain (簡易領域)')));
});
