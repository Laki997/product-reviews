import { PrismaClient, Review } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  console.log("🧹 Cleared existing data");

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "iPhone 15 Pro",
        description:
          "Latest iPhone with titanium design and advanced camera system",
        price: 999.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "MacBook Air M2",
        description:
          "Ultra-thin laptop with Apple M2 chip for incredible performance",
        price: 1199.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sony WH-1000XM5",
        description: "Premium noise-cancelling wireless headphones",
        price: 349.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Nike Air Max 270",
        description: "Comfortable running shoes with Air Max technology",
        price: 129.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Galaxy S24",
        description: "Android flagship with AI features and excellent camera",
        price: 899.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Dell XPS 13",
        description: "Premium Windows laptop with InfinityEdge display",
        price: 1099.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Apple Watch Series 9",
        description: "Smartwatch with health monitoring and fitness tracking",
        price: 399.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Canon EOS R6",
        description:
          "Full-frame mirrorless camera for professional photography",
        price: 2499.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Bose QuietComfort 45",
        description:
          "Premium wireless headphones with world-class noise cancellation",
        price: 329.99,
      },
    }),
    prisma.product.create({
      data: {
        name: "Adidas Ultraboost 22",
        description:
          "High-performance running shoes with responsive cushioning",
        price: 189.99,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  const reviews: Review[] = [];

  for (const product of products) {
    const reviewCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < reviewCount; i++) {
      const review = await prisma.review.create({
        data: {
          productId: product.id,
          firstName: getRandomFirstName(),
          lastName: getRandomLastName(),
          reviewText: getRandomReviewText(product.name),
          rating: Math.floor(Math.random() * 5) + 1, // 1-5 rating
        },
      });
      reviews.push(review);
    }
  }

  console.log(`✅ Created ${reviews.length} reviews`);

  const productCount = await prisma.product.count();
  const reviewCount = await prisma.review.count();

  console.log("\n📊 Database Statistics:");
  console.log(`Products: ${productCount}`);
  console.log(`Reviews: ${reviewCount}`);
  console.log(
    `Average reviews per product: ${(reviewCount / productCount).toFixed(1)}`
  );

  console.log("\n🎉 Seeding completed successfully!");
}

function getRandomFirstName(): string {
  const firstNames = [
    "John",
    "Jane",
    "Mike",
    "Sarah",
    "David",
    "Emily",
    "Chris",
    "Lisa",
    "Alex",
    "Maria",
    "Tom",
    "Anna",
    "James",
    "Emma",
    "Robert",
    "Sophie",
    "Michael",
    "Olivia",
    "William",
    "Ava",
    "Daniel",
    "Isabella",
    "Matthew",
    "Mia",
  ];
  return firstNames[Math.floor(Math.random() * firstNames.length)]!;
}

function getRandomLastName(): string {
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ];
  return lastNames[Math.floor(Math.random() * lastNames.length)]!;
}

function getRandomReviewText(productName: string): string {
  const positiveReviews = [
    `Great product! ${productName} exceeded my expectations.`,
    `Absolutely love this ${productName}. Highly recommended!`,
    `Excellent quality and performance. ${productName} is worth every penny.`,
    `Amazing ${productName}! I use it every day and it works perfectly.`,
    `Best purchase I've made this year. ${productName} is fantastic.`,
    `Incredible ${productName}. The quality is outstanding.`,
    `Perfect ${productName}! Exactly what I was looking for.`,
    `Outstanding product. ${productName} delivers on all promises.`,
  ];

  const neutralReviews = [
    `Good ${productName}. It does what it's supposed to do.`,
    `Decent product. ${productName} meets my basic needs.`,
    `Okay ${productName}. Nothing special but gets the job done.`,
    `Average ${productName}. It's functional but could be better.`,
    `Fair ${productName}. Reasonable for the price.`,
  ];

  const negativeReviews = [
    `Disappointed with this ${productName}. Not worth the money.`,
    `Poor quality ${productName}. Would not recommend.`,
    `Terrible ${productName}. Broke after a few days.`,
    `Avoid this ${productName}. Complete waste of money.`,
    `Bad ${productName}. Doesn't work as advertised.`,
  ];

  const allReviews = [
    ...positiveReviews,
    ...neutralReviews,
    ...negativeReviews,
  ];
  return allReviews[Math.floor(Math.random() * allReviews.length)]!;
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
