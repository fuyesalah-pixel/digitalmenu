import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { categories, menuItems, restaurant } from '../src/lib/data'
import { RESERVED_CATEGORY_SLUGS } from '../src/lib/validation'

const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 'primary' },
    update: { name: restaurant.name, tagline: restaurant.tagline, address: restaurant.address, phone: restaurant.phone, email: restaurant.email, logo: restaurant.logo, primaryColor: restaurant.primaryColor },
    create: { id: 'primary', name: restaurant.name, tagline: restaurant.tagline, address: restaurant.address, phone: restaurant.phone, email: restaurant.email, logo: restaurant.logo, primaryColor: restaurant.primaryColor },
  })

  const password = await bcrypt.hash('sky123', 10)
  await prisma.user.upsert({
    where: { email: 'skyrise@hotel.com' },
    update: { password, role: 'ADMIN' },
    create: { email: 'skyrise@hotel.com', password, role: 'ADMIN' },
  })

  const fixedCategories = categories.filter((item) => item.id !== 'all')
  for (const category of fixedCategories) {
    if (RESERVED_CATEGORY_SLUGS.has(category.slug)) throw new Error(`Reserved category slug: ${category.slug}`)
  }
  const fixedSlugs = fixedCategories.map((category) => category.slug)
  await prisma.category.deleteMany({ where: { slug: { notIn: fixedSlugs } } })
  for (const [index, category] of fixedCategories.entries()) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon, displayOrder: category.displayOrder, isActive: true },
      create: { name: category.name, slug: category.slug, icon: category.icon, displayOrder: category.displayOrder, isActive: true },
    })
    for (const item of menuItems.filter((entry) => entry.categoryId === category.id)) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: { name: item.name, description: item.description, price: item.price, imageUrl: item.imageUrl, blurHash: item.blurDataUrl, isVeg: item.isVeg, isSpicy: item.isSpicy, isGlutenFree: item.isGlutenFree, isAvailable: item.isAvailable, isFeatured: item.isFeatured, views: item.views, categoryId: saved.id },
        create: { id: item.id, name: item.name, description: item.description, price: item.price, imageUrl: item.imageUrl, blurHash: item.blurDataUrl, isVeg: item.isVeg, isSpicy: item.isSpicy, isGlutenFree: item.isGlutenFree, isAvailable: item.isAvailable, isFeatured: item.isFeatured, views: item.views, categoryId: saved.id },
      })
    }
  }
  console.log(`Seeded ${settings.name} with ${menuItems.length} menu items`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
