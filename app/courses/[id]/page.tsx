"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";

/* ─── Type Definitions ──────────────────────────────────────── */
interface FormData {
    fName: string;
    lName: string;
    email: string;
    phone_number: string;
    payment_type: string;
    payment_number: string;
    transaction_number: string;
    transaction_id: string;
}

interface FormErrors {
    [key: string]: string;
}

interface CourseInfo {
    id: number;
    title: string;
    price: number;
    discount_price: number | null;
    short_description: string;
    thumbnail: string | null;
    course_type: string;
}

interface ApiCourseResponse {
    status: boolean;
    message: string;
    data?: {
        id: number;
        title: string;
        price: string;
        discount_price: string | null;
        short_description: string;
        thumbnail: string | null;
        course_type: string;
    };
}

interface ApiEnrollResponse {
    status: boolean;
    message: string;
    data?: {
        id: number;
        transaction_id: string;
    };
}

/* ─── Environment ───────────────────────────────────────────── */
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ;
const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ;

/* ─── Payment Methods ──────────────────────────────────────── */
const PAYMENT_METHODS = [
    { value: "bkash", label: "bKash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "wallet", label: "Digital Wallet" },
    { value: "crypto", label: "Cryptocurrency" },
];

/* ─── Selling price helper ──────────────────────────────────── */
function sellingPrice(info: CourseInfo): number {
    if (
        info.discount_price !== null &&
        info.discount_price > 0 &&
        info.discount_price < info.price
    ) {
        return info.discount_price;
    }
    return info.price;
}

/* ─── Form Input Component ─────────────────────────────────── */
interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    hint?: string;
}

function FormInput({
                       label,
                       name,
                       type = "text",
                       placeholder,
                       value,
                       onChange,
                       error,
                       required,
                       disabled,
                       hint,
                   }: FormInputProps): ReactNode {
    const [focused, setFocused] = useState(false);

    const borderColor = error
        ? "rgba(255,79,79,0.4)"
        : focused
            ? "rgba(201,168,76,0.6)"
            : value
                ? "rgba(201,168,76,0.3)"
                : "rgba(255,255,255,0.1)";

    const bgColor = disabled
        ? "rgba(255,255,255,0.02)"
        : focused
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.05)";

    return (
        <div style={{ marginBottom: "22px" }}>
            <label
                htmlFor={name}
                style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "8px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}
            >
                {label}
                {required && (
                    <span style={{ color: "var(--gold)", marginLeft: "4px" }}>*</span>
                )}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxSizing: "border-box",
                }}
            />
            {hint && !error && (
                <p
                    style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        marginTop: "5px",
                        margin: "5px 0 0 0",
                    }}
                >
                    {hint}
                </p>
            )}
            {error && (
                <p
                    style={{
                        fontSize: "12px",
                        color: "rgba(255,79,79,0.9)",
                        marginTop: "6px",
                        margin: "6px 0 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <span style={{ fontSize: "10px" }}>⚠</span> {error}
                </p>
            )}
        </div>
    );
}

/* ─── Select Component ─────────────────────────────────────── */
interface FormSelectProps {
    label: string;
    name: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
}

function FormSelect({
                        label,
                        name,
                        options,
                        value,
                        onChange,
                        error,
                        required,
                        placeholder,
                    }: FormSelectProps): ReactNode {
    return (
        <div style={{ marginBottom: "22px" }}>
            <label
                htmlFor={name}
                style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "8px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}
            >
                {label}
                {required && (
                    <span style={{ color: "var(--gold)", marginLeft: "4px" }}>*</span>
                )}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: error
                        ? "1px solid rgba(255,79,79,0.4)"
                        : value
                            ? "1px solid rgba(201,168,76,0.3)"
                            : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: value ? "#fff" : "rgba(255,255,255,0.35)",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    boxSizing: "border-box",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(201,168,76,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "20px",
                    paddingRight: "40px",
                }}
            >
                {placeholder && (
                    <option value="" style={{ background: "#111", color: "rgba(255,255,255,0.4)" }}>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                        style={{ background: "#111", color: "#fff" }}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p
                    style={{
                        fontSize: "12px",
                        color: "rgba(255,79,79,0.9)",
                        marginTop: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <span style={{ fontSize: "10px" }}>⚠</span> {error}
                </p>
            )}
        </div>
    );
}

/* ─── Section Heading ───────────────────────────────────────── */
function SectionHeading({ children }: { children: string }): ReactNode {
    return (
        <div style={{ marginBottom: "28px" }}>
            <h3
                style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        width: "20px",
                        height: "1px",
                        background: "var(--gold)",
                    }}
                />
                {children}
            </h3>
            <div
                style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.05)",
                    marginTop: "16px",
                }}
            />
        </div>
    );
}

