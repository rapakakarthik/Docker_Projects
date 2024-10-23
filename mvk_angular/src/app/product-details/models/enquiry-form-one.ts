export interface EnquiryFormOne {
    company_id: number,
    seller_id: number,
    buyer_id: number,
    category_id?: number,
    product_id?: number
    enquery_type: string,
    product_name: string,
    quantity: string,
    units: string,
    description: string,
    screen: Screen,
}

type Screen = 'screen1' | 'screen2'