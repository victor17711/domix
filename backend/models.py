from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timezone
import uuid

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str
    role: Optional[str] = "user"  # user, manager, or admin

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    firstName: str
    lastName: str
    role: str = "user"  # user, manager, or admin
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    role: str

# Brand Models
class BrandCreate(BaseModel):
    name: str
    logo: Optional[str] = ""
    description: Optional[str] = ""

class Brand(BrandCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Product Models
class ProductSpecification(BaseModel):
    title: str
    value: str

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    originalPrice: Optional[float] = None
    discount: Optional[int] = 0
    category: str
    brandId: Optional[str] = None
    storeName: Optional[str] = ""
    image: str
    colors: Optional[List[str]] = []
    sizes: Optional[List[str]] = []
    specifications: Optional[List[ProductSpecification]] = []
    rating: Optional[float] = 0.0
    reviews: Optional[int] = 0
    sold: Optional[int] = 0
    available: Optional[int] = 100
    inStock: Optional[bool] = True
    badge: Optional[str] = ""

class Product(ProductCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Category Models
class CategoryCreate(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = ""
    image: Optional[str] = ""
    parentId: Optional[str] = None
    itemCount: Optional[int] = 0

class Category(CategoryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Cart Models
class CartItem(BaseModel):
    productId: str
    quantity: int
    selectedSize: Optional[str] = None
    selectedColor: Optional[str] = None
    price: float

class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    items: List[CartItem] = []
    total: float = 0.0
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class AddToCartRequest(BaseModel):
    productId: str
    quantity: int = 1
    selectedSize: Optional[str] = None
    selectedColor: Optional[str] = None

# Wishlist Models
class Wishlist(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    products: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Review Models
class ReviewCreate(BaseModel):
    productId: str
    userName: str
    userEmail: str
    rating: int  # 1-5
    comment: str

class Review(ReviewCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Order Models
class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: str
    selectedSize: Optional[str] = ""
    selectedColor: Optional[str] = ""

class ShippingAddress(BaseModel):
    fullName: str
    phone: str
    email: str
    address: str
    city: str
    postalCode: Optional[str] = ""
    notes: Optional[str] = ""

class OrderCreate(BaseModel):
    userId: str
    customerEmail: str
    customerName: str
    customerPhone: str
    items: List[OrderItem]
    shippingAddress: ShippingAddress
    totalAmount: float
    status: str = "pending"
    paymentMethod: str = "cash_on_delivery"

class Order(OrderCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Admin Dashboard Models
class DashboardStats(BaseModel):
    totalUsers: int
    totalProducts: int
    totalOrders: int
    totalRevenue: float
    pendingOrders: int
    lowStockProducts: int

# Menu Item Models
class MenuItem(BaseModel):
    id: str
    name: str
    url: str
    type: str  # 'link', 'category', 'page'
    icon: Optional[str] = None
    categoryId: Optional[str] = None
    pageId: Optional[str] = None
    hasChildren: Optional[bool] = None
    children: Optional[List['MenuItem']] = None
    parentId: Optional[str] = None

# Settings Models
class SettingsCreate(BaseModel):
    menuItems: List[MenuItem] = []
    categoryMenuItems: List[MenuItem] = []
    featuredCategoryId: Optional[str] = None

class Settings(SettingsCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Page Models
class PageCreate(BaseModel):
    title: str
    slug: str
    content: str
    isPublished: Optional[bool] = True

class Page(PageCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Rebuild MenuItem model to resolve forward references for recursive children
MenuItem.model_rebuild()