/* ─── Main Enrollment Form Page ────────────────────────────── */
export default function EnrollmentPage(): ReactNode {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");

    const [courseLoading, setCourseLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
    const [confirmedTransactionId, setConfirmedTransactionId] =
        useState<string>("");

    const [formData, setFormData] = useState<FormData>({
        fName: "",
        lName: "",
        email: "",
        phone_number: "",
        payment_type: "",
        payment_number: "",
        transaction_number: "",
        transaction_id: "",
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    /* ─── Fetch Course Details (correct: useEffect) ─────────── */
    useEffect(() => {
        if (!courseId) {
            setCourseLoading(false);
            return;
        }

        setCourseLoading(true);
        fetch(`${API_BASE_URL}/course/${courseId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: ApiCourseResponse) => {
                if (data.status && data.data) {
                    setCourseInfo({
                        id: data.data.id,
                        title: data.data.title,
                        price: parseFloat(data.data.price) || 0,
                        discount_price: data.data.discount_price
                            ? parseFloat(data.data.discount_price)
                            : null,
                        short_description: data.data.short_description,
                        thumbnail: data.data.thumbnail
                            ? `${IMAGE_BASE_URL}${data.data.thumbnail}`
                            : null,
                        course_type: data.data.course_type,
                    });
                } else {
                    setApiError(data.message || "Course not found");
                }
            })
            .catch((err) => {
                console.error("Error fetching course:", err);
                setApiError("Failed to load course information. Please try again.");
            })
            .finally(() => setCourseLoading(false));
    }, [courseId]);

    /* ─── Validate Form ────────────────────────────────────── */
    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.fName.trim()) errors.fName = "First name is required";
        if (!formData.lName.trim()) errors.lName = "Last name is required";

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!formData.phone_number.trim()) {
            errors.phone_number = "Phone number is required";
        } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(formData.phone_number.trim())) {
            errors.phone_number = "Please enter a valid phone number";
        }

        if (!formData.payment_type)
            errors.payment_type = "Please select a payment method";
        if (!formData.payment_number.trim())
            errors.payment_number = "Payment account number is required";
        if (!formData.transaction_id.trim())
            errors.transaction_id = "Transaction ID is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* ─── Handle Input Change ──────────────────────────────── */
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    /* ─── Submit Form ──────────────────────────────────────── */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            /* scroll to first error */
            const firstErrorEl = document.querySelector("[data-error]");
            firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (!courseId || !courseInfo) {
            setApiError("Course information is missing. Please go back and try again.");
            return;
        }

        setSubmitting(true);
        setApiError(null);

        try {
            const actualPrice = sellingPrice(courseInfo);

            const enrollmentPayload = {
                fName: formData.fName.trim(),
                lName: formData.lName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone_number: formData.phone_number.trim(),
                payment_type: formData.payment_type,
                payment_number: formData.payment_number.trim(),
                transaction_number: formData.transaction_number.trim() || null,
                transaction_id: formData.transaction_id.trim(),
                product_id: courseId,
                price: actualPrice,
                payed_type: "paid",
                status: "unverified",
            };

            const response = await fetch(`${API_BASE_URL}/course-enrollments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(enrollmentPayload),
            });

            const data: ApiEnrollResponse = await response.json();

            if (data.status && data.data) {
                setConfirmedTransactionId(data.data.transaction_id);
                setSuccess(true);
                /* redirect after short delay so user can see the success state */
                setTimeout(() => {
                    router.push(
                        `/enrollment/confirmation?transactionId=${data.data!.transaction_id}`
                    );
                }, 2000);
            } else {
                setApiError(data.message || "Enrollment failed. Please try again.");
            }
        } catch (err) {
            console.error("Enrollment error:", err);
            setApiError("A network error occurred. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ─── Loading State ────────────────────────────────────── */
    if (courseLoading) {
        return (
            <>
                <Navbar />
                <section
                    style={{
                        paddingTop: "160px",
                        paddingBottom: "100px",
                        background: "var(--bg)",
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                border: "2px solid rgba(201,168,76,0.2)",
                                borderTopColor: "var(--gold)",
                                borderRadius: "50%",
                                animation: "spin 0.8s linear infinite",
                                margin: "0 auto 16px",
                            }}
                        />
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                            Loading course details...
                        </p>
                    </div>
                </section>
                <Footer />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
        );
    }

    /* ─── Course Not Found ─────────────────────────────────── */
    if (!courseId || !courseInfo) {
        return (
            <>
                <Navbar />
                <section
                    style={{
                        paddingTop: "160px",
                        paddingBottom: "100px",
                        background: "var(--bg)",
                        minHeight: "100vh",
                    }}
                >
                    <div className="container">
                        <div
                            style={{
                                maxWidth: "480px",
                                margin: "0 auto",
                                textAlign: "center",
                                padding: "48px",
                                background: "#0f0f0f",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "16px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "16px",
                                    color: "rgba(255,79,79,0.6)",
                                }}
                            >
                                ⚠
                            </div>
                            <h1
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "24px",
                                    color: "#fff",
                                    marginBottom: "12px",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Course Not Found
                            </h1>
                            <p
                                style={{
                                    color: "rgba(255,255,255,0.4)",
                                    fontSize: "14px",
                                    marginBottom: "28px",
                                    lineHeight: 1.6,
                                }}
                            >
                                {apiError ||
                                    "The course you're looking for could not be found. Please browse our available courses."}
                            </p>
                            <Link
                                href="/courses"
                                style={{
                                    display: "inline-block",
                                    padding: "12px 28px",
                                    background: "var(--gold)",
                                    color: "#000",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const actualPrice = sellingPrice(courseInfo);
    const hasDiscount =
        courseInfo.discount_price !== null &&
        courseInfo.discount_price > 0 &&
        courseInfo.discount_price < courseInfo.price;

    return (
        <>
            <Navbar />

            {/* ── Hero Section ── */}
            <section
                style={{
                    paddingTop: "120px",
                    paddingBottom: "60px",
                    background: "var(--bg)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        right: "-250px",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div className="container">
                    <div style={{ maxWidth: "640px" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "24px",
                            }}
                        >
                            <Link
                                href="/courses"
                                style={{
                                    fontSize: "12px",
                                    color: "rgba(255,255,255,0.3)",
                                    textDecoration: "none",
                                    letterSpacing: "0.04em",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                ← Courses
                            </Link>
                            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px" }}>
                                /
                            </span>
                            <span
                                style={{
                                    fontSize: "11px",
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                    color: "var(--gold)",
                                }}
                            >
                                Enrollment
                            </span>
                        </div>

                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(32px, 4.5vw, 52px)",
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                                color: "#fff",
                                margin: "0 0 16px",
                            }}
                        >
                            Enroll in{" "}
                            <span style={{ color: "var(--gold)" }}>{courseInfo.title}</span>
                        </h1>

                        <p
                            style={{
                                fontSize: "15px",
                                color: "rgba(255,255,255,0.45)",
                                lineHeight: 1.7,
                            }}
                        >
                            {courseInfo.short_description}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section style={{ background: "#0a0a0a", padding: "60px 0 120px" }}>
                <div className="container">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 300px",
                            gap: "40px",
                            maxWidth: "920px",
                        }}
                    >
                        {/* ── Form Column ── */}
                        <div>
                            {success ? (
                                /* ── Success State ── */
                                <div
                                    style={{
                                        padding: "48px 40px",
                                        background: "rgba(125,212,176,0.06)",
                                        border: "1px solid rgba(125,212,176,0.2)",
                                        borderRadius: "16px",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "64px",
                                            height: "64px",
                                            borderRadius: "50%",
                                            background: "rgba(125,212,176,0.15)",
                                            border: "1px solid rgba(125,212,176,0.3)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "28px",
                                            color: "#7DD4B0",
                                            margin: "0 auto 20px",
                                        }}
                                    >
                                        ✓
                                    </div>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "24px",
                                            color: "#fff",
                                            marginBottom: "12px",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        Enrollment Submitted!
                                    </h2>
                                    <p
                                        style={{
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: "14px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Transaction ID:{" "}
                                        <strong
                                            style={{
                                                color: "var(--gold)",
                                                fontFamily: "monospace",
                                                fontSize: "13px",
                                            }}
                                        >
                                            {confirmedTransactionId}
                                        </strong>
                                    </p>
                                    <p
                                        style={{
                                            color: "rgba(255,255,255,0.3)",
                                            fontSize: "13px",
                                        }}
                                    >
                                        Redirecting to your confirmation page...
                                    </p>
                                </div>
                            ) : (
                                /* ── Enrollment Form ── */
                                <form onSubmit={handleSubmit} noValidate>
                                    {apiError && (
                                        <div
                                            style={{
                                                padding: "16px 20px",
                                                background: "rgba(255,79,79,0.08)",
                                                border: "1px solid rgba(255,79,79,0.2)",
                                                borderRadius: "10px",
                                                marginBottom: "32px",
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "12px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "rgba(255,79,79,0.8)",
                                                    fontSize: "16px",
                                                    flexShrink: 0,
                                                    marginTop: "1px",
                                                }}
                                            >
                                                ⚠
                                            </span>
                                            <p
                                                style={{
                                                    color: "rgba(255,79,79,0.8)",
                                                    margin: 0,
                                                    fontSize: "14px",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {apiError}
                                            </p>
                                        </div>
                                    )}

                                    {/* ── Personal Information ── */}
                                    <div style={{ marginBottom: "44px" }}>
                                        <SectionHeading>Personal Information</SectionHeading>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "16px",
                                            }}
                                        >
                                            <FormInput
                                                label="First Name"
                                                name="fName"
                                                value={formData.fName}
                                                onChange={handleChange}
                                                error={formErrors.fName}
                                                placeholder="John"
                                                required
                                            />
                                            <FormInput
                                                label="Last Name"
                                                name="lName"
                                                value={formData.lName}
                                                onChange={handleChange}
                                                error={formErrors.lName}
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>

                                        <FormInput
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={formErrors.email}
                                            placeholder="john@example.com"
                                            required
                                        />

                                        <FormInput
                                            label="Phone Number"
                                            name="phone_number"
                                            type="tel"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            error={formErrors.phone_number}
                                            placeholder="+880 1XXXXXXXXX"
                                            required
                                        />
                                    </div>

                                    {/* ── Payment Information ── */}
                                    <div style={{ marginBottom: "44px" }}>
                                        <SectionHeading>Payment Details</SectionHeading>

                                        {/* Payment instruction banner */}
                                        <div
                                            style={{
                                                padding: "14px 18px",
                                                background: "rgba(201,168,76,0.06)",
                                                border: "1px solid rgba(201,168,76,0.15)",
                                                borderRadius: "8px",
                                                marginBottom: "24px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    color: "rgba(201,168,76,0.8)",
                                                    fontSize: "13px",
                                                    margin: 0,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                Please complete your payment of{" "}
                                                <strong style={{ color: "var(--gold)" }}>
                                                    ${actualPrice.toFixed(2)}
                                                </strong>{" "}
                                                to our account, then enter the transaction details below.
                                            </p>
                                        </div>

                                        <FormSelect
                                            label="Payment Method"
                                            name="payment_type"
                                            options={PAYMENT_METHODS}
                                            value={formData.payment_type}
                                            onChange={handleChange}
                                            error={formErrors.payment_type}
                                            placeholder="Select a payment method"
                                            required
                                        />

                                        <FormInput
                                            label="Your Payment Account Number"
                                            name="payment_number"
                                            value={formData.payment_number}
                                            onChange={handleChange}
                                            error={formErrors.payment_number}
                                            placeholder="Your bKash/Nagad/account number"
                                            hint="The account number you sent the payment FROM"
                                            required
                                        />

                                        <FormInput
                                            label="Transaction Number"
                                            name="transaction_number"
                                            value={formData.transaction_number}
                                            onChange={handleChange}
                                            placeholder="e.g., Reference or check number (optional)"
                                        />

                                        <FormInput
                                            label="Transaction ID"
                                            name="transaction_id"
                                            value={formData.transaction_id}
                                            onChange={handleChange}
                                            error={formErrors.transaction_id}
                                            placeholder="e.g., 8N3B7ABCD1"
                                            hint="The unique Transaction ID from your payment confirmation"
                                            required
                                        />
                                    </div>

                                    {/* ── Submit Button ── */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            width: "100%",
                                            padding: "16px",
                                            background: submitting
                                                ? "rgba(201,168,76,0.4)"
                                                : "var(--gold)",
                                            color: submitting ? "rgba(0,0,0,0.4)" : "#0a0a0a",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontWeight: 700,
                                            fontSize: "14px",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            cursor: submitting ? "not-allowed" : "pointer",
                                            transition: "all 0.25s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <span
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        border: "2px solid rgba(0,0,0,0.2)",
                                                        borderTopColor: "rgba(0,0,0,0.5)",
                                                        borderRadius: "50%",
                                                        animation: "spin 0.7s linear infinite",
                                                        display: "inline-block",
                                                    }}
                                                />
                                                Processing...
                                            </>
                                        ) : (
                                            "Complete Enrollment →"
                                        )}
                                    </button>

                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "rgba(255,255,255,0.2)",
                                            textAlign: "center",
                                            marginTop: "16px",
                                        }}
                                    >
                                        Your enrollment will be reviewed within 24–48 hours.
                                    </p>
                                </form>
                            )}
                        </div>

                        {/* ── Sidebar ── */}
                        <div>
                            <div
                                style={{
                                    position: "sticky",
                                    top: "100px",
                                }}
                            >
                                {/* Course thumbnail */}
                                {courseInfo.thumbnail && (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "160px",
                                            background: `url(${courseInfo.thumbnail}) center/cover no-repeat`,
                                            borderRadius: "10px 10px 0 0",
                                            border: "1px solid rgba(201,168,76,0.15)",
                                            borderBottom: "none",
                                        }}
                                    />
                                )}

                                {/* Order summary card */}
                                <div
                                    style={{
                                        padding: "24px",
                                        background: "#0f0f0f",
                                        border: "1px solid rgba(201,168,76,0.2)",
                                        borderRadius: courseInfo.thumbnail
                                            ? "0 0 12px 12px"
                                            : "12px",
                                        borderTop: courseInfo.thumbnail ? "none" : undefined,
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "10px",
                                            color: "rgba(255,255,255,0.3)",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            margin: "0 0 14px",
                                        }}
                                    >
                                        Order Summary
                                    </p>

                                    <div
                                        style={{
                                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                                            paddingBottom: "14px",
                                            marginBottom: "14px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                color: "#fff",
                                                fontWeight: 600,
                                                margin: "0 0 6px",
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {courseInfo.title}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "11px",
                                                color: "rgba(255,255,255,0.3)",
                                                margin: 0,
                                            }}
                                        >
                                            1 × course license
                                        </p>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            marginBottom: hasDiscount ? "6px" : "20px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                color: "rgba(255,255,255,0.4)",
                                            }}
                                        >
                                            Price
                                        </span>
                                        {hasDiscount ? (
                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    color: "rgba(255,255,255,0.25)",
                                                    textDecoration: "line-through",
                                                }}
                                            >
                                                ${courseInfo.price.toFixed(2)}
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-display)",
                                                    fontSize: "20px",
                                                    color: "var(--gold)",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ${actualPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {hasDiscount && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "baseline",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    color: "#7DD4B0",
                                                }}
                                            >
                                                Discounted
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-display)",
                                                    fontSize: "20px",
                                                    color: "var(--gold)",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ${actualPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Total */}
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            background: "rgba(201,168,76,0.06)",
                                            border: "1px solid rgba(201,168,76,0.12)",
                                            borderRadius: "8px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: "rgba(255,255,255,0.5)",
                                                letterSpacing: "0.04em",
                                            }}
                                        >
                                            TOTAL DUE
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "var(--font-display)",
                                                fontSize: "22px",
                                                color: "#fff",
                                                fontWeight: 700,
                                            }}
                                        >
                                            ${actualPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Guarantees */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                        }}
                                    >
                                        {[
                                            "Lifetime access",
                                            "Certificate of completion",
                                            "30-day money back guarantee",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    fontSize: "12px",
                                                    color: "rgba(255,255,255,0.35)",
                                                }}
                                            >
                                                <span
                                                    style={{ color: "#7DD4B0", fontSize: "11px" }}
                                                >
                                                    ✓
                                                </span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, select option[value=""] { color: rgba(255,255,255,0.25); }
        input:disabled { cursor: not-allowed; }
        @media (max-width: 700px) {
          section:last-of-type > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </>
    );
}