// Add comment api interface
export interface AddComment {
    folder_id: number,
    product_id: number,
    comment: string,
    quantity: number,
    shared: 1 | 0
}

export interface AddCommentSupplier {
    folder_id: number,
    seller_id: number,
    comment: string,
    quantity: number,
    shared: 1 | 0
}