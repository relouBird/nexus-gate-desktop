export function getRelationLabel<T extends Record<string, unknown>>(
  item: T,
  labelKey?: string
): string {
  if (labelKey && typeof item[labelKey] === 'string') return item[labelKey] as string
  for (const k of ['name', 'label', 'code', 'title']) {
    if (typeof item[k] === 'string') return item[k] as string
  }
  const firstString = Object.values(item).find((v) => typeof v === 'string')
  return firstString ? String(firstString) : String(item.id ?? '?')
}

export function isSameRelation<T extends Record<string, unknown>>(a: T, b: T): boolean {
  return getRelationId(a) === getRelationId(b)
}

export function getRelationId<T extends Record<string, unknown>>(item: T): unknown {
  return item.id ?? item._id ?? JSON.stringify(item)
}
