export interface WishlistProduct {
    product_id: number,
    fk_seller_user_id: number,
    pk_seller_account_id: number,
    admin_user_company_name: string,
    company_name_logo: string,
    fk_subcat_id: number,
    prod_name: string,
    prod_img: string,
    prod_pricing: string,
    prod_discount: string,
    unit_type: string,
    prod_status: number,
    is_saved_product: number,
    min_quantity: number,
    is_verified: number,
    verified: string,
    experience: string,
    flag: string,
    fk_cat_id: number,
    buyer_seller_status: 1 | 0,
    wishlist_comment: string,
    wishlist_quantity: number,
    main_products: string,
    country: string,
    price_list: {minimum_order: string, price: string}[]
}

export interface CompareProduct {
    product_id: number
    seller_id: number
    product_name: string
    product_price: string
    unit_type: string
    product_quantity: number
    product_image: string
    company_name_logo: string
    product_rating: number
    product_reviews: string
    is_verified: number
    verified: string
    experience: string
    flag: string
}
  