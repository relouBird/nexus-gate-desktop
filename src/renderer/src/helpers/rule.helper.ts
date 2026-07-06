// ─── RULE HELPERS ─────────────────────────────────────────────

import type { ActionType, Rule } from '@/types/nexusgate.type'

export type SupportedRuleType =
  | 'IP_BLACKLIST'
  | 'IP_WHITELIST'
  | 'COUNTRY_BLACKLIST'
  | 'COUNTRY_WHITELIST'
  | 'CONTINENT_BLACKLIST'
  | 'RATE_LIMIT'

export const RULE_DEFAULTS: Record<
  SupportedRuleType,
  { action: ActionType; placeholder: string; hint: string; inputLabel: string }
> = {
  IP_BLACKLIST: {
    action: 'DENY',
    placeholder: '1.2.3.4, 10.0.0.0/8',
    hint: 'IPs ou plages CIDR séparées par des virgules',
    inputLabel: 'Adresses IP'
  },
  IP_WHITELIST: {
    action: 'ALLOW',
    placeholder: '203.0.113.0/24',
    hint: 'IPs ou plages CIDR séparées par des virgules',
    inputLabel: 'Adresses IP'
  },
  COUNTRY_BLACKLIST: {
    action: 'DENY',
    placeholder: 'CN, RU, IR',
    hint: 'Codes ISO 3166-1 alpha-2 séparés par des virgules',
    inputLabel: 'Codes pays'
  },
  COUNTRY_WHITELIST: {
    action: 'ALLOW',
    placeholder: 'FR, US, CM',
    hint: 'Codes ISO 3166-1 alpha-2 séparés par des virgules',
    inputLabel: 'Codes pays'
  },
  CONTINENT_BLACKLIST: {
    action: 'DENY',
    placeholder: 'ASIA, EUROPE',
    hint: 'AFRICA · ASIA · EUROPE · NORTH_AMERICA · SOUTH_AMERICA · OCEANIA',
    inputLabel: 'Continents'
  },
  RATE_LIMIT: {
    action: 'CHALLENGE',
    placeholder: '',
    hint: 'Nombre max de requêtes par fenêtre de temps',
    inputLabel: ''
  }
}

export const RULE_TYPE_LABELS: Record<string, string> = {
  IP_BLACKLIST: 'IP Blacklist',
  IP_WHITELIST: 'IP Whitelist',
  COUNTRY_BLACKLIST: 'Pays Blacklist',
  COUNTRY_WHITELIST: 'Pays Whitelist',
  CONTINENT_BLACKLIST: 'Continent Blacklist',
  RATE_LIMIT: 'Rate Limit'
}

export const ACTION_COLORS: Record<string, string> = {
  DENY: 'bg-red-50 text-red-600',
  ALLOW: 'bg-green-50 text-green-700',
  CHALLENGE: 'bg-amber-50 text-amber-700',
  LOG: 'bg-blue-50 text-blue-600',
  REDIRECT: 'bg-purple-50 text-purple-600'
}

export function ruleConditionSummary(rule: Rule): string {
  const c = rule.condition as Record<string, unknown>
  if (c.values && Array.isArray(c.values))
    return (
      (c.values as string[]).slice(0, 3).join(', ') +
      (c.values.length > 3 ? ` +${c.values.length - 3}` : '')
    )
  if (c.countries && Array.isArray(c.countries)) return (c.countries as string[]).join(', ')
  if (c.continents && Array.isArray(c.continents)) return (c.continents as string[]).join(', ')
  if (c.maxRequests !== undefined) return `${c.maxRequests} req / ${c.windowSeconds}s`
  return '—'
}
