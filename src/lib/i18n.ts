export const copy = {
  EN: {
    goodFood: 'Good food,',
    thoughtfully: 'thoughtfully',
    made: 'made.',
    explore: 'Explore the menu',
    story: 'Our story',
    scroll: 'Scroll to explore',
    seasonal: 'Seasonal plates, served nightly',
    menu: 'What’s on the',
    table: 'table.',
    allDishes: 'All dishes',
    noPayment: 'No payment needed',
  },
  HI: {
    goodFood: 'अच्छा खाना,',
    thoughtfully: 'सोच-समझकर',
    made: 'बनाया गया।',
    explore: 'मेन्यू देखें',
    story: 'हमारी कहानी',
    scroll: 'आगे देखने के लिए स्क्रॉल करें',
    seasonal: 'मौसमी व्यंजन, हर शाम',
    menu: 'मेज़ पर क्या',
    table: 'है।',
    allDishes: 'सभी व्यंजन',
    noPayment: 'भुगतान अनिवार्य नहीं',
  },
} as const

export type Language = keyof typeof copy
export const isLanguage = (value: string): value is Language => value === 'EN' || value === 'HI'
