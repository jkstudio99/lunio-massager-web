# Lunio Massager - User Flow

## Overview

```mermaid
flowchart TB
    subgraph ENTRY["Entry Points"]
        URL["Direct URL"]
        SEARCH_ENGINE["Search Engine"]
    end

    URL --> HOME
    SEARCH_ENGINE --> HOME

    HOME["/ Home"]
    PRODUCTS["/products Product Listing"]
    DETAIL["/product/:slug Product Detail"]
    CART["/cart Cart Page"]
    CHECKOUT["/checkout Checkout"]
    BLOG["/blog Blog"]
    BLOG_DETAIL["/blog/:slug Blog Detail"]
    WISHLIST["/wishlist Wishlist"]
    ACCOUNT["/account Account"]
    ABOUT["/about About Us"]
    SUPPORT["/support Support"]

    HOME -->|"Shop Now / Explore"| PRODUCTS
    HOME -->|"Learn More"| ABOUT
    HOME -->|"Best Sellers"| DETAIL
    HOME -->|"Category Card"| PRODUCTS

    PRODUCTS -->|"Click Product"| DETAIL
    DETAIL -->|"Related Product"| DETAIL
    DETAIL -->|"Breadcrumb"| PRODUCTS

    DETAIL -->|"Add to Cart"| CART_DRAWER
    WISHLIST -->|"Add to Cart"| CART_DRAWER

    CART_DRAWER["Cart Drawer (Overlay)"]
    CART_DRAWER -->|"Checkout"| CHECKOUT
    CART_DRAWER -->|"View Cart"| CART

    CART -->|"Proceed to Checkout"| CHECKOUT
    CART -->|"Continue Shopping"| PRODUCTS
    CHECKOUT -->|"Place Order"| SUCCESS["Order Success"]
    SUCCESS -->|"Back to Home"| HOME

    BLOG -->|"Read Article"| BLOG_DETAIL
    BLOG_DETAIL -->|"Related Product"| DETAIL
    BLOG_DETAIL -->|"Prev / Next"| BLOG_DETAIL
    BLOG_DETAIL -->|"Back to Blog"| BLOG

    ACCOUNT -->|"Wishlist Menu"| WISHLIST
    WISHLIST -->|"Click Product"| DETAIL
    WISHLIST -->|"Browse Products"| PRODUCTS

    style HOME fill:#7c5cbf,color:#fff
    style CHECKOUT fill:#2d6a4f,color:#fff
    style SUCCESS fill:#2d6a4f,color:#fff
    style CART_DRAWER fill:#e07a5f,color:#fff
```

---

## Global Navigation (Header)

```mermaid
flowchart LR
    HEADER["Header (All Pages)"]

    HEADER --> NAV_HOME["Home /"]
    HEADER --> NAV_PRODUCTS["Products /products"]
    HEADER --> NAV_ABOUT["About /about"]
    HEADER --> NAV_BLOG["Blog /blog"]
    HEADER --> NAV_SUPPORT["Support /support"]

    HEADER --> SEARCH_BTN["Search Icon"]
    HEADER --> THEME_BTN["Theme Toggle"]
    HEADER --> ACCOUNT_BTN["Account /account"]
    HEADER --> WISHLIST_BTN["Wishlist /wishlist"]
    HEADER --> CART_BTN["Cart Icon"]

    SEARCH_BTN -->|"Click or Cmd+K"| SEARCH_OVERLAY["Search Overlay"]
    CART_BTN --> CART_DRAWER["Cart Drawer"]
    THEME_BTN -->|"Toggle"| DARK_MODE["Dark / Light / System"]

    SEARCH_OVERLAY -->|"Product Result"| PRODUCT_PAGE["/product/:slug"]
    SEARCH_OVERLAY -->|"Blog Result"| BLOG_PAGE["/blog/:slug"]

    style SEARCH_OVERLAY fill:#7c5cbf,color:#fff
    style CART_DRAWER fill:#e07a5f,color:#fff
```

---

## Shopping Flow

