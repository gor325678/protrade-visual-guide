import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
    const { threshold = 0.1, rootMargin = '0px', once = true } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(element);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, once]);

    return { ref, isVisible };
};

// Animation wrapper component
interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
    delay?: number;
    className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    animation = 'fade-up',
    delay = 0,
    className = ''
}) => {
    const { ref, isVisible } = useScrollAnimation();

    const animations = {
        'fade-up': 'translate-y-8 opacity-0',
        'fade-in': 'opacity-0',
        'slide-left': 'translate-x-8 opacity-0',
        'slide-right': '-translate-x-8 opacity-0',
        'zoom-in': 'scale-95 opacity-0'
    };

    const baseStyles = animations[animation];

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : baseStyles
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default useScrollAnimation;
