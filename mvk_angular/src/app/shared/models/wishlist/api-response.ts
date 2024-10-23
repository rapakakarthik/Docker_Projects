export type WishlistResponse = {
    status: number,
    message: string
}

export type WishlistData<T> = WishlistResponse & {
    data: T[],
    folder_data: FolderData,
    product_count: number
}

export interface FolderData {
    edit_link: string,
    id: number,
    name: string,
    view_link : string
};