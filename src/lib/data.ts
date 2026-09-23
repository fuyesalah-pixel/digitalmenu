import type { Category, MenuItem, RestaurantSettings } from './types'

const image = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

export const CAFE_INFO = {
  name: 'Sunrise Cafe',
  tagline: 'Fresh flavors, warm sunrise ☀️',
  address: 'Bole Atlas, Addis Ababa, Ethiopia',
  phone: '0911223344',
  phoneLink: 'tel:+251911223344',
  email: 'hello@sunrisecafe.et',
  hours: 'Mon–Sun · 7:00 AM – 11:00 PM',
  social: {
    instagram: '@sunrisecafe.et',
    facebook: 'SunriseCafeAddis',
    tiktok: '@sunrisecafe',
  },
} as const

/** Kept as the shared settings shape used by the UI and Prisma seed. */
export const restaurant: RestaurantSettings = {
  name: CAFE_INFO.name,
  tagline: CAFE_INFO.tagline,
  address: CAFE_INFO.address,
  phone: CAFE_INFO.phone,
  email: CAFE_INFO.email,
  logo: '☀️',
  primaryColor: '#e59a45',
}

export const categories: Category[] = [
  { id: 'all', name: 'All dishes', slug: 'all', icon: '✦', displayOrder: 0, isActive: true },
  { id: 'chickens', name: 'Chickens', slug: 'chickens', icon: '🍗', displayOrder: 1, isActive: true },
  { id: 'pizza-burgers', name: 'Pizza & Burgers', slug: 'pizza-burgers', icon: '🍕', displayOrder: 2, isActive: true },
  { id: 'ethiopian', name: 'Ethiopian Food', slug: 'ethiopian', icon: '🍲', displayOrder: 3, isActive: true },
  { id: 'cakes', name: 'Cakes', slug: 'cakes', icon: '🍰', displayOrder: 4, isActive: true },
  { id: 'juice', name: 'Juice', slug: 'juice', icon: '🥤', displayOrder: 5, isActive: true },
  { id: 'hot-drinks', name: 'Hot Drinks', slug: 'hot-drinks', icon: '☕', displayOrder: 6, isActive: true },
  { id: 'cold-drinks', name: 'Cold Drinks', slug: 'cold-drinks', icon: '🧊', displayOrder: 7, isActive: true },
  { id: 'soft-drinks', name: 'Soft Drinks', slug: 'soft-drinks', icon: '🥤', displayOrder: 8, isActive: true },
]

const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category])) as Record<string, Category>

type ItemOptions = Partial<Pick<MenuItem, 'isVeg' | 'isSpicy' | 'isGlutenFree' | 'isAvailable' | 'isFeatured'>> & {
  tags?: string[]
  views?: number
  prepTime?: string
  calories?: number
}

const makeItem = (
  categoryId: string,
  id: string,
  name: string,
  description: string,
  price: number,
  imageId: string,
  options: ItemOptions = {},
): MenuItem => {
  const category = categoryMap[categoryId]
  return {
    id,
    name,
    description,
    price,
    imageUrl: image(imageId),
    categoryId,
    categoryName: category.name,
    categorySlug: category.slug,
    isVeg: options.isVeg ?? false,
    isSpicy: options.isSpicy ?? false,
    isGlutenFree: options.isGlutenFree ?? false,
    isAvailable: options.isAvailable ?? true,
    isFeatured: options.isFeatured ?? false,
    views: options.views ?? 120,
    tags: options.tags ?? [options.isVeg ? 'vegetarian' : 'cafe favorite'],
    prepTime: options.prepTime ?? '15 min',
    calories: options.calories ?? 450,
  }
}

