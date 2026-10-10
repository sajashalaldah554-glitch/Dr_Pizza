import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6Xk4KPa305WeG5sovpaTB0fgztICYI94",
    authDomain: "dr-pizza-menu.firebaseapp.com",
    projectId: "dr-pizza-menu",
    storageBucket: "dr-pizza-menu.firebasestorage.app",
    messagingSenderId: "128449244580",
    appId: "1:128449244580:web:845c93e5213f58073b6531",
    measurementId: "G-F65NFTFMXC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
//==================================================
const WHATSAPP_NUMBER = "972598409112"; // رقم الواتساب بالصيغة الدولية بدون + أو صفر البداية
const PHONE_DISPLAY   = "0598409112";   // الرقم كما يظهر للزبائن
const LOCATION_TEXT   = "الشيوخ - وسط البلد - بجانب سوبر ماركت أبناء عم الحلايقة";
/* ============================================================ */

const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const OWNER_KEY = "drpizza_owner";
const FALLBACK_IMG = "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800";
const IMG = {
  veg:      "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=800",
  chicken:  "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800",
  sausage:  "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
  salami:   "https://images.pexels.com/photos/208537/pexels-photo-208537.jpeg?auto=compress&cs=tinysrgb&w=800",
  stuffed:  "https://images.unsplash.com/photo-1621510564330-c87695020b53?q=80&w=800&auto=format&fit=crop",
  tuna:     "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=800",
  meat:     "https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=800",
  marg:     "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=800",
  manakish: "https://images.unsplash.com/photo-1611107415406-1c12f8cda424?q=80&w=800&auto=format&fit=crop",
  fries:    "https://images.pexels.com/photos/1583891/pexels-photo-1583891.jpeg?auto=compress&cs=tinysrgb&w=800",
  pasta:    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800",
};

