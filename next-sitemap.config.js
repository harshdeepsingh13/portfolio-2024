/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://theharshdeepsingh.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  transform: async (config, path) => {
    const priorities = {
      "/": 1,
      "/skills": 0.9,
      "/projects": 0.9,
      "/experiences": 0.8,
      "/education": 0.7,
      "/resume": 0.6,
    };

    return {
      loc: path,
      changefreq: path === "/" ? "weekly" : "monthly",
      priority: priorities[path] ?? 0.5,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
