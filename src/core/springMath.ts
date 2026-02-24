// Spring physics simulation — pure math, no framework dependencies

import type { SpringConfig } from './types';

export function generateSpringCurve(
  stiffness: number,
  damping: number,
  mass: number,
  duration: number
): [number, number][] {
  const points: [number, number][] = [];
  const steps = 100;
  const dt = duration / steps;

  let position = 0;
  let velocity = 0;
  const target = 1;

  for (let i = 0; i <= steps; i++) {
    const time = i * dt;
    points.push([time, position]);

    const springForce = -stiffness * (position - target);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;

    velocity += acceleration * dt;
    position += velocity * dt;
  }

  return points;
}

/**
 * Convert a SpringConfig into physics parameters (stiffness, damping, mass).
 * Handles both time-based (visualDuration/bounce) and physics-based configs.
 */
export function resolveSpringPhysics(
  spring: SpringConfig,
  isSimpleMode: boolean
): { stiffness: number; damping: number; mass: number } {
  if (isSimpleMode) {
    const visualDuration = spring.visualDuration ?? 0.3;
    const bounce = spring.bounce ?? 0.2;
    const mass = 1;

    let stiffness = (2 * Math.PI) / visualDuration;
    stiffness = Math.pow(stiffness, 2);

    const dampingRatio = 1 - bounce;
    const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);

    return { stiffness, damping, mass };
  }

  return {
    stiffness: spring.stiffness ?? 400,
    damping: spring.damping ?? 17,
    mass: spring.mass ?? 1,
  };
}
