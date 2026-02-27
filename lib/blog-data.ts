
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  featured: boolean;
}

export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'cannabis-history-global',
    title: 'The Wild Ride of Weed: From Ancient Rituals to Modern Revolution',
    excerpt: 'Look, cannabis has been getting people lifted for longer than most countries have been on maps. From ancient Chinese medicine to underground counterculture to today\'s multi-billion dollar industry – this plant has seen some serious history.',
    author: 'Highway 420 Crew',
    date: '2025-10-15',
    category: 'Culture',
    image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/History%20of%20Cannabis.jpg',
    readTime: '10 min read',
    featured: true
  },
  /* Temporarily commenting out paraphernalia articles
  {
    id: 'dabbing-101-beginners-guide',
    title: 'Dabbing 101: Your Beginner\'s Guide to Rigs, Nails & First Setups',
    excerpt: 'New to dabbing? This comprehensive guide breaks down rigs, nails, temperature control, and essential setup tips for smooth, flavorful vapor every time.',
    content: `
      <h2>Introduction to Dabbing</h2>
      <p>Dabbing has revolutionized the way we consume concentrates, offering a more potent and flavorful experience than traditional smoking methods. But for beginners, the array of equipment—rigs, nails, torches, carb caps—can be intimidating.</p>
      
      <h3>The Essentials: What You Need</h3>
      <ul>
        <li><strong>Dab Rig:</strong> A specialized water pipe designed for concentrates. Unlike bongs, rigs are usually smaller to preserve flavor.</li>
        <li><strong>Nail or Banger:</strong> The heating element, typically made of quartz, titanium, or ceramic. Quartz bangers are the industry standard for flavor.</li>
        <li><strong>Torch:</strong> You'll need a butane torch to heat your nail. Propane torches burn too hot and can damage your quartz.</li>
        <li><strong>Dab Tool:</strong> A small metal or glass tool to transfer your concentrate to the heated nail.</li>
        <li><strong>Carb Cap:</strong> Essential for regulating airflow and vaporizing your concentrate at lower temperatures.</li>
      </ul>

      <h3>The Process</h3>
      <ol>
        <li><strong>Heat the Nail:</strong> Use your torch to heat the banger for 30-45 seconds.</li>
        <li><strong>Wait:</strong> Let it cool! This is crucial. Wait 45-60 seconds for the temperature to drop. Taking a dab too hot will hurt your lungs and ruin the flavor.</li>
        <li><strong>Apply:</strong> Place your concentrate into the banger with your dab tool.</li>
        <li><strong>Cap and Inhale:</strong> Place the carb cap on top and inhale steadily.</li>
        <li><strong>Clean:</strong> Use a cotton swab to clean the residue immediately after your hit.</li>
      </ol>
      
      <p>Start small. Concentrates are significantly more potent than flower. A piece the size of a grain of rice is plenty for a beginner.</p>
    `,
    author: 'Highway 420 Team',
    date: '2025-10-30',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    readTime: '8 min read',
    featured: false
  },
  {
    id: 'anatomy-smooth-hit',
    title: 'The Anatomy of a Smooth Hit: How Airflow & Cooling Design Transform Your Experience',
    excerpt: 'Discover how percolators, recyclers, and airflow systems work together to eliminate harshness and deliver impeccably smooth, flavorful vapor.',
    content: `
      <h2>Why Does My Bong Hit Harsh?</h2>
      <p>The smoothness of a hit is determined by two main factors: temperature and filtration. Hot smoke is harsh smoke. Stagnant smoke is stale smoke.</p>

      <h3>The Role of Percolators</h3>
      <p>Percolators (percs) diffuse smoke into water, increasing surface area for cooling and filtration. More bubbles mean smoother hits.</p>
      <ul>
        <li><strong>Honeycomb Percs:</strong> Feature dozens of small holes for maximum diffusion with minimal drag.</li>
        <li><strong>Tree Percs:</strong> Classic design with multiple "arms" that filter smoke through water.</li>
        <li><strong>Matrix Percs:</strong> A grid-like design that offers a bubbly, smooth pull.</li>
      </ul>

      <h3>Recyclers: The Game Changer for Dabs</h3>
      <p>Recyclers circulate water constantly with the vapor, keeping it cool and preventing stale air pockets. This is why they are the preferred choice for dab rigs. The constant motion ensures that the vapor never sits still long enough to condense on the glass or become harsh.</p>
    `,
    author: 'Highway 420 Team',
    date: '2025-10-30',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=600&h=400&fit=crop',
    readTime: '10 min read',
    featured: false
  },
  {
    id: 'perfect-temperature-control',
    title: 'Finding the Perfect Hit: Temperature Control for Maximum Flavor & Smoothness',
    excerpt: 'Master temperature precision for concentrates. Learn the goldilocks zone, heat effects on vapor quality, and gear that keeps you in the flavor zone.',
    content: `
      <h2>The Goldilocks Zone</h2>
      <p>Temperature is the single most important variable in dabbing. Too hot, and you incinerate the terpenes (flavor) and irritate your lungs. Too cold, and the concentrate pools without vaporizing.</p>

      <h3>Temperature Ranges</h3>
      <ul>
        <li><strong>Low Temp (315°F - 450°F):</strong> The flavor chaser's zone. You'll get maximum terpene profile and very smooth vapor, but smaller clouds and milder effects.</li>
        <li><strong>Medium Temp (450°F - 600°F):</strong> The sweet spot. Good balance of flavor and vapor density. Most e-rigs default to this range.</li>
        <li><strong>High Temp (600°F - 900°F):</strong> Not recommended. You risk flash-frying the concentrate, resulting in harsh, flavorless vapor and red-hot bangers.</li>
      </ul>

      <h3>Tools for Control</h3>
      <p>Cold starting (placing the dab in a cold banger and heating until it bubbles) is a great way to ensure you don't overheat. Alternatively, investing in an IR thermometer (dab rite) or a high-quality e-rig takes the guesswork out of the equation.</p>
    `,
    author: 'Highway 420 Team',
    date: '2025-10-30',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
    readTime: '7 min read',
    featured: false
  }
  */
];