```mermaid
flowchart TD
    BROWSE["Browse Products"]
    BROWSE -->|"Click Product"| PDP["Product Detail Page"]

    PDP -->|"Select Color"| PDP
    PDP -->|"Adjust Qty"| PDP
    PDP -->|"Add to Cart"| DRAWER["Cart Drawer Opens"]
    PDP -->|"Toggle Wishlist"| WISHLIST_STORE[("Wishlist Store")]

    DRAWER -->|"Continue Shopping"| BROWSE
    DRAWER -->|"Change Qty / Remove"| DRAWER
    DRAWER -->|"Checkout"| CHECKOUT

    subgraph CHECKOUT["Checkout (3 Steps)"]
        STEP1["Step 1: Shipping Info"]
        STEP2["Step 2: Payment Method"]
        STEP3["Step 3: Order Review"]

        STEP1 -->|"Next"| STEP2
        STEP2 -->|"Next"| STEP3
        STEP2 -->|"Back"| STEP1
        STEP3 -->|"Back"| STEP2
    end

    STEP3 -->|"Place Order"| SUCCESS["Order Confirmed"]
    SUCCESS -->|"Back to Home"| HOME["/"]

    CART_PAGE["/cart Cart Page"]
    DRAWER -->|"View Full Cart"| CART_PAGE
    CART_PAGE -->|"Proceed to Checkout"| STEP1
    CART_PAGE -->|"Continue Shopping"| BROWSE

    style DRAWER fill:#e07a5f,color:#fff
    style SUCCESS fill:#2d6a4f,color:#fff
```

---

## Authentication Flow

```mermaid
flowchart TD
    VISIT_ACCOUNT["Visit /account"]
    VISIT_ACCOUNT -->|"Not Logged In"| AUTH_FORM

    subgraph AUTH_FORM["Login / Register"]
        LOGIN_TAB["Login Tab"]
        REGISTER_TAB["Register Tab"]

        LOGIN_TAB -->|"Switch Tab"| REGISTER_TAB
        REGISTER_TAB -->|"Switch Tab"| LOGIN_TAB
    end

    LOGIN_TAB -->|"Email + Password"| EMAIL_LOGIN["Email Login"]
    LOGIN_TAB -->|"Google Button"| GOOGLE["Google OAuth Popup"]
    LOGIN_TAB -->|"LINE Button"| LINE["LINE OAuth Redirect"]

    REGISTER_TAB -->|"Fill Form"| EMAIL_REGISTER["Email Register"]
    REGISTER_TAB -->|"Google Button"| GOOGLE
    REGISTER_TAB -->|"LINE Button"| LINE

    GOOGLE -->|"Success"| DASHBOARD
    LINE -->|"Redirect Back"| DASHBOARD

    VISIT_ACCOUNT -->|"Already Logged In"| DASHBOARD

    subgraph DASHBOARD["Account Dashboard"]
        PROFILE["Profile Info"]
        MENU_ORDERS["Order Tracking"]
        MENU_WISHLIST["Wishlist"]
        MENU_ADDRESS["Address Book"]
        MENU_SETTINGS["Account Settings"]
        LOGOUT_BTN["Sign Out"]
    end

    MENU_WISHLIST -->|"Navigate"| WISHLIST_PAGE["/wishlist"]
    LOGOUT_BTN -->|"Sign Out"| AUTH_FORM

    style GOOGLE fill:#4285f4,color:#fff
    style LINE fill:#06c755,color:#fff
    style DASHBOARD fill:#7c5cbf,color:#fff
```

---

## Wishlist Flow

```mermaid
flowchart TD
    PRODUCT_CARD["Product Card (Heart Icon)"]
    PRODUCT_DETAIL["Product Detail Page"]
    WISHLIST_PAGE["/wishlist"]

    PRODUCT_CARD -->|"Toggle Heart"| STORE[("Wishlist Store - localStorage")]
    PRODUCT_DETAIL -->|"Toggle Wishlist"| STORE

    STORE --> WISHLIST_PAGE
    WISHLIST_PAGE -->|"Remove Item"| STORE
    WISHLIST_PAGE -->|"Add to Cart"| CART_DRAWER["Cart Drawer"]
    WISHLIST_PAGE -->|"Click Product"| PRODUCT_DETAIL
    WISHLIST_PAGE -->|"Empty State"| BROWSE["/products"]

    HEADER_BADGE["Header Heart Badge Count"] -.->|"Reflects"| STORE

    style STORE fill:#e07a5f,color:#fff
```

