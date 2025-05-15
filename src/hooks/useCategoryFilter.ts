import { useState } from "react";
import tales from "../mocks/taleInfo";

export function useCategoryFilter(initialCategory?: string) {
  const allCategories = ["전체", "개척담", "인물담", "연애담", "신앙담"];

  const [selectedCats, setSelectedCats] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );

  const toggleCategory = (cat: string) => {
    setSelectedCats((prev) => {
      const allExceptAll = allCategories.filter((c) => c !== "전체");
      const isAllSelected = allExceptAll.every((c) => prev.includes(c));

      if (cat === "전체") {
        return isAllSelected ? [] : ["전체", ...allExceptAll];
      } else {
        const withoutAll = prev.filter((c) => c !== "전체");
        const newCats = withoutAll.includes(cat)
          ? withoutAll.filter((c) => c !== cat)
          : [...withoutAll, cat];

        const isNowAll = allExceptAll.every((c) => newCats.includes(c));
        return isNowAll ? ["전체", ...allExceptAll] : newCats;
      }
    });
  };

  const filteredMarkers = tales.filter(
    (t) => selectedCats.includes("전체") || selectedCats.includes(t.category!)
  );

  return { selectedCats, toggleCategory, filteredMarkers };
}
