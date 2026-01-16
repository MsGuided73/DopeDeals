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
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-apples&bananas.pdf",
    file_name: "COA-Cookies-apples&bananas.pdf"
  },
  {
    id: "cookies-berry-pie",
    product_name: "Berry Pie",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-berry_pie.pdf",
    file_name: "COA-Cookies-berry_pie.pdf"
  },
  {
    id: "cookies-cheetah-piss",
    product_name: "Cheetah Piss",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-cheetah_piss.pdf",
    file_name: "COA-Cookies-cheetah_piss.pdf"
  },
  {
    id: "cookies-honey-bun",
    product_name: "Honey Bun",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-honey_buns.pdf",
    file_name: "COA-Cookies-honey_buns.pdf"
  },
  {
    id: "cookies-laughing-gas",
    product_name: "Laughing Gas",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-laughing_gas.pdf",
    file_name: "COA-Cookies-laughing_gas.pdf"
  },
  {
    id: "cookies-london-pound-cake",
    product_name: "London Pound Cake",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies-london_pound_cake.pdf",
    file_name: "COA-Cookies-london_pound_cake.pdf"
  },
  {
    id: "cookies-gelatti",
    product_name: "Gelatti",
    brand_name: "Cookies",
    category_name: "Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Cookies%20COAs/COA-Cookies=gelatti.pdf",
    file_name: "COA-Cookies=gelatti.pdf"
  },

  // --- MELLOW FELLOW ---
  {
    id: "mellow-fellow-banksy",
    product_name: "Banksy Cereal Bar",
    brand_name: "Mellow Fellow",
    category_name: "Cereal Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/56572-banksy-s-cereal-bar-1000mg.pdf",
    file_name: "56572-banksy-s-cereal-bar-1000mg.pdf"
  },
  {
    id: "mellow-fellow-picasso",
    product_name: "Picasso Cereal Bar",
    brand_name: "Mellow Fellow",
    category_name: "Cereal Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/56573-picasso-s-cereal-bar-1000mg.pdf",
    file_name: "56573-picasso-s-cereal-bar-1000mg.pdf"
  },
  {
    id: "mellow-fellow-frida",
    product_name: "Frida Cereal Bar",
    brand_name: "Mellow Fellow",
    category_name: "Cereal Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/56574-frida-s-cereal-bar-1000mg.pdf",
    file_name: "56574-frida-s-cereal-bar-1000mg.pdf"
  },
  {
    id: "mellow-fellow-davinci",
    product_name: "DaVinci Cereal Bar",
    brand_name: "Mellow Fellow",
    category_name: "Cereal Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/56576-da-vinci-s-cereal-bar-1000mg.pdf",
    file_name: "56576-da-vinci-s-cereal-bar-1000mg.pdf"
  },
  {
    id: "mellow-fellow-dali",
    product_name: "Dali Cereal Bar",
    brand_name: "Mellow Fellow",
    category_name: "Cereal Bars",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/56577-dali-s-cereal-bar-1000mg.pdf",
    file_name: "56577-dali-s-cereal-bar-1000mg.pdf"
  },

  // --- TRUEMOOLA ---
  {
    id: "truemoola-blue-lotus-strawberry",
    product_name: "Blue Lotus-Strawberry Acai",
    brand_name: "TrueMoola",
    category_name: "Blue Lotus Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_blue_lotus_strawberry_acai_gummies.pdf",
    file_name: "TrueMoola_lab_blue_lotus_strawberry_acai_gummies.pdf"
  },
  {
    id: "truemoola-blue-lotus-watermelon",
    product_name: "Blue Lotus-Watermelon",
    brand_name: "TrueMoola",
    category_name: "Blue Lotus Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/TrueMoola%20COAs/TrueMoola_lab_blue_lotus_watermelon_gummies.pdf",
    file_name: "TrueMoola_lab_blue_lotus_watermelon_gummies.pdf"
  },
  {
    id: "truemoola-blue-lotus-razz",
    product_name: "Blue Lotus-Blue Razz",
    brand_name: "TrueMoola",
    category_name: "Blue Lotus Gummies",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
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
    test_date: "2024-01-01",
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
  }
];
