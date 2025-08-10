export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
  ];
}

