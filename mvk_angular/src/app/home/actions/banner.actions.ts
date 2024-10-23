import { createAction, props } from "@ngrx/store";
import { HomeBanner } from "../models/banner";

export const loadBanner = createAction('[Banner] load banner');
export const loadBannerSuccess = createAction('[Banner] load banner success', props<{data: HomeBanner[]}>());
export const loadBannerFailure = createAction('[Banner] load banner failure', props<{error: any}>());
export const loadBannerStart = createAction('[Banner] load banner start');