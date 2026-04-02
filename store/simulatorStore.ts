import { create } from "zustand";
import {
  calculate,
  DEFAULT_PARAMS,
  SimulatorParams,
  SimulatorResults,
} from "@/libs/simulator/calculations";

interface SimulatorStore {
  params: SimulatorParams;
  results: SimulatorResults;
  updateParam: (key: keyof SimulatorParams, value: number) => void;
  resetToDefault: () => void;
}

const initialResults = calculate(DEFAULT_PARAMS);

export const useSimulatorStore = create<SimulatorStore>((set) => ({
  params: DEFAULT_PARAMS,
  results: initialResults,

  updateParam: (key, value) =>
    set((state) => {
      const newParams = { ...state.params, [key]: value };
      return {
        params: newParams,
        results: calculate(newParams),
      };
    }),

  resetToDefault: () =>
    set({
      params: DEFAULT_PARAMS,
      results: calculate(DEFAULT_PARAMS),
    }),
}));
