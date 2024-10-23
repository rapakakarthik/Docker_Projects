import { createReducer, on } from "@ngrx/store";
import { HomeBanner } from "../models/banner";
import * as BannerActions from '../actions/banner.actions';

export interface BannerState {
    data: HomeBanner[],
    loading: boolean,
    error: any
}

export const initailBanner: BannerState = {
    data: [],
    loading: false,
    error: null
}

export const bannerReducer = createReducer(
    initailBanner,
    on(BannerActions.loadBannerStart, (state) => ({...state, loading: true, error: null})),
    on(BannerActions.loadBannerSuccess, (state, {data}) => ({...state, loading: false, data})),
    on(BannerActions.loadBannerFailure, (state, {error}) => ({...state, loading: false, error})),
)