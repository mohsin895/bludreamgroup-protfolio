"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

/* ─── Type Definitions ──────────────────────────────────────── */
interface EnrollmentData {
  id: number;
  fName: string;
  lName: string;
  email: string;
  phone_number: string;
  payment_type: string;
  transaction_id: string;
  price: string;
  payed_type: "paid" | "unpaid";
  status: "verified" | "unverified";
  created_at: string;
  product_id: number;
  course_title?: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data?: EnrollmentData;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── Status Badge Component ───────────────────────────────── */
interface StatusBadgeProps {
  status: "verified" | "unverified";
  paymentStatus: "paid" | "unpaid";
}

function StatusBadge({ status, paymentStatus }: StatusBadgeProps): ReactNode {
  const isVerified = status === "verified";
  const isPaid = paymentStatus === "paid";

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <div
        style={{
          padding: "8px 16px",
          background: isVerified
            ? "rgba(125,212,176,0.1)"
            : "rgba(255,193,7,0.1)",
          border: `1px solid ${isVerified ? "rgba(125,212,176,0.3)" : "rgba(255,193,7,0.3)"}`,
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: isVerified ? "rgba(125,212,176,0.9)" : "rgba(255,193,7,0.9)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>{isVerified ? "✓" : "⏱"}</span>
        {isVerified ? "Verified" : "Pending Verification"}
      </div>

      <div
        style={{
          padding: "8px 16px",
          background: isPaid ? "rgba(125,212,176,0.1)" : "rgba(255,79,79,0.1)",
          border: `1px solid ${isPaid ? "rgba(125,212,176,0.3)" : "rgba(255,79,79,0.3)"}`,
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: isPaid ? "rgba(125,212,176,0.9)" : "rgba(255,79,79,0.9)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>{isPaid ? "✓" : "✕"}</span>
        {isPaid ? "Paid" : "Unpaid"}
      </div>
    </div>
  );
}

/* ─── Main Confirmation Page ────────────────────────────────── */
export default function ConfirmationPage(): ReactNode {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setError("Transaction ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `${API_BASE_URL}/enrollments-confirmation?transaction_id=${transactionId}`,
    )
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.status && data.data) {
          setEnrollment(data.data);
        } else {
          setError(data.message || "Failed to load enrollment details");
        }
      })
      .catch((err) => {
        console.error("Error fetching enrollment:", err);
        setError("Failed to load enrollment information");
      })
      .finally(() => setLoading(false));
  }, [transactionId]);

  if (loading) {
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
              style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}
            >
              <p>Loading enrollment details...</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error || !enrollment) {
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
                maxWidth: "600px",
                margin: "0 auto",
                padding: "40px",
                background: "rgba(255, 79, 79, 0.1)",
                border: "1px solid rgba(255, 79, 79, 0.2)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <h1 style={{ color: "#000", marginBottom: "12px" }}>⚠ Error</h1>
              <p
                style={{
                  color: "rgba(255, 79, 79, 0.8)",
                  marginBottom: "24px",
                }}
              >
                {error || "Enrollment not found"}
              </p>
              <Link
                href="/courses"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
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
                Back to Courses
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const enrollmentDate = new Date(enrollment.created_at);

  return (
    <>
      <Navbar />

      {/* ── Success Hero ── */}
      <section
        style={{
          paddingTop: "100px",
          paddingBottom: "60px",
          background:
            "linear-gradient(180deg, #46595a 0%, #6c7e7f 45%, #8d9b9c 75%, #c7d1d2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div
            style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}
          >
            <div
              style={{
                fontSize: "64px",
                marginBottom: "24px",

                color: "#ffa",
                animation: "bounce 1s ease-in-out",
              }}
            >
              ✓
            </div>

            <h1
              style={{
                fontFamily: "Venus Rising",
                fontSize: "clamp(20px, 5vw, 28px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#000",
                margin: "0 0 16px",
              }}
            >
              Enrollment Successful!
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "#ff1",
                lineHeight: 1.7,
                marginBottom: "0",
              }}
            >
              Thank you, {enrollment.fName}! Your enrollment has been submitted
              and is pending verification.
            </p>
          </div>
        </div>
      </section>

      {/* ── Receipt Section ── */}
      <section style={{ background: "#627F7F", padding: "80px 0" }}>
        <div className="container font-xolonium">
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            {/* Confirmation Box */}
            <div
              style={{
                padding: "40px",
                background: "#fff",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "12px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  paddingBottom: "24px",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#000",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  Enrollment Receipt
                </p>
                <h2
                  style={{
                    fontFamily: "font-rising",
                    fontSize: "28px",
                    color: "#000",
                    margin: "0 0 8px",
                  }}
                >
                  {enrollment.course_title ||
                    `Course #${enrollment.product_id}`}
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#000",
                    margin: 0,
                  }}
                >
                  Enrolled on{" "}
                  {enrollmentDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Status Badges */}
              <div style={{ marginBottom: "32px" }}>
                <StatusBadge
                  status={enrollment.status}
                  paymentStatus={enrollment.payed_type}
                />
              </div>

              {/* Details Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  marginBottom: "32px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#000",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      margin: "0 0 6px",
                    }}
                  >
                    Student Name
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#000",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {enrollment.fName} {enrollment.lName}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#000",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      margin: "0 0 6px",
                    }}
                  >
                    Email
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#000",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {enrollment.email}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#000",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      margin: "0 0 6px",
                    }}
                  >
                    Phone Number
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#000",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {enrollment.phone_number}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#000",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      margin: "0 0 6px",
                    }}
                  >
                    Transaction ID
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "var(--gold)",
                      fontWeight: 700,
                      margin: 0,
                      fontFamily: "font-xolonium",
                    }}
                  >
                    {enrollment.transaction_id}
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div
                style={{
                  padding: "20px",
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#000" }}>
                    Enrollment Fee
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#000",
                    }}
                  >
                    ${parseFloat(enrollment.price || "0").toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#000" }}>
                    Total Paid
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#000",
                      fontWeight: 700,
                    }}
                  >
                    ${parseFloat(enrollment.price || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#000",
                    margin: "0 0 8px",
                    letterSpacing: "0.04em",
                  }}
                >
                  PAYMENT METHOD
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {enrollment.payment_type.replace(/_/g, " ")}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#000",
                    margin: "0 0 8px",
                    letterSpacing: "0.04em",
                  }}
                >
                  ENROLLMENT STATUS
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {enrollment.status}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            {enrollment.status === "unverified" && (
              <div
                style={{
                  padding: "24px",
                  background: "#fff",
                  border: "1px solid rgba(255,193,7,0.2)",
                  borderRadius: "8px",
                  marginBottom: "40px",
                }}
              >
                <h4
                  style={{
                    fontSize: "13px",
                    color: "#000",
                    fontWeight: 700,
                    margin: "0 0 12px",
                    letterSpacing: "0.04em",
                  }}
                >
                  ⏱ PENDING VERIFICATION
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#0009",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Your enrollment is pending verification. We'll review your
                  payment and confirm within 24-48 hours. You'll receive a
                  confirmation email shortly.
                </p>
              </div>
            )}

            {enrollment.status === "verified" && (
              <div
                style={{
                  padding: "24px",
                  background: "rgba(125,212,176,0.1)",
                  border: "1px solid rgba(125,212,176,0.2)",
                  borderRadius: "8px",
                  marginBottom: "40px",
                }}
              >
                <h4
                  style={{
                    fontSize: "13px",
                    color: "rgba(125,212,176,0.9)",
                    fontWeight: 700,
                    margin: "0 0 12px",
                    letterSpacing: "0.04em",
                  }}
                >
                  ✓ ENROLLMENT VERIFIED
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(125,212,176,0.7)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Your enrollment has been verified! You now have full access to
                  the course. Check your email for login details and course
                  access instructions.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 32px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#5FA6BC",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                Browse More Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
    </>
  );
}
