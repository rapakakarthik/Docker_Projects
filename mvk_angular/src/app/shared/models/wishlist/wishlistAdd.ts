export interface WishilistAddRemove {
    folder_id: number,
    action: 'add' | 'remove',
    type: 'product' | 'seller',
    record_id: number | string
}