const SEED_ITEMS = [
  { id: "p1", name: "خضار", category: "البيتزا", img: IMG.veg, desc: "فلفل ملون، زيتون، فطر وذرة مع صلصة الطماطم وجبنة الموزاريلا", prices: [{ size: "صغير", price: 18 }, { size: "كبير", price: 28 }, { size: "عائلي", price: 45 }] },
  { id: "p2", name: "جاج", category: "البيتزا", img: IMG.chicken, desc: "قطع الجاج المتبلة مع جبنة الموزاريلا وصلصة دكتور بيتزا", prices: [{ size: "صغير", price: 24 }, { size: "كبير", price: 35 }, { size: "عائلي", price: 60 }] },
  { id: "p3", name: "نقانق", category: "البيتزا", img: IMG.sausage, desc: "شرائح النقانق مع الجبنة والصلصة الخاصة", prices: [{ size: "صغير", price: 20 }, { size: "كبير", price: 33 }, { size: "عائلي", price: 52 }] },
  { id: "p4", name: "سلامي", category: "البيتزا", img: IMG.salami, desc: "شرائح السلامي الغنية مع جبنة الموزاريلا", prices: [{ size: "صغير", price: 22 }, { size: "كبير", price: 33 }, { size: "عائلي", price: 52 }] },
  { id: "p5", name: "محشية الأطراف", category: "البيتزا", img: IMG.stuffed, desc: "أطراف محشية بالجبنة مع خليط الخضار والزيتون", prices: [{ size: "صغير", price: 25 }, { size: "كبير", price: 40 }] },
  { id: "p6", name: "تونة", category: "البيتزا", img: IMG.tuna, desc: "تونة طازجة مع زيتون وبصل وجبنة", prices: [{ size: "صغير", price: 22 }, { size: "كبير", price: 33 }] },
  { id: "p7", name: "لحمة", category: "البيتزا", img: IMG.meat, desc: "لحمة مفرومة متبلة على الطريقة الخاصة", prices: [{ size: "صغير", price: 27 }, { size: "كبير", price: 38 }] },
  { id: "p8", name: "مرجريتا", category: "البيتزا", img: IMG.marg, desc: "الكلاسيكية الإيطالية: صلصة طماطم، موزاريلا وريحان", prices: [{ size: "صغير", price: 18 }, { size: "كبير", price: 28 }] },
  { id: "e1", name: "كلزونة باربيكيو", category: "أصناف إضافية", img: IMG.manakish, desc: "عجينة محشوة بصلصة الباربيكيو والجبنة", prices: [{ size: "عادي", price: 25 }] },
  { id: "e2", name: "سفيحة", category: "أصناف إضافية", img: IMG.manakish, desc: "عجينة رقيقة مع اللحمة المتبلة", prices: [{ size: "عادي", price: 18 }] },
  { id: "e3", name: "منقوشة زعتر", category: "أصناف إضافية", img: IMG.manakish, desc: "زعتر بلدي مع زيت الزيتون", prices: [{ size: "عادي", price: 9 }] },
  { id: "e4", name: "منقوشة زعتر مع جبنة", category: "أصناف إضافية", img: IMG.manakish, desc: "مزيج الزعتر والجبنة الذائبة", prices: [{ size: "عادي", price: 16 }] },
  { id: "e5", name: "منقوشة بيض مع جبنة ونقانق", category: "أصناف إضافية", img: IMG.manakish, desc: "بيض طازج مع جبنة وشرائح النقانق", prices: [{ size: "عادي", price: 18 }] },
  { id: "e6", name: "منقوشة بيض مع نقانق", category: "أصناف إضافية", img: IMG.manakish, desc: "بيض مع شرائح النقانق", prices: [{ size: "عادي", price: 15 }] },
  { id: "e7", name: "منقوشة بيض", category: "أصناف إضافية", img: IMG.manakish, desc: "بيض طازج على عجينة ساخنة", prices: [{ size: "عادي", price: 9 }] },
  { id: "e8", name: "صحن بطاطس", category: "أصناف إضافية", img: IMG.fries, desc: "بطاطس مقرمشة مع التوابل", prices: [{ size: "عادي", price: 5 }] },
  { id: "e9", name: "معكرونة بجبنة", category: "أصناف إضافية", img: IMG.pasta, desc: "معكرونة بصلصة الجبنة الكريمية", prices: [{ size: "عادي", price: 10 }] },
];
async function uploadSeedItems() {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    const existingIds = new Set();

    snapshot.forEach((item) => {
        existingIds.add(item.id);
    });

    for (const item of SEED_ITEMS) {
        if (!existingIds.has(item.id)) {
            await setDoc(
                doc(db, "products", item.id),
                item
            );
        }
    }

    console.log("تم التأكد من المنتجات الأساسية في Firebase");
}
async function loadProductsFromFirebase() {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    firebaseItems = [];

    snapshot.forEach((item) => {
        firebaseItems.push(item.data());
    });
}

const SIZES = ["عادي", "صغير", "وسط", "كبير", "عائلي"];

/* ===== الحالة ===== */
let firebaseItems = [];
let ownerMode = false;

const allItems = () => firebaseItems;
const categories = () => [...new Set(allItems().map((i) => i.category))];
/* ===== أدوات مساعدة ===== */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
$("#nav-whatsapp").href = WHATSAPP_LINK;
$("#hero-whatsapp").href = WHATSAPP_LINK;
$("#footer-whatsapp").href = WHATSAPP_LINK;

$("#phone-display").textContent = PHONE_DISPLAY;
$("#location-text").textContent = LOCATION_TEXT;

let toastTimer;
function toast(msg, isError = false) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.toggle("error", isError);
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2800);
}

/* ===== التمرير السلس ===== */
let lenis = null;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
function scrollToTarget(sel) {
  const el = sel === "#home" ? document.body : document.querySelector(sel);
  if (!el) return;
  if (lenis) lenis.scrollTo(sel === "#home" ? 0 : el, { offset: sel === "#home" ? 0 : -70, duration: 1.3 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ===== القائمة العلوية ===== */
function renderNav() {
  const links = [
    { label: "الرئيسية", target: "#home", testid: "nav-home-link" },
    ...categories().map((c, i) => ({ label: c, target: `#cat-${i}`, testid: `nav-cat-link-${i}` })),
    { label: "تواصل معنا", target: "#contact", testid: "nav-contact-link" },
  ];
  const html = links.map((l) => `<a href="${l.target}" class="nav-link" data-target="${l.target}" data-testid="${l.testid}">${esc(l.label)}</a>`).join("");
  $("#nav-links").innerHTML = html;
  $("#nav-mobile").innerHTML = links.map((l) => `<a href="${l.target}" class="nav-link" data-target="${l.target}" data-testid="${l.testid}-mobile">${esc(l.label)}</a>`).join("");
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-target]");
  if (!link) return;
  e.preventDefault();
  $("#nav-mobile").classList.remove("open");
  scrollToTarget(link.dataset.target);
});
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  if (!a.dataset.target) a.addEventListener("click", (e) => { e.preventDefault(); scrollToTarget(a.getAttribute("href")); });
});
$("#nav-toggle").addEventListener("click", () => $("#nav-mobile").classList.toggle("open"));

