import axios from "axios";

import { fetchAllTales } from "./tale";

import { TaleContent } from "../types/tale";

import { getRandomSlice } from "../utils/shuffleArray";
import { resize } from "framer-motion";

export const fetchHomeData = async () => {
  try {
    // 임시
    const res = await fetchAllTales();
    const allTales: TaleContent[] = res;

    return {
      allTales,
    };
  } catch (err) {}
  return {
    allTales: [],
  };
};
