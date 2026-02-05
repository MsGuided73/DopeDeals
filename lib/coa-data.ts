export interface COAItem {
  id: string;
  product_name: string;
  product_sku?: string;
  brand_name: string;
  category_name: string;
  lab_name: string;
  test_date: string;
  file_url: string;
  file_name: string;
}

export const STATIC_COA_DATA: COAItem[] = [
  // --- COOKIES ---
  {
    id: "cookies-apples-bananas",
    product_name: "Apples & Bananas",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-03-21",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-apples&bananas.pdf",
    file_name: "COA-Cookies-apples&bananas.pdf"
  },
  {
    id: "cookies-berry-pie",
    product_name: "Berry Pie",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-03-20",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-berry_pie.pdf",
    file_name: "COA-Cookies-berry_pie.pdf"
  },
  {
    id: "cookies-cheetah-piss",
    product_name: "Cheetah Piss",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-03-20",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-cheetah_piss.pdf",
    file_name: "COA-Cookies-cheetah_piss.pdf"
  },
  {
    id: "cookies-honey-bun",
    product_name: "Honey Bun",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-03-21",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-honey_buns.pdf",
    file_name: "COA-Cookies-honey_buns.pdf"
  },
  {
    id: "cookies-laughing-gas",
    product_name: "Laughing Gas",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-03-20",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-laughing_gas.pdf",
    file_name: "COA-Cookies-laughing_gas.pdf"
  },
  {
    id: "cookies-london-pound-cake",
    product_name: "London Pound Cake",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-04-03",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-london_pound_cake.pdf",
    file_name: "COA-Cookies-london_pound_cake.pdf"
  },
  {
    id: "cookies-gelatti",
    product_name: "Gelatti",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2025-03-20",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies=gelatti.pdf",
    file_name: "COA-Cookies=gelatti.pdf"
  },



  // --- TRUEMOOLA ---
  {
    id: "truemoola-blue-lotus-strawberry",
    product_name: "Blue Lotus-Strawberry Acai",
    brand_name: "TrueMoola",
    category_name: "Blue Lotus Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2025-02-06",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_blue_lotus_strawberry_acai_gummies.pdf",
    file_name: "TrueMoola_lab_blue_lotus_strawberry_acai_gummies.pdf"
  },
  {
    id: "truemoola-blue-lotus-watermelon",
    product_name: "Blue Lotus-Watermelon",
    brand_name: "TrueMoola",
    category_name: "Blue Lotus Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2025-02-06",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_blue_lotus_watermelon_gummies.pdf",
    file_name: "TrueMoola_lab_blue_lotus_watermelon_gummies.pdf"
  },
  {
    id: "truemoola-blue-lotus-razz",
    product_name: "Blue Lotus-Blue Razz",
    brand_name: "TrueMoola",
    category_name: "Blue Lotus Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2025-02-06",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_blue_lotus-bluerazz_gummies.pdf",
    file_name: "TrueMoola_lab_blue_lotus-bluerazz_gummies.pdf"
  },
  {
    id: "truemoola-holy-acai",
    product_name: "Acai",
    brand_name: "TrueMoola",
    category_name: "Holy Moly Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_holy_acai_gummies.pdf",
    file_name: "TrueMoola_lab_holy_acai_gummies.pdf"
  },
  {
    id: "truemoola-holy-sexy-strawberry",
    product_name: "Sexy Strawberry",
    brand_name: "TrueMoola",
    category_name: "Holy Moly Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_holy_sexy_strawberry_gummies.pdf",
    file_name: "TrueMoola_lab_holy_sexy_strawberry_gummies.pdf"
  },
  {
    id: "truemoola-holy-tutti-fruitti",
    product_name: "Tutti Fruitti",
    brand_name: "TrueMoola",
    category_name: "Holy Moly Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_holy_tutti_fruity_gummies.pdf",
    file_name: "TrueMoola_lab_holy_tutti_fruity_gummies.pdf"
  },
  {
    id: "truemoola-unicorn-poop",
    product_name: "Unicorn Poop HHC Prerolls",
    brand_name: "TrueMoola",
    category_name: "HHC Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2025-01-29",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_Unicorn_Poop-HHC-preroll.pdf",
    file_name: "TrueMoola_lab_Unicorn_Poop-HHC-preroll.pdf"
  },

  // --- ZOOMERS ---
  {
    id: "zoomers-milk-chocolate",
    product_name: "Belgian Milk Chocolate",
    brand_name: "Zoomers",
    category_name: "Chocolate Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/milk-chocolate-standard-1.pdf",
    file_name: "milk-chocolate-standard-1.pdf"
  },
  {
    id: "zoomers-dark-chocolate",
    product_name: "Dark Chocolate with Sea Salt",
    brand_name: "Zoomers",
    category_name: "Chocolate Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/dark-chocolate-standard-1.pdf",
    file_name: "dark-chocolate-standard-1.pdf"
  },
  {
    id: "zoomers-white-chocolate",
    product_name: "White Chocolate with Strawberries",
    brand_name: "Zoomers",
    category_name: "Chocolate Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/white-chocolate-standard-1.pdf",
    file_name: "white-chocolate-standard-1.pdf"
  },
  {
    id: "zoomers-blue-razz-lemonade",
    product_name: "Blue Razz Lemonade Gummies",
    brand_name: "Zoomers",
    category_name: "Mushroom Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/blue-razz-lemonade-standard-1.pdf",
    file_name: "blue-razz-lemonade-standard-1.pdf"
  },
  {
    id: "zoomers-mexico-mango",
    product_name: "Mexico Mango",
    brand_name: "Zoomers",
    category_name: "Mushroom Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/mexico-mango-standard-1.pdf",
    file_name: "mexico-mango-standard-1.pdf"
  },
  {
    id: "zoomers-mixed-berries",
    product_name: "Mixed Berries",
    brand_name: "Zoomers",
    category_name: "Mushroom Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/mixed-berries-standard-1.pdf",
    file_name: "mixed-berries-standard-1.pdf"
  },
  {
    id: "zoomers-peach-mango",
    product_name: "Peach Mango Gummies",
    brand_name: "Zoomers",
    category_name: "Mushroom Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/peach-mango-standard-1.pdf",
    file_name: "peach-mango-standard-1.pdf"
  },
  {
    id: "zoomers-sour-apple",
    product_name: "Sour Apple Gummies",
    brand_name: "Zoomers",
    category_name: "Mushroom Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/sour-apple-standard-1.pdf",
    file_name: "sour-apple-standard-1.pdf"
  },
  {
    id: "zoomers-strawberry-watermelon",
    product_name: "Strawberry-Watermelon Gummies",
    brand_name: "Zoomers",
    category_name: "Mushroom Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Zoomers%20COAs/strawberry-watermelon-standard-1.pdf",
    file_name: "strawberry-watermelon-standard-1.pdf"
  },

  // --- CRAVE ---
  {
    id: "crave-carts-berry-gelato",
    product_name: "Berry Gelato",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/BERRY%20GELATO%20.pdf",
    file_name: "BERRY GELATO .pdf"
  },
  {
    id: "crave-carts-birthday-cake",
    product_name: "Birthday Cake",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/birthday%20cake%20.pdf",
    file_name: "birthday cake .pdf"
  },
  {
    id: "crave-carts-diablo-og",
    product_name: "Diablo OG",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/diablo%20og%20.pdf",
    file_name: "diablo og .pdf"
  },
  {
    id: "crave-carts-green-crack",
    product_name: "Green Crack",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/green%20crack%20.pdf",
    file_name: "green crack .pdf"
  },
  {
    id: "crave-carts-king-louis",
    product_name: "King Louis",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/king%20louis.pdf",
    file_name: "king louis.pdf"
  },
  {
    id: "crave-carts-runtz",
    product_name: "Runtz",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/runtz.pdf",
    file_name: "runtz.pdf"
  },
  {
    id: "crave-carts-sour-tangie",
    product_name: "Sour Tangie",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/SOUR%20TANGIE%20.pdf",
    file_name: "SOUR TANGIE .pdf"
  },
  {
    id: "crave-carts-space-candy",
    product_name: "Space Candy",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/space%20candy%20.pdf",
    file_name: "space candy .pdf"
  },
  {
    id: "crave-carts-wedding-cake",
    product_name: "Wedding Cake",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/wedding%20cake%20.pdf",
    file_name: "wedding cake .pdf"
  },
  {
    id: "crave-carts-zkittles",
    product_name: "zkittles",
    brand_name: "Crave",
    category_name: "Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Carts/zkittles.pdf",
    file_name: "zkittles.pdf"
  },
  {
    id: "crave-truemoola-af1",
    product_name: "AF 1",
    brand_name: "Crave",
    category_name: "TrueMoola",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Crave_truemoola/AF%201%20Lab%20Results.pdf",
    file_name: "AF 1 Lab Results.pdf"
  },
  {
    id: "crave-truemoola-booty-call",
    product_name: "Booty Call",
    brand_name: "Crave",
    category_name: "TrueMoola",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Crave_truemoola/Booty%20Call%20Lab%20Results.pdf",
    file_name: "Booty Call Lab Results.pdf"
  },
  {
    id: "crave-truemoola-damn-square",
    product_name: "Damn Square",
    brand_name: "Crave",
    category_name: "TrueMoola",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Crave_truemoola/Damn%20Sqaure%20Lab%20Results.pdf",
    file_name: "Damn Sqaure Lab Results.pdf"
  },
  {
    id: "crave-truemoola-red-sky",
    product_name: "Red Sky",
    brand_name: "Crave",
    category_name: "TrueMoola",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Crave_truemoola/Red%20Sky%20Lab%20Results.pdf",
    file_name: "Red Sky Lab Results.pdf"
  },
  {
    id: "crave-truemoola-smack-track",
    product_name: "Smack Track",
    brand_name: "Crave",
    category_name: "TrueMoola",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Crave_truemoola/Smack%20Track%20Lab%20Results.pdf",
    file_name: "Smack Track Lab Results.pdf"
  },
  {
    id: "crave-truemoola-tunnel-vision",
    product_name: "Tunnel Vision",
    brand_name: "Crave",
    category_name: "TrueMoola",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Crave%20COAs/Crave_truemoola/Tunnel%20Vision%20Lab%20Results.pdf",
    file_name: "Tunnel Vision Lab Results.pdf"
  },



  // --- TWENTY-ONE ---
  {
    id: "twenty-one-3g-pineapple",
    product_name: "Pineapple Express-Liquid Diamonds 3G Disposable",
    brand_name: "Twenty One",
    category_name: "3G Disposables",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Twenty_One%20COAs/3G%20Disposable/87578-21-thca-liquid-diamonds-pineapple-express-23268002032608.pdf",
    file_name: "87578-21-thca-liquid-diamonds-pineapple-express-23268002032608.pdf"
  },
  {
    id: "twenty-one-3g-ak47",
    product_name: "AK47-Liquid Diamonds 3G Disposable",
    brand_name: "Twenty One",
    category_name: "3G Disposables",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Twenty_One%20COAs/3G%20Disposable/87579-21-thca-liquid-diamonds-ak47-230268002032626.pdf",
    file_name: "87579-21-thca-liquid-diamonds-ak47-230268002032626.pdf"
  },
  {
    id: "twenty-one-3g-white-runtz",
    product_name: "White Runtz-Liquid Diamonds 3G Disposable",
    brand_name: "Twenty One",
    category_name: "3G Disposables",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Twenty_One%20COAs/3G%20Disposable/87580-21-thca-liquid-diamonds-white-runtz-23268002032667.pdf",
    file_name: "87580-21-thca-liquid-diamonds-white-runtz-23268002032667.pdf"
  },
  {
    id: "twenty-one-3g-og-kush",
    product_name: "OG Kush-Liquid Diamonds 3G Disposable",
    brand_name: "Twenty One",
    category_name: "3G Disposables",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Twenty_One%20COAs/3G%20Disposable/87581-21-thca-liquid-diamonds-og-kush-23268002032609.pdf",
    file_name: "87581-21-thca-liquid-diamonds-og-kush-23268002032609.pdf"
  },


];
