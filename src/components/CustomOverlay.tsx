import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface CustomOverlayProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  children: React.ReactNode;
}

export default function CustomOverlay({
  map,
  position,
  children,
}: CustomOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, forceRender] = useState(0); // 강제 리렌더링을 위한 상태

  useEffect(() => {
    const overlay = new google.maps.OverlayView();

    overlay.onAdd = () => {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = "100";
      containerRef.current = div;

      const panes = overlay.getPanes();
      if (panes) {
        panes.overlayMouseTarget.appendChild(div);
        forceRender((v) => v + 1); // DOM이 연결된 후 강제 리렌더
      }
    };

    overlay.draw = () => {
      const projection = overlay.getProjection();
      if (!projection || !containerRef.current) return;

      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(position.lat, position.lng)
      );
      if (point) {
        containerRef.current.style.left = `${point.x}px`;
        containerRef.current.style.top = `${point.y}px`;
        containerRef.current.style.transform = "translate(-50%, -50%)";
      }
    };

    overlay.onRemove = () => {
      if (containerRef.current?.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
      containerRef.current = null;
    };

    overlay.setMap(map);

    return () => overlay.setMap(null);
  }, [map, position]);

  return containerRef.current
    ? ReactDOM.createPortal(children, containerRef.current)
    : null;
}
