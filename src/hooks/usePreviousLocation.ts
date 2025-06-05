import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function usePreviousLocation() {
  const location = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    prevLocation.current = location;
  }, [location]);

  return prevLocation.current;
}
