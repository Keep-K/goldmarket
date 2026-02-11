import { PriceTemplate } from '@/routes/prices/PriceTemplate'
import type { PriceKind } from '@/routes/prices/PriceTemplate'

export function PricePage({ kind }: { kind: PriceKind }) {
  return <PriceTemplate kind={kind} />
}
