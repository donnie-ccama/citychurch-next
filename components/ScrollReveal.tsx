'use client';

import { useScrollReveal } from '@/lib/useScrollReveal';

/**
 * Client component that activates scroll-reveal animations.
 * Renders nothing — just runs the observer hook.
 */
export default function ScrollReveal() {
    useScrollReveal();
    return null;
}
