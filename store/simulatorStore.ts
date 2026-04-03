import { create } from "zustand";
import {
  calculate,
  calculateProfit,
  calculateFinance,
  DEFAULT_PARAMS,
  DEFAULT_PROFIT_PARAMS,
  DEFAULT_FINANCE_PARAMS,
  getZoningPreset,
  type FinanceParams,
  type FinanceResults,
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
const initialFinanceResults = calculateFinance(
  DEFAULT_PARAMS.landArea,
  initialProfitResults.totalConstructionCost,
  initialProfitResults.monthlyRentalIncome,
  DEFAULT_FINANCE_PARAMS,
);

interface SimulatorStore {
  params: SimulatorParams;
  results: SimulatorResults;
  zoningType: ZoningType;
  profitParams: ProfitParams;
  profitResults: ProfitResults;
  financeParams: FinanceParams;
  financeResults: FinanceResults;
  savedScenario: ScenarioSnapshot | null;
  updateParam: (key: keyof SimulatorParams, value: number) => void;
  setZoningType: (type: ZoningType) => void;
  updateProfitParam: (key: keyof ProfitParams, value: number) => void;
  updateFinanceParam: (key: keyof FinanceParams, value: number) => void;
  resetToDefault: () => void;
  loadPreset: (preset: RealWorldPreset) => void;
  saveScenario: (label?: string) => void;
  clearScenario: () => void;
}

function recalcFinance(
  landArea: number,
  profitResults: ProfitResults,
  financeParams: FinanceParams,
): FinanceResults {
  return calculateFinance(
    landArea,
    profitResults.totalConstructionCost,
    profitResults.monthlyRentalIncome,
    financeParams,
  );
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  params: DEFAULT_PARAMS,
  results: initialResults,
  zoningType: "custom",
  profitParams: initialProfitParams,
  profitResults: initialProfitResults,
  financeParams: DEFAULT_FINANCE_PARAMS,
  financeResults: initialFinanceResults,
  savedScenario: null,

  updateParam: (key, value) =>
    set((state) => {
      const newParams = { ...state.params, [key]: value };
      const results = calculate(newParams);
      const profitResults = calculateProfit(results.actualFloorArea, state.profitParams);
      return {
        params: newParams,
        results,
        profitResults,
        financeResults: recalcFinance(newParams.landArea, profitResults, state.financeParams),
      };
    }),

  setZoningType: (type) =>
    set((state) => {
      const preset = getZoningPreset(type);
      const newProfitParams = DEFAULT_PROFIT_PARAMS[preset.usageCategory];
      const newParams = {
        ...state.params,
        floorAreaRatio: Math.min(state.params.floorAreaRatio, preset.maxFAR),
        buildingCoverageRatio: Math.min(state.params.buildingCoverageRatio, preset.maxBCR),
      };
      const results = calculate(newParams);
      const profitResults = calculateProfit(results.actualFloorArea, newProfitParams);
      return {
        zoningType: type,
        params: newParams,
        results,
        profitParams: newProfitParams,
        profitResults,
        financeResults: recalcFinance(newParams.landArea, profitResults, state.financeParams),
      };
    }),

  updateProfitParam: (key, value) =>
    set((state) => {
      const newProfitParams = { ...state.profitParams, [key]: value };
      const profitResults = calculateProfit(state.results.actualFloorArea, newProfitParams);
      return {
        profitParams: newProfitParams,
        profitResults,
        financeResults: recalcFinance(state.params.landArea, profitResults, state.financeParams),
      };
    }),

  updateFinanceParam: (key, value) =>
    set((state) => ({
      financeParams: { ...state.financeParams, [key]: value },
      financeResults: recalcFinance(
        state.params.landArea,
        state.profitResults,
        { ...state.financeParams, [key]: value },
      ),
    })),

  resetToDefault: () => {
    const results = calculate(DEFAULT_PARAMS);
    const profitParams = DEFAULT_PROFIT_PARAMS.residential;
    const profitResults = calculateProfit(results.actualFloorArea, profitParams);
    set({
      params: DEFAULT_PARAMS,
      results,
      zoningType: "custom",
      profitParams,
      profitResults,
      financeParams: DEFAULT_FINANCE_PARAMS,
      financeResults: recalcFinance(DEFAULT_PARAMS.landArea, profitResults, DEFAULT_FINANCE_PARAMS),
      savedScenario: null,
    });
  },

  loadPreset: (preset) =>
    set((state) => {
      const zoningPreset = getZoningPreset(preset.zoningType);
      const profitParams = DEFAULT_PROFIT_PARAMS[zoningPreset.usageCategory];
      const results = calculate(preset.params);
      const profitResults = calculateProfit(results.actualFloorArea, profitParams);
      return {
        zoningType: preset.zoningType,
        params: preset.params,
        results,
        profitParams,
        profitResults,
        financeResults: recalcFinance(preset.params.landArea, profitResults, state.financeParams),
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
