import { FormEvent, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router'

import { useAuthDispatch, useAuthState } from '../context/auth'
import InputGroup from '../components/InputGroup';

export default function Register() {


  const dispatch = useAuthDispatch()
  const { authenticated } = useAuthState()
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const [errors, seterrors] = useState<any>({})

  const router = useRouter()

  if(authenticated) router.push('/')
  const submitForm = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const res = await axios.post('/auth/login', {
        username,
        password
      })

      dispatch('LOGIN', res.data)
      router.back()
    } catch (error) {
      console.log(error)
      seterrors(error.response.data)
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div className="h-screen bg-center bg-cover bg-opacity-20 w-36" style={{ backgroundImage: "url('/img/bricks.jpg')" }}>
      </div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">By continuing, you agree to our User Agreement and Privacy Policy.</p>
          <form onSubmit={submitForm}>

            <InputGroup className="mb-2" value={username} setValue={setusername} placeholder="username" error={errors.username} type="username" />
            <InputGroup className="mb-2" value={password} setValue={setpassword} placeholder="password" error={errors.password} type="password" />

            <button type="submit" className="w-full py-2 mb-4 text-xs font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded hover:bg-blue-400">
              Login
            </button>
          </form>
          <small>
            Not a readitor yet?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign-up</a>
            </Link>
          </small>
        </div>
      </div>


    </div>
  )
}
