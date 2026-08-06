/**
 * Mosca's Inequality Theorem Calculator for PostGuard
 * Evaluates Dr. Michele Mosca's Theorem:
 * If (X + Y > Z), then the organization is in the red zone for
 * "Harvest Now, Decrypt Later" (HNDL) attacks.
 */

function calculateMosca(options = {}) {
  const currentYear = new Date().getFullYear();
  const targetYear = options.targetYear || 2031;
  const X = options.shelfLifeYears !== undefined ? options.shelfLifeYears : 10;
  const Y = options.migrationYears !== undefined ? options.migrationYears : 3;
  const Z = Math.max(1, targetYear - currentYear);

  const totalProtectionNeeded = X + Y;
  const isVulnerable = totalProtectionNeeded > Z;
  const vulnerabilityWindow = isVulnerable ? (totalProtectionNeeded - Z) : 0;
  const deadlineYear = currentYear + (Z - X);

  let urgency = 'SAFE';
  let badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

  if (deadlineYear <= currentYear) {
    urgency = 'CRITICAL (DEADLINE PASSED)';
    badgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  } else if (deadlineYear - currentYear <= 2) {
    urgency = 'HIGH URGENCY';
    badgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  }

  const narrative = isVulnerable
    ? `Data protected by classical algorithms will remain confidential for ${X} years, but migration requires ${Y} years. With a quantum arrival horizon of ${Z} years (${targetYear}), your Harvest Now, Decrypt Later vulnerability window is ${vulnerabilityWindow} year(s). Adversaries capturing ciphertext today can decrypt it before its confidentiality expires.`
    : `Your system migration timeline (${Y} years) plus data shelf-life (${X} years) fits safely within the projected ${Z}-year quantum horizon (${targetYear}). Continue planned post-quantum migration to maintain resilience.`;

  return {
    X,
    Y,
    Z,
    currentYear,
    targetYear,
    totalProtectionNeeded,
    isVulnerable,
    vulnerabilityWindow,
    deadlineYear,
    urgency,
    badgeClass,
    status: isVulnerable ? 'AT RISK (HNDL Vulnerable)' : 'SAFE (Within Horizon)',
    narrative
  };
}

module.exports = { calculateMosca };
