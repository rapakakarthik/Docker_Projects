export interface WishilistSupplier {
    seller_id: number,
    seller_account_id: number,
    seller_user_name: string,
    seller_company_name: string,
    company_name_logo: string,
    experience: string,
    flag: string,
    verified: string,
    is_verified: number,
    products: SupplierProduct[],
    buyer_seller_status: number,
    wishlist_comment: string,
    wishlist_quantity: number
}
  
export interface SupplierProduct {
    product_id: number,
    product_name: string,
    price: string,
    prod_img: string,
    prod_discount: string,
    min_quantity: number
}
  