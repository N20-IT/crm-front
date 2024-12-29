import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isCollapsed: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    collapseSidebar: (state) => {
      state.isCollapsed = true;
    },
    expandSidebar: (state) => {
      state.isCollapsed = false;
    },
  },
});

export const {
  toggleSidebar,
  collapseSidebar,
  expandSidebar,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