/* ===== بطاقات المنيو ===== */
function cardHtml(item) {
  const title = item.category === "البيتزا" ? `بيتزا ${item.name}` : item.name;
  const badge = item.custom ? `<span class="badge-new" data-testid="menu-item-badge-${item.id}">جديد</span>` : "";
 const del = ownerMode
    ? `<button class="delete-item" data-delete="${item.id}" data-testid="menu-item-delete-${item.id}">
         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
         حذف الصنف
       </button>` : "";
  const prices = item.prices.map((p, i) => `
    <div class="price-row" data-testid="menu-item-price-${item.id}-${i}">
      <span class="price-size">${esc(p.size)}</span>
      <span class="price-dots"></span>
      <span class="price-value">${p.price}<small>₪</small></span>
    </div>`).join("");
  return `
    <article class="item-card reveal" data-testid="menu-item-card-${item.id}">
      ${badge}
      <div class="item-img-wrap">
        <img class="item-img" src="${esc(item.img || FALLBACK_IMG)}" alt="${esc(title)}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" />
      </div>
      <div class="item-body">
        <h3 class="item-name">${esc(title)}</h3>
        ${item.desc ? `<p class="item-desc">${esc(item.desc)}</p>` : ""}
        <div class="price-list">${prices}</div>
        ${del}
      </div>
    </article>`;
}

function renderMenu() {
  const container = $("#menu-container");
  container.innerHTML = categories().map((cat, i) => `
    <section class="menu-section" id="cat-${i}" data-testid="menu-section-cat-${i}">
      <div class="section-inner">
        <div class="chapter-head reveal">
          <span class="chapter-num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <span class="chapter-label">CHAPTER</span>
            <h2 class="chapter-title">${esc(cat)}</h2>
          </div>
          <span class="chapter-rule"></span>
        </div>
        <div class="cards-grid">
          ${allItems().filter((it) => it.category === cat).map(cardHtml).join("")}
        </div>
      </div>
    </section>`).join("");
  observeReveals();
}

/* ===== الظهور عند التمرير ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
function observeReveals() {
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el));
}

/* ===== حذف صنف ===== */
document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-delete]");
    if (!btn) return;

    const id = btn.dataset.delete;

    try {
        await deleteDoc(doc(db, "products", id));

        firebaseItems = firebaseItems.filter((i) => i.id !== id);

        renderNav();
        renderMenu();

        toast("تم حذف الصنف");
    } catch (error) {
        console.error(error);
        toast("حدث خطأ أثناء حذف الصنف", true);
    }
});

/* ===== وضع المالك ===== */

function refreshOwnerUI() {
  $("#owner-lock").classList.toggle("hidden", !ownerMode);

  $("#owner-hint").textContent = ownerMode
    ? "وضع المالك مفعّل — يمكنك إضافة وحذف الأصناف الآن"
    : "صاحب المطعم؟ أضف صنفاً جديداً للمنيو مباشرة";
}


// تسجيل الخروج
$("#owner-lock").addEventListener("click", async () => {
  try {
    await signOut(auth);

    ownerMode = false;
    refreshOwnerUI();
    renderMenu();

    toast("تم تسجيل الخروج");
  } catch (error) {
    console.error("Sign out error:", error);
    toast("حدث خطأ أثناء تسجيل الخروج", true);
  }
});


// زر إضافة صنف
$("#open-add-item").addEventListener("click", () => {
  if (ownerMode) {
    openAddModal();
  } else {
    openModal("#pin-modal");
  }
});


