from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid

from models import (
    UserCreate, User, UserLogin, UserResponse,
    BrandCreate, Brand,
    ProductCreate, Product, ProductSpecification,
    CategoryCreate, Category,
    AddToCartRequest, Cart, CartItem,
    Wishlist,
    ReviewCreate, Review,
    OrderCreate, Order,
    DashboardStats,
    MenuItem, SettingsCreate, Settings,
    PageCreate, Page
)
from auth_utils import verify_password, get_password_hash, create_access_token
from dependencies import get_current_user, get_current_admin_user

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== AUTHENTICATION ENDPOINTS ====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = user_data.dict()
    hashed_password = get_password_hash(user_dict.pop("password"))
    
    new_user = User(**user_dict)
    user_to_save = new_user.dict()
    user_to_save["password"] = hashed_password
    
    await db.users.insert_one(user_to_save)
    
    return UserResponse(**new_user.dict())


@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user["id"],
            email=user["email"],
            firstName=user["firstName"],
            lastName=user["lastName"],
            role=user["role"]
        )
    }


@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(authorization: Optional[str] = Header(None)):
    """Get current user"""
    current_user = await get_current_user(authorization, db)
    return UserResponse(**current_user)


# ==================== PRODUCT ENDPOINTS ====================

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    brandId: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """Get all products with optional filtering"""
    query = {}
    
    if category:
        query["category"] = category
    
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    if minPrice is not None or maxPrice is not None:
        query["price"] = {}
        if minPrice is not None:
            query["price"]["$gte"] = minPrice
        if maxPrice is not None:
            query["price"]["$lte"] = maxPrice
    
    if brandId:
        query["brandId"] = brandId
    
    # Sort by createdAt descending (newest first)
    products = await db.products.find(query, {"_id": 0}).sort("createdAt", -1).skip(skip).limit(limit).to_list(limit)
    return [Product(**product) for product in products]


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get product by ID"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)


@api_router.post("/products", response_model=Product)
async def create_product(
    product: ProductCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new product (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_product = Product(**product.dict())
    await db.products.insert_one(new_product.dict())
    
    # Update category item count
    await db.categories.update_one(
        {"name": product.category},
        {"$inc": {"itemCount": 1}}
    )
    
    return new_product


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product: ProductCreate,
    authorization: Optional[str] = Header(None)
):
    """Update a product (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing_product = await db.products.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = product.dict()
    updated_product["updatedAt"] = datetime.utcnow()
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": updated_product}
    )
    
    updated_product["id"] = product_id
    updated_product["createdAt"] = existing_product["createdAt"]
    
    return Product(**updated_product)


@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a product (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.products.delete_one({"id": product_id})
    
    # Update category item count
    await db.categories.update_one(
        {"name": product["category"]},
        {"$inc": {"itemCount": -1}}
    )
    
    return {"message": "Product deleted successfully"}


# ==================== REVIEWS ENDPOINTS ====================

@api_router.post("/products/{product_id}/reviews", response_model=Review)
async def create_review(product_id: str, review: ReviewCreate):
    """Create a review for a product"""
    # Check if product exists
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if user already reviewed this product (based on email)
    existing_review = await db.reviews.find_one({
        "productId": product_id,
        "userEmail": review.userEmail
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="Ai lăsat deja o recenzie pentru acest produs")
    
    # Validate rating
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Create review
    new_review = Review(**review.dict())
    await db.reviews.insert_one(new_review.dict())
    
    # Recalculate product rating
    all_reviews = await db.reviews.find({"productId": product_id}, {"_id": 0}).to_list(1000)
    avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
    
    # Update product rating and review count
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"rating": round(avg_rating, 1), "reviews": len(all_reviews)}}
    )
    
    return new_review


@api_router.get("/products/{product_id}/reviews", response_model=List[Review])
async def get_product_reviews(product_id: str):
    """Get all reviews for a product"""
    reviews = await db.reviews.find({"productId": product_id}, {"_id": 0}).sort("createdAt", -1).to_list(100)
    return [Review(**review) for review in reviews]


# ==================== CATEGORY ENDPOINTS ====================

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories with product count"""
    categories = await db.categories.find().to_list(100)
    
    # Count products for each category
    for category in categories:
        # Count products where category matches the category name
        product_count = await db.products.count_documents({"category": category["name"]})
        category["itemCount"] = product_count
    
    return [Category(**cat) for cat in categories]


@api_router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: str):
    """Get category by ID"""
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return Category(**category)


