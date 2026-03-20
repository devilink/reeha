"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorOutlineRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Only run on devices that support hover (non-touch devices)
        if (window.matchMedia("(hover: none)").matches) return;

        const cursorDot = cursorDotRef.current;
        const cursorOutline = cursorOutlineRef.current;

        if (!cursorDot || !cursorOutline) return;

        const handleMouseMove = (e: MouseEvent) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Update dot instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Update outline with animation
            cursorOutline.animate(
                {
                    left: `${posX}px`,
                    top: `${posY}px`,
                },
                { duration: 500, fill: "forwards" }
            );
        };

        const handleMouseEnter = () => {
            if (!cursorOutline) return;
            cursorOutline.style.width = "60px";
            cursorOutline.style.height = "60px";
            cursorOutline.style.backgroundColor = "rgba(212, 175, 55, 0.1)"; // Brand Gold low opacity
            cursorOutline.style.borderColor = "transparent";
        };

        const handleMouseLeave = () => {
            if (!cursorOutline) return;
            cursorOutline.style.width = "40px";
            cursorOutline.style.height = "40px";
            cursorOutline.style.backgroundColor = "transparent";
            cursorOutline.style.borderColor = "rgba(26, 26, 26, 0.5)"; // Brand Dark low opacity
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Attach hover effect to interactive elements
        const hoverTriggers = document.querySelectorAll(
            "a, button, input, select, textarea, .hover-trigger, .group"
        );
        
        hoverTriggers.forEach((trigger) => {
            trigger.addEventListener("mouseenter", handleMouseEnter);
            trigger.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            hoverTriggers.forEach((trigger) => {
                trigger.removeEventListener("mouseenter", handleMouseEnter);
                trigger.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, [pathname]); // Re-run when route changes to attach listeners to new elements

    return (
        <>
            <div ref={cursorDotRef} className="cursor-dot hidden md:block"></div>
            <div ref={cursorOutlineRef} className="cursor-outline hidden md:block"></div>
        </>
    );
}
