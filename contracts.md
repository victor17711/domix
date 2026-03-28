# Sellzy eCommerce - Contracts & Implementation Plan

## Frontend MOCK Implementation (COMPLETED ✓)

### Components Created:
1. **Navbar.jsx** - Top bar + main navigation with search, cart, user account
2. **Footer.jsx** - Complete footer with newsletter, links, contact info
3. **HeroSlider.jsx** - Carousel slider with auto-play
4. **CategoryGrid.jsx** - Category icons grid
5. **ProductCard.jsx** - Product card with wishlist, quick view, colors, sizes
6. **QuickViewModal.jsx** - Product quick view modal
7. **CountdownTimer.jsx** - Countdown timer for deals
8. **AuthModal.jsx** - Login/Register/Forgot Password modals
9. **HomePage.jsx** - Main homepage with all sections

### Context Providers:
1. **CartContext** - Shopping cart management (localStorage)
2. **AuthContext** - User authentication (localStorage - MOCK)

### Mock Data:
- Products (50 items)
- Categories (6 categories)
- Slider data (5 slides)
- Brands (5 brands)

---

## Backend Implementation Plan

### MongoDB Models:

#### 1. User Model
```python
{
    "_id": ObjectId,
    "email": String (unique, required),
    "password": String (hashed, required),
    "firstName": String (required),
    "lastName": String (required),
    "role": String (enum: ["user", "admin"], default: "user"),
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

#### 2. Product Model
```python
{
    "_id": ObjectId,
    "name": String (required),
    "description": String,
    "price": Float (required),
    "originalPrice": Float,
    "discount": Integer,
    "category": String (required),
    "storeName": String,
    "image": String (URL),
    "colors": Array[String],
    "sizes": Array[String],
    "rating": Float,
    "reviews": Integer,
    "sold": Integer,
    "available": Integer,
    "inStock": Boolean,
    "badge": String,
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

#### 3. Category Model
```python
{
    "_id": ObjectId,
    "name": String (required, unique),
    "slug": String (required, unique),
    "icon": String,
    "itemCount": Integer,
    "createdAt": DateTime
}
```

#### 4. Cart Model
```python
{
    "_id": ObjectId,
    "userId": ObjectId (ref: User),
    "items": [{
        "productId": ObjectId (ref: Product),
        "quantity": Integer,
        "selectedSize": String,
        "selectedColor": String,
        "price": Float
    }],
    "total": Float,
    "updatedAt": DateTime
}
```

#### 5. Wishlist Model
```python
{
    "_id": ObjectId,
    "userId": ObjectId (ref: User),
    "products": [ObjectId] (ref: Product),
    "createdAt": DateTime
}
```

#### 6. Order Model
```python
{
    "_id": ObjectId,
    "userId": ObjectId (ref: User),
    "items": [{
        "productId": ObjectId (ref: Product),
        "productName": String,
        "quantity": Integer,
        "selectedSize": String,
        "selectedColor": String,
        "price": Float
    }],
    "total": Float,
    "status": String (enum: ["pending", "processing", "shipped", "delivered", "cancelled"]),
    "shippingAddress": {
        "fullName": String,
        "address": String,
        "city": String,
        "postalCode": String,
        "phone": String
    },
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

### API Endpoints:

#### Authentication Endpoints:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset

#### Product Endpoints:
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

#### Category Endpoints:
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

#### Cart Endpoints:
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

#### Wishlist Endpoints:
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add product to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

#### Order Endpoints:
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)

#### User Endpoints (Admin):
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Admin Dashboard Endpoints:
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/sales` - Get sales data
- `GET /api/admin/dashboard/top-products` - Get top selling products

---

## Admin Panel Structure

### Routes:
- `/admin/login` - Admin login page
- `/admin/dashboard` - Dashboard with statistics
- `/admin/products` - Products management (CRUD)
- `/admin/categories` - Categories management (CRUD)
- `/admin/users` - Users management
- `/admin/orders` - Orders management
- `/admin/settings` - Admin settings

### Admin Dashboard Features:
1. **Dashboard** - Overview with charts and statistics
2. **Products Management** - Add/Edit/Delete products with image upload
3. **Categories Management** - Manage product categories
4. **Users Management** - View/Edit/Delete users
5. **Orders Management** - View orders, update status
6. **Statistics** - Sales charts, top products, revenue

---

## Frontend Integration Changes (After Backend)

### Files to Update:
1. **AuthContext.js** - Replace mock auth with real API calls
2. **CartContext.js** - Integrate with backend cart API
3. **HomePage.jsx** - Fetch products from API instead of mock data
4. **ProductCard.jsx** - Use real product data
5. **All pages** - Replace mock data with API calls

### API Integration:
- Use axios for HTTP requests
- Add authentication token to requests
- Handle loading states
- Handle error states
- Add proper error messages

---

## Next Steps:

### Phase 1: Backend Implementation ✓ (TO DO)
1. Create MongoDB models
2. Implement authentication (JWT)
3. Create all API endpoints
4. Add middleware (auth, error handling)
5. Seed database with initial data

### Phase 2: Admin Panel ✓ (TO DO)
1. Create admin login page
2. Create admin dashboard layout
3. Implement products management
4. Implement categories management
5. Implement users management
6. Implement orders management
7. Add charts and statistics

### Phase 3: Frontend-Backend Integration ✓ (TO DO)
1. Update AuthContext with real API
2. Update CartContext with real API
3. Replace all mock data with API calls
4. Add loading states
5. Add error handling
6. Test all functionality

### Phase 4: Testing ✓ (TO DO)
1. Test backend API endpoints
2. Test frontend functionality
3. Test admin panel
4. Test authentication flow
5. Test cart and checkout
6. Test orders management
