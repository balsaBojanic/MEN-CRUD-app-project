# Vinyl Store — MEN Stack CRUD App

##  Project Overview

**Vinyl Vault** is a full-stack MEN CRUD web application that serves as a digital marketplace for vinyl record enthusiasts.  
Users can sign up as either **Buyers** or **Sellers**:

- **Sellers** can upload, edit, and delete vinyl records they are offering for sale.  
- **Buyers** can browse available records, add them to their **shopping cart**, and manage purchases.  

The app demonstrates CRUD operations, role-based authentication, and a structured MongoDB database with relational logic between users, vinyl listings, and carts.

##  Features (MVP)

- User authentication (Buyer or Seller role)
- CRUD operations on vinyl records (Create, Read, Update, Delete)
- Seller-only access to record uploads and management
- Buyer-only shopping cart to store and remove vinyl records
- Responsive UI for browsing and managing records
- Database relationships linking Users ↔ Vinyls ↔ Carts

---

##  Trello Board Setup

### 1. MVP User Stories

Each card in this list represents a single MVP user story.

**Example cards:**
- As a seller, I want to create vinyl listings, so that buyers can view and purchase them.
- As a buyer, I want to browse available vinyl records, so that I can find music I love.
- As a buyer, I want to add vinyls to my cart, so that I can review them before checkout.
- As a seller, I want to edit and delete my vinyl listings, so that I can manage my inventory.
- As a user, I want to sign up and log in, so that I can access my personalized account.

---

### 2. Wireframes

Upload screenshots or links to your wireframes (Figma, Balsamiq, or hand-drawn).  
Each wireframe should have its own Trello card.

**Recommended wireframes:**
- Landing / Login Page
- Browse Vinyls Page
- Seller Dashboard
- Buyer Cart Page
- Vinyl Detail Page

---

### 3. ERD (Entity Relationship Diagram)

Upload your ERD diagram as a card attachment.

**Suggested Entities & Relationships:**

**User**
- _id  
- name  
- email  
- password  
- role (buyer/seller)

**Vinyl**
- _id  
- title  
- artist  
- genre  
- price  
- imageURL  
- sellerId (ref: User)

**Cart**
- _id  
- buyerId (ref: User)  
- items: [ { vinylId (ref: Vinyl), quantity } ]

**Relationships:**
- One Seller → Many Vinyls
- One Buyer → One Cart
- One Cart → Many Vinyls

![DatabaseIMG](https://github.com/balsaBojanic/MEN-CRUD-app-project/blob/main/database_image.jpeg?raw=true)




