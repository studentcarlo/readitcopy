import { FormEvent, useState } from 'react';

import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios';
import {useRouter} from 'next/router';

import InputGroup from '../components/InputGroup';
import { useAuthState } from '../context/auth'

export default function Register() {
  const { authenticated } = useAuthState()
  const [email, setemail] = useState('')
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const [agreement, setagreement] = useState(false)
  const [errors, seterrors] = useState<any>({})

  const router = useRouter()
  if(authenticated) router.push('/')
  
  const submitForm = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await axios.post('/auth/register', {
        email,
        password,
        username
      })

      router.push('/login')
    } catch (error) {
      console.log(error)
      seterrors(error.response.data)
    }
  }
  
  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div className="h-screen bg-center bg-cover w-36" style={{ backgroundImage: "url('/img/bricks.jpg')" }}>
      </div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign-up</h1>
          <p className="mb-10 text-xs">By continuing, you agree to our User Agreement and Privacy Policy.</p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={e => setagreement(e.target.checked)}>
              </input>
              <label htmlFor="agreement" className="text-xs cursor-pointer">I agree to get emails about cool stuff on Reddit</label>
            </div>
            <InputGroup className="mb-2" value={email} setValue={setemail} placeholder="email" error={errors.email} type="email"/>
            <InputGroup className="mb-2" value={username} setValue={setusername} placeholder="username" error={errors.username} type="username"/>
            <InputGroup className="mb-2" value={password} setValue={setpassword} placeholder="password" error={errors.password} type="password"/>
            
            <button type="submit" className="w-full py-2 mb-4 text-xs font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded hover:bg-blue-400">
              Sign-Up
            </button>
          </form>
          <small>
            Already a Readitor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log-in</a>
            </Link>
          </small>
        </div>
      </div>


    </div>
  )
}
