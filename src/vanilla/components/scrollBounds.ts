import { LimitType } from './limit'
import { ScrollBodyType } from './scrollBody'
import { Vector1DType } from './vector1d'

export type ScrollBoundsType = {
  constrain: (v: Vector1DType, pointerDown: boolean) => void
  toggleActive: (active: boolean) => void
}

export function ScrollBounds(
  limit: LimitType,
  location: Vector1DType,
  scrollBody: ScrollBodyType,
): ScrollBoundsType {
  const pullBackThreshold = 10
  let disabled = false

  function shouldConstrain(target: Vector1DType): boolean {
    if (disabled) return false
    if (!limit.reachedAny(target.get())) return false
    if (!limit.reachedAny(location.get())) return false
    return true
  }

  function constrain(target: Vector1DType, pointerDown: boolean): void {
    if (!shouldConstrain(target)) return
    const friction = pointerDown ? 0.7 : 0.4
    const diffToTarget = target.get() - location.get()

    target.subtract(diffToTarget * friction)

    if (!pointerDown && Math.abs(diffToTarget) < pullBackThreshold) {
      target.set(limit.constrain(target.get()))
      scrollBody.useSpeed(10).useMass(3)
    }
  }

  function toggleActive(active: boolean): void {
    disabled = !active
  }

  const self: ScrollBoundsType = {
    constrain,
    toggleActive,
  }
  return self
}
