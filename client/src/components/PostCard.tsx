import React, { Fragment } from 'react';
import Link from "next/link";
import { Post } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativetime';
import axios from 'axios';
import classNames from 'classnames';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import ActionButton from './ActionButton';

interface PostCardProps {
    post: Post,
    revalidate?: Function
}
dayjs.extend(relativeTime)

export default function PostCard({ post: { identifier, voteScore, title, body, subName, createdAt, slug, commentCount, url, username, userVote,sub }, revalidate }: PostCardProps) {

    const { authenticated } = useAuthState()

    const router = useRouter()

    const isInSubPage = router.pathname ==='/r/[sub]' // /r/[sub]
    const vote = async (value: number) => {
        if (!authenticated) return router.push('/login')
        if (value === userVote) value = 0;
        try {
            const res = await axios.post('/misc/vote', {
                identifier,
                slug,
                value
            });
            if (revalidate) revalidate()
        } catch (error) {

        }
    }
    return (


        <div key={identifier} className="flex mb-4 bg-white rounded" id={identifier}>
            {/* Vote section */}
            <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
                {/* Upvote */}
                <div
                    onClick={() => vote(1)}
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
                    <i className={classNames("icon-arrow-up", { 'text-red-500': userVote === 1 })}></i>
                </div>
                <p className="text-xs font-bold">{voteScore}</p>
                {/* Downvote */}
                <div
                    onClick={() => vote(-1)}
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500">
                    <i className={classNames("icon-arrow-down", { 'text-blue-500': userVote === -1 })}></i>
                </div>
            </div>
            <div className="w-full p-2">
                <div className="flex items-center">
                    {!isInSubPage &&
                    <>
                    <Link href={`/r/${subName}`}>
                        <img
                            src={sub.imageUrl}
                            className="w-6 h-6 mr-1 rounded-full cursor-pointer" />
                    </Link>
                    <Link href={`/r/${subName}`}>
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                            /r/{subName}
                        </a>
                    </Link>
                    <span className="mx-1 text-xs text-gray-600">• Posted by</span>
                    </>
                    }
                    <p className="text-xs text-gray-600">
                        <Link href={`/u/${username}`}>
                            <a className="mx-1 hover:underline">
                                {`/u/${username}`}
                            </a>
                        </Link>
                        <Link href={url}>
                            <a className="mx-1 hover:underline">
                                {dayjs(createdAt).fromNow()}
                            </a>
                        </Link>
                    </p>
                </div>
                <Link href={url}>
                    <a className="my-1 text-lg font-medium">
                        {title}
                    </a>
                </Link>
                {body && <p className="my-1 text-sm">
                    {body}</p>}
                <div className="flex">
                    <Link href={url}>
                        <a className="flex">
                            <ActionButton>
                                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                <span className="font-bold">
                                    {commentCount} Comments
                                </span>
                            </ActionButton>
                            <ActionButton>
                                <i className="mr-1 fas fa-share fa-xs"></i>
                                <span className="font-bold">
                                    Share
                                </span>
                            </ActionButton>
                            <ActionButton>
                                <i className="mr-1 fas fa-bookmark fa-xs"></i>
                                <span className="font-bold">
                                    Save
                                </span>
                            </ActionButton>
                        </a>
                    </Link>
                </div>
            </div>
            {/* post data section */}
        </div>

    )
}