// تسجيل الدخول باستخدام الإيميل وكلمة المرور
$("#pin-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = $("#owner-email").value.trim();
  const password = $("#pin-input").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    ownerMode = true;

    $("#owner-email").value = "";
    $("#pin-input").value = "";
    $("#pin-error").classList.add("hidden");

    closeModals();
    refreshOwnerUI();
    renderMenu();
    openAddModal();

  } catch (error) {
    console.error("Login error:", error);

    $("#pin-error").textContent =
      "البريد الإلكتروني أو كلمة المرور غير صحيحة";

    $("#pin-error").classList.remove("hidden");
  }
});


// متابعة حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  ownerMode = Boolean(user);

  refreshOwnerUI();
  renderMenu();
});

/* ===== النوافذ المنبثقة ===== */
function openModal(sel) { $(sel).classList.remove("hidden"); }
function closeModals() { document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.add("hidden")); }
document.querySelectorAll(".modal-backdrop").forEach((m) => {
  m.addEventListener("click", (e) => { if (e.target === m) closeModals(); });
});
document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModals));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals();
  
 });

/* ===== نموذج إضافة صنف ===== */
function priceRowHtml(i) {
  return `
    <div class="price-row-form" data-testid="add-item-price-row-${i}">
      <select data-size data-testid="add-item-size-select-${i}">
        ${SIZES.map((s) => `<option value="${s}">${s}</option>`).join("")}
      </select>
      <input type="number" min="1" placeholder="السعر ₪" data-price data-testid="add-item-price-input-${i}" />
      <button type="button" class="remove-row" data-remove-row aria-label="حذف السطر" data-testid="add-item-remove-row-${i}">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>`;
}

function openAddModal() {
  const sel = $("#item-category");
  sel.innerHTML = categories().map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("") + `<option value="__new__">+ فئة جديدة</option>`;
  $("#item-new-category").classList.add("hidden");
  $("#price-rows").innerHTML = priceRowHtml(0);
  openModal("#add-modal");
}

$("#item-category").addEventListener("change", (e) => {
  $("#item-new-category").classList.toggle("hidden", e.target.value !== "__new__");
});

$("#add-size-row").addEventListener("click", () => {
  $("#price-rows").insertAdjacentHTML("beforeend", priceRowHtml($("#price-rows").children.length));
});

$("#price-rows").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-row]");
  if (!btn) return;
  if ($("#price-rows").children.length > 1) btn.closest(".price-row-form").remove();
});

$("#add-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = $("#item-name").value.trim();
    const catVal = $("#item-category").value;
    const category =
        catVal === "__new__"
            ? $("#item-new-category").value.trim()
            : catVal;

    const desc = $("#item-desc").value.trim();
    const img = $("#item-image").value.trim();

    const prices = [...$("#price-rows").querySelectorAll(".price-row-form")]
        .map((r) => ({
            size: r.querySelector("[data-size]").value,
            price: Number(r.querySelector("[data-price]").value)
        }))
        .filter((p) => p.price > 0);

    if (!name) return toast("أدخل اسم الصنف", true);
    if (!category) return toast("أدخل اسم الفئة الجديدة", true);
    if (prices.length === 0) return toast("أدخل سعر واحد على الأقل", true);

    const newItem = {
        id: `c-${Date.now()}`,
        name,
        category,
        desc,
        img,
        prices,
        custom: true
    };

    try {
        await setDoc(
            doc(db, "products", newItem.id),
            newItem
        );

        firebaseItems.push(newItem);

        e.target.reset();
        closeModals();

        renderNav();
        renderMenu();

        toast("تمت إضافة الصنف بنجاح");
    } catch (error) {
        console.error(error);
        toast("حدث خطأ أثناء إضافة الصنف", true);
    }
});

async function init() {
    try {
        // رفع SEED_ITEMS إلى Firebase إذا كانت قاعدة البيانات فارغة
        await uploadSeedItems();

        // تحميل المنتجات من Firebase
        await loadProductsFromFirebase();

        // تشغيل الموقع
        renderNav();
        renderMenu();
        refreshOwnerUI();
        observeReveals();

    } catch (error) {
        console.error("Firebase Error:", error);
        toast("حدث خطأ في تحميل المنتجات", true);
    }
}

init();

/* حركة parallax خفيفة لصورة الواجهة */
const heroBg = $("#hero-bg");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y < window.innerHeight) heroBg.style.transform = `scale(1.1) translateY(${y}px)`;}, { passive: true });