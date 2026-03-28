# Sellzy eCommerce - Product Requirements Document (PRD)

## Project Overview
Clone pixel-perfect al website-ului https://sellzy-preview.netlify.app/index-4 cu funcționalitate full-stack și Admin Dashboard Panel.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Authentication**: JWT

## Completed Features

### 1. Frontend (Mock Implementation) ✅

#### Components:
- **Navbar**: Top bar + navigation cu search, cart counter, user account
- **Footer**: Newsletter signup, link-uri, contact info, social media
- **HeroSlider**: Carousel auto-play cu 5 slides
- **CategoryGrid**: Grid cu 6 categorii
- **ProductCard**: Card cu imagine, rating, colors, sizes, wishlist, quick view
- **QuickViewModal**: Modal pentru preview rapid produs
- **CountdownTimer**: Timer pentru oferte
- **AuthModal**: Login/Register/Forgot Password

#### Pages:
- **HomePage**: Secțiuni complete:
  - Hero Slider
  - Categories Grid
  - Today's Hot Picks cu countdown
  - Flash Fashion Deal cu tabs
  - Promotional Banners
  - Hand Picked Products
  - Fresh Finds
  - Features Section

#### Context:
- **CartContext**: Gestionare coș (add/remove/update) - localStorage
- **AuthContext**: Autentificare user (login/register/logout) - localStorage MOCK

#### Mock Data:
- 50 produse diverse
- 6 categorii
- 5 slide-uri pentru hero
- 5 branduri

### 2. Backend (Full Implementation) ✅

#### Models:
```
- User (id, email, password, firstName, lastName, role, timestamps)
- Product (id, name, description, price, originalPrice, discount, category, image, colors, sizes, rating, reviews, sold, available, badge, timestamps)
- Category (id, name, slug, icon, itemCount, timestamp)
- Cart (id, userId, items, total, timestamp)
- Wishlist (id, userId, products, timestamp)
- Order (id, userId, items, total, status, shippingAddress, timestamps)
```

#### API Endpoints:

**Authentication:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

**Products:**
- GET /api/products (cu filtering: category, search, pagination)
- GET /api/products/:id
- POST /api/products (admin only)
- PUT /api/products/:id (admin only)
- DELETE /api/products/:id (admin only)

**Categories:**
- GET /api/categories
- GET /api/categories/:id
- POST /api/categories (admin only)
- PUT /api/categories/:id (admin only)
- DELETE /api/categories/:id (admin only)

**Cart:**
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove/:itemId
- DELETE /api/cart/clear

**Wishlist:**
- GET /api/wishlist
- POST /api/wishlist/add/:productId
- DELETE /api/wishlist/remove/:productId

**Orders:**
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders

**Admin - Users:**
- GET /api/admin/users
- GET /api/admin/users/:id
- DELETE /api/admin/users/:id

**Admin - Orders:**
- GET /api/admin/orders
- PUT /api/admin/orders/:id/status

**Admin - Dashboard:**
- GET /api/admin/dashboard/stats

#### Security:
- JWT authentication
- Password hashing cu bcrypt
- Role-based access control (user/admin)
- Protected admin endpoints

#### Database Seeding:
- Admin user: admin@sellzy.com / admin123
- 6 categorii pre-populat
- 48 produse sample

### 3. Requirements Implemented

✅ UI 1:1 exact cu website-ul model (index-4)
✅ Full-stack funcțional cu backend și CRUD complet
✅ Autentificare cu email și parolă
✅ Admin Dashboard Panel la /admin cu:
  - Dashboard Stats API ready
  - Products Management endpoints
  - Users Management endpoints  
  - Categories Management endpoints
  - Orders Management endpoints

✅ Website principal cu funcționalități complete:
  - Coș de cumpărături
  - Wishlist
  - Product browsing
  - Quick view
  - User authentication

## Remaining Tasks

### 1. Admin Panel UI (TO DO)
Crearea interfața grafice pentru Admin Panel:
- [ ] Admin Login Page (/admin/login)
- [ ] Admin Layout cu Sidebar
- [ ] Dashboard Page cu Charts și Statistics
- [ ] Products Management Page (Table cu CRUD)
- [ ] Categories Management Page
- [ ] Users Management Page
- [ ] Orders Management Page

### 2. Frontend-Backend Integration (TO DO)
Înlocuirea mock data cu API calls reale:
- [ ] Update AuthContext cu API calls reale
- [ ] Update CartContext cu API calls reale
- [ ] Update HomePage pentru a folosi /api/products
- [ ] Update ProductCard cu date reale
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications pentru succes/error

### 3. Additional Pages (NICE TO HAVE)
- [ ] Cart Page (/cart)
- [ ] Wishlist Page (/wishlist)
- [ ] Product Detail Page (/product/:id)
- [ ] Checkout Page (/checkout)
- [ ] User Account Page (/account)
- [ ] Orders History Page (/orders)

## File Structure

```
/app
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuickViewModal.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── context/
│   │   │   ├── CartContext.js
│   │   │   └── AuthContext.js
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
├── backend/
│   ├── server.py (Main FastAPI app cu toate endpoints)
│   ├── models.py (Pydantic models)
│   ├── auth_utils.py (JWT & password hashing)
│   ├── dependencies.py (Auth dependencies)
│   ├── seed_db.py (Database seeding script)
│   └── requirements.txt
└── contracts.md
```

## API Testing

Backend este complet funcțional și poate fi testat cu:

```bash
# Login as admin
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sellzy.com","password":"admin123"}'

# Get all products
curl http://localhost:8001/api/products

# Get categories
curl http://localhost:8001/api/categories

# Get dashboard stats (cu admin token)
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8001/api/admin/dashboard/stats
```

## Environment Variables

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=https://ecommerce-admin-55.preview.emergentagent.com
```

**Backend (.env):**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=sellzy_db
JWT_SECRET_KEY=your-secret-key-change-in-production-12345
```

## Admin Credentials
```
Email: admin@sellzy.com
Password: admin123
```

## Next Development Steps

1. **Prioritate 1**: Admin Panel UI
   - Create admin layout cu sidebar
   - Implement toate pagile (Dashboard, Products, Users, Orders, Categories)
   - Add charts pentru statistics

2. **Prioritate 2**: Frontend-Backend Integration
   - Replace mock data în toate componente
   - Add API calls pentru cart, wishlist, orders
   - Add loading & error states

3. **Prioritate 3**: Additional Pages
   - Cart, Wishlist, Product Detail, Checkout, Account pages

## Design Guidelines Applied

✅ Culori exacte din model (Teal #16a085, Yellow #F7DC6F)
✅ Layout identic cu originalul
✅ Product cards cu toate features (rating, colors, sizes, badges)
✅ Countdown timer pentru oferte
✅ Carousel/Slider pentru hero
✅ Responsive design
✅ Hover effects și transitions
✅ Shadcn UI components folosite
✅ Icons din lucide-react
