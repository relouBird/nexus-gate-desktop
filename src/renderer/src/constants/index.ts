export const LoaderAreas = {
  BODY: 'BODY',
  SLOT: 'SLOT'
} as const

export type LoaderAreas = (typeof LoaderAreas)[keyof typeof LoaderAreas]

export const pause = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms))
