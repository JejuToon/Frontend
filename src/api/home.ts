import axios from "axios";

import { fetchAllTales } from "./tale";

import { TaleContent } from "../types/tale";

import { getRandomSlice } from "../utils/shuffleArray";

export const fetchHomeData = async () => {
  try {
    const res0 = await fetchAllTales(0);
    const res1 = await fetchAllTales(1);
    const allTales: TaleContent[] = [...res0.contents, ...res1.contents];

    return {
      allTales,
    };
  } catch (err) {}
  return {
    allTales: [],
  };
};
