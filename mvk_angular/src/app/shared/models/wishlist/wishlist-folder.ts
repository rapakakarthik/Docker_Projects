export interface WishListFolder {
    id: number,
    name: string,
    count: number,
    permission: string,
    owner: User,
    users: User[]
}

interface User {
    id: 763,
    name: "prahlad"
}