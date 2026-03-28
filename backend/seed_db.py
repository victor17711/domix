import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from auth_utils import get_password_hash
from models import User, Category, Product
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("Seeding database...")
    
    # Create admin user
    admin_exists = await db.users.find_one({"email": "admin@sellzy.com"})
    if not admin_exists:
        admin = User(
            email="admin@sellzy.com",
            firstName="Admin",
            lastName="User",
            role="admin"
        )
        admin_dict = admin.dict()
        admin_dict["password"] = get_password_hash("admin123")
        await db.users.insert_one(admin_dict)
        print("✓ Admin user created (email: admin@sellzy.com, password: admin123)")
    else:
        print("✓ Admin user already exists")
    
    # Create categories
    categories_data = [
        {"name": "Women's Clothing", "slug": "womens-clothing", "icon": "👗", "itemCount": 0},
        {"name": "Men's Clothing", "slug": "mens-clothing", "icon": "👔", "itemCount": 0},
        {"name": "Kids & Baby Clothing", "slug": "kids-clothing", "icon": "👶", "itemCount": 0},
        {"name": "Lingerie & Sleepwear", "slug": "lingerie", "icon": "🛏️", "itemCount": 0},
        {"name": "Accessories", "slug": "accessories", "icon": "👜", "itemCount": 0},
        {"name": "Jewelry & Watches", "slug": "jewelry", "icon": "⌚", "itemCount": 0}
    ]
    
    for cat_data in categories_data:
        exists = await db.categories.find_one({"slug": cat_data["slug"]})
        if not exists:
            category = Category(**cat_data)
            await db.categories.insert_one(category.dict())
    print(f"✓ {len(categories_data)} categories created")
    
    # Create sample products
    products_data = [
        {
            "name": "Nebulizer Ultracare",
            "description": "High-quality nebulizer for medical use",
            "price": 28.56,
            "originalPrice": 29.56,
            "discount": 10,
            "category": "Women's Clothing",
            "storeName": "Fashion Hub",
            "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
            "colors": ["#9b59b6", "#3498db", "#e74c3c", "#f1c40f"],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "rating": 4.5,
            "reviews": 118,
            "sold": 4,
            "available": 200,
            "inStock": True,
            "badge": "SALES"
        },
        {
            "name": "Radiance Renewal Serum",
            "description": "Premium skincare serum for radiant skin",
            "price": 27.46,
            "originalPrice": 29.99,
            "discount": 15,
            "category": "Women's Clothing",
            "storeName": "Fashion Pro",
            "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
            "colors": ["#9b59b6", "#3498db", "#e74c3c", "#f1c40f"],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "rating": 4.7,
            "reviews": 189,
            "sold": 25,
            "available": 180,
            "inStock": True,
            "badge": "15% OFF"
        },
        {
            "name": "Casual Winter Coat",
            "description": "Warm and stylish winter coat",
            "price": 45.99,
            "originalPrice": 59.99,
            "discount": 23,
            "category": "Men's Clothing",
            "storeName": "Urban Style",
            "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
            "colors": ["#2c3e50", "#34495e", "#7f8c8d"],
            "sizes": ["M", "L", "XL", "XXL"],
            "rating": 4.8,
            "reviews": 245,
            "sold": 42,
            "available": 98,
            "inStock": True,
            "badge": "SALES"
        },
        {
            "name": "Summer Dress Collection",
            "description": "Beautiful summer dress for all occasions",
            "price": 32.99,
            "originalPrice": 45.99,
            "discount": 28,
            "category": "Women's Clothing",
            "storeName": "Trendy Fashion",
            "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
            "colors": ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"],
            "sizes": ["XS", "S", "M", "L", "XL"],
            "rating": 4.9,
            "reviews": 312,
            "sold": 67,
            "available": 133,
            "inStock": True,
            "badge": "15% OFF"
        },
        {
            "name": "Kids Comfort Wear",
            "description": "Comfortable clothing for kids",
            "price": 19.99,
            "originalPrice": 29.99,
            "discount": 33,
            "category": "Kids & Baby Clothing",
            "storeName": "Little Stars",
            "image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400",
            "colors": ["#e74c3c", "#3498db", "#f1c40f"],
            "sizes": ["2Y", "3Y", "4Y", "5Y", "6Y"],
            "rating": 4.7,
            "reviews": 156,
            "sold": 34,
            "available": 166,
            "inStock": True,
            "badge": "SALES"
        },
        {
            "name": "Elegant Watch",
            "description": "Luxury watch with premium design",
            "price": 89.99,
            "originalPrice": 129.99,
            "discount": 31,
            "category": "Jewelry & Watches",
            "storeName": "Time Piece",
            "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
            "colors": ["#2c3e50", "#c0392b", "#f39c12"],
            "sizes": ["One Size"],
            "rating": 4.8,
            "reviews": 423,
            "sold": 89,
            "available": 111,
            "inStock": True,
            "badge": "15% OFF"
        },
        {
            "name": "Leather Handbag",
            "description": "Premium leather handbag",
            "price": 56.99,
            "originalPrice": 79.99,
            "discount": 29,
            "category": "Accessories",
            "storeName": "Bag Collection",
            "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
            "colors": ["#2c3e50", "#8e44ad", "#c0392b"],
            "sizes": ["One Size"],
            "rating": 4.6,
            "reviews": 267,
            "sold": 56,
            "available": 94,
            "inStock": True,
            "badge": "SALES"
        },
        {
            "name": "Bali Underware Bra",
            "description": "Comfortable and stylish underwear",
            "price": 27.46,
            "originalPrice": 29.99,
            "discount": 10,
            "category": "Lingerie & Sleepwear",
            "storeName": "Comfort Wear",
            "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
            "colors": ["#9b59b6", "#3498db", "#e74c3c", "#f1c40f"],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "rating": 4.6,
            "reviews": 189,
            "sold": 15,
            "available": 150,
            "inStock": True,
            "badge": "15% OFF"
        }
    ]
    
    # Create more products by duplicating
    all_products = []
    for i, prod_data in enumerate(products_data):
        for j in range(6):  # Create 6 variations of each product
            product = Product(**prod_data)
            if j > 0:
                product.name = f"{prod_data['name']} {i*6 + j}"
                product.price = round(prod_data['price'] * (0.9 + j * 0.1), 2)
            all_products.append(product.dict())
    
    # Insert products if they don't exist
    existing_products = await db.products.count_documents({})
    if existing_products == 0:
        await db.products.insert_many(all_products)
        print(f"✓ {len(all_products)} products created")
        
        # Update category item counts
        for cat_data in categories_data:
            count = await db.products.count_documents({"category": cat_data["name"]})
            await db.categories.update_one(
                {"slug": cat_data["slug"]},
                {"$set": {"itemCount": count}}
            )
    else:
        print(f"✓ Products already exist ({existing_products} products)")
    
    print("\nDatabase seeded successfully!")
    print("\nAdmin credentials:")
    print("Email: admin@sellzy.com")
    print("Password: admin123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
