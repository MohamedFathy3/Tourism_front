import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import blog1 from "@/assets/Engineering.webp";
import blog2 from "@/assets/Technology.webp";
import blog3 from "@/assets/Consulting.webp";

const blogImages = [blog1, blog2, blog3];

const BlogPreview = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{t.blog.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.blog.articles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <img src={blogImages[i]} alt={article.title} loading="lazy" className="w-full h-48 object-cover" width={800} height={600} />
              <div className="p-5">
                <p className="text-xs text-muted-foreground mb-2">{article.date}</p>
                <h3 className="text-base font-bold text-foreground mb-3 line-clamp-2">{article.title}</h3>
                <Link to="/blog" className="text-primary text-sm font-medium hover:underline">
                  {t.blog.readMore}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
