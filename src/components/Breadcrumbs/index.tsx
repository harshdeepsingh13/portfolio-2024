import Link from "next/link";
import styles from "./styles.module.css";

const SITE_URL = "https://theharshdeepsingh.com";

type Breadcrumb = {
  label: string;
  href: string;
};

const Breadcrumbs = ({ items }: { items: Breadcrumb[] }) => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <div className={styles.shell}>
        <nav className={styles.nav} aria-label="Breadcrumb">
          <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.href} className={styles.item} aria-current={isLast ? "page" : undefined}>
                {isLast ? (
                  <span className={styles.current}>{item.label}</span>
                ) : (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
          </ol>
        </nav>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
};

export default Breadcrumbs;
