# Higher Learning Articles — How to add a new one

The article layout (`app/higher-learning/_components/HigherLearningArticleLayout.tsx`) handles every conversion surface in the article-page mockup: breadcrumbs, header, hero, sticky right rail with curated products + "Shop All" CTA, mid-article "Upgrade Your Setup" carousel, related articles, expert-guides nav, and share buttons.

A new article is a thin slug page that supplies content + config.

## 1. Create the page

`app/higher-learning/<slug>/page.tsx` — see `e-rig-vs-dab-rig/page.tsx` as the reference. It passes:

- `articleSlug` — must match the URL slug; this is the join key for product picks
- `breadcrumbs`, `title`, `deck`, `author`, `publishedDate`, `readTime`, `hero`
- `shopAllRail` — broad-intent CTA below the curated SKUs (e.g., `/dabsntools`)
- `relatedArticles` — three cards at the foot of the article
- `fallbackProductSlugs` — temporary slugs that render until a merchandiser sets DB picks (see step 3)
- `children` — the article body (use `<ArticleQuickAnswer>`, `<ComparisonBlock>`, `<DecisionBlock>`, plain prose)

## 2. Inline body components

Available out of the box:

- `<ArticleQuickAnswer>` — top-of-article TL;DR card with audience routing pointers
- `<ComparisonBlock>` — image + description + pros/cons + "Best for" line; use twice for an A-vs-B article
- `<DecisionBlock>` — two parallel "Choose X if…" columns with a VS marker
- For free-form prose, write plain `<section>` / `<p>` JSX — Tailwind `text-neutral-*` classes match the rest of the layout.

## 3. Wire curated products (recommended)

Until you add DB rows, the page renders the slugs in `fallbackProductSlugs`. To take editorial control, insert into `article_recommended_products`:

```sql
-- Right rail — products the article photographs/discusses
INSERT INTO public.article_recommended_products (article_slug, product_id, slot, position) VALUES
  ('e-rig-vs-dab-rig', '<diamond-glass-inline-rig uuid>', 'rail', 0),
  ('e-rig-vs-dab-rig', '<puffco-peak-pro uuid>',         'rail', 1),
  ('e-rig-vs-dab-rig', '<blazer-big-shot-torch uuid>',   'rail', 2);

-- Inline upgrade carousel — the "you've decided, here's the upgrade" set
INSERT INTO public.article_recommended_products (article_slug, product_id, slot, position) VALUES
  ('e-rig-vs-dab-rig', '<diamond-glass-beaker-rig uuid>', 'inline', 0),
  ('e-rig-vs-dab-rig', '<puffco-peak-pro uuid>',          'inline', 1),
  ('e-rig-vs-dab-rig', '<blazer-big-shot-torch uuid>',    'inline', 2);
```

DB rows always win over `fallbackProductSlugs` — once any rows exist for a `(article_slug, slot)` combination, the slot uses DB rows exclusively.

## 4. "Newer model available" / supersession

When a SKU gets a sequel, set the pointer once on the **product**, not on each article that mentions it:

```sql
UPDATE public.main_site_products
SET superseded_by_product_id = '<peak-pro-2 uuid>',
    supersession_note        = '2025 model with 30% larger chamber'
WHERE id = '<peak-pro uuid>';
```

Every article rail that lists the original Peak Pro will now show a "Newer model: Peak Pro 2" badge link beneath the View Product button. If the original is out of stock and the successor is in stock, the card promotes the successor automatically. Set `supersession_note` to override the default copy; null falls back to "Newer model available".

To clear: `UPDATE main_site_products SET superseded_by_product_id = NULL, supersession_note = NULL WHERE id = '<…>';`
