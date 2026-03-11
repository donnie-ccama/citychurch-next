'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook that observes all `.reveal` elements and adds the `animate-in`
 * class when they scroll into view — matching the original site's
 * IntersectionObserver logic from main.js.
 *
 * Re-runs on every route change so new pages' elements get observed.
 */
export function useScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        // Small delay to let the new page's DOM render before observing
        const timeout = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
            );

            document.querySelectorAll('.reveal:not(.animate-in)').forEach((el) => observer.observe(el));

            return () => observer.disconnect();
        }, 50);

        return () => clearTimeout(timeout);
    }, [pathname]);
}
