import * as React from "react";

export function MovingDot({
  color = "red",
  size = 20,
  className,
  children,
}: {
  color?: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const containerPosRef = React.useRef<DOMRect>(null);
  React.useEffect(() => {
    if (ref.current) {
      containerPosRef.current = ref.current.getBoundingClientRect();
    }
  });

  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      data-testid="moving-dot"
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX - containerPosRef.current.left,
          y: e.clientY - containerPosRef.current.top,
        });
      }}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        data-testid="moving-dot-inner"
        style={{
          position: "absolute",
          backgroundColor: color,
          borderRadius: "50%",
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