---

## Blog & Content Flow

```mermaid
flowchart TD
    BLOG["/blog Blog Listing"]
    BLOG -->|"Filter Category"| BLOG
    BLOG -->|"Search"| BLOG
    BLOG -->|"Click Article"| DETAIL["/blog/:slug"]

    DETAIL -->|"Read Content"| DETAIL
    DETAIL -->|"Comment"| COMMENT["Submit Comment (No Auth)"]
    DETAIL -->|"Like Comment"| DETAIL
    DETAIL -->|"Reply to Comment"| DETAIL
    DETAIL -->|"Related Product CTA"| PRODUCT["/product/:slug"]
    DETAIL -->|"Prev / Next Article"| DETAIL
    DETAIL -->|"Back to Blog"| BLOG

    SIDEBAR["Sidebar"]
    BLOG --> SIDEBAR
    DETAIL --> SIDEBAR
    SIDEBAR -->|"Recent Article"| DETAIL
    SIDEBAR -->|"Promotion Banner"| PRODUCTS["/products"]

    style BLOG fill:#7c5cbf,color:#fff
    style COMMENT fill:#2d6a4f,color:#fff
```

---

## Search Flow

```mermaid
flowchart TD
    TRIGGER["Cmd+K / Search Icon"]
    TRIGGER --> OVERLAY["Search Overlay (z-90)"]

    OVERLAY -->|"Type Query"| FILTER["Real-time Filter"]
    FILTER --> PRODUCT_RESULTS["Product Results (max 4)"]
    FILTER --> BLOG_RESULTS["Blog Results (max 4)"]
    FILTER --> NO_RESULTS["No Results Found"]

    PRODUCT_RESULTS -->|"Click"| PDP["/product/:slug"]
    BLOG_RESULTS -->|"Click"| BLOG["/blog/:slug"]

    OVERLAY -->|"ESC / Backdrop / X"| CLOSE["Close Overlay"]

    style OVERLAY fill:#7c5cbf,color:#fff
```

---

## State Management

```mermaid
flowchart LR
    subgraph PERSISTED["Persisted (localStorage)"]
        THEME_STORE["Theme Store\nlight / dark / system"]
        I18N_STORE["i18n Store\nzh-TW / en"]
        WISHLIST_STORE["Wishlist Store\nProduct[]"]
        AUTH_STORE["Auth Store\nFirebase Session"]
    end

    subgraph SESSION["Session Only"]
        CART_STORE["Cart Store\nItems, Drawer State"]
        SEARCH_STORE["Search Store\nQuery, isOpen"]
    end

    THEME_STORE -->|".dark class"| HTML["document.documentElement"]
    I18N_STORE -->|"lang attr"| HTML
    AUTH_STORE -->|"onAuthStateChanged"| FIREBASE["Firebase"]

    style PERSISTED fill:#2d6a4f,color:#fff
    style SESSION fill:#e07a5f,color:#fff
```

---

## Footer Navigation

```mermaid
flowchart LR
    FOOTER["Footer (All Pages)"]

    FOOTER --> F_PRODUCTS["Products"]
    FOOTER --> F_SERVICE["Service"]
    FOOTER --> F_COMPANY["Company"]

    F_PRODUCTS --> P1["/products All Products"]
    F_PRODUCTS --> P2["/products?category=calf-massager"]
    F_PRODUCTS --> P3["/products?category=boot-massager"]
    F_PRODUCTS --> P4["/products?category=neck-shoulder"]

    F_SERVICE --> S1["/support FAQ"]
    F_SERVICE --> S2["/support Shipping"]
    F_SERVICE --> S3["/support Returns"]
    F_SERVICE --> S4["/support Warranty"]

    F_COMPANY --> C1["/about About"]
    F_COMPANY --> C2["/about Brand Story"]
    F_COMPANY --> C3["/blog Blog"]
    F_COMPANY --> C4["/support Contact"]
```
