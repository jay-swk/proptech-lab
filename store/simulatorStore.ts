import { create } from "zustand";
import {
  calculate,
  calculateProfit,
  DEFAULT_PARAMS,
  DEFAULT_PROFIT_PARAMS,
  getZoningPreset,
  type ProfitParams,
  type ProfitResults,
  type RealWorldPreset,
  type SimulatorParams,
  type SimulatorResults,
  type ZoningType,
} from "@/libs/simulator/calculations";

export interface ScenarioSnapshot {
  label: string;
  zoningType: ZoningType;
  params: SimulatorParams;
  results: SimulatorResults;
  profitParams: ProfitParams;
  profitResults: ProfitResults;
}

const initialResults = calculate(DEFAULT_PARAMS);
const initialProfitParams = DEFAULT_PROFIT_PARAMS.residential;
const initialProfitResults = calculateProfit(
  initialResults.actualFloorArea,
  initialProfitParams,
);

interface SimulatorStore {
  params: SimulatorParams;
  results: SimulatorResults;
  zoningType: ZoningType;
  profitParams: ProfitParams;
  profitResults: ProfitResults;
  savedScenario: ScenarioSnapshot | null;
  updateParam: (key: keyof SimulatorParams, value: number) => void;
  setZoningType: (type: ZoningType) => void;
  updateProfitParam: (key: keyof ProfitParams, value: number) => void;
  resetToDefault: () => void;
  loadPreset: (preset: RealWorldPreset) => void;
  saveScenario: (label?: string) => void;
  clearScenario: () => void;
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  params: DEFAULT_PARAMS,
  results: initialResults,
  zoningType: "custom",
  profitParams: initialProfitParams,
  profitResults: initialProfitResults,
  savedScenario: null,

  updateParam: (key, value) =>
    set((state) => {
      const newParams = { ...state.params, [key]: value };
      const results = calculate(newParams);
      return {
        params: newParams,
        results,
        profitResults: calculateProfit(
          results.actualFloorArea,
          state.profitParams,
        ),
      };
    }),

  setZoningType: (type) =>
    set((state) => {
      const preset = getZoningPreset(type);
      const newProfitParams = DEFAULT_PROFIT_PARAMS[preset.usageCategory];
      const newParams = {
        ...state.params,
        floorAreaRatio: Math.min(state.params.floorAreaRatio, preset.maxFAR),
        buildingCoverageRatio: Math.min(
          state.params.buildingCoverageRatio,
          preset.maxBCR,
        ),
      };
      const results = calculate(newParams);
      return {
        zoningType: type,
        params: newParams,
        results,
        profitParams: newProfitParams,
        profitResults: calculateProfit(
          results.actualFloorArea,
          newProfitParams,
        ),
      };
    }),

  updateProfitParam: (key, value) =>
    set((state) => {
      const newProfitParams = { ...state.profitParams, [key]: value };
      return {
        profitParams: newProfitParams,
        profitResults: calculateProfit(
          state.results.actualFloorArea,
          newProfitParams,
        ),
      };
    }),

  resetToDefault: () =>
    set({
      params: DEFAULT_PARAMS,
      results: calculate(DEFAULT_PARAMS),
      zoningType: "custom",
      profitParams: DEFAULT_PROFIT_PARAMS.residential,
      profitResults: calculateProfit(
        calculate(DEFAULT_PARAMS).actualFloorArea,
        DEFAULT_PROFIT_PARAMS.residential,
      ),
      savedScenario: null,
    }),

  loadPreset: (preset) =>
    set(() => {
      const zoningPreset = getZoningPreset(preset.zoningType);
      const profitParams = DEFAULT_PROFIT_PARAMS[zoningPreset.usageCategory];
      const results = calculate(preset.params);
      return {
        zoningType: preset.zoningType,
        params: preset.params,
        results,
        profitParams,
        profitResults: calculateProfit(results.actualFloorArea, profitParams),
      };
    }),

  saveScenario: (label) => {
    const state = get();
    const zoningPreset = getZoningPreset(state.zoningType);
    set({
      savedScenario: {
        label: label ?? zoningPreset.label,
        zoningType: state.zoningType,
        params: { ...state.params },
        results: { ...state.results },
        profitParams: { ...state.profitParams },
        profitResults: { ...state.profitResults },
      },
    });
  },

  clearScenario: () => set({ savedScenario: null }),
}));
