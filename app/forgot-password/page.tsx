"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, AlertCircle, Loader2, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react"
import { authApi } from "@/lib/api/authApi"

import Navbar from "@/components/Navbar";


export default function ForgotPasswordPage() {
    const [email,   setEmail]   = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error,   setError]   = useState("")

    const handleSubmit = async () => {
        if (!email) { setError("Email is required."); return }
        if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email."); return }

        setLoading(true)
        setError("")
        try {
            await authApi.forgotPassword({ email })
            setSuccess(true)
        } catch (err: any) {
            setError(err?.message ?? "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background">

              <Navbar/>
        <div className=" bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-10">

                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot password?</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8 space-y-5">

                    {/* Success state */}
                    {success ? (
                        <div className="text-center py-4 space-y-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Check your inbox</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    We sent a reset link to <span className="font-semibold text-gray-700">{email}</span>.
                                    It may take a minute to arrive.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-red-600 font-semibold hover:text-red-700"
                            >
                                Back to Sign In <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                                </div>
                            )}

                            {/* Email field */}
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
                                        onChange={e => { setEmail(e.target.value); setError("") }}
                                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                        className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                            error
                                                ? "border-red-400 bg-red-50 focus:ring-red-400"
                                                : "border-gray-200 bg-gray-50 focus:ring-red-400 focus:bg-white"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-lg shadow-red-100 disabled:shadow-none"
                            >
                                {loading
                                    ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                                    : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                                }
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Remember your password?{" "}
                                <Link href="/login" className="text-red-600 font-semibold hover:text-red-700">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
          

        </main>
    )
}