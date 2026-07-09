"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import {
  fetchBlogCategories,
  fetchBlogs,
  type ApiBlogCategory,
  type MappedBlog,
} from "@/lib/api/blog";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState<MappedBlog[]>([]);
  const [categories, setCategories] = useState<ApiBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  async function loadData() {
    try {
      setLoading(true);

      const [blogs, cats] = await Promise.all([
        fetchBlogs(),
        fetchBlogCategories(),
      ]);

      setPosts(blogs);
      setCategories(cats.filter((c) => c.status === "active"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const categoryLabels = useMemo(() => {
    const inPosts = new Set(posts.map((p) => p.category));

    return [
      "All",
      ...categories.filter((c) => inPosts.has(c.title)).map((c) => c.title),
    ];
  }, [posts, categories]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts;

    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <>
      <Navbar />

      <PageHero title="Our Blog" currentPage="Blog" />

      <section className="blog-section">
        <div className="container">
          {/* category buttons */}
          <motion.div
            className="category-wrap"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {categoryLabels.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-xolonium category-btn ${
                  activeCategory === cat ? "active" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* blog list */}
          <div className="blog-list">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="blog-card flex gap-8 items-center"
                  style={{
                    margin: "14px 0px",
                  }}
                >
                  {/* image */}
                  <div className="blog-image">
                    <Image
                      src={post.imageUrl || "/placeholder.jpg"}
                      alt={post.title}
                      fill
                    />
                  </div>

                  {/* content */}
                  <div className="blog-content">
                    <span className="blog-category font-xolonium">
                      {post.category}
                    </span>

                    <h2 className="hover:text-white font-rising">
                      {post.title}
                    </h2>

                    <p className="font-xolonium">{post.excerpt}</p>

                    <div className="blog-footer font-xolonium">
                      <div className="meta">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <motion.div whileHover={{ x: 5 }} className="read-btn">
                        Continue Reading →
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .blog-section {
          background: #f4f7f6;
          padding: 80px 0;
        }

        .container {
          max-width: 1280px;
          margin: auto;
          padding: 0 20px;
        }

        .category-wrap {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .category-btn {
          border: 1px solid #d8d8d8;
          background: transparent;
          padding: 10px 20px;
          border-radius: 50px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .category-btn:hover,
        .category-btn.active {
          background: #6c7e7f;
          color: white;
          border-color: #648181;
        }

        
       .blog-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: "20px"
}

.blog-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  text-decoration: none;
  padding: 22px;
 
  transition: all 0.45s ease;
  background: #fff;
  overflow: hidden;
  position: relative;
  height: 100%;
}
        .blog-card:hover {
          background: #6c7e7f;
          transform: scale(1.02);
          box-shadow: 0 20px 50px rgba(100, 129, 129, 0.2);
        }

        .blog-card:hover .blog-image img {
          transform: scale(1.12) rotate(1deg);
        }
        .blog-image img {
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .blog-card:hover h2 {
        color:#fff}
        
        .blog-card:hover p,
        .blog-card:hover .meta,
        .blog-card:hover .blog-category {
          color: #fff;
        }
        .blog-card:hover .read-btn {
          background: #fff;
          border-color: #fff;
          color: #648181;
        }
          .blog-image {
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  flex-shrink: 0;
}

        .blog-image img {
          object-fit: cover;
          transition: 0.6s;
        }

        .blog-category {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #b28c52;
          display: inline-block;
          margin-bottom: 14px;
        }
          .blog-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  
}

        .blog-content h2 {
  font-size: 22px;
  line-height: 1.3;
  margin-bottom: 18px;
  color: #111;
 
  transition: 0.3s;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

        .blog-card:hover h2 {
          color: #fff;
        }

        .blog-content p {
  color: #666;
  font-size: 15px;
  line-height: 1.9;
 

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

        .blog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  margin-top: auto;
}

        .meta {
          display: flex;
          gap: 18px;
          color: #777;
          font-size: 14px;
        }

        .read-btn {
          border: 1px solid #c9a84c;
          padding: 12px 22px;
          border-radius: 40px;
          color: #111;
          font-size: 14px;
          transition: 0.3s;
        }

        .blog-card:hover .read-btn {
          background: #6c7e7f;
          border-color: #fff;
          color: white;
        }

        @media (max-width: 992px) {
  .blog-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .blog-content h2 {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .blog-section {
    padding: 60px 0;
  }

  .blog-list {
    grid-template-columns: 1fr;
  }

  .blog-card {
    padding: 18px;
  }

  .blog-image {
    height: 220px;
    border-radius: 12px;
  }

  .blog-content h2 {
    font-size: 22px;
    line-height: 1.4;
  }

  .blog-content p {
    font-size: 14px;
    line-height: 1.8;
  }

  .blog-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
        }
      `}</style>
    </>
  );
}