export const menuItems: MenuItem[] = [
  // Chickens
  makeItem('chickens', 'fried-chicken', 'Fried Chicken (4 pcs)', 'Crispy golden fried chicken with dipping sauce', 480, 'photo-1562967914-608f82629710', { isFeatured: true, tags: ['fried', 'signature'], views: 642, prepTime: '20 min' }),
  makeItem('chickens', 'grilled-chicken-half', 'Grilled Chicken Half', 'Charcoal-grilled half chicken with spicy butter', 520, 'photo-1532550907401-a500c9a57435', { isSpicy: true, tags: ['grilled', 'spicy'], views: 518, prepTime: '25 min' }),
  makeItem('chickens', 'chicken-wings', 'Chicken Wings (8 pcs)', 'BBQ or spicy glazed wings', 380, 'photo-1527477396000-e27163b481c2', { isSpicy: true, tags: ['bbq', 'spicy'], views: 477, prepTime: '18 min' }),
  makeItem('chickens', 'chicken-burger', 'Chicken Burger', 'Grilled chicken breast, lettuce, mayo, brioche bun', 320, 'photo-1606755962773-d324e0a13086', { tags: ['burger', 'grilled'], views: 389, prepTime: '12 min' }),
  makeItem('chickens', 'chicken-shawarma', 'Chicken Shawarma', 'Wrapped with garlic sauce & pickles', 280, 'photo-1529006557810-1b3b34f3b8b4', { tags: ['shawarma', 'wrap'], views: 411, prepTime: '10 min' }),
  makeItem('chickens', 'chicken-tibs', 'Chicken Tibs', 'Sautéed chicken with onions, jalapeño, injera', 420, 'photo-1547592180-85f173990554', { isSpicy: true, isGlutenFree: true, tags: ['tibs', 'injera'], views: 356, prepTime: '18 min' }),

  // Pizza & Burgers
  makeItem('pizza-burgers', 'margherita-pizza', 'Margherita Pizza', 'Tomato, mozzarella, basil', 350, 'photo-1574071318508-1cdbab80d002', { isVeg: true, tags: ['pizza', 'vegetarian'], views: 429, prepTime: '15 min' }),
  makeItem('pizza-burgers', 'pepperoni-pizza', 'Pepperoni Pizza', 'Classic pepperoni & cheese', 420, 'photo-1565299624946-b28f40a0ae38', { tags: ['pizza', 'pepperoni'], views: 501, prepTime: '15 min' }),
  makeItem('pizza-burgers', 'sunrise-special-pizza', 'Sunrise Special Pizza', 'Chicken, beef, peppers, olives, extra cheese', 520, 'photo-1579751626657-72bc17010498', { isFeatured: true, tags: ['pizza', 'signature'], views: 588, prepTime: '18 min' }),
  makeItem('pizza-burgers', 'beef-burger', 'Beef Burger', 'Grilled beef patty, cheddar, lettuce, tomato', 340, 'photo-1568901346375-23c9450c58cd', { tags: ['burger', 'beef'], views: 472, prepTime: '12 min' }),
  makeItem('pizza-burgers', 'cheese-burger', 'Cheese Burger', 'Double cheddar, caramelized onion', 380, 'photo-1571091718767-18b5b1457add', { tags: ['burger', 'cheese'], views: 398, prepTime: '12 min' }),
  makeItem('pizza-burgers', 'double-decker-burger', 'Double Decker Burger', 'Two patties, bacon, cheese, special sauce', 520, 'photo-1553979459-d2229ba7433b', { isFeatured: true, tags: ['burger', 'signature'], views: 534, prepTime: '16 min' }),
  makeItem('pizza-burgers', 'veggie-burger', 'Veggie Burger', 'Plant-based patty, avocado, aioli', 300, 'photo-1520072959219-c595dc870360', { isVeg: true, tags: ['burger', 'vegetarian'], views: 287, prepTime: '12 min' }),

  // Ethiopian Food
  makeItem('ethiopian', 'doro-wat', 'Doro Wat', 'Spicy chicken stew with boiled egg & injera', 450, 'photo-1601050690597-df0568f70950', { isSpicy: true, isGlutenFree: true, isFeatured: true, tags: ['ethiopian', 'spicy', 'signature'], views: 721, prepTime: '25 min' }),
  makeItem('ethiopian', 'beyaynetu', 'Beyaynetu (Veggie Combo)', 'Assorted lentils, veggies, shiro on injera', 320, 'photo-1512621776951-a57141f2eefd', { isVeg: true, isGlutenFree: true, tags: ['ethiopian', 'vegetarian'], views: 466, prepTime: '18 min' }),
  makeItem('ethiopian', 'kitfo', 'Kitfo', 'Minced beef with mitmita & kibbeh', 480, 'photo-1544025162-d76694265947', { isGlutenFree: true, tags: ['ethiopian', 'beef'], views: 319, prepTime: '18 min' }),
  makeItem('ethiopian', 'beef-tibs', 'Tibs (Beef)', 'Sautéed beef with onions, peppers, injera', 420, 'photo-1547592180-85f173990554', { isSpicy: true, isGlutenFree: true, tags: ['ethiopian', 'tibs'], views: 382, prepTime: '18 min' }),
  makeItem('ethiopian', 'shiro', 'Shiro', 'Chickpea stew with garlic & injera', 220, 'photo-1601050690117-94f5f6fa8bd7', { isVeg: true, isGlutenFree: true, tags: ['ethiopian', 'vegetarian'], views: 508, prepTime: '15 min' }),
  makeItem('ethiopian', 'firfir', 'Firfir', 'Shredded injera in spicy berbere sauce', 200, 'photo-1547592180-85f173990554', { isVeg: true, isSpicy: true, isGlutenFree: true, tags: ['ethiopian', 'spicy'], views: 356, prepTime: '15 min' }),
  makeItem('ethiopian', 'gored-gored', 'Gored Gored', 'Cubed raw/rare beef with awaze', 500, 'photo-1544025162-d76694265947', { isSpicy: true, isGlutenFree: true, tags: ['ethiopian', 'spicy'], views: 248, prepTime: '20 min' }),
  makeItem('ethiopian', 'chechebsa', 'Chechebsa', 'Torn kita with berbere & kibbeh', 180, 'photo-1504674900247-0877df9cc836', { isSpicy: true, isGlutenFree: true, tags: ['ethiopian', 'kibbeh'], views: 274, prepTime: '15 min' }),

  // Cakes
  makeItem('cakes', 'chocolate-cake', 'Chocolate Cake (slice)', 'Rich moist chocolate with ganache', 150, 'photo-1578985545062-69928b1d9587', { isVeg: true, isFeatured: true, tags: ['cake', 'vegetarian'], views: 604, prepTime: '5 min' }),
  makeItem('cakes', 'red-velvet', 'Red Velvet (slice)', 'Cream cheese frosting', 170, 'photo-1586985289688-ca3cf47d3e6e', { isVeg: true, tags: ['cake', 'vegetarian'], views: 433, prepTime: '5 min' }),
  makeItem('cakes', 'cheesecake', 'Cheesecake (slice)', 'New York style with berry coulis', 180, 'photo-1533134242443-d4fd215305ad', { isVeg: true, tags: ['cake', 'vegetarian'], views: 486, prepTime: '5 min' }),
  makeItem('cakes', 'black-forest', 'Black Forest (slice)', 'Cherry, cream, chocolate shavings', 160, 'photo-1551024506-0bccd828d307', { isVeg: true, tags: ['cake', 'chocolate'], views: 377, prepTime: '5 min' }),
  makeItem('cakes', 'carrot-cake', 'Carrot Cake (slice)', 'Walnuts & cream cheese frosting', 150, 'photo-1621303837174-89787a7d4729', { isVeg: true, tags: ['cake', 'vegetarian'], views: 298, prepTime: '5 min' }),
  makeItem('cakes', 'celebration-cake', 'Whole Celebration Cake (1kg)', 'Custom flavor (24h pre-order)', 1200, 'photo-1578985545062-69928b1d9587', { isVeg: true, isFeatured: true, tags: ['cake', 'pre-order'], views: 519, prepTime: '24 hr pre-order' }),
  makeItem('cakes', 'cupcake', 'Cupcake', 'Vanilla / chocolate / red velvet', 80, 'photo-1519869325930-281384150729', { isVeg: true, tags: ['cupcake', 'vegetarian'], views: 265, prepTime: '5 min' }),

  // Juice
  makeItem('juice', 'avocado-juice', 'Avocado Juice', 'Fresh creamy avocado with honey', 120, 'photo-1622597467836-f3285f2131b8', { isVeg: true, isGlutenFree: true, tags: ['juice', 'avocado'], views: 343, prepTime: '8 min' }),
  makeItem('juice', 'mango-juice', 'Mango Juice', 'Fresh seasonal mango', 100, 'photo-1557800636-894a64c1696f', { isVeg: true, isGlutenFree: true, isFeatured: true, tags: ['juice', 'mango'], views: 481, prepTime: '7 min' }),
  makeItem('juice', 'papaya-juice', 'Papaya Juice', 'Sweet ripe papaya', 100, 'photo-1595981267035-7b04ca84a82d', { isVeg: true, isGlutenFree: true, tags: ['juice', 'papaya'], views: 256, prepTime: '7 min' }),
  makeItem('juice', 'orange-juice', 'Orange Juice', 'Freshly squeezed', 90, 'photo-1547517138-6357f4af7d5e', { isVeg: true, isGlutenFree: true, tags: ['juice', 'orange'], views: 314, prepTime: '7 min' }),
  makeItem('juice', 'mixed-fruit-spris', 'Mixed Fruit Juice (Spris)', 'Layered avocado, mango, papaya', 150, 'photo-1546173159-315724a31696', { isVeg: true, isGlutenFree: true, isFeatured: true, tags: ['juice', 'signature'], views: 552, prepTime: '10 min' }),
  makeItem('juice', 'pineapple-juice', 'Pineapple Juice', 'Fresh tropical', 110, 'photo-1589733955941-7c5b6f2f2c95', { isVeg: true, isGlutenFree: true, tags: ['juice', 'pineapple'], views: 272, prepTime: '7 min' }),
  makeItem('juice', 'beetroot-carrot', 'Beetroot & Carrot', 'Healthy detox blend', 120, 'photo-1547592180-85f173990554', { isVeg: true, isGlutenFree: true, tags: ['juice', 'healthy'], views: 238, prepTime: '8 min' }),

  // Hot Drinks
  makeItem('hot-drinks', 'ethiopian-coffee', 'Ethiopian Coffee (Buna)', 'Traditional jebena coffee, single', 60, 'photo-1495474472287-4d71bcdd2085', { isVeg: true, isGlutenFree: true, isFeatured: true, tags: ['coffee', 'signature'], views: 698, prepTime: '8 min' }),
  makeItem('hot-drinks', 'macchiato', 'Macchiato', 'Espresso with steamed milk', 70, 'photo-1509042239860-f550ce710b93', { isVeg: true, isGlutenFree: true, tags: ['coffee'], views: 329, prepTime: '5 min' }),
  makeItem('hot-drinks', 'cappuccino', 'Cappuccino', 'Espresso, foam, cocoa dust', 90, 'photo-1572442388796-11668a67e53d', { isVeg: true, isGlutenFree: true, tags: ['coffee'], views: 441, prepTime: '5 min' }),
  makeItem('hot-drinks', 'latte', 'Latte', 'Smooth espresso + milk', 90, 'photo-1461023058943-07fcbe16d735', { isVeg: true, isGlutenFree: true, tags: ['coffee'], views: 387, prepTime: '5 min' }),
  makeItem('hot-drinks', 'hot-chocolate', 'Hot Chocolate', 'Rich cocoa with cream', 100, 'photo-1542990253-0d0f5be5f0ed', { isVeg: true, isGlutenFree: true, tags: ['cocoa', 'sweet'], views: 274, prepTime: '6 min' }),
  makeItem('hot-drinks', 'black-tea', 'Black Tea', 'Lipton / local shai', 40, 'photo-1597318181409-cf64d0b5d8a2', { isVeg: true, isGlutenFree: true, tags: ['tea'], views: 196, prepTime: '5 min' }),
  makeItem('hot-drinks', 'spiced-tea', 'Spiced Tea (Shai)', 'Cinnamon, cardamom, clove', 50, 'photo-1576092768241-dec231879fc3', { isVeg: true, isGlutenFree: true, tags: ['tea', 'spiced'], views: 284, prepTime: '7 min' }),
  makeItem('hot-drinks', 'ginger-tea', 'Ginger Tea', 'Fresh ginger & honey', 60, 'photo-1594631252845-29fc4cc8cde9', { isVeg: true, isGlutenFree: true, tags: ['tea', 'ginger'], views: 218, prepTime: '7 min' }),
  makeItem('hot-drinks', 'hot-lemon', 'Hot Lemon', 'Lemon, honey, warm water', 60, 'photo-1523677011781-91d1f2e513ca', { isVeg: true, isGlutenFree: true, tags: ['lemon', 'warm'], views: 177, prepTime: '5 min' }),

  // Cold Drinks
  makeItem('cold-drinks', 'iced-coffee', 'Iced Coffee', 'Cold brew over ice', 100, 'photo-1461023058943-07fcbe16d735', { isVeg: true, isGlutenFree: true, tags: ['cold', 'coffee'], views: 426, prepTime: '5 min' }),
  makeItem('cold-drinks', 'iced-latte', 'Iced Latte', 'Espresso, milk, ice', 110, 'photo-1461023058943-07fcbe16d735', { isVeg: true, isGlutenFree: true, isFeatured: true, tags: ['cold', 'coffee'], views: 512, prepTime: '5 min' }),
  makeItem('cold-drinks', 'iced-macchiato', 'Iced Macchiato', 'Layered cold espresso & milk', 110, 'photo-1495474472287-4d71bcdd2085', { isVeg: true, isGlutenFree: true, tags: ['cold', 'coffee'], views: 364, prepTime: '5 min' }),
  makeItem('cold-drinks', 'frappuccino', 'Frappuccino', 'Blended coffee, cream, chocolate drizzle', 140, 'photo-1461023058943-07fcbe16d735', { isVeg: true, isGlutenFree: true, tags: ['cold', 'blended'], views: 473, prepTime: '7 min' }),
  makeItem('cold-drinks', 'cold-chocolate', 'Cold Chocolate', 'Chilled cocoa with whipped cream', 120, 'photo-1542990253-0d0f5be5f0ed', { isVeg: true, isGlutenFree: true, tags: ['cold', 'cocoa'], views: 309, prepTime: '5 min' }),
  makeItem('cold-drinks', 'iced-tea', 'Iced Tea (Lemon / Peach)', 'Refreshing cold tea', 90, 'photo-1556679343-c7306c1976bc', { isVeg: true, isGlutenFree: true, tags: ['cold', 'tea'], views: 245, prepTime: '5 min' }),
  makeItem('cold-drinks', 'smoothie', 'Smoothie (Berry / Banana)', 'Yogurt-based, fresh fruit', 150, 'photo-1553530666-ba11a7da3888', { isVeg: true, isGlutenFree: true, tags: ['cold', 'smoothie'], views: 331, prepTime: '7 min' }),

  // Soft Drinks
  makeItem('soft-drinks', 'coca-cola', 'Coca-Cola (300ml)', 'Chilled bottle', 50, 'photo-1622483767028-3f66f32aef97', { isVeg: true, isGlutenFree: true, tags: ['soft drink'], views: 389, prepTime: '2 min' }),
  makeItem('soft-drinks', 'sprite', 'Sprite (300ml)', 'Chilled bottle', 50, 'photo-1629203851122-3726ecdf080e', { isVeg: true, isGlutenFree: true, tags: ['soft drink'], views: 342, prepTime: '2 min' }),
  makeItem('soft-drinks', 'fanta-orange', 'Fanta Orange (300ml)', 'Chilled bottle', 50, 'photo-1621506289937-a8e4df240d0b', { isVeg: true, isGlutenFree: true, tags: ['soft drink'], views: 287, prepTime: '2 min' }),
  makeItem('soft-drinks', 'mirinda', 'Mirinda (300ml)', 'Chilled bottle', 50, 'photo-1613218222872-954978a220d1', { isVeg: true, isGlutenFree: true, tags: ['soft drink'], views: 263, prepTime: '2 min' }),
  makeItem('soft-drinks', 'pepsi', 'Pepsi (300ml)', 'Chilled bottle', 50, 'photo-1581636625402-29b2a704ef131', { isVeg: true, isGlutenFree: true, tags: ['soft drink'], views: 314, prepTime: '2 min' }),
  makeItem('soft-drinks', 'ambo-water', 'Ambo Sparkling Water', 'Ethiopian mineral water', 40, 'photo-1523362628745-0c100150b504', { isVeg: true, isGlutenFree: true, tags: ['water'], views: 218, prepTime: '2 min' }),
  makeItem('soft-drinks', 'bottled-water', 'Bottled Water (500ml)', 'Still mineral water', 30, 'photo-1602143407151-7111542de6e8', { isVeg: true, isGlutenFree: true, tags: ['water'], views: 191, prepTime: '2 min' }),
  makeItem('soft-drinks', 'fresh-lemonade', 'Fresh Lemonade', 'Homemade, mint & lemon', 80, 'photo-1523677011781-91d1f2e513ca', { isVeg: true, isGlutenFree: true, isFeatured: true, tags: ['fresh', 'lemon'], views: 355, prepTime: '5 min' }),
]

export const testimonials = [
  { quote: 'The kind of breakfast you keep thinking about on the walk home.', author: '— A Bole Atlas regular' },
  { quote: 'Fresh, generous and full of flavor. Addis has a new favorite.', author: '— Sunrise Cafe guest' },
]
