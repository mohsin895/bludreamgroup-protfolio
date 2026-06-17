"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";

import { motion } from "framer-motion";
import { Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface EventItem {
  id: number;
  title: string;
  description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  image?: string | null;
  status?: string;
  event_category_id?: string;
}

function getImageUrl(image?: string | null) {
  if (!image) return "/placeholder.jpg";

  try {
    const parsed = JSON.parse(image);

    return (
      IMAGE_BASE +
      (parsed.large || parsed.medium || parsed.small || parsed.original)
    );
  } catch {
    return IMAGE_BASE + image;
  }
}
export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id;
  const [event, setEvent] = useState<EventItem | null>(null);
  const imageUrl = getImageUrl(event?.image);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data?.data || data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);

    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const submitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();

    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/event/enrollment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          event_id: event?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration Successful");

        setForm({
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <PageHero title="Event Details" currentPage="Event Details" />

        <div
          style={{
            padding: "100px 20px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>

        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <PageHero title="Event Not Found" currentPage="Event" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`

      .event-layout{
        display:grid;
        grid-template-columns:2fr 1fr;
        gap:40px;
         font-family: "Xolonium"
      }

      .card{
        background:#fff;
        border-radius:16px;
        border:1px solid #e8eceb;
      }

      .sidebar{
        position:sticky;
        top:100px;
      }

      .input{
        width:100%;
        padding:14px;
        border:1px solid #e8eceb;
        border-radius:10px;
        background:#f8faf9;
        outline:none;
      }

      .btn{
        background:#6c7e7f;
        color:white;
        border:none;
        padding:14px;
        width:100%;
        border-radius:10px;
        cursor:pointer;
        font-weight:700;
      }

      .btn:hover{
        background:#5a6b6c;
      }

      @media(max-width:992px){
        .event-layout{
          grid-template-columns:1fr;
        }

        .sidebar{
          position:static;
        }
      }

      @media(max-width:768px){

        .hero-image{
          height:250px !important;
        }

        .content-padding{
          padding:20px !important;
        }

      }

      `}</style>

      <Navbar />

      <PageHero title={event.title} currentPage="Event Details" />

      <section
        style={{
          background: "#f4f7f6",
          padding: "60px 0",
        }}
      >
        <div className="container">
          <div className="event-layout">
            {/* LEFT */}
            <div>
              {/* IMAGE */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="card"
                style={{
                  overflow: "hidden",
                }}
              >
                <Image
                  src={imageUrl}
                  alt={event.title}
                  width={1200}
                  height={700}
                  className="hero-image"
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                  }}
                />

                <div
                  className="content-padding"
                  style={{
                    padding: "35px",
                  }}
                >
                  <h2
                    style={{
                      color: "#1a2427",
                      marginBottom: 20,
                      fontFamily: "Venus Rising",
                    }}
                  >
                    {event.title}
                  </h2>

                  <div
                    className="font-xolonium"
                    dangerouslySetInnerHTML={{
                      __html: event.description || "",
                    }}
                    style={{
                      color: "#555",
                      lineHeight: 1.9,
                      fontFamily: "Xolonium",
                    }}
                  />
                </div>
              </motion.div>

              {/* REGISTRATION */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="card"
                style={{
                  padding: 30,
                  marginTop: 30,
                }}
              >
                <h3
                  style={{
                    marginBottom: 20,
                    color: "#1a2427",
                  }}
                >
                  Event Registration
                </h3>

                {success && (
                  <div
                    style={{
                      background: "#e7f7ee",
                      padding: 15,
                      borderRadius: 10,
                      marginBottom: 20,
                      color: "#0a7a42",
                    }}
                  >
                    {success}
                  </div>
                )}

                <form onSubmit={submitEnrollment}>
                  <div
                    style={{
                      display: "grid",
                      gap: 15,
                    }}
                  >
                    <input
                      required
                      className="input"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                    />

                    <input
                      required
                      className="input"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                    />

                    <button className="btn" type="submit">
                      {sending ? "Submitting..." : "Register Now"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* SIDEBAR */}
            <div>
              <div
                className="card sidebar"
                style={{
                  padding: 30,
                }}
              >
                <h3
                  style={{
                    marginBottom: 25,
                    color: "#1a2427",
                  }}
                >
                  Event Details
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: 22,
                  }}
                >
                  <InfoItem
                    icon={<Calendar size={18} />}
                    label="Date"
                    value={formatDate(event.event_date)}
                  />

                  <InfoItem
                    icon={<Clock size={18} />}
                    label="Time"
                    value={`${formatTime(event.start_time)} - ${formatTime(
                      event.end_time,
                    )}`}
                  />

                  <InfoItem
                    icon={<MapPin size={18} />}
                    label="Location"
                    value={event.location || "TBA"}
                  />

                  <InfoItem
                    icon={<User size={18} />}
                    label="Status"
                    value={event.status || "Active"}
                  />
                </div>
              </div>

              {/* Contact Box */}
              <div
                className="card"
                style={{
                  padding: 30,
                  marginTop: 25,
                }}
              >
                <h3
                  style={{
                    marginBottom: 20,
                  }}
                >
                  Contact
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <Phone size={18} color="#6c7e7f" />
                    <span>+880 1700 000000</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <Mail size={18} color="#6c7e7f" />
                    <span>info@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
      }}
    >
      <div
        style={{
          color: "#6c7e7f",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            color: "#95a49a",
            marginBottom: 3,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: "#1a2427",
            fontWeight: 600,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
