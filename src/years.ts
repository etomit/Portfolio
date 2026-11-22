/** Année décimale d'aujourd'hui (2026.88 pour la mi-novembre 2026), pour placer les cotes. */
export function yearNow(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1).getTime()
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime()
  return now.getFullYear() + (now.getTime() - start) / (end - start)
}
