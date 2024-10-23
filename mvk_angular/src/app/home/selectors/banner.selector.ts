import { createSelector } from "@ngrx/store";
import { BannerState } from "../reducers/banner.reducer";


export const selectBannerState = (state: any) => state.banner;

export const selectBanner = createSelector(
    selectBannerState,
    (state: BannerState) => state.data
)

export const selectLoading = createSelector(
    selectBannerState,
    (state: BannerState) => state.loading
)

export const selectFailure = createSelector(
    selectBannerState,
    (state: BannerState) => state.error
)