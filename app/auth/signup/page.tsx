'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../api/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setSuccessMessage('Already authenticated! Redirecting to dashboard...');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        if (password !== confirmPassword) {
            setError("Passwords don't match.")
            return
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, { displayName: username })
            setSuccessMessage('Account created successfully! Redirecting to the dashboard...')
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
        } catch (error: unknown) {
            handleFirebaseError(error);
        }

    }

    const handleFirebaseError = (error: unknown) => {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const firebaseError = error as { code: string };
            switch (firebaseError.code) {
                case 'auth/user-not-found':
                    setError('No user found with this email address.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format. Please enter a valid email.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled. Contact support for assistance.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many login attempts. Please try again later.');
                    break;
                default:
                    setError('Failed to log in. Please try again later.');
            }
        } else {
            setError('An unexpected error occurred.');
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-500 to-green-400 py-12 px-4 sm:px-6 lg:px-8">
            {isAuthenticated ? (
                <p className="text-green-600 text-lg font-semibold bg-green-100 border border-green-400 rounded-md p-3 my-4 shadow-md transition-transform transform scale-100 hover:scale-105">
                    {successMessage}
                </p>
            ) : (
                <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-lg">
                    <div>
                        <Link href="/">
                            <UtensilsCrossed className="w-12 h-12 mx-auto text-gray-700" />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-4">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-1 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}

                        <div>
                            <Button type="submit" className="w-full">
                                Sign up
                            </Button>
                        </div>
                    </form>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}