@api_router.post("/categories", response_model=Category)
async def create_category(
    category: CategoryCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new category (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if category already exists
    existing = await db.categories.find_one({"slug": category.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    new_category = Category(**category.dict())
    await db.categories.insert_one(new_category.dict())
    
    return new_category


@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(
    category_id: str,
    category: CategoryCreate,
    authorization: Optional[str] = Header(None)
):
    """Update a category (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing_category = await db.categories.find_one({"id": category_id})
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.categories.update_one(
        {"id": category_id},
        {"$set": category.dict()}
    )
    
    updated_category = category.dict()
    updated_category["id"] = category_id
    updated_category["createdAt"] = existing_category["createdAt"]
    
    return Category(**updated_category)


@api_router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a category (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.categories.delete_one({"id": category_id})
    
    return {"message": "Category deleted successfully"}


# ==================== BRANDS ENDPOINTS ====================

@api_router.get("/brands", response_model=List[Brand])
async def get_brands():
    """Get all brands"""
    brands = await db.brands.find({}, {"_id": 0}).to_list(100)
    return [Brand(**brand) for brand in brands]


@api_router.get("/brands/{brand_id}", response_model=Brand)
async def get_brand(brand_id: str):
    """Get brand by ID"""
    brand = await db.brands.find_one({"id": brand_id}, {"_id": 0})
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return Brand(**brand)


@api_router.post("/brands", response_model=Brand)
async def create_brand(
    brand: BrandCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new brand (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if brand already exists
    existing = await db.brands.find_one({"name": brand.name})
    if existing:
        raise HTTPException(status_code=400, detail="Brand already exists")
    
    new_brand = Brand(**brand.dict())
    await db.brands.insert_one(new_brand.dict())
    
    return new_brand


@api_router.put("/brands/{brand_id}", response_model=Brand)
async def update_brand(
    brand_id: str,
    brand: BrandCreate,
    authorization: Optional[str] = Header(None)
):
    """Update a brand (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing_brand = await db.brands.find_one({"id": brand_id})
    if not existing_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    await db.brands.update_one(
        {"id": brand_id},
        {"$set": brand.dict()}
    )
    
    updated_brand = await db.brands.find_one({"id": brand_id}, {"_id": 0})
    return Brand(**updated_brand)


@api_router.delete("/brands/{brand_id}")
async def delete_brand(
    brand_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a brand (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing_brand = await db.brands.find_one({"id": brand_id})
    if not existing_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    await db.brands.delete_one({"id": brand_id})
    
    return {"message": "Brand deleted successfully"}


# ==================== CART ENDPOINTS ====================

@api_router.get("/cart", response_model=Cart)
async def get_cart(authorization: Optional[str] = Header(None)):
    """Get user cart"""
    current_user = await get_current_user(authorization, db)
    
    cart = await db.carts.find_one({"userId": current_user["id"]})
    if not cart:
        # Create empty cart
        new_cart = Cart(userId=current_user["id"])
        await db.carts.insert_one(new_cart.dict())
        return new_cart
    
    return Cart(**cart)


@api_router.post("/cart/add")
async def add_to_cart(
    item: AddToCartRequest,
    authorization: Optional[str] = Header(None)
):
    """Add item to cart"""
    current_user = await get_current_user(authorization, db)
    
    # Get product
    product = await db.products.find_one({"id": item.productId})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create cart
    cart = await db.carts.find_one({"userId": current_user["id"]})
    if not cart:
        cart = Cart(userId=current_user["id"]).dict()
        await db.carts.insert_one(cart)
    
    # Add item to cart
    cart_item = CartItem(
        productId=item.productId,
        quantity=item.quantity,
        selectedSize=item.selectedSize,
        selectedColor=item.selectedColor,
        price=product["price"]
    )
    
    # Check if item already exists
    items = cart.get("items", [])
    found = False
    for i, existing_item in enumerate(items):
        if (existing_item["productId"] == item.productId and
            existing_item.get("selectedSize") == item.selectedSize and
            existing_item.get("selectedColor") == item.selectedColor):
            items[i]["quantity"] += item.quantity
            found = True
            break
    
    if not found:
        items.append(cart_item.dict())
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in items)
    
    await db.carts.update_one(
        {"userId": current_user["id"]},
        {"$set": {"items": items, "total": total, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Item added to cart"}


@api_router.put("/cart/update")
async def update_cart_item(
    productId: str,
    quantity: int,
    selectedSize: Optional[str] = None,
    selectedColor: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Update cart item quantity"""
    current_user = await get_current_user(authorization, db)
    
    cart = await db.carts.find_one({"userId": current_user["id"]})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = cart.get("items", [])
    for item in items:
        if (item["productId"] == productId and
            item.get("selectedSize") == selectedSize and
            item.get("selectedColor") == selectedColor):
            item["quantity"] = quantity
            break
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in items)
    
    await db.carts.update_one(
        {"userId": current_user["id"]},
        {"$set": {"items": items, "total": total, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Cart updated"}


@api_router.delete("/cart/remove/{product_id}")
async def remove_from_cart(
    product_id: str,
    selectedSize: Optional[str] = None,
    selectedColor: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Remove item from cart"""
    current_user = await get_current_user(authorization, db)
    
    cart = await db.carts.find_one({"userId": current_user["id"]})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = cart.get("items", [])
    items = [
        item for item in items
        if not (item["productId"] == product_id and
                item.get("selectedSize") == selectedSize and
                item.get("selectedColor") == selectedColor)
    ]
    
    # Calculate total
    total = sum(item["price"] * item["quantity"] for item in items)
    
    await db.carts.update_one(
        {"userId": current_user["id"]},
        {"$set": {"items": items, "total": total, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Item removed from cart"}


@api_router.delete("/cart/clear")
async def clear_cart(authorization: Optional[str] = Header(None)):
    """Clear cart"""
    current_user = await get_current_user(authorization, db)
    
    await db.carts.update_one(
        {"userId": current_user["id"]},
        {"$set": {"items": [], "total": 0.0, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Cart cleared"}


# ==================== WISHLIST ENDPOINTS ====================

@api_router.get("/wishlist", response_model=Wishlist)
async def get_wishlist(authorization: Optional[str] = Header(None)):
    """Get user wishlist"""
    current_user = await get_current_user(authorization, db)
    
    wishlist = await db.wishlists.find_one({"userId": current_user["id"]})
    if not wishlist:
        new_wishlist = Wishlist(userId=current_user["id"])
        await db.wishlists.insert_one(new_wishlist.dict())
        return new_wishlist
    
    return Wishlist(**wishlist)


@api_router.post("/wishlist/add/{product_id}")
async def add_to_wishlist(
    product_id: str,
    authorization: Optional[str] = Header(None)
):
    """Add product to wishlist"""
    current_user = await get_current_user(authorization, db)
    
    # Check if product exists
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create wishlist
    wishlist = await db.wishlists.find_one({"userId": current_user["id"]})
    if not wishlist:
        wishlist = Wishlist(userId=current_user["id"]).dict()
        await db.wishlists.insert_one(wishlist)
    
    # Add product to wishlist
    products = wishlist.get("products", [])
    if product_id not in products:
        products.append(product_id)
    
    await db.wishlists.update_one(
        {"userId": current_user["id"]},
        {"$set": {"products": products}}
    )
    
    return {"message": "Product added to wishlist"}


@api_router.delete("/wishlist/remove/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    authorization: Optional[str] = Header(None)
):
    """Remove product from wishlist"""
    current_user = await get_current_user(authorization, db)
    
    wishlist = await db.wishlists.find_one({"userId": current_user["id"]})
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    
    products = wishlist.get("products", [])
    if product_id in products:
        products.remove(product_id)
    
    await db.wishlists.update_one(
        {"userId": current_user["id"]},
        {"$set": {"products": products}}
    )
    
    return {"message": "Product removed from wishlist"}


# ==================== ORDER ENDPOINTS ====================

@api_router.get("/orders", response_model=List[Order])
async def get_user_orders(authorization: Optional[str] = Header(None)):
    """Get user orders"""
    current_user = await get_current_user(authorization, db)
    
    orders = await db.orders.find({"userId": current_user["id"]}).to_list(100)
    return [Order(**order) for order in orders]


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    authorization: Optional[str] = Header(None)
):
    """Get order by ID"""
    current_user = await get_current_user(authorization, db)
    
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if user owns the order or is admin
    if order["userId"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return Order(**order)


@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate):
    """Create a new order (guest or authenticated)"""
    # Create order
    new_order = Order(**order_data.dict())
    
    await db.orders.insert_one(new_order.dict(exclude={'_id'}))
    
    # Update product sold count and available stock
    for item in order_data.items:
        await db.products.update_one(
            {"id": item.productId},
            {
                "$inc": {
                    "sold": item.quantity,
                    "available": -item.quantity
                }
            }
        )
    
    return new_order


# ==================== ADMIN ORDER ENDPOINTS ====================

@api_router.get("/admin/orders", response_model=List[Order])
async def get_all_orders(authorization: Optional[str] = Header(None)):
    """Get all orders (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    return [Order(**order) for order in orders]


@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    authorization: Optional[str] = Header(None)
):
    """Update order status (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Order status updated"}


# ==================== ADMIN USER ENDPOINTS ====================

@api_router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(authorization: Optional[str] = Header(None)):
    """Get all users (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    users = await db.users.find().to_list(1000)
    return [UserResponse(**user) for user in users]


@api_router.get("/admin/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    authorization: Optional[str] = Header(None)
):
    """Get user by ID (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**user)


@api_router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete user (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.users.delete_one({"id": user_id})
    
    return {"message": "User deleted successfully"}


# ==================== ADMIN DASHBOARD ENDPOINTS ====================

@api_router.get("/admin/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(authorization: Optional[str] = Header(None)):
    """Get dashboard statistics (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_users = await db.users.count_documents({})
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    low_stock_products = await db.products.count_documents({"available": {"$lt": 10}})
    
    # Calculate total revenue
    orders = await db.orders.find().to_list(10000)
    total_revenue = sum(order.get("total", 0) for order in orders)
    
    return DashboardStats(
        totalUsers=total_users,
        totalProducts=total_products,
        totalOrders=total_orders,
        totalRevenue=total_revenue,
        pendingOrders=pending_orders,
        lowStockProducts=low_stock_products
    )


# ==================== SETTINGS ENDPOINTS ====================

@api_router.get("/settings")
async def get_settings():
    """Get site settings (menu configuration)"""
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default empty settings
        default_settings = Settings(
            menuItems=[],
            categoryMenuItems=[]
        )
        return default_settings
    return Settings(**settings)


@api_router.post("/settings")
async def save_settings(
    settings_data: SettingsCreate,
    authorization: Optional[str] = Header(None)
):
    """Save site settings (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if settings exist
    existing_settings = await db.settings.find_one({})
    
    settings_dict = settings_data.dict()
    settings_dict["updatedAt"] = datetime.utcnow()
    
    if existing_settings:
        # Update existing
        settings_dict["id"] = existing_settings.get("id", str(uuid.uuid4()))
        await db.settings.update_one(
            {"id": settings_dict["id"]},
            {"$set": settings_dict}
        )
    else:
        # Create new
        settings_dict["id"] = str(uuid.uuid4())
        await db.settings.insert_one(settings_dict)
    
    return {"message": "Settings saved successfully"}


# ==================== PAGES ENDPOINTS ====================

@api_router.get("/pages", response_model=List[Page])
async def get_pages(published_only: bool = False):
    """Get all pages"""
    query = {}
    if published_only:
        query["isPublished"] = True
    
    pages = await db.pages.find(query, {"_id": 0}).to_list(100)
    return [Page(**page) for page in pages]


@api_router.get("/pages/{page_id}", response_model=Page)
async def get_page(page_id: str):
    """Get page by ID"""
    page = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return Page(**page)


@api_router.get("/pages/slug/{slug}", response_model=Page)
async def get_page_by_slug(slug: str):
    """Get page by slug"""
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return Page(**page)


@api_router.post("/pages", response_model=Page)
async def create_page(
    page_data: PageCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new page (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if slug already exists
    existing = await db.pages.find_one({"slug": page_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Page with this slug already exists")
    
    new_page = Page(**page_data.dict())
    await db.pages.insert_one(new_page.dict())
    
    return new_page


@api_router.put("/pages/{page_id}", response_model=Page)
async def update_page(
    page_id: str,
    page_data: PageCreate,
    authorization: Optional[str] = Header(None)
):
    """Update a page (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing_page = await db.pages.find_one({"id": page_id})
    if not existing_page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    updated_page = page_data.dict()
    updated_page["updatedAt"] = datetime.utcnow()
    
    await db.pages.update_one(
        {"id": page_id},
        {"$set": updated_page}
    )
    
    updated_page["id"] = page_id
    updated_page["createdAt"] = existing_page["createdAt"]
    
    return Page(**updated_page)


@api_router.delete("/pages/{page_id}")
async def delete_page(
    page_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a page (admin only)"""
    current_user = await get_current_user(authorization, db)
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    page = await db.pages.find_one({"id": page_id})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    await db.pages.delete_one({"id": page_id})
    
    return {"message": "Page deleted successfully"}


@api_router.get("/")
async def root():
    return {"message": "Sellzy eCommerce API"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
