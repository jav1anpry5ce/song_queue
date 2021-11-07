import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
require("dotenv").config();

export const getAlbumArt = createAsyncThunk(
  "get/art",
  async ({ title, artiste }) => {
    const response = await axios.get(
      `https://api.happi.dev/v1/music?q=${title}%20${artiste}&limit=10&apikey=56ca0c5WBbcuhIWOYnVZj7KZp91oaHnt3qFLB2fLQYKswcLih1RINzvr&type=&lyrics=0`
    );
    if (response.status === 200) {
      const data = response.data;
      return {
        artiste,
        title,
        data,
      };
    }
  }
);

export const getUpdatedArt = createAsyncThunk(
  "get/updated/art",
  async ({ title, artiste }) => {
    const response = await axios.get(
      `https://api.happi.dev/v1/music?q=${title}%20${artiste}&limit=10&apikey=56ca0c5WBbcuhIWOYnVZj7KZp91oaHnt3qFLB2fLQYKswcLih1RINzvr&type=&lyrics=0`
    );
    if (response.status === 200) {
      const data = response.data;
      return {
        artiste,
        title,
        data,
      };
    }
  }
);

export const songSlice = createSlice({
  name: "song",
  initialState: {
    loading: false,
    success: false,
    uSuccess: false,
    cover: null,
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.success = false;
      state.uSuccess = false;
      state.cover = null;
    },
  },
  extraReducers: {
    [getAlbumArt.pending]: (state) => {
      state.loading = true;
    },
    [getAlbumArt.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.data.length > 0) {
        const cover = payload.data.result.filter(
          (item) =>
            item.track.toUpperCase().includes(payload.title.toUpperCase()) &&
            item.artist.toUpperCase().includes(payload.artiste.toUpperCase())
        );
        if (cover[0]) {
          state.cover = cover[0].cover;
        }
      }
    },
    [getAlbumArt.rejected]: (state) => {
      state.loading = false;
      state.success = false;
    },
    [getUpdatedArt.pending]: (state) => {
      state.loading = true;
    },
    [getUpdatedArt.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.uSuccess = true;
      if (payload.data.length > 0) {
        const cover = payload.data.result.filter(
          (item) =>
            item.track.toUpperCase().includes(payload.title.toUpperCase()) &&
            item.artist.toUpperCase().includes(payload.artiste.toUpperCase())
        );
        if (cover[0]) {
          state.cover = cover[0].cover;
        }
      }
    },
    [getUpdatedArt.rejected]: (state) => {
      state.loading = false;
      state.uSuccess = false;
    },
  },
});

export const { clearState } = songSlice.actions;
export default songSlice.reducer;
