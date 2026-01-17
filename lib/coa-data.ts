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

  // --- MELLOW FELLOW (New Additions) ---
  {
    id: "mellow-fellow-2g-cart-klimt",
    product_name: "Klimt’s Desire Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56954-klimt-s-desire-2ml-cartridge-mimosa.pdf",
    file_name: "56954-klimt-s-desire-2ml-cartridge-mimosa.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-frida",
    product_name: "Frida’s Recovery Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56955-frida-s-recovery-platinum-og-2ml-cartridge.pdf",
    file_name: "56955-frida-s-recovery-platinum-og-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-banksy",
    product_name: "Banksy’s Introvert Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56956-banksy-s-introvert-god-s-gift-2ml-cartridge.pdf",
    file_name: "56956-banksy-s-introvert-god-s-gift-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-van-gogh",
    product_name: "Van Gogh’s Creativity Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56957-van-gogh-s-creativity-gmo-cookies-2ml-cartridge.pdf",
    file_name: "56957-van-gogh-s-creativity-gmo-cookies-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-okeeffe",
    product_name: "O’Keefe’s Tranquility Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56958-o-keeffe-s-tranquility-pink-rozay-2ml-cartridge.pdf",
    file_name: "56958-o-keeffe-s-tranquility-pink-rozay-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-picasso",
    product_name: "Picasso’s Euphoria Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56959-picasso-s-euphoria-pandora-s-box-2ml-cartridge.pdf",
    file_name: "56959-picasso-s-euphoria-pandora-s-box-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-warhol",
    product_name: "Warhol’s Charged Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56960-warhol-s-charged-candyland-2ml-cartridge.pdf",
    file_name: "56960-warhol-s-charged-candyland-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-dali",
    product_name: "Dali’s Dream Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56961-dali-s-dream-phantom-og-2ml-cartridge.pdf",
    file_name: "56961-dali-s-dream-phantom-og-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-cart-basquiat",
    product_name: "Basquiat Motivation Blend - 2G Cartridge",
    brand_name: "Mellow Fellow",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Carts/56962-basquiat-s-motivation-first-class-funk-2ml-cartridge.pdf",
    file_name: "56962-basquiat-s-motivation-first-class-funk-2ml-cartridge.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-davinci",
    product_name: "DaVinci’s Clarity - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/61046-da-vinci-s-clarity-forbidden-fruit-2ml-disposable.pdf",
    file_name: "61046-da-vinci-s-clarity-forbidden-fruit-2ml-disposable.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-picasso",
    product_name: "Picasso’s Euphoria - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/61047-picasso-s-euphoria-green-crack-2ml-disposable.pdf",
    file_name: "61047-picasso-s-euphoria-green-crack-2ml-disposable.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-dali",
    product_name: "Dali’s Dream - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/61048-dali-s-dream-sunset-sherbet-2ml-disposable.pdf",
    file_name: "61048-dali-s-dream-sunset-sherbet-2ml-disposable.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-van-gogh",
    product_name: "Van Gogh’s Creativity - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/61049-van-gogh-s-creativity-golden-goat-2ml-disposable.pdf",
    file_name: "61049-van-gogh-s-creativity-golden-goat-2ml-disposable.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-charged",
    product_name: "Charged Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Charged_Blend__Wedding_Crasher.pdf",
    file_name: "Charged_Blend__Wedding_Crasher.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-clarity",
    product_name: "Clarity Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Clarity_Blend__Durban_Poison.pdf",
    file_name: "Clarity_Blend__Durban_Poison.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-creativity",
    product_name: "Creativity Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Creativity_Blend__White_Widow.pdf",
    file_name: "Creativity_Blend__White_Widow.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-desire",
    product_name: "Desire Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Desire_Blend__Acapulco_Gold.pdf",
    file_name: "Desire_Blend__Acapulco_Gold.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-dream",
    product_name: "Dream Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Dream_Blend__Double_Dream.pdf",
    file_name: "Dream_Blend__Double_Dream.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-euphoria",
    product_name: "Euphoria Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Euphoria_Blend__Sundae_Driver.pdf",
    file_name: "Euphoria_Blend__Sundae_Driver.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-introvert",
    product_name: "Introvert Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Introvert_Blend__AK-47.pdf",
    file_name: "Introvert_Blend__AK-47.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-motivation",
    product_name: "Motivation Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Motivation_Blend__Tangie.pdf",
    file_name: "Motivation_Blend__Tangie.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-recover",
    product_name: "Recover Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Recover_Blend__Jungle_Cake.pdf",
    file_name: "Recover_Blend__Jungle_Cake.pdf"
  },
  {
    id: "mellow-fellow-2g-disposable-tranquility",
    product_name: "Tranquility Blend - 2G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "2G Disposable Vapes",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/2G%20Disposable/Tranquility_Blend__White_Buffalo.pdf",
    file_name: "Tranquility_Blend__White_Buffalo.pdf"
  },
  {
    id: "mellow-fellow-4g-disposable-banksy",
    product_name: "Banksy’s Introvert Blend 4G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/4G%20Disposable/SA-230328-19371_Arvida_Labs_Banksy_s_Introvert_Blend_4ml_Blueberry_OG.pdf",
    file_name: "SA-230328-19371_Arvida_Labs_Banksy_s_Introvert_Blend_4ml_Blueberry_OG.pdf"
  },
  {
    id: "mellow-fellow-4g-disposable-warhol",
    product_name: "Warhol’s Charged Blend 4G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/4G%20Disposable/SA-230328-19372_Arvida_Labs_Warhol_s_Charged_Blend_4ml_Strawberry_Cough.pdf",
    file_name: "SA-230328-19372_Arvida_Labs_Warhol_s_Charged_Blend_4ml_Strawberry_Cough.pdf"
  },
  {
    id: "mellow-fellow-4g-disposable-dali",
    product_name: "Dali’s Dream Blend 4G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/4G%20Disposable/SA-230328-19373_Arvida_Labs_Dali_s_Dream_Blend_4ml_Granddaddy_purple.pdf",
    file_name: "SA-230328-19373_Arvida_Labs_Dali_s_Dream_Blend_4ml_Granddaddy_purple.pdf"
  },
  {
    id: "mellow-fellow-4g-disposable-picasso",
    product_name: "Picasso’s Euphoria Blend 4G Disposable",
    brand_name: "Mellow Fellow",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Mellow%20Fellow/4G%20Disposable/SA-230328-19374_Arvida_Labs_Picasso_s_Euphoria_Blend_4ml_Green_Crack.pdf",
    file_name: "SA-230328-19374_Arvida_Labs_Picasso_s_Euphoria_Blend_4ml_Green_Crack.pdf"
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

  // --- URTH FARMACY ---
  {
    id: "urth-farmacy-1g-apple-fritter",
    product_name: "Apple Fritter’s 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Apple%20Fritters%20Lab%20Results.pdf",
    file_name: "Apple Fritters Lab Results.pdf"
  },
  {
    id: "urth-farmacy-1g-banana-punch",
    product_name: "Banana Punch 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Banana%20Punch%20Lab%20Results.pdf",
    file_name: "Banana Punch Lab Results.pdf"
  },
  {
    id: "urth-farmacy-1g-cheetah-piss",
    product_name: "Cheetah Piss 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Cheetah%20Piss%20Lab%20Results.pdf",
    file_name: "Cheetah Piss Lab Results.pdf"
  },
  {
    id: "urth-farmacy-1g-forbidden-fruit",
    product_name: "Forbidden Fruit Punch 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Forbidden%20Fruit%20Punch%20Lab%20Report.pdf",
    file_name: "Forbidden Fruit Punch Lab Report.pdf"
  },
  {
    id: "urth-farmacy-1g-garlic-truffle",
    product_name: "Garlic Truffle 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Garlic%20Truffle%20Lab%20Results.pdf",
    file_name: "Garlic Truffle Lab Results.pdf"
  },
  {
    id: "urth-farmacy-1g-himalayan-haze",
    product_name: "Himalayan Haze 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Himalayan%20Haze%20Lab%20Report.pdf",
    file_name: "Himalayan Haze Lab Report.pdf"
  },
  {
    id: "urth-farmacy-1g-machi",
    product_name: "Machi 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Machi%20Lab%20Results.pdf",
    file_name: "Machi Lab Results.pdf"
  },
  {
    id: "urth-farmacy-1g-mango-tango",
    product_name: "Mango Tango 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Mango%20Tango%20Lab%20Report.pdf",
    file_name: "Mango Tango Lab Report.pdf"
  },
  {
    id: "urth-farmacy-1g-octane-gas",
    product_name: "Octane Gas 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Octane%20Gas%20Lab%20Results.pdf",
    file_name: "Octane Gas Lab Results.pdf"
  },
  {
    id: "urth-farmacy-1g-purple-thai",
    product_name: "Purple Thai Kush 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Purple%20Thai%20Kush%20Lab%20Report.pdf",
    file_name: "Purple Thai Kush Lab Report.pdf"
  },
  {
    id: "urth-farmacy-1g-purple-zaza",
    product_name: "Purple Zaza 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Purple%20Zaza%20Lab%20Report.pdf",
    file_name: "Purple Zaza Lab Report.pdf"
  },
  {
    id: "urth-farmacy-1g-tahitian-blue",
    product_name: "Tahitian Blue 1G Preroll",
    brand_name: "Urth Farmacy",
    category_name: "1G Prerolls",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/1G_Preroll/Tahitian%20Blue%20Lab%20Report.pdf",
    file_name: "Tahitian Blue Lab Report.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-blue-dream",
    product_name: "Blue Dream Exotic Blend 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Exotic%20Blend%20Blue%20Dream.pdf",
    file_name: "2g-cartridge Exotic Blend Blue Dream.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-green-crack",
    product_name: "Green Crack Exotic Blend 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Exotic%20Blend%20Green%20Crack.pdf",
    file_name: "2g-cartridge Exotic Blend Green Crack.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-rainbow-belts",
    product_name: "Rainbow Belts Exotic Blend 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Exotic%20Blend%20Rainbow%20Belts.pdf",
    file_name: "2g-cartridge Exotic Blend Rainbow Belts.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-unflavored-exotic",
    product_name: "Unflavored Exotic Blend 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Exotic%20Blend%20Un%20Flavored.pdf",
    file_name: "2g-cartridge Exotic Blend Un Flavored.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-bubba-kush",
    product_name: "Bubba Kush Liquid Diamonds 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Liquid%20Diamond%20Bubba%20Kush.pdf",
    file_name: "2g-cartridge Liquid Diamond Bubba Kush.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-london-mints",
    product_name: "London Mints Liquid Diamonds 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Liquid%20Diamond%20London%20Mints.pdf",
    file_name: "2g-cartridge Liquid Diamond London Mints.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-unflavored-liquid",
    product_name: "Unflavored Liquid Diamonds 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Liquid%20Diamond%20Un%20Flavored.pdf",
    file_name: "2g-cartridge Liquid Diamond Un Flavored.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-snow-cap",
    product_name: "Snow Cap Live Rosin 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20LiveRosin%20Snow%20Cap.pdf",
    file_name: "2g-cartridge LiveRosin Snow Cap.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-strawberry-shortcake",
    product_name: "Strawberry Shortcake Live Rosin 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20LiveRosin%20Strawberry%20Shortcake.pdf",
    file_name: "2g-cartridge LiveRosin Strawberry Shortcake.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-unflavored-rosin",
    product_name: "Unflavored Live Rosin 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20LiveRosin%20Un%20Flavored.pdf",
    file_name: "2g-cartridge LiveRosin Un Flavored.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-ghost-train",
    product_name: "Ghost Train Haze Pharma Blend 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Phama%20Blend%20Ghost%20Train%20Haze.pdf",
    file_name: "2g-cartridge Phama Blend Ghost Train Haze.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-unflavored-pharma",
    product_name: "Unflavored Pharma Blend 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/2g-cartridge%20Phama%20Blend%20Un%20flavored.pdf",
    file_name: "2g-cartridge Phama Blend Un flavored.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-fruit-punch",
    product_name: "Fruit Punch Live Rosin 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/83916-urth-farmacy-live-rosin-fruit-punch-2g-cartridge.pdf",
    file_name: "83916-urth-farmacy-live-rosin-fruit-punch-2g-cartridge.pdf"
  },
  {
    id: "urth-farmacy-2g-cart-strawberry-liquid",
    product_name: "Liquid Diamond Strawberry 2G Cart",
    brand_name: "Urth Farmacy",
    category_name: "2G Carts",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/2G%20Carts/83917-urth-farmacy-liquid-diamond-strawberry.pdf",
    file_name: "83917-urth-farmacy-liquid-diamond-strawberry.pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-apple-fritter",
    product_name: "Apple Fritter 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Apple%20Fritters%20Lab%20Results%20(1).pdf",
    file_name: "Apple Fritters Lab Results (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-banana-punch",
    product_name: "Banana Punch 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Banana%20Punch%20Lab%20Results%20(1).pdf",
    file_name: "Banana Punch Lab Results (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-cheetah-piss",
    product_name: "Cheetah Piss 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Cheetah%20Piss%20Lab%20Results%20(1).pdf",
    file_name: "Cheetah Piss Lab Results (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-forbidden-fruit",
    product_name: "Forbidden Fruit 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Forbidden%20Fruit%20Punch%20Lab%20Report%20(1).pdf",
    file_name: "Forbidden Fruit Punch Lab Report (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-garlic-truffle",
    product_name: "Garlic Truffle 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Garlic%20Truffle%20Lab%20Results%20(1).pdf",
    file_name: "Garlic Truffle Lab Results (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-himalayan-haze",
    product_name: "Himalayan Haze 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Himalayan%20Haze%20Lab%20Report%20(1).pdf",
    file_name: "Himalayan Haze Lab Report (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-machi",
    product_name: "Machi 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Machi%20Lab%20Results%20(1).pdf",
    file_name: "Machi Lab Results (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-mango-tango",
    product_name: "Mango Tango 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Mango%20Tango%20Lab%20Report%20(1).pdf",
    file_name: "Mango Tango Lab Report (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-octane-gas",
    product_name: "Octane Gas 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Octane%20Gas%20Lab%20Results%20(1).pdf",
    file_name: "Octane Gas Lab Results (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-purple-thai",
    product_name: "Purple Thai Kush 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Purple%20Thai%20Kush%20Lab%20Report%20(1).pdf",
    file_name: "Purple Thai Kush Lab Report (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-purple-zaza",
    product_name: "Purple Zaza 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Purple%20Zaza%20Lab%20Report%20(1).pdf",
    file_name: "Purple Zaza Lab Report (1).pdf"
  },
  {
    id: "urth-farmacy-3.5g-flower-tahitian-blue",
    product_name: "Tahitian Blue 3.5G Flower",
    brand_name: "Urth Farmacy",
    category_name: "3.5G Flower",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/3.5G_Flower/Tahitian%20Blue%20Lab%20Report%20(1).pdf",
    file_name: "Tahitian Blue Lab Report (1).pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-bubba-kush",
    product_name: "Liquid Diamond Bubba Kush 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4g%20Disposable%20Liquid%20Diamond%20Bubba%20Kush.pdf",
    file_name: "4g Disposable Liquid Diamond Bubba Kush.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-london-mints",
    product_name: "Liquid Diamond London Mints 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4g%20Disposable%20Liquid%20Diamond%20London%20Mints.pdf",
    file_name: "4g Disposable Liquid Diamond London Mints.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-strawberry-lemonade",
    product_name: "Liquid Diamond Strawberry Lemonade 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4g%20Disposable%20Liquid%20Diamond%20Strawberry%20Lemonade.pdf",
    file_name: "4g Disposable Liquid Diamond Strawberry Lemonade.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-blue-dream",
    product_name: "Blue Dream Exotic Blend 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Exotic%20Blend%20Blue%20Dream.pdf",
    file_name: "4G Disposable-Exotic Blend Blue Dream.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-green-crack",
    product_name: "Green Crack Exotic Blend 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Exotic%20Blend%20Green%20Crack.pdf",
    file_name: "4G Disposable-Exotic Blend Green Crack.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-rainbow-belts",
    product_name: "Rainbow Belts Exotic Blend 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Exotic%20Blend%20Rainbow%20Belts.pdf",
    file_name: "4G Disposable-Exotic Blend Rainbow Belts.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-fruit-punch",
    product_name: "Fruit Punch Live Rosin 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Live%20Rosin%20Fruit%20Punch.pdf",
    file_name: "4G Disposable-Live Rosin Fruit Punch.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-snow-cap",
    product_name: "Snow Cap Live Rosin 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Live%20Rosin%20Snow%20Cap.pdf",
    file_name: "4G Disposable-Live Rosin Snow Cap.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-strawberry-shortcake",
    product_name: "Strawberry Shortcake Live Rosin 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Live%20Rosin%20Strawberry%20Shortcake.pdf",
    file_name: "4G Disposable-Live Rosin Strawberry Shortcake.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-northern-lights",
    product_name: "Northern Lights Pharmacy Blend 4g Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Pharma%20Blend%20Northern%20Lights.pdf",
    file_name: "4G Disposable-Pharma Blend Northern Lights.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-sundae-driver",
    product_name: "Sundae Driver Pharmacy Blend 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/4G%20Disposable-Pharma%20Blend%20Sundae%20Driver.pdf",
    file_name: "4G Disposable-Pharma Blend Sundae Driver.pdf"
  },
  {
    id: "urth-farmacy-4g-disposable-ghost-train",
    product_name: "Ghost Train Haze Pharma Blend 4G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "4G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/4G_Disposable/83922-urth-farmacy-pharma-blend-ghost-train-haze-4g-disposable.pdf",
    file_name: "83922-urth-farmacy-pharma-blend-ghost-train-haze-4g-disposable.pdf"
  },
  {
    id: "urth-farmacy-6g-disposable-cactus-cooler",
    product_name: "Cactus Cooler 6G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "6G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/6G_Dispoable/104781-urth-farmacy-6g-disposable-cactus-cooler.pdf",
    file_name: "104781-urth-farmacy-6g-disposable-cactus-cooler.pdf"
  },
  {
    id: "urth-farmacy-6g-disposable-angry-apple",
    product_name: "Angry Apple 6G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "6G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/6G_Dispoable/104782-urth-farmacy-6g-disposable-angry-apple.pdf",
    file_name: "104782-urth-farmacy-6g-disposable-angry-apple.pdf"
  },
  {
    id: "urth-farmacy-6g-disposable-wild-baja-blast",
    product_name: "Wild Baja Blast 6G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "6G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/6G_Dispoable/104786-urth-farmacy-6g-disposable-wild-baja-blast.pdf",
    file_name: "104786-urth-farmacy-6g-disposable-wild-baja-blast.pdf"
  },
  {
    id: "urth-farmacy-6g-disposable-berry-skittlez",
    product_name: "Berry Skittlez 6G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "6G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/6G_Dispoable/104787-urth-farmacy-6g-disposable-berry-skittlez.pdf",
    file_name: "104787-urth-farmacy-6g-disposable-berry-skittlez.pdf"
  },
  {
    id: "urth-farmacy-6g-disposable-tropical-runtz",
    product_name: "Tropical Runtz 6G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "6G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/6G_Dispoable/104788-urth-farmacy-6g-disposable-tropical-runtz.pdf",
    file_name: "104788-urth-farmacy-6g-disposable-tropical-runtz.pdf"
  },
  {
    id: "urth-farmacy-6g-disposable-mucho-mango",
    product_name: "Mucho Mango 6G Disposable",
    brand_name: "Urth Farmacy",
    category_name: "6G Disposable",
    lab_name: "Third-Party Lab",
    test_date: "2024-01-01",
    file_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/reference/COAs/Urth_Farmacy/6G_Dispoable/104789-urth-farmacy-6g-disposable-mucho-mango.pdf",
    file_name: "104789-urth-farmacy-6g-disposable-mucho-mango.pdf"
  }
];
