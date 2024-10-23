import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RecommendationService } from "src/app/shared/services/recommendation.service";
import * as BannerActions from '../actions/banner.actions';
import { catchError, map, mergeMap, of } from "rxjs";
import { Injectable } from "@angular/core";
import { BannersResponse } from "../models/banner";
import { Store } from "@ngrx/store";


@Injectable()
export class BannerEffects {
    constructor(private actions$: Actions, private recService: RecommendationService, private store: Store) {}
        loadBannerData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BannerActions.loadBanner),
            mergeMap(() => {
                this.store.dispatch(BannerActions.loadBannerStart());
                return this.recService.getRecommendedBannersV2().pipe(
                    map((data: BannersResponse) => {
                        this.recService.postBanners(data);
                        if(data.status == 200) return BannerActions.loadBannerSuccess({data: data.data.home_banner});
                        console.log('banner error code', data.status)
                        return BannerActions.loadBannerFailure({error: data});
                    }),
                    catchError((error: any) => of(BannerActions.loadBannerFailure({error})))
                )
            } )
        )
    )

}