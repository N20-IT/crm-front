// store/filtersStore.js
import { create } from "zustand";

export const useFiltersStore = create((set, get) => ({
  // Stan początkowy
  filters: {
    ulica: "",
    dzielnica: [],
    poddzielnica: [],
    miasto: "",
    typInwestycji: "",
    rynek: "",
    minIloscPokoi: "",
    maxIloscPokoi: "",
    minMetraz: "",
    maxMetraz: "",
    minPrice: "",
    maxPrice: "",
    agent: "",
    statusOferty: "",
    dataKontaktuOd: "",
    dataKontaktuDo: "",
    dataNastepnegoKontaktuOd: "",
    dataNastepnegoKontaktuDo: "",
    clientId: "",
  },

  // Akcje do aktualizacji stanu
  setFilters: (newFilters) =>
    set({
      filters: { ...get().filters, ...newFilters },
    }),

  updateFilter: (name, value) =>
    set({
      filters: { ...get().filters, [name]: value },
    }),

  clearFilters: () =>
    set({
      filters: {
        ulica: "",
        dzielnica: [],
        poddzielnica: [],
        miasto: "",
        typInwestycji: "",
        rynek: "",
        minIloscPokoi: "",
        maxIloscPokoi: "",
        minMetraz: "",
        maxMetraz: "",
        minPrice: "",
        maxPrice: "",
        agent: "",
        statusOferty: "",
        dataKontaktuOd: "",
        dataKontaktuDo: "",
        dataNastepnegoKontaktuOd: "",
        dataNastepnegoKontaktuDo: "",
        clientId: "",
      },
    }),

  // Specjalna akcja do ustawienia tylko clientId
  setClientId: (clientId) =>
    set({
      filters: { ...get().filters, clientId },
    }),
}));
