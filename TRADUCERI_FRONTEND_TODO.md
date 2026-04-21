# Modificări Frontend pentru Afișare Traduceri RU

## 1. Navbar.jsx - Meniuri
**Fișier:** `/app/frontend/src/components/Navbar.jsx`

**Modificare necesară:**
- În `menuItems.map()` și `categoryMenuItems.map()`, schimbă afișarea de la `item.name` la:
```javascript
const displayName = language === 'ru' && item.nameRu ? item.nameRu : item.name;
```

## 2. CategoryPage.jsx - Nume Categorii
**Fișier:** `/app/frontend/src/pages/CategoryPage.jsx`

**Modificare necesară:**
- La afișarea numelui categoriei și subcategoriilor, folosește:
```javascript
const categoryName = language === 'ru' && category.nameRu ? category.nameRu : category.name;
```

## 3. FAQPage.jsx - Întrebări și Răspunsuri
**Fișier:** `/app/frontend/src/pages/FAQPage.jsx`

**Modificare necesară:**
- La afișarea FAQ-urilor:
```javascript
const question = language === 'ru' && faq.questionRu ? faq.questionRu : faq.question;
const answer = language === 'ru' && faq.answerRu ? faq.answerRu : faq.answer;
```

## 4. ProductDetailPage.jsx - Specificații
**Fișier:** `/app/frontend/src/pages/ProductDetailPage.jsx`

**Modificare necesară:**
- În tab-ul specifications:
```javascript
const specTitle = language === 'ru' && spec.titleRu ? spec.titleRu : spec.title;
const specValue = language === 'ru' && spec.valueRu ? spec.valueRu : spec.value;
```

## 5. Alte locuri unde apar categorii
- CatalogPage.jsx
- HeroSlider.jsx (dacă are categorii)
- Orice componentă care afișează categorii sau submeniuri
