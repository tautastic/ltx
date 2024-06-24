import Fuse, { type IFuseOptions } from "fuse.js";
import { useMemo, useState } from "react";

export interface IFuzzyClient<T> {
  resetSearch: () => void;
  result: T[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export function useFuzzy<T>(data: T[], options: IFuseOptions<T>): IFuzzyClient<T> {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const resetSearch = () => setSearchTerm("");

  const searcher = useMemo(() => {
    const defaultOptions: IFuseOptions<T> = { threshold: 0.2, ignoreLocation: false };
    return new Fuse(data, { ...defaultOptions, ...options });
  }, [data, options]);

  const result: T[] = searchTerm ? searcher.search(searchTerm).map((fuseResult) => fuseResult.item) : data;

  return {
    searchTerm,
    resetSearch,
    result,
    setSearchTerm,
  };
}
