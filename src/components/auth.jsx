import { useState } from 'react'
import { auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'


function Auth() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLogedIn, setIsLogedIn] = useState(false)

    console.log(auth?.currentUser?.email)

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)

        } catch (err) {
            console.error(err)
        }

        if (auth?.currentUser?.email) {
            setIsLogedIn(true)
        }

    }
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)

        } catch (err) {
            console.error(err)
        }
    }

    const logOut = async () => {
        try {
            await signOut(auth)

        } catch (err) {
            console.error(err)
        }
    }
    console.log(isLogedIn)

    return (

        <div className={isLogedIn ? "hidden" : "flex min-h-full flex-1 flex-col justify-center lg:px-8 bg-slate-200"}>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white px-2 pb-5 rounded-lg shadow-md">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="my-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <button
                            onClick={signIn}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={signInWithGoogle}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}


export default Auth