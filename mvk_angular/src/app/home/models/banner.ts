export type Response = {
    status: number,
    message: string
}


export type BannersData = {
    data: {
        home_banner: HomeBanner[],
        just_for: any[],
        single_banner: any[],
        multi_banner: any[],
        solid_banner: any[]
    }
}


export type BannersResponse = Response & BannersData;

export interface HomeBanner {
    banner_id: number,
    banner_title: string,
    banner_sub_title: string,
    banner_type: string,
    banner_order: number,
    banner_status: string,
    banner_image: string,
    thumbnail_image: string,
    mobile_banner_image: string,
    banner_title_color: string,
    banner_sub_title_color: string,
    background_color: string,
    have_link: number,
    have_button: number,
    button_text: string,
    button_text_color: string,
    button_bg_color: string,
    button_border_color: string,
    link_type: string,
    link_id: number,
    link_name: string,
}