export interface ProductDetails {
    id: number,
    account_id: number,
    seller_id: number,
    category_id: number,
    buyer_seller_status: number,
    name: string,
    price: string,
    discount: string,
    quantity: number,
    discount_terms_cond: string,
    status: number,
    unit_type: string,
    likes: number,
    is_liked: number,
    is_saved_product: number,
    isbn: string,
    customize_offered: number,
    keywords: string,
    details: string,
    meta_title: string,
    meta_keywords: string,
    meta_description: string,
    description: string,
    shared_url: string,
    flag: string,
    verified: string,
    image: string,
    experience: string,
    is_verified: number,
    total_rating: number,
    total_orders: number,
    connect_count: number,
    keys: string[],
    values: string[],
    bullet_points: string[],
    lead_time: string
}

export interface ProductMedia {
    type: "image" | "video",
    value: string
}

export interface Package {
    shipping_mode: string,
    port_of_dispatch: string,
    shipping: Shipping[],
    packaging_dimensions: string,
    product_dimensions: string,
    cover_photo: string,
    image: string,
    cover_video: string,
    video: string,
}

interface Shipping {
    quantity: string,
    days: string
}


export interface Supplier {
    product_id: number,
    seller_id: number,
    company_id: number,
    account_id: number,
    product_name: string,
    product_price: string,
    product_discount: string,
    image: string,
    is_verified: number,
    quantity: number,
    company_name: string,
    minimum_quantity: number,
    unit_type: string,
    buyer_seller_status: number
}