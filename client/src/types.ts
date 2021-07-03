export interface Post {
    identifier: string
    title: string
    slug: string
    body?: string
    subName: string
    createdAt: string
    updatedAt: string
    username: string
    sub?: Sub
    //virtual fields
    url: string
    voteScore?: number
    commentCount?: number
    userVote?: number
}

export interface User {
    username: string
    email: string
    createdAt: string
    updatedAt: string
}

export interface Sub {
    createdAt: string
    updatedAt: string
    name: string
    title: string
    description: string
    imageUrn: string
    bannerUrn: string
    username: string
    posts: Post[]
    //Virtuals
    imageUrl: string
    bannerUrl: string
    postCount?: number
}

export interface Comment {
    identifier: string
    body: string
    username: string
    createdAt: string
    updatedAt: string
    post? : Post
    //virtuals
    userVote: number
    voteScore: number
}