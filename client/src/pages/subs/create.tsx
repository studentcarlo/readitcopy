import Head from 'next/head'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import classNames from 'classnames';
import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/router';

export default function create() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [errors, setErrors] = useState<Partial<any>>({})

    const router = useRouter();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.post('/subs',{name, title, description})
            router.push(`/r/${res.data.name}`)

        } catch (error) {
            setErrors(error.response.data)
        }
    };

    return (
        <div className="flex bg-white">
            <Head>
                <title>Create Community</title>
            </Head>
            <div className="h-screen bg-center bg-cover bg-opacity-20 w-36" style={{ backgroundImage: "url('/img/bricks.jpg')" }}>
            </div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-96">
                    <h1 className="mb-2 text-lg font-medium">
                        Create Community
                    </h1>
                    <hr/>
                    <form onSubmit={submitForm}>
                        <div className="my-6">
                            <p className="font-medium">Name</p>
                            <p className="mb-2 text-xs text-gray-500">Community names including capitalization cannot be changed.</p>
                            <input 
                            type="text" 
                            className={classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", {'border-red-600' : errors.name})}
                            value={name}
                            onChange={e => setName(e.target.value)}
                             />
                             <small className="font-medium text-red-600">
                                 {errors.name}
                             </small>
                        </div>
                        <div className="my-6">
                            <p className="font-medium">Title</p>
                            <p className="mb-2 text-xs text-gray-500">Community title represents the topic and you change it at anytime.</p>
                            <input 
                            type="text" 
                            className={classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500", {'border-red-600' : errors.title})}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                             />
                             <small className="font-medium text-red-600">
                                 {errors.title}
                             </small>
                        </div>
                        <div className="my-6">
                            <p className="font-medium">Description</p>
                            <p className="mb-2 text-xs text-gray-500">This is how new members come to understand your community.</p>
                            <textarea 
                            className="w-full p-3 border border-gray-200 rounded hover:border-gray-500"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                             />
                             <small className="font-medium text-red-600">
                                 {errors.description}
                             </small>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-4 py-1 text-sm font-semibold capitalize blue button"> Create Community</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async({req, res}) => {
    try {
        const cookie = req.headers.cookie
        if(!cookie) throw new Error('Missingg auth token cookie')
        
        await axios.get('/auth/me',{headers:{cookie}})

        return {props:{}}
    } catch (error) {
        res.writeHead(307,{Location:'/login'}).end()
    }
} 