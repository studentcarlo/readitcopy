import Head from 'next/head';
import { useRouter } from "next/router";
import { ChangeEvent, createRef, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import useSWR from "swr";
import Image from 'next/image'
import classNames from 'classnames'

import { Sub } from '../../types'
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import { useAuthState } from '../../context/auth'
export default function SubPage() {
    //Local State
    const [ownSub, setOwnSub] = useState(false)
    //Global State
    const { authenticated, user } = useAuthState()
    const fileInputRef = createRef<HTMLInputElement>()
    const router = useRouter()

    const subName = router.query.sub

    const { data: sub, error, revalidate } = useSWR<Sub>(subName ? `/subs/${subName}` : null)
    useEffect(() => {
        if (!sub) return
        setOwnSub(authenticated && user.username === sub.username)
    }, [sub])

    const openFileInput = (type: string) => {
        if (!ownSub) return
        fileInputRef.current.name = type
        fileInputRef.current.click()
    }

    const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]

        const formData = new FormData()

        formData.append('image', file)
        formData.append('type', fileInputRef.current.name)

        try {
            await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            revalidate()

        } catch (error) {
            console.log(error)
        }
    }
    if (error) router.push('/')
    let postMarkup

    if (!sub) {
        postMarkup = <p className="text-lg text-center">Loading...</p>
    } else if (sub.posts.length === 0) {
        postMarkup = <p className="text-lg text-center">No posts submitted yet</p>
    } else {
        postMarkup = sub.posts.map(post => (
            <PostCard key={post.identifier} post={post} revalidate={revalidate} />
        ))
    }
    return (
        <div>
            <Head>
                <title>{sub?.title}</title>
            </Head>
            {sub && (
                <Fragment>
                    <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
                    {/* Subinfo & Images */}
                    <div>
                        {/* Banner image */}
                        <div
                            onClick={() => openFileInput('banner')}
                            className={classNames("bg-blue-500", { 'cursor-pointer': ownSub })}>
                            {sub.bannerUrl ? (
                                <div className="relative h-56">
                                    <Image
                                        src={sub.bannerUrl}
                                        alt="Banner"
                                        layout="fill"
                                        objectFit="cover"
                                    >
                                    </Image>
                                </div>

                            ) : (
                                <div className="h-20 bg-blue-500"></div>
                            )
                            }
                        </div>
                        {/* Sub metadata */}
                        <div className="h-20 bg-white">
                            <div className="container relative flex">
                                <div className="absolute" style={{
                                    top: -20
                                }}>
                                    <Image
                                        src={sub.imageUrl}
                                        alt="Sub"
                                        className={classNames("rounded-full", { 'cursor-pointer': ownSub })}
                                        width={70}
                                        height={70}
                                        onClick={() => openFileInput('image')}
                                    />
                                </div>
                                <div className="pt-1 pl-24">
                                    <div className="flex items-center">
                                        <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">/r/{sub.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Posts & Sidebar */}
                    <div className="container flex pt-5">
                        <div className="w-160">
                            {postMarkup}
                        </div>
                        <Sidebar sub={sub}/>
                    </div>
                </Fragment>
            )
            }
        </div >
    )
}