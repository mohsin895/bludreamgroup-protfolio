"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import Navbar from "@/components/Navbar";


export default function LoginPage() {
    const { login, isLoading, error } = useAuth()
    const searchParams = useSearchParams()
    const redirectTo   = searchParams.get("redirect") ?? "/"

    const [email,    setEmail]    = useState("")
    const [password, setPassword] = useState("")
    const [showPw,   setShowPw]   = useState(false)
    const [errors,   setErrors]   = useState<Record<string, string>>({})

    const validate = () => {
        const e: Record<string, string> = {}
        if (!email)                          e.email    = "Email is required."
        else if (!/\S+@\S+\.\S+/.test(email)) e.email   = "Enter a valid email."
        if (!password)                       e.password = "Password is required."
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        const res = await login({ email, password }, redirectTo)
        if (!res.success && res.error) {
            setErrors({ form: res.error })
        }
    }

    return (
        <>

            <Navbar />
            <div className=" bg-gray-50 flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md">

                    {/* Logo / Brand */}
                    <div className="text-center mb-2 ">
                        <Link href="/" className="inline-flex items-center gap-2  group">
                            <div className=" h-10   flex items-center justify-center   group-hover:bg-red-700 transition-colors">
                                Please Login
                            </div>

                        </Link>

                    </div>

                    {/* Card */}
                    <div className="bg-white  border border-gray-100  px-8 py-8 space-y-5">

                        {/* Global error */}
                        {(error || errors.form) && (
                            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200  px-4 py-3 text-sm text-red-700">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error || errors.form}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setErrors(x => ({ ...x, email: "" })) }}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    className={`w-full h-11 pl-10 pr-4  border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                        errors.email
                                            ? "border-red-400 bg-red-50 focus:ring-red-400"
                                            : "border-gray-200 bg-gray-50 focus:ring-red-400 focus:bg-white"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <AlertCircle className="w-3 h-3" />{errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <Link href="/forgot-password" className="text-xs text-red-600 hover:text-red-700 font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPw ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setErrors(x => ({ ...x, password: "" })) }}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    className={`w-full h-11 pl-10 pr-11  border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                        errors.password
                                            ? "border-red-400 bg-red-50 focus:ring-red-400"
                                            : "border-gray-200 bg-gray-50 focus:ring-red-400 focus:bg-white"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(s => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <AlertCircle className="w-3 h-3" />{errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm  flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-lg shadow-red-100 disabled:shadow-none mt-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-xs text-gray-400">or</span>
                            </div>
                        </div>

                        {/* Register link */}
                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-red-600 font-semibold hover:text-red-700">
                                Create one free
                            </Link>
                        </p>

                    </div>

                    {/* Guest hint */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        You can also{" "}
                        <Link href="/" className="text-gray-600 underline underline-offset-2">
                            continue as guest
                        </Link>{" "}
                        without signing in.
                    </p>

                </div>
            </div>


        </>
    )
}