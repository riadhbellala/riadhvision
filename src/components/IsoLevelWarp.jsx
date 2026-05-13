import  { useRef, useEffect } from "react";

const IsoLevelWarp = ({
  className = "",
  color = "66, 108, 129", // RGB for #426C81
  speed = 1.5,
  density = 40,
  ...props
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let animationFrameId;

    // Grid Configuration
    const gridGap = density;
    let rows = Math.ceil(height / gridGap) + 10; // Extra buffer
    let cols = Math.ceil(width / gridGap) + 5;
    
    // Mouse Interaction
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    
    // Wave Physics
    let time = 0;
    let scrollY = window.scrollY;

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      rows = Math.ceil(height / gridGap) + 10;
      cols = Math.ceil(width / gridGap) + 5;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    // Math Helper: Smoothstep
    const smoothMix = (a, b, t) => {
      return a + (b - a) * t;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse movement
      mouse.x = smoothMix(mouse.x, mouse.targetX, 0.1);
      mouse.y = smoothMix(mouse.y, mouse.targetY, 0.1);

      time += 0.01 * speed;

      ctx.beginPath();
      
      // Calculate scroll offset for the "walking" effect
      // This will visually scroll the waves with the page
      const scrollOffset = scrollY * 0.5;

      for (let y = 0; y <= rows; y++) {
        let isFirst = true;

        for (let x = 0; x <= cols; x++) {
          const baseX = (x * gridGap) - (gridGap * 2);
          
          // Physically move the grid base Y position based on scroll,
          // then wrap it using modulo so it never runs out of grid lines!
          let scrolledY = (y * gridGap) - scrollOffset;
          // Wrap it around to keep the grid infinite
          scrolledY = ((scrolledY % (rows * gridGap)) + (rows * gridGap)) % (rows * gridGap);
          const baseY = scrolledY - (gridGap * 4);

          // DISTORTION LOGIC
          const wavePhaseX = x * 0.2 + time;
          const wavePhaseY = y * 0.2 + time;
          
          const wave = Math.sin(wavePhaseX) * Math.cos(wavePhaseY) * 15;
          
          const dx = baseX - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300;
          
          const force = Math.max(0, (maxDist - dist) / maxDist);
          const interactionY = -(force * force) * 80; 

          const finalX = baseX;
          const finalY = baseY + wave + interactionY;

          if (isFirst) {
            ctx.moveTo(finalX, finalY);
            isFirst = false;
          } else {
            ctx.lineTo(finalX, finalY);
          }
        }
      }

      // STYLING
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgba(${color}, 0)`); 
      gradient.addColorStop(0.5, `rgba(${color}, 0.5)`); 
      gradient.addColorStop(1, `rgba(${color}, 0)`); 

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll);
    
    // Add mouse listeners to the document so it tracks everywhere over the background
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, density]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background ${className}`}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-80 pointer-events-none" />
    </div>
  );
};

export default IsoLevelWarp;
