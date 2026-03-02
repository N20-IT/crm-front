import { create } from "zustand";

export const useClientFiltersStore = create((set, get) => ({
  filters: {
    status: "",
    agent: "",
    lokalizacja: [],
    rodzajNieruchomosci: "",
    pokojeOd: "",
    pokojeDo: "",
    metrazOd: "",
    metrazDo: "",
    budzetOd: "",
    budzetDo: "",
    standard: [],
    dataZapytaniaOd: "",
    dataZapytaniaDo: "",
    ostatniKontaktOd: "",
    ostatniKontaktDo: "",
    dataNastepnegoKontaktuOd: "",
    dataNastepnegoKontaktuDo: "",
    offerId: "",
  },

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
        status: "",
        agent: "",
        lokalizacja: [],
        rodzajNieruchomosci: "",
        pokojeOd: "",
        pokojeDo: "",
        metrazOd: "",
        metrazDo: "",
        budzetOd: "",
        budzetDo: "",
        standard: [],
        dataZapytaniaOd: "",
        dataZapytaniaDo: "",
        ostatniKontaktOd: "",
        ostatniKontaktDo: "",
        dataNastepnegoKontaktuOd: "",
        dataNastepnegoKontaktuDo: "",
        offerId: "",
      },
    }),

  filterPanel: {
    isOpen: false,
  },

  changeFilterPanelOpen: () =>
    set((state) => ({
      filterPanel: { isOpen: !state.filterPanel.isOpen },
    })),

  setOfferId: (offerId) =>
    set({
      filters: { ...get().filters, offerId },
    }),
}));
