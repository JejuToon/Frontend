import { useEffect, useState } from "react";

export function useSelectedMarker(initMarker: any) {
  const [selectedMarker, setSelectedMarker] = useState(initMarker ?? null);
  const [sheetPos, setSheetPos] = useState<"collapsed" | "half" | "full">(
    "collapsed"
  );

  useEffect(() => {
    if (initMarker) {
      setTimeout(() => {
        setSheetPos("half");
      }, 300);
    }
  }, [initMarker]);

  return { selectedMarker, setSelectedMarker, sheetPos, setSheetPos };
}
