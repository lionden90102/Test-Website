import { auth, db } from "./firebase.js";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { 
    collection, 
    getDocs, 
    addDoc 
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const productsContainer = document.getElementById("products-container");
const cartContainer = document.getElementById("cart-container");
const checkoutBtn = document.getElementById("checkout-btn");

// State
let user = null;
let cart = [];

// Handle Login
loginBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        alert("Login failed: " + error.message);
    }
});

// Handle Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    user = null;
    updateUI();
});

// Listen for Auth State Changes
onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
    updateUI();
});

// Fetch Products
const fetchProducts = async () => {
    const productsSnap = await getDocs(collection(db, "products"));
    const products = [];
    productsSnap.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
    return products;
};

// Render Products
const renderProducts = async () => {
    const products = await fetchProducts();
    productsContainer.innerHTML = "";
    products.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;
        div.querySelector("button").addEventListener("click", () => addToCart(product));
        productsContainer.appendChild(div);
    });
};

// Add to Cart
const addToCart = (product) => {
    cart.push(product);
    updateCart();
};

// Update Cart
const updateCart = () => {
    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: $${item.price}</p>
            <button data-index="${index}">Remove</button>
        `;
        div.querySelector("button").addEventListener("click", () => {
            cart.splice(index, 1);
            updateCart();
        });
        cartContainer.appendChild(div);
    });
    checkoutBtn.style.display = cart.length > 0 ? "block" : "none";
};

// Handle Checkout
checkoutBtn.addEventListener("click", async () => {
    if (!user) {
        alert("Please log in to place an order.");
        return;
    }
    try {
        await addDoc(collection(db, "orders"), { userId: user.uid, cart, timestamp: new Date() });
        alert("Order placed successfully!");
        cart = [];
        updateCart();
    } catch (error) {
        alert("Checkout failed: " + error.message);
    }
});

// Update UI
const updateUI = () => {
    loginBtn.style.display = user ? "none" : "block";
    logoutBtn.style.display = user ? "block" : "none";
    renderProducts();
};

// Initial Load
updateUI();