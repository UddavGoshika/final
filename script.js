const activeIntervals = new Set();

/* =====================================================
   CORE HELPER FUNCTIONS
===================================================== */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const safe = (fn) => { 
    try { 
        fn(); 
    } catch (e) { 
        console.warn('Safe execution warning:', e.message); 
    } 
};

/* =====================================================
   LAYOUT CONTROLS (NAVBAR/FOOTER VISIBILITY)
===================================================== */
function hidelay() {
    const navbar = document.querySelector(".navbar");
    const footer = document.querySelector(".footer");
    
    if (navbar) navbar.classList.add("hidden");
    if (footer) footer.classList.add("hidden");
    
    localStorage.setItem("hideLayout", "true");
}

function showlay() {
    const navbar = document.querySelector(".navbar");
    const footer = document.querySelector(".footer");
    
    if (navbar) navbar.classList.remove("hidden");
    if (footer) footer.classList.remove("hidden");
    
    localStorage.setItem("hideLayout", "false");
}

/* =====================================================
   AUTHENTICATION SYSTEM
===================================================== */
// DOM Elements
const authPopup = document.getElementById("authPopup");
const clientPopup = document.getElementById("clientPopup");
const advocatePopup = document.getElementById("advocatePopup");
const Browseprofiles = document.getElementById("Browseprofiles");

// Popup Controls
function openAuth(tab = "login") {
    if (authPopup) {
        authPopup.style.display = "flex";
        switchTab(tab);
    }
}

function closeAuth() {
    if (authPopup) authPopup.style.display = "none";
}

function openClientForm() {
    if (clientPopup) clientPopup.style.display = "flex";
}

function closeClientForm() {
    if (clientPopup) clientPopup.style.display = "none";
}

function openAdvocateForm() {
    if (advocatePopup) advocatePopup.style.display = "flex";
}

function closeAdvocateForm() {
    if (advocatePopup) advocatePopup.style.display = "none";
}

function openbrowseprofiles() {
    if (Browseprofiles) Browseprofiles.style.display = "flex";
}

function closebrowseprofiles() {
    if (Browseprofiles) Browseprofiles.style.display = "none";
}

// Tab Switching
function switchTab(tab) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    if (!loginForm || !registerForm || !loginTab || !registerTab) return;

    [loginForm, registerForm, loginTab, registerTab].forEach(el => 
        el.classList.remove("active")
    );

    if (tab === "login") {
        loginForm.classList.add("active");
        loginTab.classList.add("active");
    } else {
        registerForm.classList.add("active");
        registerTab.classList.add("active");
    }
}

// Login Form Submission
document.addEventListener("submit", function (e) {
    if (e.target.id === "loginForm") {
        e.preventDefault();

        const email = e.target.querySelector('input[type="email"]')?.value;
        const password = e.target.querySelector('input[type="password"]')?.value;

        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        // Authentication logic
        let redirectHash = "";
        
        if (email === "admin@gmail.com" && password === "admin123") {
            redirectHash = "dashboard";
        } else if (email === "client@gmail.com" && password === "client123") {
            redirectHash = "clientdashboard";
        } else if (email === "advocate@gmail.com" && password === "advocate123") {
            redirectHash = "advocatedashboard";
        } else {
            alert("Invalid email or password");
            return;
        }

        // Set user session
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", "Demo User");
        
        updateNavbarAuth();
        hidelay();
        closeAuth();
        location.hash = redirectHash;
    }
});

/* =====================================================
   MULTI-STEP FORM WIZARD (Client Registration)
===================================================== */
function initMultiStepForm() {
    const clientSteps = document.querySelectorAll(".client-step");
    const steps = document.querySelectorAll(".step");
    let currentStep = 0;

    if (!clientSteps.length || !steps.length) return;

    function updateStepDisplay() {
        // Update sections
        clientSteps.forEach((section, index) => {
            section.classList.toggle("active", index === currentStep);
        });
        
        // Update step indicators
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === currentStep);
        });
        
        // Update buttons
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        
        if (prevBtn) {
            prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
        }
        
        if (nextBtn) {
            nextBtn.textContent = currentStep === clientSteps.length - 1 ? "Submit" : "Next";
        }
    }

    // Next button handler
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentStep < clientSteps.length - 1) {
                currentStep++;
                updateStepDisplay();
            } else {
                alert("Client Registration Submitted ✅");
                closeClientForm();
            }
        };
    }

    // Previous button handler
    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepDisplay();
            }
        };
    }

    // Initial display
    updateStepDisplay();
}















/* =====================================================
   CHATBOT SYSTEM
===================================================== */
let chatOpen = false;

function initChatbot() {
    const chatWidget = document.getElementById("chatWidget");
    const chatToggle = document.getElementById("chatToggle");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const notificationDot = document.querySelector(".notification-dot");

    if (!chatWidget || !chatToggle) return;

    // Toggle chat visibility
    chatToggle.addEventListener("click", toggleChat);

    // Send message function
    window.sendChatMessage = function() {
        const text = chatInput?.value.trim();
        if (!text || !chatMessages) return;

        addMessage(text, "user");
        if (chatInput) chatInput.value = "";

        setTimeout(() => {
            addMessage(getBotReply(text), "bot");
            if (!chatOpen && notificationDot) {
                notificationDot.style.display = "block";
            }
        }, 700);
    };

    // Add message to chat
    function addMessage(text, type) {
        const msg = document.createElement("div");
        msg.className = `message ${type}`;
        msg.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Bot response logic
    function getBotReply(input) {
        input = input.toLowerCase();

        if (input.includes("lawyer") || input.includes("advocate")) {
            return "I can help you find a verified advocate based on your legal issue.";
        }
        if (input.includes("case") || input.includes("legal help")) {
            return "Please tell me your case type (Criminal, Civil, Family, Corporate).";
        }
        if (input.includes("price") || input.includes("fee")) {
            return "Consultation fees vary by advocate experience and case complexity.";
        }
        return "Thank you for reaching out. Please provide more details so I can assist you better.";
    }

    // Enter key support
    if (chatInput) {
        chatInput.addEventListener("keydown", e => {
            if (e.key === "Enter") window.sendChatMessage();
        });
    }

    // Initial notification
    setTimeout(() => {
        if (!chatOpen && notificationDot) {
            notificationDot.style.display = "block";
        }
    }, 2000);
}

function toggleChat() {
    const chatWidget = document.getElementById("chatWidget");
    const notificationDot = document.querySelector(".notification-dot");
    
    if (!chatWidget) return;
    
    chatOpen = !chatOpen;
    chatWidget.style.display = chatOpen ? "flex" : "none";
    
    if (notificationDot) {
        notificationDot.style.display = "none";
    }
}

/* =====================================================
   NAVBAR INITIALIZATION & UI CONTROLS
===================================================== */
function initNavbar() {
    const nav = document.querySelector(".navbar");
    if (nav) {
        document.documentElement.style.setProperty("--nav-height", nav.offsetHeight + "px");
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => navLinks.classList.toggle("show"));
    }

    // Font size controls
    let fontSize = 16;
    const fontPlus = document.getElementById("font-plus");
    const fontMinus = document.getElementById("font-minus");
    
    if (fontPlus) {
        fontPlus.addEventListener("click", () => {
            document.body.style.fontSize = ++fontSize + "px";
        });
    }
    
    if (fontMinus) {
        fontMinus.addEventListener("click", () => {
            document.body.style.fontSize = --fontSize + "px";
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }
}

/* =====================================================
   IMAGE SLIDER SYSTEMS
===================================================== */

let sliderTimer = null;

// Main case slider
function initMainSlider() {
    const slides = document.querySelectorAll(".case-slide");
    const dots = document.querySelectorAll(".case-dots .dot");

    if (!slides.length || !dots.length) return;

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        if (slides[index]) slides[index].classList.add("active");
        if (dots[index]) dots[index].classList.add("active");
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function goToSlide(index) {
        currentIndex = index;
        showSlide(currentIndex);
        restartAutoSlide();
    }

    function restartAutoSlide() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, 6000);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
    });

    // Expose controls globally if needed
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Initialize
    showSlide(currentIndex);
    restartAutoSlide();
}

// Multiple sliders for different sections
function initMultiSliders() {
    const sliderBoxes = document.querySelectorAll(".slider-box");
    if (!sliderBoxes.length) return;

    sliderBoxes.forEach(sliderBox => {
        if (sliderBox.dataset.initialized === "true") return;

        const slides = sliderBox.querySelectorAll(".slide");
        const prevBtn = sliderBox.querySelector(".prev");
        const nextBtn = sliderBox.querySelector(".next");
        const dotsWrap = sliderBox.querySelector(".dots");

        if (!slides.length) return;

        let current = 0;

        // Create dots
        dotsWrap.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.className = "dot";
            if (index === 0) dot.classList.add("active");
            dotsWrap.appendChild(dot);

            dot.addEventListener("click", () => {
                showSlide(index);
            });
        });

        const dots = dotsWrap.querySelectorAll(".dot");

        function showSlide(index) {
            if (slides[current]) slides[current].classList.remove("active");
            if (dots[current]) dots[current].classList.remove("active");

            current = index;

            if (slides[current]) slides[current].classList.add("active");
            if (dots[current]) dots[current].classList.add("active");
        }

        function nextSlide() {
            showSlide((current + 1) % slides.length);
        }

        function prevSlide() {
            showSlide((current - 1 + slides.length) % slides.length);
        }

        // Button events
        if (nextBtn) nextBtn.addEventListener("click", nextSlide);
        if (prevBtn) prevBtn.addEventListener("click", prevSlide);

        // Auto-play
        let sliderInterval;
        function startAutoPlay() {
            clearInterval(sliderInterval);
                sliderInterval = setInterval(nextSlide, 5000);
                activeIntervals.add(sliderInterval);
        }
        
        function stopAutoPlay() {
            clearInterval(sliderInterval);
        }
        
        startAutoPlay();
        
        // Pause on hover
        sliderBox.addEventListener("mouseenter", stopAutoPlay);
        sliderBox.addEventListener("mouseleave", startAutoPlay);

        sliderBox.dataset.initialized = "true";
    });
}

/* =====================================================
   INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
===================================================== */
function initRevealAnimations(selector = ".reveal-on-scroll", threshold = 0.2) {
    const elements = $$(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold });

    elements.forEach(el => observer.observe(el));
}

/* =====================================================
   BLOG SYSTEMS
===================================================== */
// Blog data
const blogs = [
    {
        title: "Ethical Boundaries for Advocates on Digital Platforms",
        excerpt: "Understanding Bar Council of India guidelines when engaging with clients online.",
        author: "Adv. R. Sharma",
        role: "BCI Registered Advocate",
        date: "March 2025"
    },
    {
        title: "How Technology is Changing Client–Advocate Communication",
        excerpt: "Digital platforms are improving access while maintaining professional independence.",
        author: "Adv. P. Mehta",
        role: "Corporate Law",
        date: "February 2025"
    },
    {
        title: "What Clients Should Know Before Contacting an Advocate Online",
        excerpt: "Important points for clients when using digital discovery platforms.",
        author: "Legal Editorial Team",
        role: "Tatito Platform",
        date: "January 2025"
    },
    {
        title: "Why Platforms Must Not Provide Legal Advice",
        excerpt: "A clear explanation of why technology platforms must stay advisory-neutral.",
        author: "Adv. S. Iyer",
        role: "Legal Compliance",
        date: "January 2025"
    }
];

// Load blogs to homepage
function loadBlogsToHomepage() {
    const container = document.getElementById("blogContainer");
    if (!container) return;

    container.innerHTML = blogs.map(blog => `
        <article class="blog-card premium-blog">
            <div class="blog-author">
                <div class="author-avatar premium-avatar">${blog.author.charAt(0)}</div>
                <div class="author-info">
                    <strong>${blog.author}</strong>
                    <span class="author-role">${blog.role}</span>
                    <span class="author-date">${blog.date}</span>
                </div>
            </div>
            <h3 class="blog-title">${blog.title}</h3>
            <p class="blog-excerpt">${blog.excerpt}</p>
            <div class="blog-footer">
                <span class="blog-tag">Legal Awareness</span>
                <a href="#mainblogs" class="blog-btn premium-btn">Read Article →</a>
            </div>
        </article>
    `).join("");
}

// Main blogs page navigation
const mainblogs = [
    {
        title: "Building Trust in Digital Platforms",
        meta: "5 min read • Platform Insights",
        body: `<p>Trust is the foundation of any successful digital platform. In modern ecosystems, transparency, verification, and communication play a crucial role.</p>`
    },
    {
        title: "How Legal Tech Is Evolving",
        meta: "6 min read • Technology",
        body: `<p>Legal technology is transforming how users interact with professionals.</p>`
    },
    {
        title: "Choosing the Right Advocate Online",
        meta: "4 min read • User Guide",
        body: `<p>Online platforms give users access to a wide range of advocates.</p>`
    }
];

let currentBlogIndex = 0;

function loadMainBlog(index) {
    if (!mainblogs[index]) return;
    currentBlogIndex = index;

    const titleEl = document.getElementById("blg-title");
    const metaEl = document.getElementById("blg-meta");
    const bodyEl = document.getElementById("blg-body");
    const counterEl = document.getElementById("blg-counter");
    const blogListItems = $$("#blg-list li");

    if (titleEl) titleEl.textContent = mainblogs[index].title;
    if (metaEl) metaEl.textContent = mainblogs[index].meta;
    if (bodyEl) bodyEl.innerHTML = mainblogs[index].body;
    if (counterEl) counterEl.textContent = `${index + 1} of ${mainblogs.length}`;

    blogListItems.forEach((li, i) => {
        li.classList.toggle("active", i === index);
    });
}

function nextBlog() {
    if (currentBlogIndex < mainblogs.length - 1) {
        loadMainBlog(currentBlogIndex + 1);
    }
}

function prevBlog() {
    if (currentBlogIndex > 0) {
        loadMainBlog(currentBlogIndex - 1);
    }
}

function initMainBlogsPage() {
    if (document.getElementById("blg-title")) {
        loadMainBlog(0);
    }
}

/* =====================================================
   ADVOCATES DIRECTORY SYSTEM
===================================================== */
const advocates = [
    {
        name: "Sarah Mitchell",
        specialization: "Corporate Law",
        location: "Mumbai",
        experience: 15,
        image: "femalelawyer.jpg"
    },
    {
        name: "David Chen",
        specialization: "Criminal Defense",
        location: "Delhi",
        experience: 12,
        image: "malelawyer.jpg"
    },
    {
        name: "Emily Rodriguez",
        specialization: "Family Law",
        location: "Bangalore",
        experience: 10,
        image: "femalelawyer.jpg"
    }
];

let isPremiumUser = false;

function maskName(name) {
    return isPremiumUser ? name : name.split(" ").map(part => part.slice(0, 2) + "***").join(" ");
}

function renderAdvocates(list = advocates) {
    const container = document.getElementById("advocates-container");
    if (!container) return;

    container.innerHTML = list.map(advocate => `
        <div class="adv-card premium-card">
            <div class="adv-image">
                <img src="${advocate.image}" alt="Advocate profile">
            </div>
            <div class="adv-card-body">
                <h3 class="adv-name">${maskName(advocate.name)}</h3>
                <p class="adv-role">${advocate.specialization}</p>
                <p class="adv-meta">📍 ${advocate.location} <span>•</span> ${advocate.experience}+ Years Experience</p>
                <div class="adv-actions">
                    <button class="btn-outline" onclick="alert('Interest Sent!')">Interest</button>
                    <button class="btn-outline" onclick="alert('Super Interest Sent!')">Super Interest</button>
                    <button class="btn-outline" onclick="alert('Opening Profile')">View Profile</button>
                    <button class="btn-outline" onclick="alert('Opening Chat')">Chat</button>
                </div>
                <p class="adv-note">Platform facilitated connection only. No legal advice or consultation.</p>
            </div>
        </div>
    `).join("");
}

window.applyAdvocateFilters = function() {
    const location = $("#filter-location")?.value;
    const experience = $("#filter-experience")?.value;
    const specialization = $("#filter-specialization")?.value;

    const filtered = advocates.filter(advocate => {
        return (!location || advocate.location === location) &&
               (!experience || advocate.experience >= parseInt(experience)) &&
               (!specialization || advocate.specialization === specialization);
    });

    renderAdvocates(filtered);
};

/* =====================================================
   ADVOCATES/CLIENTS TOGGLE MODULE
===================================================== */
function initAdvocatesClientsToggle() {
    const grid = document.getElementById("grid");
    const advBtn = document.getElementById("advBtn");
    const clientBtn = document.getElementById("clientBtn");

    if (!grid || !advBtn || !clientBtn) return;
    if (grid.dataset.initialized === "true") return;

    const toggleAdvocates = [
        {name:"Sa*** Mi***",role:"Corporate Law",location:"Mumbai",exp:15,meta:"📍 Mumbai • 15+ Years",img:"female2.jpg"},
    {name:"Da*** Ch***",role:"Criminal Defense",location:"Delhi",exp:12,meta:"📍 Delhi • 12+ Years",img:"malelawyer.jpg"},
    {name:"Em*** Ro***",role:"Family Law",location:"Bangalore",exp:10,meta:"📍 Bangalore • 10+ Years",img:"advoate1.jpeg"},
    {name:"Sa*** Mi***",role:"Corporate Law",location:"Mumbai",exp:15,meta:"📍 Mumbai • 15+ Years",img:"malelawyer.jpg"},
    {name:"Da*** Ch***",role:"Criminal Defense",location:"Delhi",exp:12,meta:"📍 Delhi • 12+ Years",img:"advoate1.jpeg"},
    {name:"Em*** Ro***",role:"Family Law",location:"Bangalore",exp:10,meta:"📍 Bangalore • 10+ Years",img:"femalelawyer.jpg"}
    ];

    const clients = [
    {name:"Ra*** Ku***",role:"Business Owner",location:"Hyderabad",exp:15,meta:"📍 Hyderabad • Corporate Case",img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"},
    {name:"An*** Sh***",role:"IT Professional",location:"Pune",exp:12,meta:"📍 Pune • Employment Issue",img:"https://images.unsplash.com/photo-1527980965255-d3b416303d12"},
    {name:"Me*** Pa***",role:"Home Buyer",location:"Chennai",exp:10,meta:"📍 Chennai • Property Case",img:"https://images.unsplash.com/photo-1520813792240-56fc4a3765a7"},
    {name:"Ra*** Ku***",role:"Business Owner",location:"Hyderabad",exp:15,meta:"📍 Hyderabad • Corporate Case",img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"},
    {name:"An*** Sh***",role:"IT Professional",location:"Pune",exp:12,meta:"📍 Pune • Employment Issue",img:"https://images.unsplash.com/photo-1527980965255-d3b416303d12"},
    {name:"Me*** Pa***",role:"Home Buyer",location:"Chennai",exp:10,meta:"📍 Chennai • Property Case",img:"https://images.unsplash.com/photo-1520813792240-56fc4a3765a7"}
  ];

    let currentType = "advocates";

    function renderToggle(list) {
        grid.innerHTML = list.slice(0, 6).map(person => `
            <div class="blogcard">
                <div class="blogavatar" style="background-image:url('${person.img}')"></div>
                <div class="name">${person.name}</div>
                <div class="role">${person.role}</div>
                <div class="meta">${person.meta}</div>
                <div class="btn-row" >
                    <button class="btn primary" onclick="alert('Interest sent to ${person.name}')">Interest</button>
                    <button class="btn" onclick="alert('Super interest sent to ${person.name}')">Super Interest</button>
                </div>
                <div class="btn-row">
                    <button class="btn"style="margin-left:-50px;" onclick="alert('Viewing profile of ${person.name}')">View Profile</button>
                    <button class="btn" onclick="alert('Opening chat with ${person.name}')">Chat</button>
                </div>
                <div class="footer-note">Platform facilitated connection only. No legal advice.</div>
            </div>
        `).join("");
    }

    window.applyToggleFilters = function() {
        const loc = $("#locationFilter")?.value;
        const exp = $("#experienceFilter")?.value;
        const spec = $("#specializationFilter")?.value;

        const source = currentType === "advocates" ? toggleAdvocates : clients;
        const filtered = source.filter(person => {
            return (!loc || person.location === loc) &&
                   (!exp || person.exp >= exp) &&
                   (!spec || person.role === spec);
        });

        renderToggle(filtered);
    };

    window.showAdvocatesToggle = function() {
        currentType = "advocates";
        advBtn.classList.add("active");
        clientBtn.classList.remove("active");
        renderToggle(toggleAdvocates);
        resetFilters();
    };

    window.showClientsToggle = function() {
        currentType = "clients";
        clientBtn.classList.add("active");
        advBtn.classList.remove("active");
        renderToggle(clients);
        resetFilters();
    };

    function resetFilters() {
        const filters = ["locationFilter", "experienceFilter", "specializationFilter"];
        filters.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    }

    // Event listeners
    advBtn.addEventListener("click", window.showAdvocatesToggle);
    clientBtn.addEventListener("click", window.showClientsToggle);

    const locationFilter = $("#locationFilter");
    const experienceFilter = $("#experienceFilter");
    const specializationFilter = $("#specializationFilter");

    if (locationFilter) locationFilter.addEventListener("change", window.applyToggleFilters);
    if (experienceFilter) experienceFilter.addEventListener("change", window.applyToggleFilters);
    if (specializationFilter) specializationFilter.addEventListener("change", window.applyToggleFilters);

    // Initial render
    renderToggle(toggleAdvocates);
    grid.dataset.initialized = "true";

    // Cleanup function
    window.cleanupToggleModule = function() {
        advBtn.removeEventListener("click", window.showAdvocatesToggle);
        clientBtn.removeEventListener("click", window.showClientsToggle);
        
        if (locationFilter) locationFilter.removeEventListener("change", window.applyToggleFilters);
        if (experienceFilter) experienceFilter.removeEventListener("change", window.applyToggleFilters);
        if (specializationFilter) specializationFilter.removeEventListener("change", window.applyToggleFilters);
        
        delete window.showAdvocatesToggle;
        delete window.showClientsToggle;
        delete window.applyToggleFilters;
        delete window.cleanupToggleModule;
        
        grid.dataset.initialized = "false";
    };
}

/* =====================================================
   CONTACT FORM HANDLING
===================================================== */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        alert("Message sent successfully ✅");
        form.reset();
    });
}

/* =====================================================
   CONTACT POPUP SYSTEM
===================================================== */
function initContactPopup() {
    // Create popup if template exists
    const template = document.getElementById("contactPopupTemplate");
    if (!template) return;

    // Add event listeners to all contact links
    $$(".contact-link").forEach(link => {
        link.addEventListener("click", openContactPopup);
    });
}

function openContactPopup(e) {
    if (e) e.preventDefault();
    
    let popup = document.getElementById("tatitoContactPopup");
    if (popup) {
        popup.style.display = "flex";
        return;
    }
    
    const template = document.getElementById("contactPopupTemplate");
    if (!template) return;
    
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);
    
    document.addEventListener("keydown", handleContactPopupEscape);
    
    setTimeout(() => {
        const popupContainer = $(".tatito-popup-container");
        if (popupContainer) popupContainer.focus();
    }, 100);
}

function closeContactPopup(e) {
    if (e) {
        if (e.target.classList.contains("tatito-popup-overlay") ||
            e.target.classList.contains("tatito-popup-close") ||
            e.target.classList.contains("tatito-close-btn")) {
            e.preventDefault();
        }
    }
    
    const popup = document.getElementById("tatitoContactPopup");
    if (popup) popup.style.display = "none";
    
    document.removeEventListener("keydown", handleContactPopupEscape);
}

function handleContactPopupEscape(e) {
    if (e.key === "Escape") closeContactPopup();
}

function copyContactDetails() {
    const contactInfo = `E-Advocate Support Contact Details:\n\n📞 Phone: +91 70937 04706\n📧 Email: tatitoprojects@gmail.com\n📧 Email: support@tatitoprojects.com\n⏰ Hours: Mon-Fri 10 AM - 6 PM IST, Sat 10 AM - 2 PM IST\n\nFor urgent legal matters, contact local authorities.`;
    
    navigator.clipboard.writeText(contactInfo)
        .then(() => {
            const btn = $(".tatito-copy-btn");
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "✓ Copied!";
                btn.style.backgroundColor = "#4CAF50";
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "";
                }, 2000);
            }
        })
        .catch(() => {
            alert("Failed to copy to clipboard. Please copy manually.");
        });
}

/* =====================================================
   FAQ SYSTEM
===================================================== */
function initFaq() {
    $$(".faq-question").forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            $$(".faq-item").forEach(faq => {
                if (faq !== item) faq.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });
}

/* =====================================================
   USER PROFILE & NAVBAR AUTH MANAGEMENT
===================================================== */
function setAvatarInitials() {
    const avatar = document.getElementById("avatarInitials");
    const name = localStorage.getItem("userName");

    if (!avatar || !name) return;

    const initials = name
        .split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    avatar.textContent = initials;
}

function initProfileDropdown() {
    const wrapper = $(".profile-wrapper");
    const trigger = document.getElementById("profileTrigger");
    const dropdown = document.getElementById("profileDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!wrapper || !trigger || !dropdown) return;

    // Remove any existing listeners
    trigger.onclick = null;

    // Toggle dropdown
    trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        wrapper.classList.toggle("open");
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
        wrapper.classList.remove("open");
    });

    // Prevent close when clicking inside dropdown
    dropdown.addEventListener("click", function(e) {
        e.stopPropagation();
    });

    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userName");
            wrapper.classList.remove("open");
            updateNavbarAuth();
            showlay();
            location.hash = "#";
        });
    }
}

function updateNavbarAuth() {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginBtn = $(".loginnav");
    const registerBtn = $(".registernav");
    const profileNav = $(".profile-nav");

    if (loggedIn) {
        loginBtn?.classList.add("hide");
        registerBtn?.classList.add("hide");
        profileNav?.classList.add("show");
        setAvatarInitials();
        initProfileDropdown();
    } else {
        loginBtn?.classList.remove("hide");
        registerBtn?.classList.remove("hide");
        profileNav?.classList.remove("show");
    }
}

/* =====================================================
   DASHBOARD SYSTEMS
===================================================== */
function initDashboard() {
    const form = document.getElementById("dashboardForm");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            alert("Dashboard data saved (UI only)");
        });
    }
}

function initadvocateDashboard() {
    const canvas = document.getElementById("earnChart");
    if (!canvas) return;

    // Check if Chart.js is available
    if (typeof Chart === "undefined") {
        console.warn("Chart.js not loaded - skipping chart initialization");
        return;
    }

    new Chart(canvas, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                data: [45000, 52000, 48000, 61000, 58000, 70000],
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56,189,248,0.2)",
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

/* =====================================================
   BLOG GRID MODULE (EdVerse Style)
===================================================== */
function initBlogGrid() {
    const blogGrid = document.getElementById("blog-grid");
    const loader = document.getElementById("loader");

    if (!blogGrid) return;

    let page = 1;
    let loading = false;
    let isInitialized = false;

    const authors = [
        { name: "Adv. Priya Sharma", role: "Corporate Law Expert • 15+ Years", letter: "P" },
        { name: "Adv. Rajesh Kumar", role: "Criminal Defense • 12+ Years", letter: "R" }
    ];

    const blogTypes = [
        { type: "legal-news", icon: "fas fa-newspaper", label: "Legal News" },
        { type: "case-study", icon: "fas fa-gavel", label: "Case Study" }
    ];

    const topics = [
        "Digital Evidence in Modern Courtrooms: A Practical Guide",
        "Supreme Court's Latest Ruling on Digital Contracts"
    ];

    const contentSnippets = [
        "In today's digital age, legal professionals must adapt to new technologies...",
        "Recent changes in legislation have significant implications for how cases are handled..."
    ];

    const fullContents = [
        `<p>Digital transformation has revolutionized legal proceedings...</p>`,
        `<p>The Supreme Court's recent judgment sets important precedents...</p>`
    ];

    function generateBlog(id) {
        const author = authors[id % authors.length];
        const blogType = blogTypes[id % blogTypes.length];
        const topicIndex = id % topics.length;
        const hasImage = Math.random() > 0.3;
        const likes = Math.floor(Math.random() * 500) + 100;
        const comments = Math.floor(Math.random() * 100) + 20;
        const hoursAgo = Math.floor(Math.random() * 48) + 1;
        
        return {
            id,
            title: topics[topicIndex],
            excerpt: contentSnippets[id % contentSnippets.length],
            fullContent: fullContents[id % fullContents.length],
            type: blogType.type,
            typeIcon: blogType.icon,
            typeLabel: blogType.label,
            author: author.name,
            authorRole: author.role,
            avatarLetter: author.letter,
            date: hoursAgo > 24 ? 
                `${Math.floor(hoursAgo / 24)} days ago` : 
                `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`,
            hasImage,
            likes,
            comments
        };
    }

    function createBlogCard(blog) {
        const card = document.createElement("article");
        card.className = "blog-card";
        card.dataset.id = blog.id;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="author-info">
                    <div class="avatar">${blog.avatarLetter}</div>
                    <div class="author-details">
                        <h3>${blog.author}</h3>
                        <p>${blog.authorRole} • ${blog.date}</p>
                    </div>
                </div>
                <button class="bookmark-btn" aria-label="Bookmark this post">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
            
            <div class="badge-container">
                <span class="badge ${blog.type}">
                    <i class="${blog.typeIcon}"></i>
                    ${blog.typeLabel}
                </span>
            </div>
            
            <div class="card-content">
                <h2>${blog.title}</h2>
                <p>${blog.excerpt}</p>
                ${blog.hasImage ? "<div class='post-image'></div>" : ""}
            </div>
            
            <div class="card-footer">
                <div class="interactions">
                    <div class="interaction-item">
                        <button class="like-btn" aria-label="Like this post">
                            <i class="far fa-heart"></i>
                        </button>
                        <span class="like-count">${blog.likes}</span>
                    </div>
                    <div class="interaction-item">
                        <i class="fas fa-comment comment-btn"></i>
                        <span>${blog.comments}</span>
                    </div>
                </div>
                <button class="share-btn" aria-label="Share this post">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        `;
        
        return card;
    }


function throttle(fn, limit = 200) {
  let waiting = false;
  return function (...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => waiting = false, limit);
    }
  };
}



    function loadBlogs() {
        if (loading) return;
        loading = true;
        
        if (loader) loader.classList.remove("hidden");
        
        setTimeout(() => {
            for (let i = 1; i <= 4; i++) {
                const id = (page - 1) * 4 + i;
                const blog = generateBlog(id);
                blogGrid.appendChild(createBlogCard(blog));
            }
            
            page++;
            loading = false;
            
            if (loader) loader.classList.add("hidden");
            attachCardEvents();
        }, 800);
    }

    function attachCardEvents() {
        // Bookmark buttons
        $$(".bookmark-btn").forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const icon = this.querySelector("i");
                icon.classList.toggle("fas");
                icon.classList.toggle("far");
            };
        });
        
        // Like buttons
        $$(".like-btn").forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const icon = this.querySelector("i");
                const likeCount = this.nextElementSibling;
                
                if (icon.classList.contains("fas")) {
                    icon.classList.remove("fas");
                    icon.classList.add("far");
                    likeCount.textContent = parseInt(likeCount.textContent) - 1;
                } else {
                    icon.classList.remove("far");
                    icon.classList.add("fas");
                    likeCount.textContent = parseInt(likeCount.textContent) + 1;
                }
            };
        });
        
        // Share buttons
        $$(".share-btn").forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const card = this.closest(".blog-card");
                const title = card.querySelector("h2").textContent;
                alert(`Sharing: "${title}"`);
            };
        });
        
        // Card click to view full content
        $$(".blog-card").forEach(card => {
            card.onclick = function(e) {
                if (e.target.closest("button") || e.target.tagName === "BUTTON" || 
                    e.target.tagName === "I") {
                    return;
                }
                
                const title = this.querySelector("h2").textContent;
                alert(`Opening full article: ${title}\n\nIn a real application, this would open a detailed view.`);
            };
        });
    }

    if (!isInitialized) {
        loadBlogs();
        
        const scrollHandler = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
                loadBlogs();
            }
        };
        
window.addEventListener("scroll", throttle(scrollHandler, 200));
        isInitialized = true;
        
        window.cleanupBlogGrid = () => {
            window.removeEventListener("scroll", scrollHandler);
            delete window.cleanupBlogGrid;
            isInitialized = false;
        };
    }
}

// location 


function initEnhancedLocationPage() {

  /* ================= DATA ================= */
const data = {
  "Andhra Pradesh": {
    "Alluri Sitharama Raju": ["Paderu", "Araku Valley", "Chintapalle"],
    "Anakapalli": ["Anakapalle", "Elamanchili", "Narsipatnam"],
    "Annamayya": ["Rayachoti", "Madanapalle", "Rajampet"],
    "Bapatla": ["Bapatla", "Chirala", "Repalle"],
    "Chittoor": ["Chittoor", "Palamaner", "Nagari"],
    "Dr. B.R. Ambedkar Konaseema": ["Amalapuram", "Razole", "Mummidivaram"],
    "East Godavari": ["Rajamahendravaram", "Mandapeta", "Rajanagaram"],
    "Eluru": ["Eluru", "Nuzvid", "Jangareddygudem"],
    "Guntur": ["Guntur", "Tenali", "Mangalagiri"],
    "Kakinada": ["Kakinada", "Samalkota", "Peddapuram"],
    "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada"],
    "Kurnool": ["Kurnool", "Adoni", "Yemmiganur"],
    "Markapuram": ["Markapuram", "Yerragondapalem", "Dornala"],
    "Nandyal": ["Nandyal", "Banaganapalle", "Atmakur"],
    "NTR": ["Vijayawada", "Nandigama", "Jaggayyapeta"],
    "Palnadu": ["Narasaraopet", "Piduguralla", "Sattenapalle"],
    "Parvathipuram Manyam": ["Parvathipuram", "Salur", "Kurupam"],
    "Polavaram": ["Polavaram", "Buttayagudem", "Gopalapuram"],
    "Prakasam": ["Ongole", "Chirala", "Kandukur"],
    "Satya Sai": ["Puttaparthi", "Dharmavaram", "Hindupur"],
    "Sri Balaji": ["Tirupati", "Srikalahasti", "Renigunta"],
    "Srikakulam": ["Srikakulam", "Palasa", "Amadalavalasa"],
    "Tirupati": ["Tirupati", "Chandragiri", "Srikalahasti"],
    "Visakhapatnam": ["Visakhapatnam", "Bheemunipatnam", "Anakapalle"],
    "Vizianagaram": ["Vizianagaram", "Bobbili", "Cheepurupalli"],
    "West Godavari": ["Bhimavaram", "Tadepalligudem", "Narasapuram"],
    "YSR Kadapa": ["Kadapa", "Proddatur", "Pulivendula"]
  },

  "Arunachal Pradesh": {
    "Anjaw": ["Hawai"],
    "Changlang": ["Changlang", "Jairampur"],
    "Dibang Valley": ["Anini"],
    "East Kameng": ["Seppa"],
    "East Siang": ["Pasighat"],
    "Kamle": ["Raga"],
    "Kra Daadi": ["Palin"],
    "Kurung Kumey": ["Koloriang"],
    "Lepa Rada": ["Basar"],
    "Lohit": ["Tezu"],
    "Longding": ["Longding"],
    "Lower Dibang Valley": ["Roing"],
    "Lower Siang": ["Likabali"],
    "Lower Subansiri": ["Ziro"],
    "Namsai": ["Namsai"],
    "Pakke Kessang": ["Lemmi"],
    "Papum Pare": ["Yupia", "Doimukh"],
    "Shi Yomi": ["Tato"],
    "Siang": ["Boleng"],
    "Tawang": ["Tawang"],
    "Tirap": ["Khonsa"],
    "Upper Siang": ["Yingkiong"],
    "Upper Subansiri": ["Daporijo"],
    "West Kameng": ["Bomdila"],
    "West Siang": ["Aalo"],
    "Itanagar Capital Complex": ["Itanagar", "Naharlagun"]
  },

  "Assam": {
    "Bajali": ["Pathsala"],
    "Baksa": ["Mushalpur"],
    "Barpeta": ["Barpeta", "Howly"],
    "Biswanath": ["Biswanath Chariali"],
    "Bongaigaon": ["Bongaigaon"],
    "Cachar": ["Silchar"],
    "Charaideo": ["Sonari"],
    "Chirang": ["Kajalgaon"],
    "Darrang": ["Mangaldoi"],
    "Dhemaji": ["Dhemaji"],
    "Dhubri": ["Dhubri"],
    "Dibrugarh": ["Dibrugarh"],
    "Goalpara": ["Goalpara"],
    "Golaghat": ["Golaghat"],
    "Hailakandi": ["Hailakandi"],
    "Hojai": ["Hojai"],
    "Jorhat": ["Jorhat"],
    "Kamrup": ["Rangia"],
    "Kamrup Metropolitan": ["Guwahati"],
    "Karbi Anglong": ["Diphu"],
    "Karimganj": ["Karimganj"],
    "Kokrajhar": ["Kokrajhar"],
    "Lakhimpur": ["North Lakhimpur"],
    "Majuli": ["Garamur"],
    "Morigaon": ["Morigaon"],
    "Nagaon": ["Nagaon"],
    "Nalbari": ["Nalbari"],
    "Sivasagar": ["Sivasagar"],
    "Sonitpur": ["Tezpur"],
    "South Salmara-Mankachar": ["Hatsingimari"],
    "Tinsukia": ["Tinsukia"],
    "Udalguri": ["Udalguri"],
    "West Karbi Anglong": ["Hamren"]
  },
  "Bihar": {
    "Araria": ["Araria", "Forbesganj", "Jokihat"],
    "Arwal": ["Arwal", "Kaler"],
    "Aurangabad": ["Aurangabad", "Daudnagar", "Rafiganj"],
    "Banka": ["Banka", "Amarpur"],
    "Begusarai": ["Begusarai", "Barauni", "Teghra"],
    "Bhagalpur": ["Bhagalpur", "Naugachia", "Sabour"],
    "Bhojpur": ["Arrah", "Piro", "Jagdishpur"],
    "Buxar": ["Buxar", "Dumraon"],
    "Darbhanga": ["Darbhanga", "Hayaghat", "Benipur"],
    "East Champaran": ["Motihari", "Raxaul", "Chakia"],
    "Gaya": ["Gaya", "Tekari", "Sherghati"],
    "Gopalganj": ["Gopalganj", "Thawe"],
    "Jamui": ["Jamui", "Jhajha"],
    "Jehanabad": ["Jehanabad", "Makhdumpur"],
    "Kaimur": ["Bhabua", "Mohania"],
    "Katihar": ["Katihar", "Manihari", "Barsoi"],
    "Khagaria": ["Khagaria", "Gogri"],
    "Kishanganj": ["Kishanganj", "Bahadurganj"],
    "Lakhisarai": ["Lakhisarai", "Barahiya"],
    "Madhepura": ["Madhepura", "Bihariganj"],
    "Madhubani": ["Madhubani", "Jhanjharpur", "Benipatti"],
    "Munger": ["Munger", "Jamalpur"],
    "Muzaffarpur": ["Muzaffarpur", "Kanti", "Saraiya"],
    "Nalanda": ["Bihar Sharif", "Rajgir", "Harnaut"],
    "Nawada": ["Nawada", "Hisua"],
    "Patna": ["Patna", "Danapur", "Phulwari Sharif"],
    "Purnia": ["Purnia", "Banmankhi"],
    "Rohtas": ["Sasaram", "Dehri"],
    "Saharsa": ["Saharsa", "Simri Bakhtiarpur"],
    "Samastipur": ["Samastipur", "Dalsinghsarai"],
    "Saran": ["Chhapra", "Marhaura"],
    "Sheikhpura": ["Sheikhpura", "Barbigha"],
    "Sheohar": ["Sheohar", "Piprarhi"],
    "Sitamarhi": ["Sitamarhi", "Belsand"],
    "Siwan": ["Siwan", "Maharajganj"],
    "Supaul": ["Supaul", "Birpur"],
    "Vaishali": ["Hajipur", "Mahnar"],
    "West Champaran": ["Bettiah", "Narkatiaganj"]
  },

  "Chhattisgarh": {
    "Balod": ["Balod", "Dondi"],
    "Baloda Bazar": ["Baloda Bazar", "Bhatapara"],
    "Balrampur": ["Balrampur", "Rajpur"],
    "Bastar": ["Jagdalpur", "Kondagaon"],
    "Bemetara": ["Bemetara", "Saja"],
    "Bijapur": ["Bijapur", "Bhairamgarh"],
    "Bilaspur": ["Bilaspur", "Takhatpur"],
    "Dantewada": ["Dantewada", "Gidam"],
    "Dhamtari": ["Dhamtari", "Kurud"],
    "Durg": ["Durg", "Bhilai"],
    "Gariaband": ["Gariaband", "Rajim"],
    "Janjgir-Champa": ["Janjgir", "Champa"],
    "Jashpur": ["Jashpur Nagar", "Pathalgaon"],
    "Kabirdham": ["Kawardha", "Pandariya"],
    "Kanker": ["Kanker", "Antagarh"],
    "Kondagaon": ["Kondagaon", "Makdi"],
    "Korba": ["Korba", "Katghora"],
    "Korea": ["Baikunthpur", "Manendragarh"],
    "Mahasamund": ["Mahasamund", "Pithora"],
    "Mungeli": ["Mungeli", "Lormi"],
    "Narayanpur": ["Narayanpur", "Orchha"],
    "Raigarh": ["Raigarh", "Kharsia"],
    "Raipur": ["Raipur", "Arang"],
    "Rajnandgaon": ["Rajnandgaon", "Dongargarh"],
    "Sukma": ["Sukma", "Kontaa"],
    "Surajpur": ["Surajpur", "Pratappur"],
    "Surguja": ["Ambikapur", "Sitapur"]
  },

  "Goa": {
    "North Goa": ["Panaji", "Mapusa", "Pernem"],
    "South Goa": ["Margao", "Vasco da Gama", "Canacona"]
  },

  "Gujarat": {
    "Ahmedabad": ["Ahmedabad", "Sanand", "Dholka"],
    "Amreli": ["Amreli", "Savarkundla"],
    "Anand": ["Anand", "Petlad"],
    "Aravalli": ["Modasa", "Bayad"],
    "Banaskantha": ["Palanpur", "Deesa"],
    "Bharuch": ["Bharuch", "Ankleshwar"],
    "Bhavnagar": ["Bhavnagar", "Mahuva"],
    "Botad": ["Botad", "Gadhada"],
    "Chhota Udaipur": ["Chhota Udaipur", "Bodeli"],
    "Dahod": ["Dahod", "Limkheda"],
    "Dang": ["Ahwa"],
    "Devbhoomi Dwarka": ["Dwarka", "Khambhalia"],
    "Gandhinagar": ["Gandhinagar", "Kalol"],
    "Gir Somnath": ["Veraval", "Kodinar"],
    "Jamnagar": ["Jamnagar", "Dhrol"],
    "Junagadh": ["Junagadh", "Keshod"],
    "Kheda": ["Nadiad", "Kapadvanj"],
    "Kutch": ["Bhuj", "Gandhidham"],
    "Mahisagar": ["Lunawada", "Balasinor"],
    "Mehsana": ["Mehsana", "Visnagar"],
    "Morbi": ["Morbi", "Wankaner"],
    "Narmada": ["Rajpipla"],
    "Navsari": ["Navsari", "Bilimora"],
    "Panchmahal": ["Godhra", "Halol"],
    "Patan": ["Patan", "Sidhpur"],
    "Porbandar": ["Porbandar", "Kutiyana"],
    "Rajkot": ["Rajkot", "Gondal"],
    "Sabarkantha": ["Himmatnagar", "Idar"],
    "Surat": ["Surat", "Bardoli"],
    "Surendranagar": ["Surendranagar", "Wadhwan"],
    "Tapi": ["Vyara"],
    "Vadodara": ["Vadodara", "Padra"],
    "Valsad": ["Valsad", "Vapi"]
  },

  "Haryana": {
    "Ambala": ["Ambala", "Naraingarh"],
    "Bhiwani": ["Bhiwani", "Loharu"],
    "Charkhi Dadri": ["Charkhi Dadri", "Badhra"],
    "Faridabad": ["Faridabad", "Ballabhgarh"],
    "Fatehabad": ["Fatehabad", "Tohana"],
    "Gurugram": ["Gurugram", "Sohna"],
    "Hisar": ["Hisar", "Hansi"],
    "Jhajjar": ["Jhajjar", "Bahadurgarh"],
    "Jind": ["Jind", "Narwana"],
    "Kaithal": ["Kaithal", "Guhla"],
    "Karnal": ["Karnal", "Assandh"],
    "Kurukshetra": ["Thanesar", "Pehowa"],
    "Mahendragarh": ["Narnaul", "Mahendragarh"],
    "Nuh": ["Nuh", "Punhana"],
    "Palwal": ["Palwal", "Hodal"],
    "Panchkula": ["Panchkula", "Kalka"],
    "Panipat": ["Panipat", "Samalkha"],
    "Rewari": ["Rewari", "Bawal"],
    "Rohtak": ["Rohtak", "Meham"],
    "Sirsa": ["Sirsa", "Ellenabad"],
    "Sonipat": ["Sonipat", "Gohana"],
    "Yamunanagar": ["Yamunanagar", "Jagadhri"]
  },

  "Himachal Pradesh": {
    "Bilaspur": ["Bilaspur", "Ghumarwin"],
    "Chamba": ["Chamba", "Dalhousie"],
    "Hamirpur": ["Hamirpur", "Nadaun"],
    "Kangra": ["Dharamshala", "Palampur"],
    "Kinnaur": ["Reckong Peo"],
    "Kullu": ["Kullu", "Manali"],
    "Lahaul and Spiti": ["Keylong"],
    "Mandi": ["Mandi", "Sundernagar"],
    "Shimla": ["Shimla", "Rohru"],
    "Sirmaur": ["Nahan", "Paonta Sahib"],
    "Solan": ["Solan", "Nalagarh"],
    "Una": ["Una", "Amb"]
  },

  "Jharkhand": {
    "Bokaro": ["Bokaro Steel City", "Chandrapura"],
    "Chatra": ["Chatra", "Hunterganj"],
    "Deoghar": ["Deoghar", "Madhupur"],
    "Dhanbad": ["Dhanbad", "Jharia"],
    "Dumka": ["Dumka", "Jamtara"],
    "East Singhbhum": ["Jamshedpur", "Ghatshila"],
    "Garhwa": ["Garhwa", "Nagar Untari"],
    "Giridih": ["Giridih", "Jamua"],
    "Godda": ["Godda", "Mahagama"],
    "Gumla": ["Gumla", "Sisai"],
    "Hazaribagh": ["Hazaribagh", "Barhi"],
    "Jamtara": ["Jamtara", "Nala"],
    "Khunti": ["Khunti", "Tamar"],
    "Koderma": ["Koderma", "Jhumri Telaiya"],
    "Latehar": ["Latehar", "Barwadih"],
    "Lohardaga": ["Lohardaga", "Kisko"],
    "Pakur": ["Pakur", "Hiranpur"],
    "Palamu": ["Medininagar", "Hussainabad"],
    "Ramgarh": ["Ramgarh", "Patratu"],
    "Ranchi": ["Ranchi", "Bundu"],
    "Sahibganj": ["Sahibganj", "Rajmahal"],
    "Seraikela Kharsawan": ["Seraikela", "Chandil"],
    "Simdega": ["Simdega", "Kolebira"],
    "West Singhbhum": ["Chaibasa", "Chakradharpur"]
  },
   "Karnataka": {
    "Bagalkot": ["Bagalkot", "Jamkhandi"],
    "Ballari": ["Ballari", "Hospet"],
    "Belagavi": ["Belagavi", "Gokak"],
    "Bengaluru Rural": ["Devanahalli", "Doddaballapur"],
    "Bengaluru Urban": ["Bengaluru", "Yelahanka", "Whitefield"],
    "Bidar": ["Bidar", "Basavakalyan"],
    "Chamarajanagar": ["Chamarajanagar", "Gundlupet"],
    "Chikkaballapur": ["Chikkaballapur", "Gauribidanur"],
    "Chikkamagaluru": ["Chikkamagaluru", "Kadur"],
    "Chitradurga": ["Chitradurga", "Hiriyur"],
    "Dakshina Kannada": ["Mangaluru", "Puttur"],
    "Davangere": ["Davangere", "Harihar"],
    "Dharwad": ["Dharwad", "Hubballi"],
    "Gadag": ["Gadag", "Mundargi"],
    "Hassan": ["Hassan", "Arsikere"],
    "Haveri": ["Haveri", "Ranebennur"],
    "Kalaburagi": ["Kalaburagi", "Aland"],
    "Kodagu": ["Madikeri", "Virajpet"],
    "Kolar": ["Kolar", "Malur"],
    "Koppal": ["Koppal", "Gangavati"],
    "Mandya": ["Mandya", "Maddur"],
    "Mysuru": ["Mysuru", "Nanjangud"],
    "Raichur": ["Raichur", "Sindhanur"],
    "Ramanagara": ["Ramanagara", "Channapatna"],
    "Shivamogga": ["Shivamogga", "Bhadravati"],
    "Tumakuru": ["Tumakuru", "Tiptur"],
    "Udupi": ["Udupi", "Kundapura"],
    "Uttara Kannada": ["Karwar", "Sirsi"],
    "Vijayanagara": ["Hospet", "Kudligi"],
    "Vijayapura": ["Vijayapura", "Indi"],
    "Yadgir": ["Yadgir", "Shorapur"]
  },

  "Kerala": {
    "Alappuzha": ["Alappuzha", "Kayamkulam"],
    "Ernakulam": ["Kochi", "Aluva"],
    "Idukki": ["Thodupuzha", "Munnar"],
    "Kannur": ["Kannur", "Taliparamba"],
    "Kasaragod": ["Kasaragod", "Kanhangad"],
    "Kollam": ["Kollam", "Punalur"],
    "Kottayam": ["Kottayam", "Changanassery"],
    "Kozhikode": ["Kozhikode", "Vadakara"],
    "Malappuram": ["Malappuram", "Tirur"],
    "Palakkad": ["Palakkad", "Ottapalam"],
    "Pathanamthitta": ["Pathanamthitta", "Adoor"],
    "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara"],
    "Thrissur": ["Thrissur", "Irinjalakuda"],
    "Wayanad": ["Kalpetta", "Mananthavady"]
  },

  "Madhya Pradesh": {
    "Agar Malwa": ["Agar"],
    "Alirajpur": ["Alirajpur", "Jobat"],
    "Anuppur": ["Anuppur", "Kotma"],
    "Ashoknagar": ["Ashoknagar", "Chanderi"],
    "Balaghat": ["Balaghat", "Baihar"],
    "Barwani": ["Barwani", "Sendhwa"],
    "Betul": ["Betul", "Multai"],
    "Bhind": ["Bhind", "Gohad"],
    "Bhopal": ["Bhopal", "Berasia"],
    "Burhanpur": ["Burhanpur", "Nepanagar"],
    "Chhatarpur": ["Chhatarpur", "Nowgong"],
    "Chhindwara": ["Chhindwara", "Pandhurna"],
    "Damoh": ["Damoh", "Patharia"],
    "Datia": ["Datia", "Bhander"],
    "Dewas": ["Dewas", "Bagli"],
    "Dhar": ["Dhar", "Manawar"],
    "Dindori": ["Dindori", "Shahpura"],
    "Guna": ["Guna", "Raghogarh"],
    "Gwalior": ["Gwalior", "Dabra"],
    "Harda": ["Harda", "Timarni"],
    "Hoshangabad": ["Itarsi", "Pipariya"],
    "Indore": ["Indore", "Mhow"],
    "Jabalpur": ["Jabalpur", "Patan"],
    "Jhabua": ["Jhabua", "Thandla"],
    "Katni": ["Katni", "Vijayraghavgarh"],
    "Khandwa": ["Khandwa", "Pandhana"],
    "Khargone": ["Khargone", "Sanawad"],
    "Mandla": ["Mandla", "Nainpur"],
    "Mandsaur": ["Mandsaur", "Garoth"],
    "Morena": ["Morena", "Ambah"],
    "Narmadapuram": ["Hoshangabad", "Babai"],
    "Neemuch": ["Neemuch", "Manasa"],
    "Narsinghpur": ["Narsinghpur", "Gadarwara"],
    "Panna": ["Panna", "Ajaigarh"],
    "Raisen": ["Raisen", "Bareli"],
    "Rajgarh": ["Rajgarh", "Biaora"],
    "Ratlam": ["Ratlam", "Jaora"],
    "Rewa": ["Rewa", "Mauganj"],
    "Sagar": ["Sagar", "Bina"],
    "Satna": ["Satna", "Maihar"],
    "Sehore": ["Sehore", "Ashta"],
    "Seoni": ["Seoni", "Lakhnadon"],
    "Shahdol": ["Shahdol", "Burhar"],
    "Shajapur": ["Shajapur", "Agar"],
    "Sheopur": ["Sheopur", "Vijaypur"],
    "Shivpuri": ["Shivpuri", "Pichhore"],
    "Sidhi": ["Sidhi", "Churhat"],
    "Singrauli": ["Singrauli", "Waidhan"],
    "Tikamgarh": ["Tikamgarh", "Niwari"],
    "Ujjain": ["Ujjain", "Nagda"],
    "Umaria": ["Umaria", "Pali"],
    "Vidisha": ["Vidisha", "Basoda"]
  },

  "Maharashtra": {
    "Ahmednagar": ["Ahmednagar", "Shrirampur"],
    "Akola": ["Akola", "Akot"],
    "Amravati": ["Amravati", "Badnera"],
    "Aurangabad": ["Aurangabad", "Paithan"],
    "Beed": ["Beed", "Georai"],
    "Bhandara": ["Bhandara", "Tumsar"],
    "Buldhana": ["Buldhana", "Khamgaon"],
    "Chandrapur": ["Chandrapur", "Ballarpur"],
    "Dhule": ["Dhule", "Shirpur"],
    "Gadchiroli": ["Gadchiroli", "Aheri"],
    "Gondia": ["Gondia", "Tirora"],
    "Hingoli": ["Hingoli", "Kalamnuri"],
    "Jalgaon": ["Jalgaon", "Bhusawal"],
    "Jalna": ["Jalna", "Partur"],
    "Kolhapur": ["Kolhapur", "Ichalkaranji"],
    "Latur": ["Latur", "Udgir"],
    "Mumbai City": ["Mumbai"],
    "Mumbai Suburban": ["Andheri", "Borivali"],
    "Nagpur": ["Nagpur", "Katol"],
    "Nanded": ["Nanded", "Deglur"],
    "Nandurbar": ["Nandurbar", "Shahada"],
    "Nashik": ["Nashik", "Malegaon"],
    "Osmanabad": ["Osmanabad", "Tuljapur"],
    "Palghar": ["Palghar", "Vasai"],
    "Parbhani": ["Parbhani", "Manwath"],
    "Pune": ["Pune", "Baramati"],
    "Raigad": ["Alibag", "Panvel"],
    "Ratnagiri": ["Ratnagiri", "Chiplun"],
    "Sangli": ["Sangli", "Miraj"],
    "Satara": ["Satara", "Karad"],
    "Sindhudurg": ["Sawantwadi", "Kudal"],
    "Solapur": ["Solapur", "Pandharpur"],
    "Thane": ["Thane", "Kalyan"],
    "Wardha": ["Wardha", "Hinganghat"],
    "Washim": ["Washim", "Karanja"],
    "Yavatmal": ["Yavatmal", "Pusad"]
  },

  "Manipur": {
    "Bishnupur": ["Bishnupur", "Nambol"],
    "Chandel": ["Chandel", "Moreh"],
    "Churachandpur": ["Churachandpur"],
    "Imphal East": ["Porompat"],
    "Imphal West": ["Imphal"],
    "Jiribam": ["Jiribam"],
    "Kakching": ["Kakching"],
    "Kamjong": ["Kamjong"],
    "Kangpokpi": ["Kangpokpi"],
    "Noney": ["Noney"],
    "Pherzawl": ["Pherzawl"],
    "Senapati": ["Senapati"],
    "Tamenglong": ["Tamenglong"],
    "Tengnoupal": ["Tengnoupal"],
    "Thoubal": ["Thoubal"],
    "Ukhrul": ["Ukhrul"]
  },

  "Meghalaya": {
    "East Garo Hills": ["Williamnagar"],
    "East Jaintia Hills": ["Khliehriat"],
    "East Khasi Hills": ["Shillong"],
    "Eastern West Khasi Hills": ["Mairang"],
    "North Garo Hills": ["Resubelpara"],
    "Ri-Bhoi": ["Nongpoh"],
    "South Garo Hills": ["Baghmara"],
    "South West Garo Hills": ["Ampati"],
    "South West Khasi Hills": ["Mawkyrwat"],
    "West Garo Hills": ["Tura"],
    "West Jaintia Hills": ["Jowai"],
    "West Khasi Hills": ["Nongstoin"]
  },

  "Mizoram": {
    "Aizawl": ["Aizawl"],
    "Champhai": ["Champhai"],
    "Hnahthial": ["Hnahthial"],
    "Khawzawl": ["Khawzawl"],
    "Kolasib": ["Kolasib"],
    "Lawngtlai": ["Lawngtlai"],
    "Lunglei": ["Lunglei"],
    "Mamit": ["Mamit"],
    "Saiha": ["Saiha"],
    "Saitual": ["Saitual"],
    "Serchhip": ["Serchhip"]
  },

  "Nagaland": {
    "Chümoukedima": ["Chümoukedima"],
    "Dimapur": ["Dimapur"],
    "Kiphire": ["Kiphire"],
    "Kohima": ["Kohima"],
    "Longleng": ["Longleng"],
    "Mokokchung": ["Mokokchung"],
    "Mon": ["Mon"],
    "Niuland": ["Niuland"],
    "Noklak": ["Noklak"],
    "Peren": ["Peren"],
    "Phek": ["Phek"],
    "Shamator": ["Shamator"],
    "Tseminyü": ["Tseminyü"],
    "Tuensang": ["Tuensang"],
    "Wokha": ["Wokha"],
    "Zunheboto": ["Zunheboto"]
  },

  "Odisha": {
    "Angul": ["Angul", "Talcher"],
    "Balangir": ["Balangir", "Titlagarh"],
    "Balasore": ["Balasore", "Jaleswar"],
    "Bargarh": ["Bargarh", "Padampur"],
    "Bhadrak": ["Bhadrak", "Basudevpur"],
    "Boudh": ["Boudh"],
    "Cuttack": ["Cuttack", "Choudwar"],
    "Deogarh": ["Deogarh"],
    "Dhenkanal": ["Dhenkanal", "Kamakhyanagar"],
    "Gajapati": ["Paralakhemundi"],
    "Ganjam": ["Berhampur", "Chhatrapur"],
    "Jagatsinghpur": ["Jagatsinghpur", "Paradip"],
    "Jajpur": ["Jajpur", "Vyasanagar"],
    "Jharsuguda": ["Jharsuguda", "Belpahar"],
    "Kalahandi": ["Bhawanipatna", "Junagarh"],
    "Kandhamal": ["Phulbani"],
    "Kendrapara": ["Kendrapara", "Pattamundai"],
    "Kendujhar": ["Keonjhar", "Barbil"],
    "Khordha": ["Bhubaneswar", "Jatni"],
    "Koraput": ["Koraput", "Jeypore"],
    "Malkangiri": ["Malkangiri"],
    "Mayurbhanj": ["Baripada", "Rairangpur"],
    "Nabarangpur": ["Nabarangpur"],
    "Nayagarh": ["Nayagarh"],
    "Nuapada": ["Nuapada", "Khariar"],
    "Puri": ["Puri", "Konark"],
    "Rayagada": ["Rayagada", "Gunupur"],
    "Sambalpur": ["Sambalpur", "Hirakud"],
    "Subarnapur": ["Sonepur"],
    "Sundargarh": ["Sundargarh", "Rourkela"]
  },

  "Punjab": {
    "Amritsar": ["Amritsar", "Ajnala"],
    "Barnala": ["Barnala"],
    "Bathinda": ["Bathinda", "Raman"],
    "Faridkot": ["Faridkot"],
    "Fatehgarh Sahib": ["Fatehgarh Sahib"],
    "Fazilka": ["Fazilka", "Abohar"],
    "Firozpur": ["Firozpur", "Zira"],
    "Gurdaspur": ["Gurdaspur", "Pathankot"],
    "Hoshiarpur": ["Hoshiarpur", "Mukerian"],
    "Jalandhar": ["Jalandhar", "Phillaur"],
    "Kapurthala": ["Kapurthala", "Phagwara"],
    "Ludhiana": ["Ludhiana", "Khanna"],
    "Malerkotla": ["Malerkotla"],
    "Mansa": ["Mansa", "Budhlada"],
    "Moga": ["Moga"],
    "Mohali": ["Mohali", "Kharar"],
    "Muktsar": ["Sri Muktsar Sahib"],
    "Pathankot": ["Pathankot"],
    "Patiala": ["Patiala", "Rajpura"],
    "Rupnagar": ["Rupnagar", "Anandpur Sahib"],
    "Sangrur": ["Sangrur", "Sunam"],
    "Shaheed Bhagat Singh Nagar": ["Nawanshahr"],
    "Tarn Taran": ["Tarn Taran"]
  },
   "Rajasthan": {
    "Ajmer": ["Ajmer", "Pushkar"],
    "Alwar": ["Alwar", "Behror"],
    "Anupgarh": ["Anupgarh"],
    "Balotra": ["Balotra"],
    "Banswara": ["Banswara"],
    "Baran": ["Baran"],
    "Barmer": ["Barmer"],
    "Beawar": ["Beawar"],
    "Bharatpur": ["Bharatpur", "Deeg"],
    "Bhilwara": ["Bhilwara"],
    "Bikaner": ["Bikaner"],
    "Bundi": ["Bundi"],
    "Chittorgarh": ["Chittorgarh"],
    "Churu": ["Churu", "Ratangarh"],
    "Dausa": ["Dausa"],
    "Deeg": ["Deeg"],
    "Dholpur": ["Dholpur"],
    "Didwana-Kuchaman": ["Didwana", "Kuchaman"],
    "Dungarpur": ["Dungarpur"],
    "Gangapur City": ["Gangapur City"],
    "Hanumangarh": ["Hanumangarh", "Sangaria"],
    "Jaipur": ["Jaipur"],
    "Jaipur Rural": ["Chomu", "Kotputli"],
    "Jaisalmer": ["Jaisalmer"],
    "Jalore": ["Jalore"],
    "Jhalawar": ["Jhalawar"],
    "Jhunjhunu": ["Jhunjhunu"],
    "Jodhpur": ["Jodhpur"],
    "Jodhpur Rural": ["Bilara"],
    "Karauli": ["Karauli"],
    "Kekri": ["Kekri"],
    "Kotputli-Behror": ["Kotputli", "Behror"],
    "Khairthal-Tijara": ["Tijara"],
    "Nagaur": ["Nagaur", "Ladnun"],
    "Neem ka Thana": ["Neem ka Thana"],
    "Pali": ["Pali"],
    "Phalodi": ["Phalodi"],
    "Pratapgarh": ["Pratapgarh"],
    "Rajsamand": ["Rajsamand", "Nathdwara"],
    "Salumbar": ["Salumbar"],
    "Sanchore": ["Sanchore"],
    "Sawai Madhopur": ["Sawai Madhopur"],
    "Sikar": ["Sikar"],
    "Sirohi": ["Sirohi", "Mount Abu"],
    "Sri Ganganagar": ["Sri Ganganagar"],
    "Tonk": ["Tonk"],
    "Udaipur": ["Udaipur"]
  },

  "Sikkim": {
    "Gangtok": ["Gangtok"],
    "Mangan": ["Mangan"],
    "Namchi": ["Namchi"],
    "Pakyong": ["Pakyong"],
    "Soreng": ["Soreng"],
    "Gyalshing": ["Gyalshing"]
  },

  "Tamil Nadu": {
    "Ariyalur": ["Ariyalur"],
    "Chengalpattu": ["Chengalpattu"],
    "Chennai": ["Chennai"],
    "Coimbatore": ["Coimbatore", "Pollachi"],
    "Cuddalore": ["Cuddalore", "Chidambaram"],
    "Dharmapuri": ["Dharmapuri"],
    "Dindigul": ["Dindigul", "Palani"],
    "Erode": ["Erode", "Gobichettipalayam"],
    "Kallakurichi": ["Kallakurichi"],
    "Kancheepuram": ["Kancheepuram"],
    "Kanniyakumari": ["Nagercoil"],
    "Karur": ["Karur"],
    "Krishnagiri": ["Krishnagiri", "Hosur"],
    "Madurai": ["Madurai"],
    "Mayiladuthurai": ["Mayiladuthurai"],
    "Nagapattinam": ["Nagapattinam"],
    "Namakkal": ["Namakkal"],
    "Nilgiris": ["Ooty", "Coonoor"],
    "Perambalur": ["Perambalur"],
    "Pudukkottai": ["Pudukkottai"],
    "Ramanathapuram": ["Ramanathapuram"],
    "Ranipet": ["Ranipet"],
    "Salem": ["Salem"],
    "Sivaganga": ["Sivaganga"],
    "Tenkasi": ["Tenkasi"],
    "Thanjavur": ["Thanjavur"],
    "Theni": ["Theni"],
    "Thoothukudi": ["Thoothukudi"],
    "Tiruchirappalli": ["Tiruchirappalli"],
    "Tirunelveli": ["Tirunelveli"],
    "Tirupathur": ["Tirupathur"],
    "Tiruppur": ["Tiruppur"],
    "Tiruvallur": ["Tiruvallur"],
    "Tiruvannamalai": ["Tiruvannamalai"],
    "Tiruvarur": ["Tiruvarur"],
    "Vellore": ["Vellore"],
    "Viluppuram": ["Viluppuram"],
    "Virudhunagar": ["Virudhunagar"]
  },

  "Telangana": {
    "Adilabad": ["Adilabad"],
    "Bhadradri Kothagudem": ["Kothagudem"],
    "Hanumakonda": ["Hanumakonda"],
    "Hyderabad": ["Hyderabad"],
    "Jagtial": ["Jagtial"],
    "Jangaon": ["Jangaon"],
    "Jayashankar Bhupalpally": ["Bhupalpally"],
    "Jogulamba Gadwal": ["Gadwal"],
    "Kamareddy": ["Kamareddy"],
    "Karimnagar": ["Karimnagar"],
    "Khammam": ["Khammam"],
    "Komaram Bheem Asifabad": ["Asifabad"],
    "Mahabubabad": ["Mahabubabad"],
    "Mahbubnagar": ["Mahbubnagar"],
    "Mancherial": ["Mancherial"],
    "Medak": ["Medak"],
    "Medchal-Malkajgiri": ["Medchal", "Malkajgiri"],
    "Mulugu": ["Mulugu"],
    "Nagarkurnool": ["Nagarkurnool"],
    "Nalgonda": ["Nalgonda"],
    "Narayanpet": ["Narayanpet"],
    "Nirmal": ["Nirmal"],
    "Nizamabad": ["Nizamabad"],
    "Peddapalli": ["Peddapalli"],
    "Rajanna Sircilla": ["Sircilla"],
    "Rangareddy": ["Shamshabad"],
    "Sangareddy": ["Sangareddy"],
    "Siddipet": ["Siddipet"],
    "Suryapet": ["Suryapet"],
    "Vikarabad": ["Vikarabad"],
    "Wanaparthy": ["Wanaparthy"],
    "Warangal": ["Warangal"],
    "Yadadri Bhuvanagiri": ["Bhongir"]
  },

  "Tripura": {
    "Dhalai": ["Ambassa"],
    "Gomati": ["Udaipur"],
    "Khowai": ["Khowai"],
    "North Tripura": ["Dharmanagar"],
    "Sepahijala": ["Bishramganj"],
    "South Tripura": ["Belonia"],
    "Unakoti": ["Kailashahar"],
    "West Tripura": ["Agartala"]
  },

  "Uttar Pradesh": {
    "Agra": ["Agra"],
    "Aligarh": ["Aligarh"],
    "Ayodhya": ["Ayodhya"],
    "Azamgarh": ["Azamgarh"],
    "Bareilly": ["Bareilly"],
    "Ghaziabad": ["Ghaziabad"],
    "Gorakhpur": ["Gorakhpur"],
    "Jhansi": ["Jhansi"],
    "Kanpur Nagar": ["Kanpur"],
    "Lucknow": ["Lucknow"],
    "Mathura": ["Mathura", "Vrindavan"],
    "Meerut": ["Meerut"],
    "Moradabad": ["Moradabad"],
    "Muzaffarnagar": ["Muzaffarnagar"],
    "Prayagraj": ["Prayagraj"],
    "Varanasi": ["Varanasi"]
  },

  "Uttarakhand": {
    "Almora": ["Almora"],
    "Bageshwar": ["Bageshwar"],
    "Chamoli": ["Gopeshwar"],
    "Champawat": ["Champawat"],
    "Dehradun": ["Dehradun"],
    "Haridwar": ["Haridwar"],
    "Nainital": ["Nainital", "Haldwani"],
    "Pauri Garhwal": ["Pauri"],
    "Pithoragarh": ["Pithoragarh"],
    "Rudraprayag": ["Rudraprayag"],
    "Tehri Garhwal": ["New Tehri"],
    "Udham Singh Nagar": ["Rudrapur"],
    "Uttarkashi": ["Uttarkashi"]
  },

  "West Bengal": {
    "Alipurduar": ["Alipurduar"],
    "Bankura": ["Bankura"],
    "Birbhum": ["Suri"],
    "Cooch Behar": ["Cooch Behar"],
    "Dakshin Dinajpur": ["Balurghat"],
    "Darjeeling": ["Darjeeling", "Kurseong"],
    "Hooghly": ["Chinsurah"],
    "Howrah": ["Howrah"],
    "Jalpaiguri": ["Jalpaiguri"],
    "Jhargram": ["Jhargram"],
    "Kalimpong": ["Kalimpong"],
    "Kolkata": ["Kolkata"],
    "Malda": ["Malda"],
    "Murshidabad": ["Baharampur"],
    "Nadia": ["Krishnanagar"],
    "North 24 Parganas": ["Barasat"],
    "Paschim Bardhaman": ["Durgapur", "Asansol"],
    "Paschim Medinipur": ["Medinipur"],
    "Purba Bardhaman": ["Bardhaman"],
    "Purba Medinipur": ["Tamluk"],
    "Purulia": ["Purulia"],
    "South 24 Parganas": ["Alipore"],
    "Uttar Dinajpur": ["Raiganj"]
  },

   "Andaman and Nicobar Islands": {
    "Nicobar": ["Car Nicobar", "Campbell Bay"],
    "North and Middle Andaman": ["Mayabunder", "Diglipur"],
    "South Andaman": ["Port Blair", "Ferrargunj"]
  },

  "Chandigarh": {
    "Chandigarh": ["Chandigarh"]
  },

  "Dadra and Nagar Haveli and Daman and Diu": {
    "Dadra and Nagar Haveli": ["Silvassa"],
    "Daman": ["Daman"],
    "Diu": ["Diu"]
  },

  "Delhi (NCT)": {
    "Central": ["Connaught Place", "Karol Bagh"],
    "Central North": ["Civil Lines"],
    "East": ["Preet Vihar", "Gandhi Nagar"],
    "New Delhi": ["New Delhi"],
    "North": ["Model Town", "Burari"],
    "North East": ["Seelampur", "Nand Nagri"],
    "North West": ["Rohini", "Pitampura"],
    "Old Delhi": ["Chandni Chowk"],
    "Shahdara": ["Shahdara", "Vivek Vihar"],
    "South": ["Saket", "Mehrauli"],
    "South East": ["Kalkaji", "Okhla"],
    "South West": ["Dwarka", "Najafgarh"],
    "West": ["Rajouri Garden", "Punjabi Bagh"]
  },

  "Jammu and Kashmir": {
    "Anantnag": ["Anantnag"],
    "Bandipora": ["Bandipora"],
    "Baramulla": ["Baramulla"],
    "Budgam": ["Budgam"],
    "Doda": ["Doda"],
    "Ganderbal": ["Ganderbal"],
    "Jammu": ["Jammu"],
    "Kathua": ["Kathua"],
    "Kishtwar": ["Kishtwar"],
    "Kulgam": ["Kulgam"],
    "Kupwara": ["Kupwara"],
    "Poonch": ["Poonch"],
    "Pulwama": ["Pulwama"],
    "Rajouri": ["Rajouri"],
    "Ramban": ["Ramban"],
    "Reasi": ["Reasi"],
    "Samba": ["Samba"],
    "Shopian": ["Shopian"],
    "Srinagar": ["Srinagar"],
    "Udhampur": ["Udhampur"]
  },

  "Ladakh": {
    "Kargil": ["Kargil"],
    "Leh": ["Leh"]
  },

  "Lakshadweep": {
    "Lakshadweep": ["Kavaratti", "Agatti"]
  },

  "Puducherry": {
    "Karaikal": ["Karaikal"],
    "Mahe": ["Mahe"],
    "Puducherry": ["Puducherry"],
    "Yanam": ["Yanam"]
  }

};



const stateImages = {
  "Andhra Pradesh": "/andhrapradesh.png",
  "Arunachal Pradesh": "/Arunachal Pradesh 2.jpg",
  "Assam": "/assam 2.jpg",
  "Bihar": "/bihar.jpeg",
  "Chhattisgarh": "/chhattisgarh 2.jpg",
  "Goa": "/goa 2.jpg",
  "Gujarat": "/Gujarat 2.jpg",
  "Haryana": "/Haryana 2.jpg",
  "Himachal Pradesh": "/Himachal Pradesh 2.jpg",
  "Jharkhand": "/Jharkhand 2.jpg",
  "Karnataka": "/karnataka2.jpg",
  "Kerala": "/kerala 2.jpg",
  "Madhya Pradesh": "/Madhya Pradesh 2.jpg",
  "Maharashtra": "/Maharastra 2.jpg",
  "Manipur": "/manipur.png",
  "Meghalaya": "/meghalaya.jpeg",
  "Mizoram": "/Mizoram 2.jpg",
  "Nagaland": "/Nagaland 2.jpg",
  "Odisha": "/Odisha 2.jpg",
  "Punjab": "/Punjab 2.jpeg",
  "Rajasthan": "/Rajasthan 2.jpg",
  "Sikkim": "/Sikkim 2.jpg",
  "Tamil Nadu": "/Tamil Nadu 2.jpg",
  "Telangana": "/telangana.png",
  "Tripura": "/Tripura 2.jpg",
  "Uttar Pradesh": "/Uttar Pradesh 2.jpg",
  "Uttarakhand": "/Uttarakhand 2.jpg",
  "West Bengal": "/West Bengal 2.jpg",

  "Andaman and Nicobar Islands": "/Andaman and Nicobar Islands 2.jpg",
  "Chandigarh": "/Chandigarh 2.jpg",
  "Dadra and Nagar Haveli and Daman and Diu": "/Dadra and Nagar Haveli and Daman and Diu 2.jpg",
  "Delhi": "/Delhi 3.jpg",
  "Jammu and Kashmir": "/Jammu and kashmir 3.jpg",
  "Ladakh": "/Ladakh 2.jpg",
  "Lakshadweep": "/Lakshadweep 2.jpg",
  "Puducherry": "/Puducherry 2.jpg"
};

    /* ================= ELEMENTS ================= */
    const stateSelect = document.getElementById("fadv-state-select");
    const districtSelect = document.getElementById("fadv-district-select");
    const citySelect = document.getElementById("fadv-city-select");
    const districtGrid = document.getElementById("districtGrid");
    const cityGrid = document.getElementById("cityGrid");
    const preview = document.getElementById("statePreview");

    // ⛔ Prevent crashes if page not loaded
    if (!stateSelect || !districtSelect || !citySelect) return;

    /* ================= STATE CHANGE ================= */
    stateSelect.addEventListener("change", () => {
        const state = stateSelect.value;

        districtSelect.innerHTML = '<option value="">All Districts</option>';
        citySelect.innerHTML = '<option value="">All Cities</option>';
        districtGrid.innerHTML = "";
        cityGrid.innerHTML = "";

        if (!state || !data[state]) return;

        Object.keys(data[state]).forEach(district => {
        districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        districtGrid.innerHTML += `<div class="grid-item">${district}</div>`;
        });

        preview.src = stateImages[state] || "/india states.jpeg";
    });

    /* ================= DISTRICT CHANGE ================= */
    districtSelect.addEventListener("change", () => {
        const state = stateSelect.value;
        const district = districtSelect.value;

        citySelect.innerHTML = '<option value="">All Cities</option>';
        cityGrid.innerHTML = "";

        if (!state || !district || !data[state][district]) return;

        data[state][district].forEach(city => {
        citySelect.innerHTML += `<option>${city}</option>`;
        cityGrid.innerHTML += `<div class="grid-item">${city}</div>`;
        });
    });

    /* ================= RESET ================= */
    window.resetAll = function () {
        stateSelect.value = "";
        districtSelect.innerHTML = '<option value="">All Districts</option>';
        citySelect.innerHTML = '<option value="">All Cities</option>';
        districtGrid.innerHTML = "";
        cityGrid.innerHTML = "";
        preview.src = "/india states.jpeg";
    };

    const selectBox = document.querySelector(".select-box");
    if (selectBox) {
        selectBox.onclick = () => {
        document.querySelector(".multi-select")?.classList.toggle("active");
        };
    }
    }





/* =====================================================
   EXCEL DATA HANDLING (University/College Data)
===================================================== */
let excelData = [];

async function loadExcelData() {
    try {
        const response = await fetch("/data/law-universities.xlsx");
        if (!response.ok) throw new Error("Failed to load Excel file");
        
        const buffer = await response.arrayBuffer();
        
        // Check if XLSX is available
        if (typeof XLSX === "undefined") {
            console.warn("SheetJS (XLSX) not loaded - skipping Excel data");
            return;
        }
        
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(sheet);
        
        populateUniversities();
    } catch (error) {
        console.error("Error loading Excel data:", error);
    }
}

function populateUniversities() {
    const universitySelect = document.getElementById("universitySelect");
    if (!universitySelect) return;

    const universities = [...new Set(excelData.map(row => row.University).filter(Boolean))];
    
    universities.forEach(university => {
        const option = document.createElement("option");
        option.value = university.trim();
        option.textContent = university.trim();
        universitySelect.appendChild(option);
    });
}

function initUniversitySelection() {
    const universitySelect = document.getElementById("universitySelect");
    if (!universitySelect) return;

    universitySelect.addEventListener("change", function() {
        const collegeSelect = document.getElementById("collegeSelect");
        if (!collegeSelect) return;

        collegeSelect.innerHTML = `<option value="">Select College</option>`;
        collegeSelect.disabled = false;

        const selectedUniversity = this.value;
        
        excelData
            .filter(row => row.University === selectedUniversity && row.College)
            .forEach(row => {
                const option = document.createElement("option");
                option.value = row.College.trim();
                option.textContent = row.College.trim();
                collegeSelect.appendChild(option);
            });
    });
}

/* =====================================================
   SPA ROUTER & PAGE MANAGEMENT
===================================================== */
const app = document.getElementById("app");
let currentPageCleanup = null;

function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function initHomePage() {
    safe(initMainSlider);
    safe(initMultiSliders);
    safe(loadBlogsToHomepage);
    safe(() => renderAdvocates(advocates));
    safe(initContactForm);
    safe(initFaq);
    safe(() => initRevealAnimations(".service-row", 0.1));
    safe(() => initRevealAnimations(".hiw-card", 0.3));
    safe(() => initRevealAnimations(".tm-card", 0.2));
}

function backToBlogs() {
    location.hash = "home";
}

function showPage(pageId) {
    $$(".main").forEach(el => el.classList.remove("active"));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active");
    
    $$(".menu a").forEach(el => el.classList.remove("active"));
    const activeLink = $(`.menu a[onclick="showPage('${pageId}')"]`);
    if (activeLink) activeLink.classList.add("active");
}

function toggleAnswer(element) {
    element.classList.toggle("active");
}

function renderPage() {
    const route = location.hash.replace("#", "") || "home";
    const template = document.getElementById(route);

    // Cleanup previous page
    if (typeof currentPageCleanup === "function") {
        currentPageCleanup();
        currentPageCleanup = null;
    }

    // 404 handling
    if (!template || !app) {
        app.innerHTML = "<h1>404 - Page Not Found</h1>";
        return;
    }

    // Auth guard for dashboard pages
    const dashboardPages = ["dashboard", "clientdashboard", "advocatedashboard"];
    if (dashboardPages.includes(route) && !isLoggedIn()) {
        location.hash = "login";
        return;
    }

    // Inject template
    app.innerHTML = template.innerHTML;

    // Layout handling
    const isDashboardPage = route.includes("dashboard");
    
    if (isDashboardPage) {
        hidelay();
        app.style.marginTop = "0px";
    } else {
        showlay();
        const navbar = $(".navbar");
        if (navbar) {
            document.documentElement.style.setProperty("--nav-height", navbar.offsetHeight + "px");
        }
    }

    // Page initialization
    requestAnimationFrame(() => {
        // Page-specific initialization
        switch (route) {
            case "home":
                initHomePage();
                break;
            case "dashboard":
                initDashboard();
                break;
            case "blogs":
                initBlogGrid();
                break;
            case "advocatedashboard":
                initadvocateDashboard();
                break;
            case "clientdashboard":
                // Add client dashboard initialization here if needed
                break;
            case "mainblogs":
                initMainBlogsPage();
                break;
              case "membership":  // ADD THIS LINE
                initMembershipPage();  // ADD THIS LINE
                break;   
              case "location-finder": // Add this for a dedicated location finder page
            case "browse-profiles": // Or whatever your browse page is called
                initEnhancedLocationPage();
                break;    
                
        }

        // Feature modules initialization (safe)
        if ($("#blog-grid")) safe(initBlogGrid);
        if ($("#grid") && $("#advBtn") && $("#clientBtn")) safe(initAdvocatesClientsToggle);
        if ($(".slider-box")) safe(initMultiSliders);
        if ($(".faq-question")) safe(initFaq);
        if ($("#contactForm")) safe(initContactForm);
        if ($(".contact-link")) safe(initContactPopup);
        if ($("#universitySelect")) {
            safe(loadExcelData);
            safe(initUniversitySelection);
        }

        // Always run these
        safe(() => initRevealAnimations(".reveal-on-scroll", 0.1));
        updateNavbarAuth();
        window.scrollTo(0, 0);

        // Store cleanup function
        if (typeof window.cleanupToggleModule === "function") {
            currentPageCleanup = window.cleanupToggleModule;
        } else if (typeof window.cleanupBlogGrid === "function") {
            currentPageCleanup = window.cleanupBlogGrid;
        }
    });
}

// advocate resistartion 


function initAdvocateRegistration() {
    const popup = document.getElementById("advocatePopup");
    const form = document.getElementById("advocateForm");
    
    if (!popup || !form) {
        console.warn("Advocate registration elements not found");
        return;
    }
    
    // ===== DOM ELEMENTS =====
    const steps = document.querySelectorAll('.form-step');
    const stepButtons = document.querySelectorAll('.step');
    const progressFill = document.getElementById('progressFill');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const signatureCanvas = document.getElementById('adr-signatureCanvas');
    const signatureDate = document.getElementById('adr-signatureDate');
    const closeBtn = popup.querySelector('.close-btn');
    const submitBtn = document.getElementById('adr-submit-btn');
    const termsCheckboxes = document.getElementById('adr-terms-checkboxes');
    const termsContent = document.getElementById('adr-terms-content');
    const scrollIndicator = document.getElementById('adr-scroll-indicator');

    // ===== FORM DATA STORAGE =====
    let formData = {
        step1: {}, step2: {}, step3: {}, step4: {},
        step5: {}, step6: {}, step7: {}, step8: {}, step9: {}
    };

    // ===== CURRENT STEP & STATE =====
    let currentStep = 1;
    let termsScrolled = false;
    
    // Store elements in an object for easy access
    const elements = {
        popup, form, steps, stepButtons, progressFill,
        nextButtons, backButtons, fileInputs, signatureCanvas,
        signatureDate, closeBtn, submitBtn, termsCheckboxes,
        termsContent, scrollIndicator
    };

    // ===== INITIALIZE FORM =====
    function initForm() {
        // Set today's date for signature
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        if (signatureDate) {
            signatureDate.value = formattedDate;
            signatureDate.max = formattedDate;
        }
        
        // Initialize signature pad if canvas exists
        if (signatureCanvas) initSignaturePad();
        
        // Add event listeners
        addEventListeners();
        
        // Initialize password strength checker
        initPasswordStrength();
        
        // Initialize password match checker
        initPasswordMatch();
        
        // Initialize terms scroll checker
        initTermsScrollCheck();
        
        // Fill graduation years
        fillGraduationYears();
        
        // Show first step
        showStep(1);
    }

    // ===== INITIALIZE SIGNATURE PAD =====
    function initSignaturePad() {
        const ctx = signatureCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        // Mouse events
        signatureCanvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
        
        signatureCanvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
        
        signatureCanvas.addEventListener('mouseup', () => isDrawing = false);
        signatureCanvas.addEventListener('mouseout', () => isDrawing = false);
        
        // Touch events for mobile
        signatureCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            isDrawing = true;
            [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
        });
        
        signatureCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
            [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
        });
        
        signatureCanvas.addEventListener('touchend', () => isDrawing = false);
    }

    // ===== FILL GRADUATION YEARS =====
    function fillGraduationYears() {
        const gradYearSelect = document.querySelector('[name="adr-gradYear"]');
        if (!gradYearSelect) return;
        
        const currentYear = new Date().getFullYear();
        
        // Clear existing options except the first one
        while (gradYearSelect.options.length > 1) {
            gradYearSelect.remove(1);
        }
        
        // Add years from current year to 1950
        for(let year = currentYear; year >= 1950; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            gradYearSelect.appendChild(option);
        }
    }

    // ===== INITIALIZE PASSWORD STRENGTH CHECKER =====
    function initPasswordStrength() {
        const passwordInput = document.getElementById('adr-password');
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        const requirements = document.querySelectorAll('.password-requirements li');
        
        if (!passwordInput || !strengthBar || !strengthText) return;
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Check requirements
            const hasLength = password.length >= 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[@$!%*?&]/.test(password);
            
            // Update requirement indicators
            if (requirements.length >= 5) {
                updateRequirement(requirements[0], hasLength, 'length');
                updateRequirement(requirements[1], hasUppercase, 'uppercase');
                updateRequirement(requirements[2], hasLowercase, 'lowercase');
                updateRequirement(requirements[3], hasNumber, 'number');
                updateRequirement(requirements[4], hasSpecial, 'special');
            }
            
            // Calculate strength
            strength += hasLength ? 20 : 0;
            strength += hasUppercase ? 20 : 0;
            strength += hasLowercase ? 20 : 0;
            strength += hasNumber ? 20 : 0;
            strength += hasSpecial ? 20 : 0;
            
            // Update strength bar
            strengthBar.style.width = `${strength}%`;
            
            // Update strength text and color
            if (strength === 0) {
                strengthBar.style.background = '#e74c3c';
                strengthText.textContent = 'Password strength: Very weak';
                strengthText.style.color = '#e74c3c';
            } else if (strength <= 40) {
                strengthBar.style.background = '#e67e22';
                strengthText.textContent = 'Password strength: Weak';
                strengthText.style.color = '#e67e22';
            } else if (strength <= 60) {
                strengthBar.style.background = '#f1c40f';
                strengthText.textContent = 'Password strength: Fair';
                strengthText.style.color = '#f1c40f';
            } else if (strength <= 80) {
                strengthBar.style.background = '#2ecc71';
                strengthText.textContent = 'Password strength: Good';
                strengthText.style.color = '#2ecc71';
            } else {
                strengthBar.style.background = '#27ae60';
                strengthText.textContent = 'Password strength: Strong';
                strengthText.style.color = '#27ae60';
            }
        });
        
        function updateRequirement(element, isValid, rule) {
            if (isValid) {
                element.classList.add('valid');
                element.setAttribute('data-valid', 'true');
            } else {
                element.classList.remove('valid');
                element.setAttribute('data-valid', 'false');
            }
        }
    }

    // ===== INITIALIZE PASSWORD MATCH CHECKER =====
    function initPasswordMatch() {
        const passwordInput = document.getElementById('adr-password');
        const confirmInput = document.getElementById('adr-confirm-password');
        const matchIndicator = document.getElementById('adr-password-match');
        
        if (!passwordInput || !confirmInput || !matchIndicator) return;
        
        function checkMatch() {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            if (confirm === '') {
                matchIndicator.style.opacity = '0.5';
                return;
            }
            
            if (password === confirm && password !== '') {
                matchIndicator.classList.add('matched');
                matchIndicator.innerHTML = '<i class="fas fa-check-circle"></i><span>Passwords match</span>';
            } else {
                matchIndicator.classList.remove('matched');
                matchIndicator.innerHTML = '<i class="fas fa-times-circle"></i><span>Passwords do not match</span>';
            }
        }
        
        passwordInput.addEventListener('input', checkMatch);
        confirmInput.addEventListener('input', checkMatch);
    }

    // ===== INITIALIZE TERMS SCROLL CHECK =====
    function initTermsScrollCheck() {
        if (!termsContent) return;
        
        const termsScrollable = termsContent.querySelector('.terms-scrollable');
        if (!termsScrollable) return;
        
        termsScrollable.addEventListener('scroll', function() {
            const scrollPercentage = (this.scrollTop + this.clientHeight) / this.scrollHeight * 100;
            
            if (scrollPercentage >= 95 && !termsScrolled) {
                termsScrolled = true;
                scrollIndicator.style.opacity = '0.5';
                scrollIndicator.innerHTML = '<i class="fas fa-check-circle"></i><span>All terms read</span>';
                
                // Enable checkboxes
                document.querySelectorAll('#adr-terms-checkboxes input[type="checkbox"]').forEach(checkbox => {
                    checkbox.disabled = false;
                });
            }
        });
        
        // Monitor checkbox changes
        document.querySelectorAll('#adr-terms-checkboxes input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateSubmitButton);
        });
    }

    // ===== UPDATE SUBMIT BUTTON STATE =====
    function updateSubmitButton() {
        if (!submitBtn) return;
        
        const allChecked = Array.from(document.querySelectorAll('#adr-terms-checkboxes input[type="checkbox"]'))
            .every(checkbox => checkbox.checked);
        
        submitBtn.disabled = !allChecked;
        
        if (allChecked) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // ===== SHOW/HIDE STEPS =====
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Remove active class from all step buttons
        stepButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step button
        const currentStepButton = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (currentStepButton) {
            currentStepButton.classList.add('active');
        }
        
        // Update progress bar
        if (progressFill) {
            updateProgressBar(stepNumber);
        }
        
        // Save current step data before moving
        saveStepData(currentStep);
        currentStep = stepNumber;
        
        // If moving to review step (step 9), update review summary
        if (stepNumber === 9) {
            updateReviewSummary();
            // Reset terms scrolled state
            termsScrolled = false;
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.innerHTML = '<i class="fas fa-mouse-pointer"></i><span>Scroll to read all terms</span>';
            }
            // Disable checkboxes until scrolled
            document.querySelectorAll('#adr-terms-checkboxes input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
            updateSubmitButton();
        }
    }

    // ===== UPDATE PROGRESS BAR =====
    function updateProgressBar(step) {
        const percentage = (step / 9) * 100;
        progressFill.style.width = `${percentage}%`;
    }

    // ===== SAVE STEP DATA =====
    function saveStepData(stepNumber) {
        const stepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!stepElement) return;
        
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        formData[`step${stepNumber}`] = {};
        
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    const name = input.name;
                    if (!formData[`step${stepNumber}`][name]) {
                        formData[`step${stepNumber}`][name] = [];
                    }
                    formData[`step${stepNumber}`][name].push(input.value);
                }
            } else if (input.type === 'file') {
                // Handle file separately
                formData[`step${stepNumber}`][input.name] = input.files[0]?.name || '';
            } else {
                formData[`step${stepNumber}`][input.name] = input.value;
            }
        });
        
        // Special handling for language checkboxes
        if (stepNumber === 7) {
            const languageCheckboxes = stepElement.querySelectorAll('input[name="adr-languages"]:checked');
            const languages = Array.from(languageCheckboxes).map(cb => cb.value);
            const otherLang = stepElement.querySelector('.other-lang');
            
            if (otherLang && otherLang.value) {
                languages.push(...otherLang.value.split(',').map(lang => lang.trim()));
            }
            
            formData.step7['adr-languages'] = languages;
        }
    }

    // ===== VALIDATE CURRENT STEP =====
    function validateStep(stepNumber) {
        const stepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!stepElement) return false;
        
        let isValid = true;
        const errorFields = [];
        
        // Special validation for password step
        if (stepNumber === 3) {
            const password = document.getElementById('adr-password')?.value || '';
            const confirmPassword = document.getElementById('adr-confirm-password')?.value || '';
            
            // Check password strength
            const requirements = document.querySelectorAll('.password-requirements li[data-valid="false"]');
            if (requirements.length > 0) {
                showToast('Please meet all password requirements', 'error');
                isValid = false;
            }
            
            // Check password match
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                isValid = false;
            }
            
            // Check security questions
            const securityQuestion1 = stepElement.querySelector('[name="adr-security-question-1"]');
            const securityAnswer1 = stepElement.querySelector('[name="adr-security-answer-1"]');
            const securityQuestion2 = stepElement.querySelector('[name="adr-security-question-2"]');
            const securityAnswer2 = stepElement.querySelector('[name="adr-security-answer-2"]');
            
            if ((!securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) ||
                (!securityQuestion1.value || !securityAnswer1.value || 
                 !securityQuestion2.value || !securityAnswer2.value)) {
                showToast('Please complete all security questions', 'error');
                isValid = false;
            }
        }
        
        // Validate all required fields
        const inputs = stepElement.querySelectorAll('[required]');
        inputs.forEach(input => {
            if (!input.value && input.type !== 'checkbox' && input.type !== 'file') {
                input.style.borderColor = '#e74c3c';
                errorFields.push(input);
                isValid = false;
            } else if (input.type === 'checkbox' && !input.checked) {
                input.parentElement.style.color = '#e74c3c';
                errorFields.push(input);
                isValid = false;
            } else if (input.type === 'file' && !input.files.length) {
                input.parentElement.parentElement.style.borderColor = '#e74c3c';
                errorFields.push(input);
                isValid = false;
            } else {
                input.style.borderColor = '';
                if (input.parentElement) {
                    input.parentElement.style.color = '';
                    input.parentElement.style.borderColor = '';
                }
            }
        });
        
        // Validate email format
        const emailInput = stepElement.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                emailInput.style.borderColor = '#e74c3c';
                errorFields.push(emailInput);
                isValid = false;
                showToast('Please enter a valid email address', 'error');
            }
        }
        
        // Validate phone number
        const phoneInput = stepElement.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value) {
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phoneInput.value)) {
                phoneInput.style.borderColor = '#e74c3c';
                errorFields.push(phoneInput);
                isValid = false;
                showToast('Please enter a valid 10-digit phone number', 'error');
            }
        }
        
        if (!isValid && errorFields.length > 0) {
            errorFields[0].focus();
        }
        
        return isValid;
    }

    // ===== NEXT STEP =====
    function nextStep() {
        if (!validateStep(currentStep)) {
            return;
        }
        
        saveStepData(currentStep);
        
        if (currentStep < 9) {
            showStep(currentStep + 1);
        }
    }

    // ===== PREVIOUS STEP =====
    function prevStep() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }

    // ===== UPDATE REVIEW SUMMARY =====
    function updateReviewSummary() {
        // Personal Details
        const personalData = formData.step1;
        const personalEl = document.getElementById('adr-review-personal');
        if (personalEl) {
            personalEl.innerHTML = `
                <div class="review-item">
                    <span class="review-label">Name:</span>
                    <span class="review-value">${personalData['adr-firstName'] || ''} ${personalData['adr-lastName'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Gender:</span>
                    <span class="review-value">${personalData['adr-gender'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Date of Birth:</span>
                    <span class="review-value">${personalData['adr-dob'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Contact:</span>
                    <span class="review-value">${personalData['adr-mobile'] || ''}<br>${personalData['adr-email'] || ''}</span>
                </div>
            `;
        }
        
        // Security Details
        const securityData = formData.step3;
        const securityEl = document.getElementById('adr-review-security');
        if (securityEl) {
            securityEl.innerHTML = `
                <div class="review-item">
                    <span class="review-label">Security Question 1:</span>
                    <span class="review-value">${securityData['adr-security-question-1'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Answer 1:</span>
                    <span class="review-value">${'*'.repeat(securityData['adr-security-answer-1']?.length || 0)}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Security Question 2:</span>
                    <span class="review-value">${securityData['adr-security-question-2'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Answer 2:</span>
                    <span class="review-value">${'*'.repeat(securityData['adr-security-answer-2']?.length || 0)}</span>
                </div>
            `;
        }
        
        // Education Details
        const educationData = formData.step4;
        const educationEl = document.getElementById('adr-review-education');
        if (educationEl) {
            educationEl.innerHTML = `
                <div class="review-item">
                    <span class="review-label">Degree:</span>
                    <span class="review-value">${educationData['adr-degree'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">University:</span>
                    <span class="review-value">${educationData['adr-university'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">College:</span>
                    <span class="review-value">${educationData['adr-college'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Graduation Year:</span>
                    <span class="review-value">${educationData['adr-gradYear'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Enrollment No:</span>
                    <span class="review-value">${educationData['adr-enrollmentNo'] || ''}</span>
                </div>
            `;
        }
        
        // Practice Information
        const practiceData = formData.step5;
        const practiceEl = document.getElementById('adr-review-practice');
        if (practiceEl) {
            practiceEl.innerHTML = `
                <div class="review-item">
                    <span class="review-label">Court:</span>
                    <span class="review-value">${practiceData['adr-court'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Experience:</span>
                    <span class="review-value">${practiceData['adr-experience'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Specialization:</span>
                    <span class="review-value">${practiceData['adr-specialization'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Sub-Specialization:</span>
                    <span class="review-value">${practiceData['adr-subSpecialization'] || 'Not specified'}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Bar Association:</span>
                    <span class="review-value">${practiceData['adr-barAssociation'] || 'Not specified'}</span>
                </div>
            `;
        }
        
        // Location Details
        const locationData = formData.step6;
        const locationEl = document.getElementById('adr-review-location');
        if (locationEl) {
            locationEl.innerHTML = `
                <div class="review-item">
                    <span class="review-label">Location:</span>
                    <span class="review-value">${locationData['adr-city'] || ''}, ${locationData['adr-state'] || ''}, ${locationData['adr-country'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Office Address:</span>
                    <span class="review-value">${locationData['adr-officeAddress'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Permanent Address:</span>
                    <span class="review-value">${locationData['adr-permanentAddress'] || ''}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Pincode:</span>
                    <span class="review-value">${locationData['adr-pincode'] || ''}</span>
                </div>
            `;
        }
        
        // Availability
        const availabilityData = formData.step8;
        const availabilityEl = document.getElementById('adr-review-availability');
        if (availabilityEl) {
            const modes = availabilityData['adr-consultationMode'] || [];
            const days = availabilityData['adr-availableDays'] || [];
            const startTime = availabilityData['adr-workStart'] || '09:00';
            const endTime = availabilityData['adr-workEnd'] || '18:00';
            
            availabilityEl.innerHTML = `
                <div class="review-item">
                    <span class="review-label">Consultation Modes:</span>
                    <span class="review-value">${modes.map(mode => mode.charAt(0).toUpperCase() + mode.slice(1)).join(', ') || 'Not specified'}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Available Days:</span>
                    <span class="review-value">${days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ') || 'Not specified'}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Working Hours:</span>
                    <span class="review-value">${startTime} - ${endTime}</span>
                </div>
            `;
        }
    }

    // ===== HANDLE FORM SUBMISSION =====
    function handleSubmit(e) {
        e.preventDefault();
        
        // Validate signature
        if (signatureCanvas) {
            const ctx = signatureCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height);
            const isEmpty = !imageData.data.some(channel => channel !== 0);
            
            if (isEmpty) {
                showToast('Please provide your signature', 'error');
                return;
            }
        }
        
        // Validate date
        if (signatureDate && !signatureDate.value) {
            showToast('Please select date', 'error');
            return;
        }
        
        // Check if terms were scrolled
        if (!termsScrolled) {
            showToast('Please read all terms and conditions before accepting', 'error');
            return;
        }
        
        // Check terms checkboxes
        const allTermsChecked = Array.from(document.querySelectorAll('#adr-terms-checkboxes input[type="checkbox"]'))
            .every(checkbox => checkbox.checked);
        
        if (!allTermsChecked) {
            showToast('Please accept all terms and conditions', 'error');
            return;
        }
        
        // Save final step data
        saveStepData(9);
        
        // Prepare final data (in real app, this would be sent to server)
        const finalData = {
            personal: formData.step1,
            security: {
                ...formData.step3,
                password: '********' // Don't send actual password in demo
            },
            education: formData.step4,
            practice: formData.step5,
            location: formData.step6,
            career: formData.step7,
            availability: formData.step8,
            signatureDate: signatureDate ? signatureDate.value : '',
            submittedAt: new Date().toISOString()
        };
        
        // Show success message
        showToast('Advocate registration submitted successfully! Verification in progress.', 'success');
        
        // Log data (in real app, send to server)
        console.log('Advocate Registration Data:', finalData);
        
        // Close popup after delay
        setTimeout(() => {
            closeAdvocateForm();
            resetForm();
        }, 2000);
    }

    // ===== TOGGLE PASSWORD VISIBILITY =====
    function togglePasswordVisibility(targetId) {
        const input = document.getElementById(targetId);
        const toggleBtn = document.querySelector(`.toggle-password[data-target="${targetId}"] i`);
        
        if (!input || !toggleBtn) return;
        
        if (input.type === 'password') {
            input.type = 'text';
            toggleBtn.classList.remove('fa-eye');
            toggleBtn.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            toggleBtn.classList.remove('fa-eye-slash');
            toggleBtn.classList.add('fa-eye');
        }
    }

    // ===== CLEAR SIGNATURE =====
    function clearSignature() {
        if (!signatureCanvas) return;
        
        const ctx = signatureCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
    }

    // ===== SHOW TOAST NOTIFICATION =====
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== RESET FORM =====
    function resetForm() {
        if (form) form.reset();
        formData = {
            step1: {}, step2: {}, step3: {}, step4: {},
            step5: {}, step6: {}, step7: {}, step8: {}, step9: {}
        };
        currentStep = 1;
        termsScrolled = false;
        
        // Clear signature
        clearSignature();
        
        // Reset file names
        document.querySelectorAll('.file-name').forEach(span => {
            span.textContent = 'No file chosen';
        });
        
        // Reset password strength
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        if (strengthBar && strengthText) {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength: Very weak';
            strengthText.style.color = '#e74c3c';
        }
        
        // Reset password match indicator
        const matchIndicator = document.getElementById('adr-password-match');
        if (matchIndicator) {
            matchIndicator.classList.remove('matched');
            matchIndicator.innerHTML = '<i class="fas fa-check-circle"></i><span>Passwords match</span>';
            matchIndicator.style.opacity = '0.5';
        }
        
        // Reset password requirements
        document.querySelectorAll('.password-requirements li').forEach(li => {
            li.classList.remove('valid');
            li.setAttribute('data-valid', 'false');
        });
        
        // Reset terms scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.innerHTML = '<i class="fas fa-mouse-pointer"></i><span>Scroll to read all terms</span>';
        }
        
        // Reset checkboxes
        document.querySelectorAll('#adr-terms-checkboxes input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = true;
        });
        
        updateSubmitButton();
        
        // Show first step
        showStep(1);
    }

    // ===== ADD EVENT LISTENERS =====
    function addEventListeners() {
        // Next button click
        nextButtons.forEach(button => {
            button.addEventListener('click', nextStep);
        });
        
        // Back button click
        backButtons.forEach(button => {
            button.addEventListener('click', prevStep);
        });
        
        // File input changes
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                const fileName = this.files[0]?.name || 'No file chosen';
                const fileDisplay = this.parentElement.querySelector('.file-name');
                if (fileDisplay) {
                    fileDisplay.textContent = fileName;
                }
            });
        });
        
        // Upload button clicks
        document.querySelectorAll('.upload-btn').forEach(button => {
            button.addEventListener('click', function() {
                const fileInput = this.parentElement.querySelector('input[type="file"]');
                fileInput?.click();
            });
        });
        
        // OTP input auto-focus
        document.querySelectorAll('.otp-input input').forEach((input, index, inputs) => {
            input.addEventListener('input', function() {
                if (this.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !this.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
        
        // Resend OTP buttons
        document.querySelectorAll('.btn-resend').forEach(button => {
            button.addEventListener('click', function() {
                showToast('OTP sent successfully!', 'info');
            });
        });
        
        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                togglePasswordVisibility(targetId);
            });
        });
        
        // Clear signature button
        const clearSignatureBtn = document.getElementById('adr-clear-signature');
        if (clearSignatureBtn) {
            clearSignatureBtn.addEventListener('click', clearSignature);
        }
        
        // Form submission
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        
        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeAdvocateForm);
        }
        
        // Click outside to close
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeAdvocateForm();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popup.style.display === 'flex') {
                closeAdvocateForm();
            }
        });
    }

    // ===== GLOBAL FUNCTIONS =====
    function openAdvocateForm() {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        initForm();
    }

    function closeAdvocateForm() {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Override existing functions
    window.openAdvocateForm = openAdvocateForm;
    window.closeAdvocateForm = closeAdvocateForm;
    window.showToast = showToast;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.clearSignature = clearSignature;
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    
    // Initialize if popup is already open
    if (popup.style.display === 'flex') {
        initForm();
    }
}



// advocate dashbaord

function admindash(){


 // =============================
    // DOM Elements (SAFE)
    // =============================

            // DOM Elements
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mainContent = document.getElementById('mainContent');
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        const notificationBtn = document.getElementById('notificationBtn');
        
        // Page elements
        const pageContents = {
            dashboard: document.getElementById('dashboardContent'),
            members: document.getElementById('membersContent'),
            packages: document.getElementById('packagesContent'),
            payments: document.getElementById('membersContent'), // Reusing members template
            wallet: document.getElementById('membersContent'), // Reusing members template
            stories: document.getElementById('membersContent'), // Reusing members template
            blog: document.getElementById('blogContent'),
            marketing: document.getElementById('membersContent'), // Reusing members template
            files: document.getElementById('membersContent'), // Reusing members template
            website: document.getElementById('membersContent'), // Reusing members template
            settings: document.getElementById('settingsContent'),
            staff: document.getElementById('staffContent'),
            system: document.getElementById('membersContent'), // Reusing members template
            addons: document.getElementById('membersContent') // Reusing members template
        };
        
        // Current page state
        let currentPage = 'dashboard';
        let currentSubpage = '';
        
        // Sample data for members
        const membersData = [
            {id: 1, name: "John Doe", email: "john@example.com", type: "Advocate", joinDate: "2023-08-15", status: "active"},
            {id: 2, name: "Jane Smith", email: "jane@example.com", type: "Client", joinDate: "2023-09-20", status: "active"},
            {id: 3, name: "Robert Johnson", email: "robert@example.com", type: "Advocate", joinDate: "2023-07-10", status: "pending"},
            {id: 4, name: "Maria Garcia", email: "maria@example.com", type: "Client", joinDate: "2023-10-05", status: "active"},
            {id: 5, name: "David Wilson", email: "david@example.com", type: "Advocate", joinDate: "2023-06-22", status: "blocked"},
            {id: 6, name: "Lisa Brown", email: "lisa@example.com", type: "Client", joinDate: "2023-09-30", status: "active"},
            {id: 7, name: "Michael Taylor", email: "michael@example.com", type: "Advocate", joinDate: "2023-08-05", status: "active"},
            {id: 8, name: "Sarah Anderson", email: "sarah@example.com", type: "Client", joinDate: "2023-10-12", status: "inactive"}
        ];
        
        // Sample data for packages
        const packagesData = [
            {id: 1, name: "Gold Package", price: "₹5,000", duration: "1 Year", users: 124, status: "active"},
            {id: 2, name: "Silver Package", price: "₹3,000", duration: "6 Months", users: 89, status: "active"},
            {id: 3, name: "Platinum Package", price: "₹8,000", duration: "2 Years", users: 45, status: "active"},
            {id: 4, name: "Basic Package", price: "₹1,500", duration: "3 Months", users: 203, status: "expired"},
            {id: 5, name: "Trial Package", price: "Free", duration: "1 Month", users: 312, status: "active"}
        ];
        
        // Sample data for staff
        const staffData = [
            {id: 1, name: "Admin User", email: "admin@example.com", role: "Admin", joinDate: "2023-01-15", status: "active"},
            {id: 2, name: "Content Editor", email: "editor@example.com", role: "Editor", joinDate: "2023-03-20", status: "active"},
            {id: 3, name: "Support Staff", email: "support@example.com", role: "Support", joinDate: "2023-05-10", status: "active"},
            {id: 4, name: "Moderator", email: "moderator@example.com", role: "Moderator", joinDate: "2023-07-05", status: "inactive"}
        ];
        
        // Sample data for blogs
        const blogsData = [
            {id: 1, title: "How to Find the Right Advocate", category: "Tutorials", author: "Admin", date: "2023-10-10", views: 1245, status: "published"},
            {id: 2, title: "New Features Released", category: "Updates", author: "Editor", date: "2023-10-05", views: 892, status: "published"},
            {id: 3, title: "Client Success Stories", category: "News", author: "Admin", date: "2023-09-28", views: 1567, status: "published"},
            {id: 4, title: "Upcoming Platform Changes", category: "Announcements", author: "Admin", date: "2023-10-15", views: 0, status: "draft"}
        ];
        
        // Initialize the dashboard
        function initDashboard() {
            // Setup sidebar toggle
            sidebarToggle.addEventListener('click', toggleSidebar);
            
            // Setup clear cache button
            clearCacheBtn.addEventListener('click', clearCache);
            
            // Setup notification button
            notificationBtn.addEventListener('click', showNotifications);
            
            // Setup sidebar menu clicks
            setupSidebarMenu();
            
            // Setup modals
            setupModals();
            
            // Initialize charts
            initCharts();
            
            // Load initial page (dashboard)
            loadPage('dashboard');
            
            // Show welcome notification
            setTimeout(() => {
                showNotification('Admin dashboard loaded successfully', 'success');
            }, 500);
        }
        
        // Toggle sidebar collapse/expand
        function toggleSidebar() {
            sidebar.classList.toggle('collapsed');
            const icon = sidebarToggle.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-bars';
            } else {
                icon.className = 'fas fa-times';
            }
        }
        
        // Setup sidebar menu interactions
        function setupSidebarMenu() {
            const menuItems = document.querySelectorAll('.menu .item');
            
            menuItems.forEach(item => {
                const title = item.querySelector('.title');
                
                // Handle click on menu item title
                title.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // If item has submenu, toggle it
                    if (item.classList.contains('has-sub')) {
                        // Close other open submenus
                        document.querySelectorAll('.item.open').forEach(openItem => {
                            if (openItem !== item) {
                                openItem.classList.remove('open');
                            }
                        });
                        
                        // Toggle current item
                        item.classList.toggle('open');
                    } else {
                        // Close all open submenus
                        document.querySelectorAll('.item.open').forEach(openItem => {
                            openItem.classList.remove('open');
                        });
                        
                        // Get page name from data attribute
                        const page = item.getAttribute('data-page');
                        loadPage(page);
                    }
                });
                
                // Handle click on submenu items
                const submenuItems = item.querySelectorAll('.submenu a');
                submenuItems.forEach(subItem => {
                    subItem.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        // Get page and subpage from data attributes
                        const page = item.getAttribute('data-page');
                        const subpage = this.getAttribute('data-subpage');
                        
                        // Close all open submenus
                        document.querySelectorAll('.item.open').forEach(openItem => {
                            openItem.classList.remove('open');
                        });
                        
                        // Load the page with subpage
                        loadPage(page, subpage);
                    });
                });
            });
        }
        
        // Load a page with optional subpage
        function loadPage(page, subpage = '') {
            // Update current page state
            currentPage = page;
            currentSubpage = subpage;
            
            // Hide all page contents
            Object.values(pageContents).forEach(content => {
                if (content) content.classList.add('d-none');
            });
            
            // Show active page content
            if (pageContents[page]) {
                pageContents[page].classList.remove('d-none');
                
                // Update page title and content based on page and subpage
                updatePageContent(page, subpage);
                
                // Update active menu item
                updateActiveMenuItem(page, subpage);
            }
        }
        
        // Update page content based on page and subpage
        function updatePageContent(page, subpage) {
            switch(page) {
                case 'dashboard':
                    // Dashboard is already set up
                    break;
                    
                case 'members':
                    updateMembersPage(subpage);
                    break;
                    
                case 'packages':
                    updatePackagesPage(subpage);
                    break;
                    
                case 'blog':
                    updateBlogPage(subpage);
                    break;
                    
                case 'settings':
                    updateSettingsPage(subpage);
                    break;
                    
                case 'staff':
                    updateStaffPage(subpage);
                    break;
                    
                default:
                    // For other pages, show a generic content
                    const pageTitle = document.querySelector(`#${page}Content #pageTitle`);
                    if (pageTitle) {
                        pageTitle.textContent = formatPageName(page);
                    }
                    break;
            }
        }
        
        // Update members page based on subpage
        function updateMembersPage(subpage) {
            const pageTitle = document.getElementById('pageTitle');
            const tableBody = document.getElementById('membersTableBody');
            
            // Set page title based on subpage
            switch(subpage) {
                case 'all-members':
                    pageTitle.textContent = 'All Members';
                    break;
                case 'advocates':
                    pageTitle.textContent = 'Advocates';
                    break;
                case 'clients':
                    pageTitle.textContent = 'Clients';
                    break;
                default:
                    pageTitle.textContent = 'All Members';
                    subpage = 'all-members';
            }
            
            // Clear table
            tableBody.innerHTML = '';
            
            // Filter members based on subpage
            let filteredMembers = [...membersData];
            if (subpage === 'advocates') {
                filteredMembers = membersData.filter(member => member.type === 'Advocate');
            } else if (subpage === 'clients') {
                filteredMembers = membersData.filter(member => member.type === 'Client');
            }
            
            // Populate table with filtered members
            filteredMembers.forEach(member => {
                const row = document.createElement('tr');
                
                // Determine status class
                let statusClass = 'active';
                if (member.status === 'pending') statusClass = 'pending';
                if (member.status === 'blocked') statusClass = 'blocked';
                if (member.status === 'inactive') statusClass = 'inactive';
                
                row.innerHTML = `
                    <td>#${member.id}</td>
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.type}</td>
                    <td>${member.joinDate}</td>
                    <td><span class="status ${statusClass}">${member.status.charAt(0).toUpperCase() + member.status.slice(1)}</span></td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }
        
        // Update packages page based on subpage
        function updatePackagesPage(subpage) {
            const packagesTitle = document.getElementById('packagesTitle');
            const packagesActions = document.getElementById('packagesActions');
            const packagesSubContent = document.getElementById('packagesSubContent');
            
            // Set page title based on subpage
            switch(subpage) {
                case 'create-package':
                    packagesTitle.textContent = 'Create New Package';
                    packagesActions.innerHTML = '<button class="btn btn-primary"><i class="fas fa-save"></i> Save Package</button>';
                    packagesSubContent.innerHTML = getPackageFormHTML();
                    break;
                    
                case 'active-packages':
                    packagesTitle.textContent = 'Active Packages';
                    packagesActions.innerHTML = '<button class="btn btn-primary"><i class="fas fa-plus"></i> Create Package</button>';
                    packagesSubContent.innerHTML = getPackagesTableHTML(packagesData.filter(pkg => pkg.status === 'active'));
                    break;
                    
                case 'expired-packages':
                    packagesTitle.textContent = 'Expired Packages';
                    packagesActions.innerHTML = '<button class="btn btn-primary"><i class="fas fa-plus"></i> Create Package</button>';
                    packagesSubContent.innerHTML = getPackagesTableHTML(packagesData.filter(pkg => pkg.status === 'expired'));
                    break;
                    
                default:
                    packagesTitle.textContent = 'Premium Packages';
                    packagesActions.innerHTML = '<button class="btn btn-primary"><i class="fas fa-plus"></i> Create Package</button>';
                    packagesSubContent.innerHTML = getPackagesOverviewHTML();
            }
        }
        
        // Get HTML for packages overview
        function getPackagesOverviewHTML() {
            return `
                <div class="stats mb-20">
                    <div class="card blue"><p>Total Packages</p><h2>${packagesData.length}</h2></div>
                    <div class="card green"><p>Active Packages</p><h2>${packagesData.filter(pkg => pkg.status === 'active').length}</h2></div>
                    <div class="card orange"><p>Expired Packages</p><h2>${packagesData.filter(pkg => pkg.status === 'expired').length}</h2></div>
                </div>
                
                <div class="data-table">
                    <h3 style="margin-bottom: 15px; color: #f8fafc;">All Packages</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Package Name</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Users</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${packagesData.map(pkg => `
                                <tr>
                                    <td>#${pkg.id}</td>
                                    <td>${pkg.name}</td>
                                    <td>${pkg.price}</td>
                                    <td>${pkg.duration}</td>
                                    <td>${pkg.users}</td>
                                    <td><span class="status ${pkg.status === 'active' ? 'active' : 'inactive'}">${pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}</span></td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Get HTML for packages table
        function getPackagesTableHTML(packages) {
            if (packages.length === 0) {
                return '<div class="text-center p-20"><h3>No packages found</h3></div>';
            }
            
            return `
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Package Name</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Users</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${packages.map(pkg => `
                                <tr>
                                    <td>#${pkg.id}</td>
                                    <td>${pkg.name}</td>
                                    <td>${pkg.price}</td>
                                    <td>${pkg.duration}</td>
                                    <td>${pkg.users}</td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Get HTML for package form
        function getPackageFormHTML() {
            return `
                <div class="form-container">
                    <form id="packageForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Package Name</label>
                                <input type="text" class="form-control" placeholder="e.g., Gold Package" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Price (₹)</label>
                                <input type="number" class="form-control" placeholder="5000" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Duration</label>
                                <select class="form-control" required>
                                    <option value="">Select Duration</option>
                                    <option value="1">1 Month</option>
                                    <option value="3">3 Months</option>
                                    <option value="6">6 Months</option>
                                    <option value="12">1 Year</option>
                                    <option value="24">2 Years</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Users</label>
                                <input type="number" class="form-control" placeholder="100" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Features</label>
                            <textarea class="form-control" rows="4" placeholder="List package features (one per line)" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="3" placeholder="Package description" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-control" required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Package</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        // Update blog page based on subpage
        function updateBlogPage(subpage) {
            const blogTitle = document.getElementById('blogTitle');
            const blogSubContent = document.getElementById('blogSubContent');
            
            // Set page title based on subpage
            switch(subpage) {
                case 'all-blogs':
                    blogTitle.textContent = 'All Blog Posts';
                    blogSubContent.innerHTML = getAllBlogsHTML();
                    break;
                    
                case 'add-blog':
                    blogTitle.textContent = 'Add New Blog Post';
                    blogSubContent.innerHTML = getAddBlogHTML();
                    break;
                    
                case 'blog-categories':
                    blogTitle.textContent = 'Blog Categories';
                    blogSubContent.innerHTML = getBlogCategoriesHTML();
                    break;
                    
                default:
                    blogTitle.textContent = 'Blog System';
                    blogSubContent.innerHTML = getAllBlogsHTML();
            }
        }
        
        // Get HTML for all blogs
        function getAllBlogsHTML() {
            return `
                <div class="page-actions" style="margin-bottom: 20px;">
                    <button class="btn btn-primary" id="openAddBlogModal"><i class="fas fa-plus"></i> Add Blog Post</button>
                </div>
                
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Views</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${blogsData.map(blog => `
                                <tr>
                                    <td>#${blog.id}</td>
                                    <td>${blog.title}</td>
                                    <td>${blog.category}</td>
                                    <td>${blog.author}</td>
                                    <td>${blog.date}</td>
                                    <td>${blog.views}</td>
                                    <td><span class="status ${blog.status === 'published' ? 'active' : 'pending'}">${blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}</span></td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Get HTML for add blog
        function getAddBlogHTML() {
            return `
                <div class="form-container">
                    <form id="addBlogForm">
                        <div class="form-group">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-control" placeholder="Enter blog title" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Category</label>
                                <select class="form-control" required>
                                    <option value="">Select Category</option>
                                    <option value="news">News</option>
                                    <option value="tutorials">Tutorials</option>
                                    <option value="updates">Updates</option>
                                    <option value="announcements">Announcements</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Author</label>
                                <input type="text" class="form-control" value="Admin" readonly>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Content</label>
                            <textarea class="form-control" rows="10" placeholder="Write your blog content here..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Featured Image</label>
                            <input type="file" class="form-control">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Status</label>
                                <select class="form-control" required>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Publish Date</label>
                                <input type="date" class="form-control" required>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary">Cancel</button>
                            <button type="submit" class="btn btn-primary">Publish Blog</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        // Get HTML for blog categories
        function getBlogCategoriesHTML() {
            const categories = ['News', 'Tutorials', 'Updates', 'Announcements', 'Success Stories'];
            
            return `
                <div class="page-actions" style="margin-bottom: 20px;">
                    <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Category</button>
                </div>
                
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Blog Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${categories.map((cat, index) => `
                                <tr>
                                    <td>#${index + 1}</td>
                                    <td>${cat}</td>
                                    <td>${blogsData.filter(blog => blog.category === cat).length}</td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Update settings page based on subpage
        function updateSettingsPage(subpage) {
            const settingsTitle = document.getElementById('settingsTitle');
            const settingsSubContent = document.getElementById('settingsSubContent');
            
            // Set page title based on subpage
            switch(subpage) {
                case 'general':
                    settingsTitle.textContent = 'General Settings';
                    settingsSubContent.innerHTML = getGeneralSettingsHTML();
                    break;
                    
                case 'security':
                    settingsTitle.textContent = 'Security Settings';
                    settingsSubContent.innerHTML = getSecuritySettingsHTML();
                    break;
                    
                case 'roles':
                    settingsTitle.textContent = 'Role Management';
                    settingsSubContent.innerHTML = getRolesSettingsHTML();
                    break;
                    
                default:
                    settingsTitle.textContent = 'Settings';
                    settingsSubContent.innerHTML = getGeneralSettingsHTML();
            }
        }
        
        // Get HTML for general settings
        function getGeneralSettingsHTML() {
            return `
                <div class="form-container">
                    <form id="generalSettingsForm">
                        <div class="form-group">
                            <label class="form-label">Website Name</label>
                            <input type="text" class="form-control" value="AdvocateConnect" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Website URL</label>
                            <input type="text" class="form-control" value="https://advocateconnect.example.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Contact Email</label>
                            <input type="email" class="form-control" value="admin@advocateconnect.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Timezone</label>
                            <select class="form-control" required>
                                <option value="UTC+5:30" selected>UTC+5:30 (India)</option>
                                <option value="UTC+0">UTC+0 (London)</option>
                                <option value="UTC-5">UTC-5 (New York)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Date Format</label>
                            <select class="form-control" required>
                                <option value="dd/mm/yyyy" selected>DD/MM/YYYY</option>
                                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Save Settings</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        // Get HTML for security settings
        function getSecuritySettingsHTML() {
            return `
                <div class="form-container">
                    <form id="securitySettingsForm">
                        <div class="form-group">
                            <label class="form-label">Enable Two-Factor Authentication</label>
                            <div>
                                <label style="display: inline-flex; align-items: center; margin-right: 20px;">
                                    <input type="radio" name="2fa" value="yes" checked> Yes
                                </label>
                                <label style="display: inline-flex; align-items: center;">
                                    <input type="radio" name="2fa" value="no"> No
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Session Timeout (minutes)</label>
                            <input type="number" class="form-control" value="30" min="5" max="120" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Failed Login Attempts Before Lockout</label>
                            <input type="number" class="form-control" value="5" min="1" max="10" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Enable Login Notifications</label>
                            <div>
                                <label style="display: inline-flex; align-items: center; margin-right: 20px;">
                                    <input type="checkbox" checked> Email
                                </label>
                                <label style="display: inline-flex; align-items: center;">
                                    <input type="checkbox"> SMS
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Save Security Settings</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        // Get HTML for roles settings
        function getRolesSettingsHTML() {
            const roles = [
                {name: 'Admin', permissions: 'Full Access', users: 2},
                {name: 'Editor', permissions: 'Content Management', users: 3},
                {name: 'Moderator', permissions: 'User Management', users: 5},
                {name: 'Support', permissions: 'Support Access', users: 4}
            ];
            
            return `
                <div class="page-actions" style="margin-bottom: 20px;">
                    <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Role</button>
                </div>
                
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Permissions</th>
                                <th>Users</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${roles.map(role => `
                                <tr>
                                    <td>${role.name}</td>
                                    <td>${role.permissions}</td>
                                    <td>${role.users}</td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Update staff page based on subpage
        function updateStaffPage(subpage) {
            const staffTitle = document.getElementById('staffTitle');
            const staffSubContent = document.getElementById('staffSubContent');
            
            // Set page title based on subpage
            switch(subpage) {
                case 'all-staffs':
                    staffTitle.textContent = 'All Staff Members';
                    staffSubContent.innerHTML = getAllStaffHTML();
                    break;
                    
                case 'add-staff':
                    staffTitle.textContent = 'Add New Staff';
                    staffSubContent.innerHTML = getAddStaffHTML();
                    break;
                    
                default:
                    staffTitle.textContent = 'Staff Management';
                    staffSubContent.innerHTML = getAllStaffHTML();
            }
        }
        
        // Get HTML for all staff
        function getAllStaffHTML() {
            return `
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${staffData.map(staff => `
                                <tr>
                                    <td>#${staff.id}</td>
                                    <td>${staff.name}</td>
                                    <td>${staff.email}</td>
                                    <td>${staff.role}</td>
                                    <td>${staff.joinDate}</td>
                                    <td><span class="status ${staff.status === 'active' ? 'active' : 'inactive'}">${staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}</span></td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Get HTML for add staff
        function getAddStaffHTML() {
            return `
                <div class="form-container">
                    <form id="addStaffForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Role</label>
                            <select class="form-control" required>
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="moderator">Moderator</option>
                                <option value="support">Support</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Permissions</label>
                            <div>
                                <label style="display: block; margin-bottom: 8px;">
                                    <input type="checkbox"> Manage Users
                                </label>
                                <label style="display: block; margin-bottom: 8px;">
                                    <input type="checkbox"> Manage Content
                                </label>
                                <label style="display: block; margin-bottom: 8px;">
                                    <input type="checkbox"> View Analytics
                                </label>
                                <label style="display: block; margin-bottom: 8px;">
                                    <input type="checkbox"> Manage Settings
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary">Cancel</button>
                            <button type="submit" class="btn btn-primary">Add Staff</button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        // Update active menu item
        function updateActiveMenuItem(page, subpage) {
            // Remove active class from all items
            document.querySelectorAll('.menu .item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Find and activate the current page item
            const activeItem = document.querySelector(`.menu .item[data-page="${page}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                
                // If there's a subpage, also mark it as active
                if (subpage) {
                    // Remove active class from all submenu items
                    activeItem.querySelectorAll('.submenu a').forEach(subItem => {
                        subItem.classList.remove('active');
                    });
                    
                    // Find and activate the subpage item
                    const activeSubItem = activeItem.querySelector(`.submenu a[data-subpage="${subpage}"]`);
                    if (activeSubItem) {
                        activeSubItem.classList.add('active');
                    }
                }
            }
        }
        
        // Format page name for display
        function formatPageName(page) {
            return page.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        
        // Initialize charts
        function initCharts() {
            // Earnings chart
            const earnChartCtx = document.getElementById('earnChart').getContext('2d');
            const earnChart = new Chart(earnChartCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Earnings (₹)',
                        data: [32000, 28000, 35000, 42000, 48000, 52000, 58000, 62000, 55000, 60000, 65000, 70000],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(71, 85, 105, 0.3)'
                            },
                            ticks: {
                                color: '#cbd5e1',
                                callback: function(value) {
                                    return '₹' + value/1000 + 'k';
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(71, 85, 105, 0.3)'
                            },
                            ticks: {
                                color: '#cbd5e1'
                            }
                        }
                    }
                }
            });
        }
        
        // Setup modals
        function setupModals() {
            // Staff modal
            const addStaffModal = document.getElementById('addStaffModal');
            const addStaffBtn = document.getElementById('addStaffBtn');
            const closeStaffModal = document.getElementById('closeStaffModal');
            const cancelStaffBtn = document.getElementById('cancelStaffBtn');
            const saveStaffBtn = document.getElementById('saveStaffBtn');
            
            if (addStaffBtn) {
                addStaffBtn.addEventListener('click', () => {
                    addStaffModal.classList.add('active');
                });
            }
            
            if (closeStaffModal) {
                closeStaffModal.addEventListener('click', () => {
                    addStaffModal.classList.remove('active');
                });
            }
            
            if (cancelStaffBtn) {
                cancelStaffBtn.addEventListener('click', () => {
                    addStaffModal.classList.remove('active');
                });
            }
            
            if (saveStaffBtn) {
                saveStaffBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    addStaffModal.classList.remove('active');
                    showNotification('Staff member added successfully', 'success');
                });
            }
            
            // Blog modal
            const addBlogModal = document.getElementById('addBlogModal');
            const openAddBlogModal = document.getElementById('openAddBlogModal');
            const closeBlogModal = document.getElementById('closeBlogModal');
            const cancelBlogBtn = document.getElementById('cancelBlogBtn');
            const saveBlogBtn = document.getElementById('saveBlogBtn');
            
            // Open blog modal when clicking "Add Blog Post" button
            document.addEventListener('click', function(e) {
                if (e.target && e.target.id === 'openAddBlogModal') {
                    addBlogModal.classList.add('active');
                }
            });
            
            if (closeBlogModal) {
                closeBlogModal.addEventListener('click', () => {
                    addBlogModal.classList.remove('active');
                });
            }
            
            if (cancelBlogBtn) {
                cancelBlogBtn.addEventListener('click', () => {
                    addBlogModal.classList.remove('active');
                });
            }
            
            if (saveBlogBtn) {
                saveBlogBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    addBlogModal.classList.remove('active');
                    showNotification('Blog post published successfully', 'success');
                });
            }
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('active');
                }
            });
        }
        
        // Clear cache function
        function clearCache() {
            showNotification('Cache cleared successfully', 'success');
        }
        
        // Show notifications
        function showNotifications() {
            showNotification('You have 3 new notifications', 'info');
        }
        
        // Show notification
        function showNotification(message, type = 'info') {
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Initialize when DOM is loaded
        // document.addEventListener('DOMContentLoaded', initDashboard);


} 

// "use strict";

/* ==============================
   ADMIN DASHBOARD SCRIPT
   ============================== */












/* =====================================================
   MEMBERSHIP COMPONENT SYSTEM
===================================================== */

const membershipPlans = {
    free: {
    title: "Free Membership",
    
    rows: [
        ["Free Registration","✅","✅","✅"],
        ["Short List","🔒","🔒","🔒"],
        ["Intrest","🔒","🔒","🔒"],
        ["Super Intrest","🔒","🔒","🔒"],
        ["Messages","🔒","🔒","🔒"],
      ["Contact Views","🔒","🔒","🔒"],
      ["Profile Views","🔒","🔒","🔒"],
      ["Connections","🔒","🔒","🔒"],
       ["Voice call","🔒","🔒","🔒"],
      ["Video call","🔒","🔒","🔒"],
      [" In Person","🔒","🔒","🔒"],
      ["Access to Premium","🔒","🔒","🔒"],
      ["Search Visibility","🔒","🔒","🔒"],
      ["chat support" , "🔒" ,"🔒","🔒"] ,
      ["Call support","🔒","🔒","🔒"] ,
       ["Assistant Service","🔒","🔒","🔒"],
       ["Personal Assistant ","🔒","🔒","🔒"]
    ]
  },

  lite: {
    title: "Pro Lite ",
    
    rows: [
          ["Free Registration","✅","✅","✅"],
        ["Short List","🔒","🔒","🔒"],
        ["Intrest","🔒","🔒","🔒"],
        ["Super Intrest","🔒","🔒","🔒"],
        ["Messages","🔒","🔒","🔒"],
    ["Contact Views","🔒","🔒","🔒"],
      ["Profile Views","🔒","🔒","🔒"],
      ["Connections","🔒","🔒","🔒"],
     ["Messages","🔒","🔒","🔒"],
      ["Voice call","🔒","🔒","🔒"],
      ["Video call","🔒","🔒","🔒"],
      [" In Person","🔒","🔒","🔒"],
      ["Access to Premium","🔒","🔒","🔒"],
      ["Search Visibility","🔒","🔒","🔒"],
      ["Credits","🔒","🔒","🔒"],
      ["chat support" , "🔒" ,"🔒","🔒"] ,
      ["Call support","🔒","🔒","🔒"] ,
       ["Assistant Service","🔒","🔒","🔒"],
       ["Personal Assistant ","🔒","🔒","🔒"]
    ]
  },

  pro: {
    title: "Pro ",
    
    rows: [
          ["Free Registration","✅","✅","✅"],
        ["Short List","🔒","🔒","🔒"],
        ["Intrest","🔒","🔒","🔒"],
        ["Super Intrest","🔒","🔒","🔒"],
        ["Messages","🔒","🔒","🔒"],
    ["Contact Views","🔒","🔒","🔒"],
      ["Profile Views","🔒","🔒","🔒"],
      ["Connections","🔒","🔒","🔒"],
       ["Messages","🔒","🔒","🔒"],
              ["Featured Profiles","🔒","🔒","🔒"],

      ["Voice call","🔒","🔒","🔒"],
      ["Video call","🔒","🔒","🔒"],
      [" In Person","🔒","🔒","🔒"],
      ["Access to Premium","🔒","🔒","🔒"],
      ["Search Visibility","🔒","🔒","🔒"],
      ["Credits","🔒","🔒","🔒"],
      ["chat support" , "🔒" ,"🔒","🔒"] ,
      ["Call support","🔒","🔒","🔒"] ,
       ["Assistant Service","🔒","🔒","🔒"],
       ["Personal Assistant ","🔒","🔒","🔒"]
  ]
  },

  ultra: {
    title: "Ultra Pro ",
    
    rows: [
          ["Free Registration","✅","✅","✅"],
        ["Short List","🔒","🔒","🔒"],
        ["Intrest","🔒","🔒","🔒"],
        ["Super Intrest","🔒","🔒","🔒"],
        ["Messages","🔒","🔒","🔒"],
      ["Contact Views","🔒","🔒","🔒"],
      ["Profile Views","🔒","🔒","🔒"],
      ["Connections","🔒","🔒","🔒"],
      ["Messages","🔒","🔒","🔒"],
      ["Voice call","🔒","🔒","🔒"],
      ["Video call","🔒","🔒","🔒"],
      [" In Person","🔒","🔒","🔒"],
      ["Access to Premium","🔒","🔒","🔒"],
      ["Search Visibility","🔒","🔒","🔒"],
      ["Credits","🔒","🔒","🔒"],
      ["chat support" , "🔒" ,"🔒","🔒"] ,
      ["Call support","🔒","🔒","🔒"] ,
       ["Assistant Service","🔒","🔒","🔒"],
       ["Personal Assistant ","🔒","🔒","🔒"]
    ]
  }
};

function initMembershipPage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    // Check if we're on the membership page by looking for specific elements
    const tabsContainer = app.querySelector(".tabs");
    const tableRows = app.querySelector("#tableRows");
    const title = app.querySelector("#title");
    const rightTitle = app.querySelector("#rightTitle");
    const rightDesc = app.querySelector("#rightDesc");
    
    // If membership elements exist, initialize
    if (tabsContainer && tableRows && title && rightTitle && rightDesc) {
        loadMembershipPlan("free");
        
        // Event delegation for tabs
        tabsContainer.addEventListener("click", e => {
            const tab = e.target.closest(".tab");
            if (!tab) return;

            tabsContainer.querySelectorAll(".tab")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");
            loadMembershipPlan(tab.dataset.plan);
        });
    }
}

function loadMembershipPlan(key) {
    const plan = membershipPlans[key];
    if (!plan) return;
    
    const title = document.querySelector("#title");
    const rightTitle = document.querySelector("#rightTitle");
    const rightDesc = document.querySelector("#rightDesc");
    const tableRows = document.querySelector("#tableRows");
    
    if (!title || !rightTitle || !rightDesc || !tableRows) return;
    
    title.textContent = plan.title;
    rightTitle.textContent = plan.title;
    rightDesc.textContent = plan.right;
    tableRows.textContent = "";

    const fragment = document.createDocumentFragment();

    plan.rows.forEach(([feature, silver, gold, platinum]) => {
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `
            <div class="col feature">${feature}</div>
            <div class="col">${silver}</div>
            <div class="col">${gold}</div>
            <div class="col">${platinum}</div>
        `;
        fragment.appendChild(row);
    });

    tableRows.appendChild(fragment);
}



/* =====================================================
   MAIN INITIALIZATION
===================================================== */
window.addEventListener("DOMContentLoaded", () => {
    // Set initial layout based on login state
    const loggedIn = isLoggedIn();
    const navbar = $(".navbar");
    const footer = $(".footer");
    
    if (navbar) navbar.classList.toggle("hidden", loggedIn);
    if (footer) footer.classList.toggle("hidden", loggedIn);

    // Initialize core systems
    initNavbar();
    initChatbot();
    updateNavbarAuth();
    renderPage();
        initAdvocateRegistration();
admindash();
    // Initialize multi-step forms
    initMultiStepForm();



    
});

window.addEventListener("hashchange", renderPage);

// Make functions available globally
window.hidelay = hidelay;
window.showlay = showlay;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.switchTab = switchTab;
window.openClientForm = openClientForm;
window.closeClientForm = closeClientForm;
window.openAdvocateForm = openAdvocateForm;
window.closeAdvocateForm = closeAdvocateForm;
window.openbrowseprofiles = openbrowseprofiles;
window.closebrowseprofiles = closebrowseprofiles;
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.applyAdvocateFilters = applyAdvocateFilters;
window.applyToggleFilters = applyToggleFilters;
window.showAdvocatesToggle = showAdvocatesToggle;
window.showClientsToggle = showClientsToggle;
window.nextBlog = nextBlog;
window.prevBlog = prevBlog;
window.backToBlogs = backToBlogs;
window.openContactPopup = openContactPopup;
window.closeContactPopup = closeContactPopup;
window.copyContactDetails = copyContactDetails;
window.showPage = showPage;
window.toggleAnswer = toggleAnswer;












// // =====================================================
// // TATITO LEGAL CONNECT - MASTER JS FILE
// // =====================================================

// // ================= GLOBAL VARIABLES =================
// let currentPageCleanup = null;
// let sliderTimer = null;
// let isPremiumUser = false;
// let currentPage = 'featured-profiles';
// let sidebarOpen = true;
// let selectedPlan = 'Gold';

// // Profile data for detailed view
// const profileData = {
//   1: {
//     name: "Samantha",
//     age: 27,
//     id: "NYC98765",
//     verified: true,
//     lastSeen: "12:51 AM",
//     photo: "femalelawyer.jpg",
//     height: "5'4\"",
//     religion: "Christian",
//     caste: "Roman Catholic",
//     motherTongue: "English",
//     location: "New York, USA",
//     income: "$80,000 - $100,000",
//     maritalStatus: "Never Married",
//     about: "I am a caring, independent and family-oriented person. I value honesty, respect, and emotional connection.",
//     education: "JD – Harvard Law School"
//   },
//   2: {
//     name: "Daniel",
//     age: 32,
//     id: "TX44521",
//     verified: true,
//     lastSeen: "1:10 AM",
//     photo: "images/daniel.jpg",
//     height: "5'9\"",
//     religion: "Christian",
//     caste: "General",
//     motherTongue: "English",
//     location: "Austin, Texas, USA",
//     income: "$120,000+",
//     maritalStatus: "Never Married",
//     about: "Corporate professional with a passion for growth and stability.",
//     education: "LL.M – Stanford Law School"
//   }
//   // ... rest of profile data
// };

// // Sub-departments data
// const subDepartments = {
//   criminal: ["IPC & CrPC", "Cyber Crimes", "Juvenile Justice"],
//   family: ["Marriage & Divorce", "Maintenance", "Adoption"],
//   corporate: ["Company Incorporation", "Mergers & Acquisitions"],
//   // ... rest of sub-departments
// };

// // Locations data
// const locations = {
//   telangana: {
//     Hyderabad: ["Banjara Hills", "Gachibowli", "Madhapur"],
//     Warangal: ["Hanamkonda", "Kazipet"]
//   },
//   andhra: {
//     AlluriSitharamaRaju: ["Paderu", "Araku Valley"],
//     Anakapalli: ["Anakapalli", "Narsipatnam"]
//   }
//   // ... rest of locations
// };

// // ================= CORE HELPER FUNCTIONS =================
// const $ = (s, c = document) => c.querySelector(s);
// const $$ = (s, c = document) => [...c.querySelectorAll(s)];
// const safe = (fn) => { try { fn(); } catch (e) { console.warn(e.message); } };

// // ================= LAYOUT CONTROL =================
// function hidelay() {
//   const navbar = document.querySelector(".navbar");
//   const footer = document.querySelector(".footer");
  
//   if (navbar) navbar.classList.add("hidden");
//   if (footer) footer.classList.add("hidden");
  
//   localStorage.setItem("hideLayout", "true");
// }

// function showlay() {
//   const navbar = document.querySelector(".navbar");
//   const footer = document.querySelector(".footer");
  
//   if (navbar) navbar.classList.remove("hidden");
//   if (footer) footer.classList.remove("hidden");
  
//   localStorage.setItem("hideLayout", "false");
// }

// // ================= AUTHENTICATION SYSTEM =================
// function openAuth(tab) {
//   document.getElementById("authPopup").style.display = "flex";
//   switchAuthTab(tab);
// }

// function closeAuth() {
//   document.getElementById("authPopup").style.display = "none";
// }

// function switchAuthTab(tab) {
//   const loginForm = document.getElementById("loginForm");
//   const registerForm = document.getElementById("registerForm");
//   const loginTab = document.getElementById("loginTab");
//   const registerTab = document.getElementById("registerTab");

//   loginForm?.classList.remove("active");
//   registerForm?.classList.remove("active");
//   loginTab?.classList.remove("active");
//   registerTab?.classList.remove("active");

//   if (tab === "login") {
//     loginForm?.classList.add("active");
//     loginTab?.classList.add("active");
//   } else {
//     registerForm?.classList.add("active");
//     registerTab?.classList.add("active");
//   }
// }

// function openClientForm() {
//   document.getElementById("clientPopup")?.style.display = "flex";
// }

// function closeClientForm() {
//   document.getElementById("clientPopup")?.style.display = "none";
// }

// function openAdvocateForm() {
//   document.getElementById("advocatePopup")?.style.display = "flex";
// }

// function closeAdvocateForm() {
//   document.getElementById("advocatePopup")?.style.display = "none";
// }

// // ================= REGISTRATION FORMS =================
// function initClientRegistration() {
//   const steps = document.querySelectorAll(".step");
//   const sections = document.querySelectorAll(".client-step");
//   let current = 0;

//   function updateClientSteps() {
//     sections.forEach((s, i) => s.classList.toggle("active", i === current));
//     steps.forEach((s, i) => s.classList.toggle("active", i === current));
    
//     const prevBtn = document.getElementById("prevBtn");
//     const nextBtn = document.getElementById("nextBtn");
    
//     if (prevBtn) prevBtn.style.display = current === 0 ? "none" : "inline-block";
//     if (nextBtn) nextBtn.innerText = current === sections.length - 1 ? "Submit" : "Next";
//   }

//   updateClientSteps();

//   const nextBtn = document.getElementById("nextBtn");
//   const prevBtn = document.getElementById("prevBtn");

//   if (nextBtn) {
//     nextBtn.onclick = () => {
//       if (current < sections.length - 1) {
//         current++;
//         updateClientSteps();
//       } else {
//         alert("Client Registration Submitted ✅");
//       }
//     };
//   }

//   if (prevBtn) {
//     prevBtn.onclick = () => {
//       if (current > 0) {
//         current--;
//         updateClientSteps();
//       }
//     };
//   }
// }

// // ================= NAVBAR & PROFILE =================
// function initNavbar() {
//   const nav = $(".navbar");
//   if (nav) {
//     document.documentElement.style.setProperty("--nav-height", nav.offsetHeight + "px");
//   }

//   $(".menu-toggle")?.addEventListener("click", () =>
//     $(".nav-links")?.classList.toggle("show")
//   );

//   let fontSize = 16;
//   $("#font-plus")?.addEventListener("click", () => {
//     document.body.style.fontSize = ++fontSize + "px";
//   });
  
//   $("#font-minus")?.addEventListener("click", () => {
//     document.body.style.fontSize = --fontSize + "px";
//   });

//   $("#theme-toggle")?.addEventListener("click", () =>
//     document.body.classList.toggle("dark")
//   );

//   initProfileDropdown();
// }

// function setAvatarInitials() {
//   const avatar = document.getElementById("avatarInitials");
//   const name = localStorage.getItem("userName");

//   if (!avatar || !name) return;

//   const initials = name
//     .split(" ")
//     .map(w => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   avatar.textContent = initials;
// }

// function initProfileDropdown() {
//   const wrapper = document.querySelector(".profile-wrapper");
//   const trigger = document.getElementById("profileTrigger");
//   const dropdown = document.getElementById("profileDropdown");
//   const logoutBtn = document.getElementById("logoutBtn");

//   if (!wrapper || !trigger || !dropdown) return;

//   trigger.onclick = null;
//   document.onclick = null;

//   trigger.addEventListener("click", function (e) {
//     e.stopPropagation();
//     wrapper.classList.toggle("open");
//   });

//   document.addEventListener("click", function () {
//     wrapper.classList.remove("open");
//   });

//   dropdown.addEventListener("click", function (e) {
//     e.stopPropagation();
//   });

//   logoutBtn?.addEventListener("click", function () {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userName");
//     wrapper.classList.remove("open");
//     updateNavbarAuth();
//     location.hash = "login";
//   });
// }

// function updateNavbarAuth() {
//   const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const loginBtn = document.querySelector(".loginnav");
//   const registerBtn = document.querySelector(".registernav");
//   const profileNav = document.querySelector(".profile-nav");

//   if (loggedIn) {
//     loginBtn?.classList.add("hide");
//     registerBtn?.classList.add("hide");
//     profileNav?.classList.add("show");
//     setAvatarInitials();
//   } else {
//     loginBtn?.classList.remove("hide");
//     registerBtn?.classList.remove("hide");
//     profileNav?.classList.remove("show");
//   }
// }

// function isLoggedIn() {
//   return localStorage.getItem("isLoggedIn") === "true";
// }

// function logout() {
//   localStorage.removeItem("isLoggedIn");
//   localStorage.removeItem("userName");
//   showlay();
//   updateNavbarAuth();
//   location.hash = "home";
// }

// // ================= PAGE NAVIGATION =================
// function showsidePage(pageId) {
//   document.querySelectorAll('.page').forEach(page => {
//     page.classList.remove('active');
//   });
  
//   document.querySelectorAll('.menu li').forEach(item => {
//     item.classList.remove('active');
//   });
  
//   const targetPage = document.getElementById(pageId);
//   if (targetPage) {
//     targetPage.classList.add('active');
//   }
  
//   currentPage = pageId;
//   updateBottomNavActive(pageId);
  
//   if (window.innerWidth <= 768) {
//     toggleSidebar();
//   }
// }

// function backtohome() {
//   showsidePage('featured-profiles');
// }

// function asNavigate(pageId) {
//   showToast(`Opening ${pageId.replace('-', ' ')}...`);
//   document.querySelectorAll('.page').forEach(page => {
//     page.classList.remove('active');
//   });
  
//   const targetPage = document.getElementById(pageId);
//   if (targetPage) {
//     targetPage.classList.add('active');
//   }
// }

// // ================= SIDEBAR FUNCTIONS =================
// function toggleSidebar() {
//   const sidebar = document.getElementById('sidebar');
//   const mainContent = document.getElementById('main-content');
  
//   if (sidebarOpen) {
//     sidebar?.classList.add('closed');
//     mainContent?.classList.add('expanded');
//     sidebarOpen = false;
//   } else {
//     sidebar?.classList.remove('closed');
//     mainContent?.classList.remove('expanded');
//     sidebarOpen = true;
//   }
// }

// // ================= CHATBOT SYSTEM =================
// function initChat() {
//   const widget = $("#chatWidget");
//   const toggle = $("#chatToggle");
//   const input = $("#chatInput");
//   const messages = $("#chatMessages");

//   if (!widget || !toggle) return;

//   toggle.onclick = () => widget.style.display =
//     widget.style.display === "flex" ? "none" : "flex";

//   input?.addEventListener("keydown", e => {
//     if (e.key === "Enter" && input.value.trim()) {
//       messages.innerHTML += `<div class="message user">${input.value}</div>`;
//       input.value = "";
//     }
//   });
// }

// // ================= SLIDER SYSTEMS =================
// function initSlider() {
//   const slides = document.querySelectorAll(".case-slide");
//   const dots = document.querySelectorAll(".case-dots .dot");

//   if (!slides.length) return;

//   let currentIndex = 0;

//   function showSlide(index) {
//     slides.forEach(s => s.classList.remove("active"));
//     dots.forEach(d => d.classList.remove("active"));

//     slides[index]?.classList.add("active");
//     dots[index]?.classList.add("active");
//   }

//   function nextSlide() {
//     currentIndex = (currentIndex + 1) % slides.length;
//     showSlide(currentIndex);
//   }

//   function prevSlide() {
//     currentIndex = (currentIndex - 1 + slides.length) % slides.length;
//     showSlide(currentIndex);
//   }

//   function goToSlide(index) {
//     currentIndex = index;
//     showSlide(currentIndex);
//     restartAuto();
//   }

//   function restartAuto() {
//     clearInterval(sliderTimer);
//     sliderTimer = setInterval(nextSlide, 6000);
//   }

//   dots.forEach((dot, i) => {
//     dot.addEventListener("click", () => goToSlide(i));
//   });

//   window.nextSlide = nextSlide;
//   window.prevSlide = prevSlide;
//   window.goToSlide = goToSlide;

//   showSlide(currentIndex);
//   restartAuto();
// }

// function initMultiSliders() {
//   const sliderBoxes = document.querySelectorAll(".slider-box");
//   if (!sliderBoxes.length) return;

//   sliderBoxes.forEach(sliderBox => {
//     if (sliderBox.dataset.initialized === "true") return;

//     const slides = sliderBox.querySelectorAll(".slide");
//     const prevBtn = sliderBox.querySelector(".prev");
//     const nextBtn = sliderBox.querySelector(".next");
//     const dotsWrap = sliderBox.querySelector(".dots");

//     if (!slides.length) return;

//     let current = 0;
//     dotsWrap.innerHTML = '';
    
//     slides.forEach((_, i) => {
//       const dot = document.createElement("span");
//       dot.className = "dot";
//       if (i === 0) dot.classList.add("active");
//       dotsWrap.appendChild(dot);

//       dot.addEventListener("click", () => {
//         showSlide(i);
//       });
//     });

//     const dots = dotsWrap.querySelectorAll(".dot");

//     function showSlide(index) {
//       slides[current]?.classList.remove("active");
//       dots[current]?.classList.remove("active");
//       current = index;
//       slides[current]?.classList.add("active");
//       dots[current]?.classList.add("active");
//     }

//     function nextSlide() {
//       showSlide((current + 1) % slides.length);
//     }

//     function prevSlide() {
//       showSlide((current - 1 + slides.length) % slides.length);
//     }

//     nextBtn?.addEventListener("click", nextSlide);
//     prevBtn?.addEventListener("click", prevSlide);

//     let sliderInterval;
//     function startAutoPlay() {
//       clearInterval(sliderInterval);
//       sliderInterval = setInterval(nextSlide, 5000);
//     }
    
//     function stopAutoPlay() {
//       clearInterval(sliderInterval);
//     }
    
//     startAutoPlay();
//     sliderBox.addEventListener("mouseenter", stopAutoPlay);
//     sliderBox.addEventListener("mouseleave", startAutoPlay);

//     sliderBox.dataset.initialized = "true";
//   });
// }

// // ================= BLOG SYSTEMS =================
// const blogs = [
//   {
//     title: "Ethical Boundaries for Advocates on Digital Platforms",
//     excerpt: "Understanding Bar Council of India guidelines when engaging with clients online.",
//     author: "Adv. R. Sharma",
//     role: "BCI Registered Advocate",
//     date: "March 2025"
//   }
//   // ... more blogs
// ];

// function loadBlogs() {
//   const container = document.getElementById("blogContainer");
//   if (!container) return;

//   container.innerHTML = blogs.map(blog => `
//     <article class="blog-card premium-blog">
//       <div class="blog-author">
//         <div class="author-avatar premium-avatar">${blog.author.charAt(0)}</div>
//         <div class="author-info">
//           <strong>${blog.author}</strong>
//           <span class="author-role">${blog.role}</span>
//           <span class="author-date">${blog.date}</span>
//         </div>
//       </div>
//       <h3 class="blog-title">${blog.title}</h3>
//       <p class="blog-excerpt">${blog.excerpt}</p>
//       <div class="blog-footer">
//         <span class="blog-tag">Legal Awareness</span>
//         <a href="#mainblogs" class="blog-btn premium-btn">Read Article →</a>
//       </div>
//     </article>
//   `).join("");
// }

// function initBlogPage() {
//   if (!document.querySelector('link[href*="font-awesome"]')) {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
//     document.head.appendChild(link);
//   }
  
//   initBlogGrid();
// }

// function initBlogGrid() {
//   const blogGrid = document.getElementById('blog-grid');
//   if (!blogGrid) return;

//   let page = 1;
//   let loading = false;
//   let isInitialized = false;

//   const authors = [
//     { name: "Adv. Priya Sharma", role: "Corporate Law Expert • 15+ Years", letter: "P" }
//     // ... more authors
//   ];

//   function generateBlog(id) {
//     const author = authors[id % authors.length];
//     return {
//       id,
//       title: "Digital Evidence in Modern Courtrooms: A Practical Guide",
//       excerpt: "In today's digital age, legal professionals must adapt to new technologies...",
//       fullContent: `<p>Digital transformation has revolutionized legal proceedings...</p>`,
//       author: author.name,
//       authorRole: author.role,
//       avatarLetter: author.letter,
//       date: "2 days ago",
//       likes: Math.floor(Math.random() * 500) + 100,
//       comments: Math.floor(Math.random() * 100) + 20
//     };
//   }

//   function createBlogCard(blog) {
//     const card = document.createElement('article');
//     card.className = 'blog-card';
//     card.dataset.id = blog.id;
    
//     card.innerHTML = `
//       <div class="card-header">
//         <div class="author-info">
//           <div class="avatar">${blog.avatarLetter}</div>
//           <div class="author-details">
//             <h3>${blog.author}</h3>
//             <p>${blog.authorRole} • ${blog.date}</p>
//           </div>
//         </div>
//         <button class="bookmark-btn" aria-label="Bookmark this post">
//           <i class="fas fa-bookmark"></i>
//         </button>
//       </div>
//       <div class="card-content">
//         <h2>${blog.title}</h2>
//         <p>${blog.excerpt}</p>
//       </div>
//       <div class="card-footer">
//         <div class="interactions">
//           <div class="interaction-item">
//             <button class="like-btn" aria-label="Like this post">
//               <i class="far fa-heart"></i>
//             </button>
//             <span class="like-count">${blog.likes}</span>
//           </div>
//           <div class="interaction-item">
//             <i class="fas fa-comment comment-btn"></i>
//             <span>${blog.comments}</span>
//           </div>
//         </div>
//         <button class="share-btn" aria-label="Share this post">
//           <i class="fas fa-share-alt"></i>
//         </button>
//       </div>
//     `;
    
//     return card;
//   }

//   function loadBlogs() {
//     if (loading) return;
//     loading = true;
    
//     setTimeout(() => {
//       for (let i = 1; i <= 4; i++) {
//         const id = (page - 1) * 4 + i;
//         const blog = generateBlog(id);
//         blogGrid.appendChild(createBlogCard(blog));
//       }
      
//       page++;
//       loading = false;
//       attachCardEvents();
//     }, 800);
//   }

//   function attachCardEvents() {
//     document.querySelectorAll('.bookmark-btn').forEach(btn => {
//       btn.onclick = function(e) {
//         e.stopPropagation();
//         const icon = this.querySelector('i');
//         if (icon.classList.contains('fas')) {
//           icon.classList.remove('fas');
//           icon.classList.add('far');
//         } else {
//           icon.classList.remove('far');
//           icon.classList.add('fas');
//         }
//       };
//     });
    
//     document.querySelectorAll('.like-btn').forEach(btn => {
//       btn.onclick = function(e) {
//         e.stopPropagation();
//         const icon = this.querySelector('i');
//         const likeCount = this.nextElementSibling;
        
//         if (icon.classList.contains('fas')) {
//           icon.classList.remove('fas');
//           icon.classList.add('far');
//           likeCount.textContent = parseInt(likeCount.textContent) - 1;
//         } else {
//           icon.classList.remove('far');
//           icon.classList.add('fas');
//           likeCount.textContent = parseInt(likeCount.textContent) + 1;
//         }
//       };
//     });
    
//     document.querySelectorAll('.blog-card').forEach(card => {
//       card.onclick = function(e) {
//         if (e.target.closest('button') || e.target.tagName === 'BUTTON' || 
//             e.target.tagName === 'I') {
//           return;
//         }
        
//         const title = this.querySelector('h2').textContent;
//         alert(`Opening full article: ${title}`);
//       };
//     });
//   }

//   if (!isInitialized) {
//     loadBlogs();
    
//     const scrollHandler = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
//         loadBlogs();
//       }
//     };
    
//     window.addEventListener('scroll', scrollHandler);
//     isInitialized = true;
    
//     window.cleanupBlogGrid = () => {
//       window.removeEventListener('scroll', scrollHandler);
//       delete window.cleanupBlogGrid;
//       isInitialized = false;
//     };
//   }
// }

// // ================= ADVOCATES/CLIENTS TOGGLE =================
// function initAdvocatesClientsToggle() {
//   const grid = document.getElementById("grid");
//   const advBtn = document.getElementById("advBtn");
//   const clientBtn = document.getElementById("clientBtn");
  
//   if (!grid || !advBtn || !clientBtn) return;

//   if (grid.dataset.initialized === "true") return;

//   let currentType = "advocates";

//   const toggleAdvocates = [
//     {name:"Sa*** Mi***",role:"Corporate Law",location:"Mumbai",exp:15,meta:"📍 Mumbai • 15+ Years",img:"female2.jpg"}
//     // ... more advocates
//   ];

//   const clients = [
//     {name:"Ra*** Ku***",role:"Business Owner",location:"Hyderabad",exp:15,meta:"📍 Hyderabad • Corporate Case",img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"}
//     // ... more clients
//   ];

//   function renderToggle(list) {
//     if (!grid) return;
    
//     grid.innerHTML = "";
//     list.slice(0, 6).forEach(p => {
//       grid.innerHTML += `
//         <div class="blogcard">
//           <div class="blogavatar" style="background-image:url('${p.img}')"></div>
//           <div class="name">${p.name}</div>
//           <div class="role">${p.role}</div>
//           <div class="meta">${p.meta}</div>
//           <div class="btn-row">
//             <button class="btn primary" onclick="alert('Interest sent to ${p.name}')">Interest</button>
//             <button class="btn" onclick="alert('Super interest sent to ${p.name}')">Super Interest</button>
//           </div>
//           <div class="btn-row">
//             <button class="btn" onclick="alert('Viewing profile of ${p.name}')">View Profile</button>
//             <button class="btn" onclick="alert('Opening chat with ${p.name}')">Chat</button>
//           </div>
//           <div class="footer-note">Platform facilitated connection only. No legal advice.</div>
//         </div>`;
//     });
//   }

//   window.showAdvocatesToggle = () => {
//     currentType = "advocates";
//     advBtn.classList.add("active");
//     clientBtn.classList.remove("active");
//     renderToggle(toggleAdvocates);
//   };

//   window.showClientsToggle = () => {
//     currentType = "clients";
//     clientBtn.classList.add("active");
//     advBtn.classList.remove("active");
//     renderToggle(clients);
//   };

//   advBtn.addEventListener("click", window.showAdvocatesToggle);
//   clientBtn.addEventListener("click", window.showClientsToggle);

//   renderToggle(toggleAdvocates);
//   grid.dataset.initialized = "true";

//   window.cleanupToggleModule = () => {
//     advBtn.removeEventListener("click", window.showAdvocatesToggle);
//     clientBtn.removeEventListener("click", window.showClientsToggle);
//     delete window.showAdvocatesToggle;
//     delete window.showClientsToggle;
//     delete window.cleanupToggleModule;
//     grid.dataset.initialized = "false";
//   };
// }

// // ================= ADVOCATES LISTING =================
// const advocates = [
//   {
//     name: "Sarah Mitchell",
//     specialization: "Corporate Law",
//     location: "Mumbai",
//     experience: 15,
//     image: "/femalelawyer.jpg"
//   }
//   // ... more advocates
// ];

// function maskName(name) {
//   return isPremiumUser ? name : name.split(" ").map(p => p.slice(0,2)+"***").join(" ");
// }

// function renderAdvocates(list) {
//   const container = document.getElementById("advocates-container");
//   if (!container) return;
  
//   container.innerHTML = "";
//   list.forEach(a => {
//     container.innerHTML += `
//       <div class="adv-card premium-card">
//         <div class="adv-image">
//           <img src="${a.image}" alt="Advocate profile">
//         </div>
//         <div class="adv-card-body">
//           <h3 class="adv-name">${maskName(a.name)}</h3>
//           <p class="adv-role">${a.specialization}</p>
//           <p class="adv-meta">📍 ${a.location} <span>•</span> ${a.experience}+ Years Experience</p>
//           <div class="adv-actions">
//             <button class="btn-outline" onclick="alert('Interest Sent!')">Interest</button>
//             <button class="btn-outline" onclick="alert('Super Interest Sent!')">Super Interest</button>
//             <button class="btn-outline" onclick="alert('Opening Profile')">View Profile</button>
//             <button class="btn-outline" onclick="alert('Opening Chat')">Chat</button>
//           </div>
//           <p class="adv-note">Platform facilitated connection only. No legal advice or consultation.</p>
//         </div>
//       </div>`;
//   });
// }

// window.applyFilters = () => {
//   const loc = $("#filter-location")?.value;
//   const exp = $("#filter-experience")?.value;
//   const spec = $("#filter-specialization")?.value;

//   const filtered = advocates.filter(a =>
//     (!loc || a.location === loc) &&
//     (!exp || a.experience >= exp) &&
//     (!spec || a.specialization === spec)
//   );

//   renderAdvocates(filtered);
// };

// // ================= CONTACT SYSTEM =================
// function initContact() {
//   const form = $("#contactForm");
//   if (!form) return;

//   form.addEventListener("submit", e => {
//     e.preventDefault();
//     alert("Message sent successfully ✅");
//     form.reset();
//   });
// }

// function initContactPopup() {
//   document.querySelectorAll('.contact-link').forEach(link => {
//     link.addEventListener('click', openContactPopup);
//   });
// }

// function openContactPopup(e) {
//   if (e) e.preventDefault();
  
//   let popup = document.getElementById('tatitoContactPopup');
//   if (popup) {
//     popup.style.display = 'flex';
//     return;
//   }
  
//   const template = document.getElementById('contactPopupTemplate');
//   if (!template) return;
  
//   const clone = template.content.cloneNode(true);
//   document.body.appendChild(clone);
  
//   document.addEventListener('keydown', handleContactPopupEscape);
  
//   setTimeout(() => {
//     const popupContainer = document.querySelector('.tatito-popup-container');
//     popupContainer?.focus();
//   }, 100);
// }

// function closeContactPopup(e) {
//   if (e) {
//     if (e.target.classList.contains('tatito-popup-overlay') || 
//         e.target.classList.contains('tatito-popup-close') || 
//         e.target.classList.contains('tatito-close-btn')) {
//       e.preventDefault();
//     }
//   }
  
//   const popup = document.getElementById('tatitoContactPopup');
//   if (popup) popup.style.display = 'none';
  
//   document.removeEventListener('keydown', handleContactPopupEscape);
// }

// function handleContactPopupEscape(e) {
//   if (e.key === 'Escape') closeContactPopup();
// }

// // ================= FAQ SYSTEM =================
// function initFaq() {
//   $$(".faq-question").forEach(q => {
//     q.addEventListener("click", () => {
//       const item = q.closest(".faq-item");
//       $$(".faq-item").forEach(f => f !== item && f.classList.remove("active"));
//       item.classList.toggle("active");
//     });
//   });
// }

// // ================= INTERSECTION OBSERVER =================
// function reveal(selector, threshold = 0.2) {
//   const els = $$(selector);
//   if (!els.length) return;

//   const obs = new IntersectionObserver(entries => {
//     entries.forEach(e => {
//       if (e.isIntersecting) {
//         e.target.classList.add("visible");
//         obs.unobserve(e.target);
//       }
//     });
//   }, { threshold });

//   els.forEach(el => obs.observe(el));
// }

// // ================= DETAILED PROFILE VIEW =================
// function showDetailedProfile(profileId) {
//   const profile = profileData[profileId];
//   if (!profile) return;

//   const profileDetails = document.getElementById('profile-details');
//   if (!profileDetails) return;

//   profileDetails.innerHTML = `
//     <div class="dp-header">
//       <button class="dp-back-btn" onclick="showsidePage('featured-profiles')">
//         <i class="fa-solid fa-arrow-left"></i>
//       </button>
//       <div>
//         <div class="dp-name">${profile.name}, ${profile.age}</div>
//         <div class="dp-title">${profile.location}</div>
//       </div>
//       <div class="dp-id">
//         <i class="fa-solid fa-shield"></i> ${profile.id}
//       </div>
//     </div>
//     <div class="dp-content">
//       <div class="dp-top-grid">
//         <div class="dp-image-card">
//           <img src="${profile.photo}" alt="${profile.name}">
//         </div>
//         <div class="dp-right-card">
//           <div class="dp-section">
//             <div class="dp-section-title">About Me</div>
//             <div class="dp-bio">${profile.about}</div>
//           </div>
//           <div class="dp-section">
//             <div class="dp-section-title">Details</div>
//             <div class="dp-info-grid">
//               ${renderInfoItem("ruler-vertical", "Height", profile.height)}
//               ${renderInfoItem("om", "Religion / Caste", `${profile.religion} • ${profile.caste}`)}
//               ${renderInfoItem("language", "Mother Tongue", profile.motherTongue)}
//               ${renderInfoItem("location-dot", "Location", profile.location)}
//               ${renderInfoItem("wallet", "Income", profile.income)}
//               ${renderInfoItem("ring", "Marital Status", profile.maritalStatus)}
//               ${renderInfoItem("graduation-cap", "Education", profile.education)}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div class="dp-section dp-full-width">
//         <div class="dp-section-title">Professional & Personal Overview</div>
//         <p>${profile.name} is a well-educated professional with a strong academic background from ${profile.education}.</p>
//       </div>
//     </div>
//     <div class="dp-actions-gridss">
//       <button class="dp-action-btn primary" onclick="showToast('Interest sent to ${profile.name}!')">
//         <i class="fa-solid fa-heart"></i> Interest
//       </button>
//       <button class="dp-action-btn secondary" onclick="showToast('Super Interest sent to ${profile.name}!')">
//         <i class="fa-solid fa-bolt"></i> Super Interest
//       </button>
//       <button class="dp-action-btn secondary" onclick="showToast('${profile.name} shortlisted!')">
//         <i class="fa-solid fa-star"></i> Shortlist
//       </button>
//       <button class="dp-action-btn secondary" onclick="showToast('Chat opened with ${profile.name}')">
//         <i class="fa-regular fa-message"></i> Chat
//       </button>
//     </div>
//   `;

//   document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
//   document.getElementById('detailed-profile-view')?.classList.add('active');
// }

// function renderInfoItem(icon, label, value) {
//   if (!value) return '';
//   return `
//     <div class="dp-info-item">
//       <div class="dp-info-icon">
//         <i class="fa-solid fa-${icon}"></i>
//       </div>
//       <div class="dp-info-text">
//         <div class="dp-info-label">${label}</div>
//         <div class="dp-info-value">${value}</div>
//       </div>
//     </div>
//   `;
// }

// // ================= BROWSE PROFILES FILTERS =================
// function initBrowseProfilesFilters() {
//   const deptCheckboxes = document.querySelectorAll("#departmentSelect input[type='checkbox']");
//   const subDeptDropdown = document.querySelector("#subDepartmentSelect .dropdown");
  
//   deptCheckboxes.forEach(cb => {
//     cb.addEventListener("change", updateSubDepartments);
//   });

//   function updateSubDepartments() {
//     const searchInput = subDeptDropdown?.querySelector(".dropdown-search");
//     if (!subDeptDropdown) return;
    
//     subDeptDropdown.innerHTML = "";
//     if (searchInput) subDeptDropdown.appendChild(searchInput);

//     const selectedDepartments = Array.from(deptCheckboxes)
//       .filter(cb => cb.checked)
//       .map(cb => cb.value.toLowerCase());

//     let finalSubDepartments = [];
//     selectedDepartments.forEach(dept => {
//       if (subDepartments[dept]) {
//         finalSubDepartments = finalSubDepartments.concat(subDepartments[dept]);
//       }
//     });

//     finalSubDepartments = [...new Set(finalSubDepartments)];

//     if (finalSubDepartments.length === 0) {
//       const placeholder = document.createElement("span");
//       placeholder.style.padding = "8px";
//       placeholder.style.display = "block";
//       placeholder.textContent = "Select a department first";
//       subDeptDropdown.appendChild(placeholder);
//       return;
//     }

//     finalSubDepartments.forEach(sub => {
//       const label = document.createElement("label");
//       label.innerHTML = `<input type="checkbox" value="${sub}"> ${sub}`;
//       subDeptDropdown.appendChild(label);
//     });
//   }

//   updateSubDepartments();
// }

// function initLocationFilters() {
//   const stateCheckboxes = document.querySelectorAll("#stateSelect input[type='checkbox']");
//   const districtDropdown = document.querySelector("#districtSelect .dropdown");
//   const cityDropdown = document.querySelector("#citySelect .dropdown");

//   stateCheckboxes.forEach(cb => cb.addEventListener("change", updateDistricts));

//   function updateDistricts() {
//     if (!districtDropdown || !cityDropdown) return;
    
//     districtDropdown.innerHTML = '<input class="dropdown-search" placeholder="Search district">';
//     cityDropdown.innerHTML = '<input class="dropdown-search" placeholder="Search city">' +
//         '<div style="padding: 12px; color: #94a3b8; font-style: italic;">Select a district first to see cities</div>';

//     const selectedStates = Array.from(stateCheckboxes)
//       .filter(cb => cb.checked)
//       .map(cb => cb.value);

//     if (selectedStates.length === 0) {
//       districtDropdown.innerHTML += '<div style="padding: 12px; color: #94a3b8; font-style: italic;">Select a state first to see districts</div>';
//       return;
//     }

//     let allDistricts = [];
//     selectedStates.forEach(state => {
//       if (locations[state]) {
//         allDistricts = allDistricts.concat(Object.keys(locations[state]));
//       }
//     });
//     allDistricts = [...new Set(allDistricts)].sort();

//     allDistricts.forEach(dist => {
//       const niceName = dist.replace(/([A-Z])/g, ' $1').trim();
//       const label = document.createElement("label");
//       label.innerHTML = `<input type="checkbox" value="${dist}"> ${niceName}`;
//       districtDropdown.appendChild(label);
//     });

//     document.querySelectorAll("#districtSelect input[type='checkbox']").forEach(cb => {
//       cb.addEventListener("change", updateCities);
//     });
//   }

//   function updateCities() {
//     if (!cityDropdown) return;
    
//     cityDropdown.innerHTML = '<input class="dropdown-search" placeholder="Search city">';

//     const selectedDistricts = Array.from(document.querySelectorAll("#districtSelect input[type='checkbox']"))
//       .filter(cb => cb.checked)
//       .map(cb => cb.value);

//     const selectedStates = Array.from(stateCheckboxes)
//       .filter(cb => cb.checked)
//       .map(cb => cb.value);

//     if (selectedDistricts.length === 0) {
//       cityDropdown.innerHTML += '<div style="padding: 12px; color: #94a3b8; font-style: italic;">Select a district first to see cities</div>';
//       return;
//     }

//     let allCities = [];
//     selectedStates.forEach(state => {
//       if (locations[state]) {
//         Object.entries(locations[state]).forEach(([dist, cities]) => {
//           if (selectedDistricts.includes(dist)) {
//             allCities = allCities.concat(cities);
//           }
//         });
//       }
//     });
//     allCities = [...new Set(allCities)].sort();

//     allCities.forEach(city => {
//       const label = document.createElement("label");
//       label.innerHTML = `<input type="checkbox" value="${city}"> ${city}`;
//       cityDropdown.appendChild(label);
//     });
//   }

//   updateDistricts();
// }

// // ================= NOTIFICATION & TOAST =================
// function showNotification(message, type = 'info') {
//   const notification = document.getElementById('adNotification');
//   const notificationText = document.getElementById('adNotificationText');
  
//   if (!notification || !notificationText) return;
  
//   notificationText.textContent = message;
//   notification.className = `ad-notification ad-${type}`;
//   notification.classList.add('ad-show');
  
//   setTimeout(() => {
//     notification.classList.remove('ad-show');
//   }, 3000);
// }

// function showToast(message) {
//   let toast = document.getElementById('toast');
  
//   if (!toast) {
//     toast = document.createElement('div');
//     toast.id = 'toast';
//     toast.className = 'toast';
//     document.body.appendChild(toast);
//   }
  
//   toast.textContent = message;
//   toast.style.display = 'block';
  
//   setTimeout(() => {
//     toast.style.display = 'none';
//   }, 3000);
// }

// // ================= DROPDOWN SELECT SYSTEMS =================
// function initSelectDropdowns() {
//   document.querySelectorAll(".select-box").forEach(box => {
//     box.onclick = e => {
//       e.stopPropagation();
//       closeAllDropdowns();
//       const parent = box.parentElement;
//       parent.classList.toggle("active");
//       parent.querySelector(".dropdown")?.classList.toggle("open");
//     }
//   });

//   document.querySelectorAll(".dropdown-search").forEach(input => {
//     input.oninput = () => {
//       input.parentElement.querySelectorAll("label").forEach(l => {
//         l.style.display = l.textContent.toLowerCase().includes(input.value.toLowerCase()) ? "flex" : "none";
//       });
//     };
//   });

//   document.querySelectorAll("label input").forEach(cb => {
//     cb.onchange = () => {
//       const box = cb.closest(".multi-select")?.querySelector(".select-box span");
//       if (!box) return;
      
//       const count = cb.closest(".dropdown")?.querySelectorAll("input:checked").length || 0;
//       box.querySelector(".selected-count")?.remove();
      
//       if (count) {
//         const s = document.createElement("span");
//         s.className = "selected-count";
//         s.textContent = count;
//         box.appendChild(s);
//       }
//     };
//   });

//   function closeAllDropdowns() {
//     document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open"));
//     document.querySelectorAll(".multi-select").forEach(s => s.classList.remove("active"));
//   }
  
//   document.addEventListener("click", closeAllDropdowns);
// }

// // ================= ADMIN DASHBOARD =================
// function adInitDashboard() {
//   const adSidebar = document.getElementById('adSidebar');
//   const adSidebarToggle = document.getElementById('adSidebarToggle');
  
//   if (adSidebarToggle && adSidebar) {
//     adSidebarToggle.addEventListener('click', function() {
//       adSidebar.classList.toggle('ad-collapsed');
//       const icon = adSidebarToggle.querySelector('i');
//       if (adSidebar.classList.contains('ad-collapsed')) {
//         icon.className = 'fas fa-bars';
//       } else {
//         icon.className = 'fas fa-times';
//       }
//     });
//   }
  
//   adInitMenu();
//   adInitCharts();
//   adInitButtons();
//   adInitModals();
  
//   setTimeout(() => {
//     adShowNotification('Admin dashboard loaded successfully', 'success');
//   }, 800);
// }

// function adInitMenu() {
//   const menuItems = document.querySelectorAll('.ad-menu-item');
  
//   menuItems.forEach(item => {
//     const title = item.querySelector('.ad-title');
//     if (!title) return;
    
//     title.addEventListener('click', function(e) {
//       e.stopPropagation();
      
//       if (item.classList.contains('ad-has-sub')) {
//         document.querySelectorAll('.ad-menu-item.ad-open').forEach(openItem => {
//           if (openItem !== item) {
//             openItem.classList.remove('ad-open');
//           }
//         });
        
//         item.classList.toggle('ad-open');
//       } else {
//         const page = item.getAttribute('data-page');
//         adLoadPage(page);
//       }
//     });
    
//     const submenuItems = item.querySelectorAll('.ad-submenu a');
//     submenuItems.forEach(subItem => {
//       subItem.addEventListener('click', function(e) {
//         e.stopPropagation();
        
//         const page = item.getAttribute('data-page');
//         const subpage = this.getAttribute('data-subpage');
        
//         document.querySelectorAll('.ad-menu-item.ad-open').forEach(openItem => {
//           openItem.classList.remove('ad-open');
//         });
        
//         adLoadPage(page, subpage);
//       });
//     });
//   });
// }

// let adCurrentPage = 'dashboard';
// let adCurrentSubpage = '';

// function adLoadPage(page, subpage = '') {
//   adCurrentPage = page;
//   adCurrentSubpage = subpage;
  
//   const pages = ['dashboard', 'members', 'packages', 'settings', 'staff', 'blog', 'wallet', 'marketing', 'system'];
//   pages.forEach(p => {
//     const element = document.getElementById(`ad${p.charAt(0).toUpperCase() + p.slice(1)}Content`);
//     if (element) {
//       element.classList.add('ad-hidden');
//     }
//   });
  
//   const currentPageElement = document.getElementById(`ad${page.charAt(0).toUpperCase() + page.slice(1)}Content`);
//   if (currentPageElement) {
//     currentPageElement.classList.remove('ad-hidden');
//     adUpdatePageContent(page, subpage);
//   }
  
//   adUpdateActiveMenuItem(page, subpage);
// }

// function adUpdatePageContent(page, subpage) {
//   switch(page) {
//     case 'dashboard':
//       break;
//     case 'members':
//       adUpdateMembersPage(subpage);
//       break;
//     case 'packages':
//       adUpdatePackagesPage(subpage);
//       break;
//     case 'blog':
//       adUpdateBlogPage(subpage);
//       break;
//     case 'settings':
//       adUpdateSettingsPage(subpage);
//       break;
//     case 'staff':
//       adUpdateStaffPage(subpage);
//       break;
//     case 'wallet':
//       adUpdateWalletPage(subpage);
//       break;
//     case 'marketing':
//       adUpdateMarketingPage(subpage);
//       break;
//     case 'system':
//       adUpdateSystemPage(subpage);
//       break;
//   }
// }

// function adUpdateMembersPage(subpage) {
//   const pageTitle = document.getElementById('adPageTitle');
//   const tableBody = document.getElementById('adMembersTableBody');
  
//   if (!pageTitle || !tableBody) return;
  
//   switch(subpage) {
//     case 'all-members': pageTitle.textContent = 'All Members'; break;
//     case 'advocates': pageTitle.textContent = 'Advocates'; break;
//     case 'clients': pageTitle.textContent = 'Clients'; break;
//     default: pageTitle.textContent = 'All Members';
//   }
  
//   const membersData = [
//     {id: 1, name: "John Doe", email: "john@example.com", type: "Advocate", joinDate: "2023-08-15", status: "active"}
//     // ... more members
//   ];
  
//   let filteredData = [...membersData];
//   if (subpage === 'advocates') {
//     filteredData = membersData.filter(m => m.type === 'Advocate');
//   } else if (subpage === 'clients') {
//     filteredData = membersData.filter(m => m.type === 'Client');
//   }
  
//   tableBody.innerHTML = '';
//   filteredData.forEach(member => {
//     let statusClass = 'ad-status-active';
//     if (member.status === 'pending') statusClass = 'ad-status-pending';
//     if (member.status === 'blocked') statusClass = 'ad-status-blocked';
    
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>#${member.id}</td>
//       <td>${member.name}</td>
//       <td>${member.email}</td>
//       <td>${member.type}</td>
//       <td>${member.joinDate}</td>
//       <td><span class="ad-status-badge ${statusClass}">${member.status.charAt(0).toUpperCase() + member.status.slice(1)}</span></td>
//       <td>
//         <button class="ad-btn ad-btn-secondary ad-btn-sm"><i class="fas fa-edit"></i></button>
//         <button class="ad-btn ad-btn-secondary ad-btn-sm" style="margin-left: 8px;"><i class="fas fa-trash"></i></button>
//       </td>
//     `;
//     tableBody.appendChild(row);
//   });
// }

// // ... other admin functions (truncated for brevity)

// // ================= SPA ROUTER =================
// const app = $("#app");

// function initHome() {
//   safe(initSlider);
//   safe(initMultiSliders);
//   safe(loadBlogs);
//   safe(() => renderAdvocates(advocates));
//   safe(initContact);
//   safe(initFaq);
//   safe(() => reveal(".service-row", 0.1));
//   safe(() => reveal(".hiw-card", 0.3));
//   safe(() => reveal(".tm-card", 0.2));
// }

// function initDashboard() {
//   const form = document.getElementById("dashboardForm");
//   if (!form) return;

//   form.addEventListener("submit", e => {
//     e.preventDefault();
//     alert("Dashboard data saved (UI only)");
//   });
// }

// function initadvocateDashboard() {
//   const canvas = document.getElementById("earnChart");
//   if (!canvas) return;

//   new Chart(canvas, {
//     type: 'line',
//     data: {
//       labels: ['Jan','Feb','Mar','Apr','May','Jun'],
//       datasets: [{
//         data: [45000,52000,48000,61000,58000,70000],
//         borderColor: '#38bdf8',
//         backgroundColor: 'rgba(56,189,248,0.2)',
//         borderWidth: 3,
//         tension: 0.4,
//         fill: true
//       }]
//     },
//     options: {
//       plugins: { legend: { display: false } },
//       scales: { y: { beginAtZero: true } }
//     }
//   });
// }

// function renderPage() {
//   const route = location.hash.replace("#", "") || "home";
//   const tpl = document.getElementById(route);

//   if (typeof currentPageCleanup === "function") {
//     currentPageCleanup();
//     currentPageCleanup = null;
//   }

//   if (!tpl || !app) {
//     app.innerHTML = "<h1>404 - Page Not Found</h1>";
//     return;
//   }

//   const dashboardPages = ["dashboard", "clientdashboard", "advocatedashboard"];
//   if (dashboardPages.includes(route) && !isLoggedIn()) {
//     location.hash = "login";
//     return;
//   }

//   app.innerHTML = tpl.innerHTML;

//   const isDashboardPage = route.includes("dashboard");

//   if (isDashboardPage) {
//     hidelay();
//     app.style.marginTop = "0px";
//   } else {
//     showlay();
//     const navbar = document.querySelector(".navbar");
//     if (navbar) {
//       document.documentElement.style.setProperty("--nav-height", navbar.offsetHeight + "px");
//     }
//   }

//   requestAnimationFrame(() => {
//     if (route === "home") initHome();
//     else if (route === "dashboard") initDashboard();
//     else if (route === "blogs") initBlogPage();
//     else if (route === "advocatedashboard") initadvocateDashboard();
//     else if (route === "clientdashboard") { /* init client dashboard */ }

//     if (document.getElementById("blog-grid")) safe(initBlogGrid);
//     if (document.getElementById("grid") && document.getElementById("advBtn") && document.getElementById("clientBtn")) {
//       safe(initAdvocatesClientsToggle);
//     }
//     if (document.querySelector(".slider-box")) safe(initMultiSliders);
//     if (document.querySelector(".faq-question")) safe(initFaq);
//     if (document.getElementById("contactForm")) safe(initContact);
//     if (document.querySelector(".contact-link")) safe(initContactPopup);
    
//     safe(() => reveal(".reveal-on-scroll", 0.1));
    
//     updateNavbarAuth();
//     window.scrollTo(0, 0);
    
//     if (typeof window.cleanupToggleModule === "function") {
//       currentPageCleanup = window.cleanupToggleModule;
//     } else if (typeof window.cleanupBlogGrid === "function") {
//       currentPageCleanup = window.cleanupBlogGrid;
//     }
//   });
// }

// // ================= EVENT LISTENERS =================
// document.addEventListener("DOMContentLoaded", function() {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   document.querySelector(".navbar")?.classList.toggle("hidden", isLoggedIn);
//   document.querySelector(".footer")?.classList.toggle("hidden", isLoggedIn);

//   showsidePage('featured-profiles');
  
//   if (window.innerWidth <= 576) {
//     toggleSidebar();
//   }

//   initNavbar();
//   initChat();
//   updateNavbarAuth();
//   renderPage();
  
//   initSelectDropdowns();
//   initBrowseProfilesFilters();
//   initLocationFilters();
  
//   document.querySelectorAll('.sidebar .menu li').forEach(item => {
//     item.addEventListener('click', () => {
//       if (window.innerWidth < 992) {
//         toggleSidebar();
//       }
//     });
//   });
// });

// window.addEventListener("hashchange", renderPage);

// // ================= FORM SUBMISSION HANDLER =================
// document.addEventListener("submit", function (e) {
//   if (e.target.id === "loginForm") {
//     e.preventDefault();

//     const email = e.target.querySelector('input[type="email"]').value;
//     const password = e.target.querySelector('input[type="password"]').value;

//     if (email === "admin@gmail.com" && password === "admin123") {
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("userName", "Demo User");
//       updateNavbarAuth();
//       hidelay();
//       closeAuth();
//       location.hash = "dashboard";
//     } else if(email === "client@gmail.com" && password === "client123") {
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("userName", "Demo User");
//       updateNavbarAuth();
//       hidelay();
//       closeAuth();
//       location.hash = "clientdashboard";
//     } else if (email === "advocate@gmail.com" && password === "advocate123") {
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("userName", "Demo User");
//       updateNavbarAuth();
//       hidelay();
//       closeAuth();
//       location.hash = "advocatedashboard"; 
//     } else {
//       alert("Invalid email or password");
//     }
//   }
// });

// // ================= UTILITY FUNCTIONS =================
// function backToCases() {
//   showsidePage('my-cases');
// }

// function backblog() {
//   location.hash = "home";
// }

// function openModal(section) {
//   const modal = document.getElementById('editModal');
//   const modalTitle = document.getElementById('modalTitle');
  
//   if (modal && modalTitle) {
//     modalTitle.textContent = `Edit ${section}`;
//     modal.classList.add('active');
//   }
// }

// function closeModal() {
//   document.getElementById('editModal')?.classList.remove('active');
// }

// function saveChanges() {
//   showToast('Changes saved successfully!');
//   closeModal();
// }

// function updateAgeValue() {
//   const ageSlider = document.getElementById('ageRange');
//   const ageValue = document.getElementById('ageValue');
//   if (ageSlider && ageValue) {
//     ageValue.textContent = `25 - ${ageSlider.value}`;
//   }
// }

// function updateExpValue() {
//   const expSlider = document.getElementById('expRange');
//   const expValue = document.getElementById('expValue');
//   if (expSlider && expValue) {
//     expValue.textContent = `2 - ${expSlider.value}`;
//   }
// }

// function selectPlan(cardElement, planName) {
//   document.querySelectorAll('.pp-card').forEach(card => {
//     card.classList.remove('selected');
//   });
  
//   cardElement.classList.add('selected');
//   selectedPlan = planName;
  
//   const buyBtn = document.getElementById('pp-buy-btn');
//   if (buyBtn) buyBtn.textContent = `Get ${planName} now`;
// }

// function toggleUpgradeType(type) {
//   const toggleItems = document.querySelectorAll('.pp-toggle div');
//   toggleItems.forEach(item => {
//     if (item.textContent === type) {
//       item.classList.add('active');
//     } else {
//       item.classList.remove('active');
//     }
//   });
  
//   showToast(`${type} upgrade selected`);
// }

// function bottomNavClick(item) {
//   document.querySelectorAll('.nav-item').forEach(navItem => {
//     navItem.classList.remove('active');
//   });
  
//   event.currentTarget.classList.add('active');
  
//   switch(item) {
//     case 'profiles': showsidePage('featured-profiles'); break;
//     case 'blogs': showsidePage('blogs'); break;
//     case 'messenger': showsidePage('messenger'); break;
//     case 'activity': showsidePage('activity'); break;
//     case 'cases': showsidePage('my-cases'); break;
//   }
// }

// // ================= MESSENGER TABS =================
// function initMessengerTabs() {
//   const tabs = document.querySelectorAll('.messenger-tab');
//   const indicator = document.querySelector('.messenger-tab-indicator');

//   tabs.forEach((tab, index) => {
//     tab.addEventListener('click', () => {
//       tabs.forEach(t => t.classList.remove('active'));
//       tab.classList.add('active');
//       if (indicator) indicator.style.left = `${index * 33.33}%`;
//     });
//   });
// }

// // ================= LEGAL MATCHING APP =================
// function initLegalMatchingApp() {
//   const navItems = document.querySelectorAll('.legal-matching-app .nav-item');
//   const tabContents = document.querySelectorAll('.legal-matching-app .tab-content');
//   const topBarTitle = document.querySelector('.legal-matching-app #top-bar h1');
  
//   function switchTab(tabId) {
//     navItems.forEach(item => item.classList.remove('active'));
//     document.querySelector(`.legal-matching-app .nav-item[data-tab="${tabId}"]`)?.classList.add('active');
    
//     tabContents.forEach(c => c.classList.remove('active'));
//     document.getElementById(tabId)?.classList.add('active');
    
//     const titleMap = {
//       'matches': 'My Matches',
//       'activity': 'Activity',
//       'messenger': 'Messenger',
//       'my-cases': 'My Cases',
//       'file-case': 'File a New Case'
//     };
    
//     if (topBarTitle) topBarTitle.textContent = titleMap[tabId] || tabId.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
//   }
  
//   navItems.forEach(item => {
//     item.addEventListener('click', () => {
//       const tab = item.dataset.tab;
//       switchTab(tab);
//     });
//   });
  
//   document.querySelector('.legal-matching-app .file-case-btn')?.addEventListener('click', () => {
//     switchTab('file-case');
//   });
  
//   document.querySelector('.legal-matching-app #cancelBtn')?.addEventListener('click', () => {
//     switchTab('my-cases');
//   });
  
//   document.querySelector('.legal-matching-app #submitBtn')?.addEventListener('click', function() {
//     const caseTitle = document.querySelector('.legal-matching-app input[type="text"]')?.value;
//     const caseDesc = document.querySelector('.legal-matching-app textarea')?.value;
    
//     if (!caseTitle || !caseDesc) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     const originalText = this.textContent;
//     this.textContent = 'Submitting...';
//     this.style.opacity = '0.7';
    
//     setTimeout(() => {
//       alert(`Case "${caseTitle}" submitted successfully!`);
//       this.textContent = originalText;
//       this.style.opacity = '1';
//       switchTab('my-cases');
      
//       document.querySelector('.legal-matching-app input[type="text"]').value = '';
//       document.querySelector('.legal-matching-app textarea').value = '';
//     }, 1500);
//   });
  
//   switchTab('matches');
// }

// // ================= WINDOW RESIZE HANDLER =================
// window.addEventListener('resize', function() {
//   if (window.innerWidth <= 576 && sidebarOpen) {
//     toggleSidebar();
//   } else if (window.innerWidth > 576 && !sidebarOpen) {
//     toggleSidebar();
//   }
// });

// // ================= EXPORT GLOBALLY =================
// window.hidelay = hidelay;
// window.showlay = showlay;
// window.openAuth = openAuth;
// window.closeAuth = closeAuth;
// window.switchAuthTab = switchAuthTab;
// window.logout = logout;
// window.showsidePage = showsidePage;
// window.backtohome = backtohome;
// window.asNavigate = asNavigate;
// window.toggleSidebar = toggleSidebar;
// window.showDetailedProfile = showDetailedProfile;
// window.showToast = showToast;
// window.showNotification = showNotification;
// window.applyFilters = applyFilters;
// window.openClientForm = openClientForm;
// window.closeClientForm = closeClientForm;
// window.openAdvocateForm = openAdvocateForm;
// window.closeAdvocateForm = closeAdvocateForm;
// window.openContactPopup = openContactPopup;
// window.closeContactPopup = closeContactPopup;
// window.adInitDashboard = adInitDashboard;
// window.adLoadPage = adLoadPage;
// window.nextSlide = nextSlide;
// window.prevSlide = prevSlide;
// window.goToSlide = goToSlide;



































// // ================================
// // CORE UTILITIES (PERFORMANCE OPTIMIZED)
// // ================================

// // Efficient DOM selectors with caching
// const domCache = new Map();
// const $ = (selector, context = document) => {
//   const cacheKey = `${selector}_${context.id || 'doc'}`;
//   if (domCache.has(cacheKey)) return domCache.get(cacheKey);
  
//   const element = context.querySelector(selector);
//   domCache.set(cacheKey, element);
//   return element;
// };

// const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

// // Performance-optimized safe execution
// const safe = (fn, fallback = null) => {
//   try {
//     return fn();
//   } catch (e) {
//     console.warn('Safe execution warning:', e.message);
//     return fallback;
//   }
// };

// // Efficient throttling/debouncing
// const throttle = (func, limit) => {
//   let lastFunc;
//   let lastRan;
//   return function() {
//     const context = this;
//     const args = arguments;
//     if (!lastRan) {
//       func.apply(context, args);
//       lastRan = Date.now();
//     } else {
//       clearTimeout(lastFunc);
//       lastFunc = setTimeout(function() {
//         if ((Date.now() - lastRan) >= limit) {
//           func.apply(context, args);
//           lastRan = Date.now();
//         }
//       }, limit - (Date.now() - lastRan));
//     }
//   };
// };

// const debounce = (func, delay) => {
//   let debounceTimer;
//   return function() {
//     const context = this;
//     const args = arguments;
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => func.apply(context, args), delay);
//   };
// };

// // Memory management
// const activeIntervals = new Set();
// const activeObservers = new WeakMap();

// const cleanupIntervals = () => {
//   activeIntervals.forEach(interval => clearInterval(interval));
//   activeIntervals.clear();
// };

// // ================================
// // LAYOUT & VISIBILITY MANAGEMENT
// // ================================

// let layoutHidden = false;
// const updateLayoutVisibility = () => {
//   const navbar = $(".navbar");
//   const footer = $(".footer");
//   const body = document.body;
  
//   if (layoutHidden) {
//     navbar?.classList.add("hidden");
//     footer?.classList.add("hidden");
//     body.style.marginTop = "0";
//     body.style.marginBottom = "0";
//   } else {
//     navbar?.classList.remove("hidden");
//     footer?.classList.remove("hidden");
    
//     // Smoothly update margins based on navbar height
//     if (navbar) {
//       const navbarHeight = navbar.offsetHeight;
//       document.documentElement.style.setProperty("--nav-height", `${navbarHeight}px`);
//       body.style.marginTop = `${navbarHeight}px`;
//     }
    
//     if (footer) {
//       body.style.marginBottom = `${footer.offsetHeight}px`;
//     }
//   }
  
//   localStorage.setItem("hideLayout", layoutHidden.toString());
// };

// const hidelay = () => {
//   layoutHidden = true;
//   updateLayoutVisibility();
// };

// const showlay = () => {
//   layoutHidden = false;
//   updateLayoutVisibility();
// };

// // ================================
// // AUTHENTICATION SYSTEM (OPTIMIZED)
// // ================================

// const auth = {
//   init() {
//     this.cacheDOM();
//     this.bindEvents();
//     this.updateAuthState();
//   },
  
//   cacheDOM() {
//     this.popup = $("#authPopup");
//     this.clientPopup = $("#clientPopup");
//     this.advocatePopup = $("#advocatePopup");
//     this.browsePopup = $("#Browseprofiles");
//     this.loginForm = $("#loginForm");
//     this.registerForm = $("#registerForm");
//     this.loginTab = $("#loginTab");
//     this.registerTab = $("#registerTab");
//   },
  
//   bindEvents() {
//     if (this.loginForm) {
//       this.loginForm.addEventListener("submit", this.handleLogin.bind(this));
//     }
//   },
  
//   handleLogin(e) {
//     e.preventDefault();
//     const email = this.loginForm.querySelector('input[type="email"]')?.value;
//     const password = this.loginForm.querySelector('input[type="password"]')?.value;
    
//     if (!email || !password) {
//       alert("Please enter both email and password");
//       return;
//     }
    
//     // Authentication logic (could be moved to a service)
//     let redirectHash = "";
//     if (email === "admin@gmail.com" && password === "admin123") {
//       redirectHash = "dashboard";
//     } else if (email === "client@gmail.com" && password === "client123") {
//       redirectHash = "clientdashboard";
//     } else if (email === "advocate@gmail.com" && password === "advocate123") {
//       redirectHash = "advocatedashboard";
//     } else {
//       alert("Invalid email or password");
//       return;
//     }
    
//     // Set session
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("userName", "Demo User");
    
//     // Update UI
//     this.closeAuth();
//     hidelay();
//     router.navigate(redirectHash);
//     navbar.updateAuthState();
//   },
  
//   openAuth(tab = "login") {
//     if (this.popup) {
//       this.popup.style.display = "flex";
//       this.switchTab(tab);
//     }
//   },
  
//   closeAuth() {
//     if (this.popup) this.popup.style.display = "none";
//   },
  
//   openClientForm() {
//     if (this.clientPopup) this.clientPopup.style.display = "flex";
//   },
  
//   closeClientForm() {
//     if (this.clientPopup) this.clientPopup.style.display = "none";
//   },
  
//   openAdvocateForm() {
//     if (this.advocatePopup) this.advocatePopup.style.display = "flex";
//   },
  
//   closeAdvocateForm() {
//     if (this.advocatePopup) this.advocatePopup.style.display = "none";
//   },
  
//   openbrowseprofiles() {
//     if (this.browsePopup) this.browsePopup.style.display = "flex";
//   },
  
//   closebrowseprofiles() {
//     if (this.browsePopup) this.browsePopup.style.display = "none";
//   },
  
//   switchTab(tab) {
//     if (!this.loginForm || !this.registerForm || !this.loginTab || !this.registerTab) return;
    
//     [this.loginForm, this.registerForm, this.loginTab, this.registerTab].forEach(el => 
//       el.classList.remove("active")
//     );
    
//     if (tab === "login") {
//       this.loginForm.classList.add("active");
//       this.loginTab.classList.add("active");
//     } else {
//       this.registerForm.classList.add("active");
//       this.registerTab.classList.add("active");
//     }
//   },
  
//   updateAuthState() {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const userName = localStorage.getItem("userName") || "User";
    
//     // Update UI based on auth state
//     if (isLoggedIn) {
//       $(".loginnav")?.classList.add("hide");
//       $(".registernav")?.classList.add("hide");
//       $(".profile-nav")?.classList.add("show");
      
//       // Update avatar
//       const avatar = $("#avatarInitials");
//       if (avatar) {
//         const initials = userName.split(" ")
//           .map(word => word[0])
//           .slice(0, 2)
//           .join("")
//           .toUpperCase();
//         avatar.textContent = initials;
//       }
//     } else {
//       $(".loginnav")?.classList.remove("hide");
//       $(".registernav")?.classList.remove("hide");
//       $(".profile-nav")?.classList.remove("show");
//     }
//   },
  
//   cleanup() {
//     if (this.loginForm) {
//       this.loginForm.removeEventListener("submit", this.handleLogin.bind(this));
//     }
//   }
// };

// // ================================
// // NAVBAR SYSTEM (PERFORMANT)
// // ================================

// const navbar = {
//   init() {
//     this.cacheDOM();
//     this.bindEvents();
//     this.updateLayoutHeight();
//     this.updateAuthState();
//   },
  
//   cacheDOM() {
//     this.nav = $(".navbar");
//     this.menuToggle = $(".menu-toggle");
//     this.navLinks = $(".nav-links");
//     this.fontPlus = $("#font-plus");
//     this.fontMinus = $("#font-minus");
//     this.themeToggle = $("#theme-toggle");
//     this.profileTrigger = $("#profileTrigger");
//     this.profileWrapper = $(".profile-wrapper");
//     this.logoutBtn = $("#logoutBtn");
//   },
  
//   bindEvents() {
//     // Mobile menu toggle
//     if (this.menuToggle && this.navLinks) {
//       this.menuToggle.addEventListener("click", () => {
//         this.navLinks.classList.toggle("show");
//       });
//     }
    
//     // Font size controls
//     let fontSize = parseInt(document.body.style.fontSize) || 16;
//     if (this.fontPlus) {
//       this.fontPlus.addEventListener("click", () => {
//         fontSize = Math.min(fontSize + 1, 24); // Cap at 24px
//         document.body.style.fontSize = `${fontSize}px`;
//       });
//     }
    
//     if (this.fontMinus) {
//       this.fontMinus.addEventListener("click", () => {
//         fontSize = Math.max(fontSize - 1, 12); // Minimum 12px
//         document.body.style.fontSize = `${fontSize}px`;
//       });
//     }
    
//     // Theme toggle
//     if (this.themeToggle) {
//       this.themeToggle.addEventListener("click", () => {
//         document.body.classList.toggle("dark");
//         localStorage.setItem("darkMode", document.body.classList.contains("dark"));
//       });
      
//       // Apply saved theme
//       if (localStorage.getItem("darkMode") === "true") {
//         document.body.classList.add("dark");
//       }
//     }
    
//     // Profile dropdown
//     if (this.profileTrigger && this.profileWrapper) {
//       this.profileTrigger.addEventListener("click", (e) => {
//         e.stopPropagation();
//         this.profileWrapper.classList.toggle("open");
//       });
      
//       document.addEventListener("click", () => {
//         this.profileWrapper.classList.remove("open");
//       });
      
//       if (this.logoutBtn) {
//         this.logoutBtn.addEventListener("click", (e) => {
//           e.stopPropagation();
//           localStorage.removeItem("isLoggedIn");
//           localStorage.removeItem("userName");
//           this.profileWrapper.classList.remove("open");
//           this.updateAuthState();
//           showlay();
//           router.navigate("home");
//         });
//       }
//     }
    
//     // Handle window resize for nav height
//     window.addEventListener("resize", debounce(this.updateLayoutHeight.bind(this), 100));
//   },
  
//   updateLayoutHeight() {
//     if (this.nav && !layoutHidden) {
//       const navbarHeight = this.nav.offsetHeight;
//       document.documentElement.style.setProperty("--nav-height", `${navbarHeight}px`);
//       document.body.style.marginTop = `${navbarHeight}px`;
//     }
//   },
  
//   updateAuthState() {
//     auth.updateAuthState();
//   },
  
//   cleanup() {
//     window.removeEventListener("resize", this.updateLayoutHeight.bind(this));
//   }
// };

// // ================================
// // SLIDER SYSTEMS (PERFORMANT ANIMATIONS)
// // ================================

// class Slider {
//   constructor(containerSelector) {
//     this.container = $(containerSelector);
//     if (!this.container) return;
    
//     this.slides = this.container.querySelectorAll(".slide, .case-slide");
//     this.dotsContainer = this.container.querySelector(".dots, .case-dots");
//     this.prevBtn = this.container.querySelector(".prev");
//     this.nextBtn = this.container.querySelector(".next");
//     this.currentIndex = 0;
//     this.autoPlayInterval = null;
    
//     if (this.slides.length > 0) {
//       this.init();
//     }
//   }
  
//   init() {
//     this.createDots();
//     this.setupEventListeners();
//     this.showSlide(0);
//     this.startAutoPlay();
//   }
  
//   createDots() {
//     if (!this.dotsContainer) return;
    
//     this.dotsContainer.innerHTML = '';
//     this.dots = [];
    
//     this.slides.forEach((_, index) => {
//       const dot = document.createElement("span");
//       dot.className = `dot ${index === 0 ? 'active' : ''}`;
//       dot.addEventListener("click", () => this.goToSlide(index));
//       this.dotsContainer.appendChild(dot);
//       this.dots.push(dot);
//     });
//   }
  
//   showSlide(index) {
//     // Use CSS transforms for smooth animations
//     this.slides.forEach((slide, i) => {
//       slide.style.opacity = i === index ? '1' : '0';
//       slide.style.transform = i === index ? 'translateX(0)' : 'translateX(20px)';
//       slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//     });
    
//     if (this.dots) {
//       this.dots.forEach((dot, i) => {
//         dot.classList.toggle('active', i === index);
//       });
//     }
    
//     this.currentIndex = index;
//   }
  
//   nextSlide() {
//     this.showSlide((this.currentIndex + 1) % this.slides.length);
//   }
  
//   prevSlide() {
//     this.showSlide((this.currentIndex - 1 + this.slides.length) % this.slides.length);
//   }
  
//   goToSlide(index) {
//     this.showSlide(index);
//     this.restartAutoPlay();
//   }
  
//   setupEventListeners() {
//     if (this.prevBtn) {
//       this.prevBtn.addEventListener("click", () => this.prevSlide());
//     }
    
//     if (this.nextBtn) {
//       this.nextBtn.addEventListener("click", () => this.nextSlide());
//     }
    
//     // Pause on hover
//     if (this.container) {
//       this.container.addEventListener("mouseenter", () => this.stopAutoPlay());
//       this.container.addEventListener("mouseleave", () => this.startAutoPlay());
//     }
//   }
  
//   startAutoPlay(interval = 5000) {
//     this.stopAutoPlay();
//     this.autoPlayInterval = setInterval(() => this.nextSlide(), interval);
//     activeIntervals.add(this.autoPlayInterval);
//   }
  
//   stopAutoPlay() {
//     if (this.autoPlayInterval) {
//       clearInterval(this.autoPlayInterval);
//       activeIntervals.delete(this.autoPlayInterval);
//       this.autoPlayInterval = null;
//     }
//   }
  
//   restartAutoPlay() {
//     this.stopAutoPlay();
//     this.startAutoPlay();
//   }
  
//   cleanup() {
//     this.stopAutoPlay();
//     if (this.prevBtn) this.prevBtn.removeEventListener("click", this.prevSlide);
//     if (this.nextBtn) this.nextBtn.removeEventListener("click", this.nextSlide);
//     if (this.container) {
//       this.container.removeEventListener("mouseenter", this.stopAutoPlay);
//       this.container.removeEventListener("mouseleave", this.startAutoPlay);
//     }
//   }
// }

// // ================================
// // CHATBOT SYSTEM (LIGHTWEIGHT)
// // ================================

// const chatbot = {
//   init() {
//     this.cacheDOM();
//     if (!this.chatWidget) return;
    
//     this.bindEvents();
//     this.scheduleInitialNotification();
//   },
  
//   cacheDOM() {
//     this.chatWidget = $("#chatWidget");
//     this.chatToggle = $("#chatToggle");
//     this.chatMessages = $("#chatMessages");
//     this.chatInput = $("#chatInput");
//     this.notificationDot = $(".notification-dot");
//   },
  
//   bindEvents() {
//     if (this.chatToggle) {
//       this.chatToggle.addEventListener("click", this.toggleChat.bind(this));
//     }
    
//     if (this.chatInput) {
//       this.chatInput.addEventListener("keydown", (e) => {
//         if (e.key === "Enter") this.sendChatMessage();
//       });
//     }
//   },
  
//   toggleChat() {
//     const isOpen = this.chatWidget.style.display !== "flex";
//     this.chatWidget.style.display = isOpen ? "flex" : "none";
    
//     if (this.notificationDot && isOpen) {
//       this.notificationDot.style.display = "none";
//     }
    
//     // Focus input when opening
//     if (isOpen && this.chatInput) {
//       setTimeout(() => this.chatInput.focus(), 100);
//     }
//   },
  
//   sendChatMessage() {
//     if (!this.chatInput || !this.chatInput.value.trim() || !this.chatMessages) return;
    
//     const text = this.chatInput.value.trim();
//     this.addMessage(text, "user");
//     this.chatInput.value = "";
    
//     // Bot response with slight delay
//     setTimeout(() => {
//       this.addMessage(this.getBotReply(text), "bot");
      
//       // Show notification if chat is closed
//       if (this.chatWidget.style.display !== "flex" && this.notificationDot) {
//         this.notificationDot.style.display = "block";
//       }
//     }, 500);
//   },
  
//   addMessage(text, type) {
//     const msg = document.createElement("div");
//     msg.className = `message ${type}`;
//     msg.innerHTML = `<div class="message-content">${text}</div>`;
//     this.chatMessages.appendChild(msg);
    
//     // Smooth scroll to bottom
//     requestAnimationFrame(() => {
//       this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
//     });
//   },
  
//   getBotReply(input) {
//     const lowerInput = input.toLowerCase();
    
//     if (lowerInput.includes("lawyer") || lowerInput.includes("advocate")) {
//       return "I can help you find a verified advocate based on your legal issue.";
//     }
    
//     if (lowerInput.includes("case") || lowerInput.includes("legal help")) {
//       return "Please tell me your case type (Criminal, Civil, Family, Corporate).";
//     }
    
//     if (lowerInput.includes("price") || lowerInput.includes("fee")) {
//       return "Consultation fees vary by advocate experience and case complexity.";
//     }
    
//     return "Thank you for reaching out. Please provide more details so I can assist you better.";
//   },
  
//   scheduleInitialNotification() {
//     setTimeout(() => {
//       if (this.chatWidget.style.display !== "flex" && this.notificationDot) {
//         this.notificationDot.style.display = "block";
//       }
//     }, 2000);
//   },
  
//   cleanup() {
//     if (this.chatToggle) {
//       this.chatToggle.removeEventListener("click", this.toggleChat.bind(this));
//     }
    
//     if (this.chatInput) {
//       this.chatInput.removeEventListener("keydown", this.sendChatMessage);
//     }
//   }
// };

// // ================================
// // REVEAL ANIMATIONS (PERFORMANT)
// // ================================

// const animations = {
//   init() {
//     this.initRevealAnimations();
//   },
  
//   initRevealAnimations(selector = ".reveal-on-scroll", threshold = 0.15) {
//     const elements = $$(selector);
//     if (!elements.length) return;
    
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add("visible");
//           observer.unobserve(entry.target);
//         }
//       });
//     }, { 
//       threshold,
//       rootMargin: "0px 0px -50px 0px" // Trigger earlier
//     });
    
//     elements.forEach(el => {
//       // Reset animation state
//       el.classList.remove("visible");
//       el.style.opacity = "0";
//       el.style.transform = "translateY(20px)";
//       el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      
//       observer.observe(el);
//     });
    
//     activeObservers.set(this, observer);
//   },
  
//   cleanup() {
//     const observer = activeObservers.get(this);
//     if (observer) {
//       observer.disconnect();
//       activeObservers.delete(this);
//     }
//   }
// };

// // ================================
// // BLOG SYSTEM (VIRTUALIZED & LAZY)
// // ================================

// const blogSystem = {
//   blogs: [
//     {
//       title: "Ethical Boundaries for Advocates on Digital Platforms",
//       excerpt: "Understanding Bar Council of India guidelines when engaging with clients online.",
//       author: "Adv. R. Sharma",
//       role: "BCI Registered Advocate",
//       date: "March 2025"
//     },
//     {
//       title: "How Technology is Changing Client–Advocate Communication",
//       excerpt: "Digital platforms are improving access while maintaining professional independence.",
//       author: "Adv. P. Mehta",
//       role: "Corporate Law",
//       date: "February 2025"
//     },
//     {
//       title: "What Clients Should Know Before Contacting an Advocate Online",
//       excerpt: "Important points for clients when using digital discovery platforms.",
//       author: "Legal Editorial Team",
//       role: "Tatito Platform",
//       date: "January 2025"
//     },
//     {
//       title: "Why Platforms Must Not Provide Legal Advice",
//       excerpt: "A clear explanation of why technology platforms must stay advisory-neutral.",
//       author: "Adv. S. Iyer",
//       role: "Legal Compliance",
//       date: "January 2025"
//     }
//   ],
  
//   mainBlogs: [
//     {
//       title: "Building Trust in Digital Platforms",
//       meta: "5 min read • Platform Insights",
//       body: `<p>Trust is the foundation of any successful digital platform. In modern ecosystems, transparency, verification, and communication play a crucial role.</p>`
//     },
//     {
//       title: "How Legal Tech Is Evolving",
//       meta: "6 min read • Technology",
//       body: `<p>Legal technology is transforming how users interact with professionals.</p>`
//     },
//     {
//       title: "Choosing the Right Advocate Online",
//       meta: "4 min read • User Guide",
//       body: `<p>Online platforms give users access to a wide range of advocates.</p>`
//     }
//   ],
  
//   currentBlogIndex: 0,
  
//   initHomepageBlogs() {
//     const container = $("#blogContainer");
//     if (!container) return;
    
//     // Use document fragment for efficient DOM updates
//     const fragment = document.createDocumentFragment();
    
//     this.blogs.forEach(blog => {
//       const article = document.createElement("article");
//       article.className = "blog-card premium-blog";
//       article.innerHTML = `
//         <div class="blog-author">
//           <div class="author-avatar premium-avatar">${blog.author.charAt(0)}</div>
//           <div class="author-info">
//             <strong>${blog.author}</strong>
//             <span class="author-role">${blog.role}</span>
//             <span class="author-date">${blog.date}</span>
//           </div>
//         </div>
//         <h3 class="blog-title">${blog.title}</h3>
//         <p class="blog-excerpt">${blog.excerpt}</p>
//         <div class="blog-footer">
//           <span class="blog-tag">Legal Awareness</span>
//           <a href="#mainblogs" class="blog-btn premium-btn">Read Article →</a>
//         </div>
//       `;
//       fragment.appendChild(article);
//     });
    
//     container.innerHTML = '';
//     container.appendChild(fragment);
//   },
  
//   initMainBlogsPage() {
//     if (!$("#blg-title")) return;
//     this.loadMainBlog(0);
//   },
  
//   loadMainBlog(index) {
//     if (!this.mainBlogs[index]) return;
    
//     this.currentBlogIndex = index;
//     const titleEl = $("#blg-title");
//     const metaEl = $("#blg-meta");
//     const bodyEl = $("#blg-body");
//     const counterEl = $("#blg-counter");
//     const blogListItems = $$("#blg-list li");
    
//     if (titleEl) titleEl.textContent = this.mainBlogs[index].title;
//     if (metaEl) metaEl.textContent = this.mainBlogs[index].meta;
//     if (bodyEl) bodyEl.innerHTML = this.mainBlogs[index].body;
//     if (counterEl) counterEl.textContent = `${index + 1} of ${this.mainBlogs.length}`;
    
//     blogListItems.forEach((li, i) => {
//       li.classList.toggle("active", i === index);
//     });
//   },
  
//   nextBlog() {
//     if (this.currentBlogIndex < this.mainBlogs.length - 1) {
//       this.loadMainBlog(this.currentBlogIndex + 1);
//     }
//   },
  
//   prevBlog() {
//     if (this.currentBlogIndex > 0) {
//       this.loadMainBlog(this.currentBlogIndex - 1);
//     }
//   },
  
//   cleanup() {
//     // No specific cleanup needed
//   }
// };

// // ================================
// // ADVOCATE SYSTEM (VIRTUALIZED LISTS)
// // ================================

// const advocateSystem = {
//   advocates: [
//     {
//       name: "Sarah Mitchell",
//       specialization: "Corporate Law",
//       location: "Mumbai",
//       experience: 15,
//       image: "femalelawyer.jpg"
//     },
//     {
//       name: "David Chen",
//       specialization: "Criminal Defense",
//       location: "Delhi",
//       experience: 12,
//       image: "malelawyer.jpg"
//     },
//     {
//       name: "Emily Rodriguez",
//       specialization: "Family Law",
//       location: "Bangalore",
//       experience: 10,
//       image: "femalelawyer.jpg"
//     }
//   ],
  
//   toggleAdvocates: [
//     {name:"Sa*** Mi***",role:"Corporate Law",location:"Mumbai",exp:15,meta:"📍 Mumbai • 15+ Years",img:"female2.jpg"},
//     {name:"Da*** Ch***",role:"Criminal Defense",location:"Delhi",exp:12,meta:"📍 Delhi • 12+ Years",img:"malelawyer.jpg"},
//     {name:"Em*** Ro***",role:"Family Law",location:"Bangalore",exp:10,meta:"📍 Bangalore • 10+ Years",img:"advoate1.jpeg"},
//     {name:"Sa*** Mi***",role:"Corporate Law",location:"Mumbai",exp:15,meta:"📍 Mumbai • 15+ Years",img:"malelawyer.jpg"},
//     {name:"Da*** Ch***",role:"Criminal Defense",location:"Delhi",exp:12,meta:"📍 Delhi • 12+ Years",img:"advoate1.jpeg"},
//     {name:"Em*** Ro***",role:"Family Law",location:"Bangalore",exp:10,meta:"📍 Bangalore • 10+ Years",img:"femalelawyer.jpg"}
//   ],
  
//   clients: [
//     {name:"Ra*** Ku***",role:"Business Owner",location:"Hyderabad",exp:15,meta:"📍 Hyderabad • Corporate Case",img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"},
//     {name:"An*** Sh***",role:"IT Professional",location:"Pune",exp:12,meta:"📍 Pune • Employment Issue",img:"https://images.unsplash.com/photo-1527980965255-d3b416303d12"},
//     {name:"Me*** Pa***",role:"Home Buyer",location:"Chennai",exp:10,meta:"📍 Chennai • Property Case",img:"https://images.unsplash.com/photo-1520813792240-56fc4a3765a7"},
//     {name:"Ra*** Ku***",role:"Business Owner",location:"Hyderabad",exp:15,meta:"📍 Hyderabad • Corporate Case",img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"},
//     {name:"An*** Sh***",role:"IT Professional",location:"Pune",exp:12,meta:"📍 Pune • Employment Issue",img:"https://images.unsplash.com/photo-1527980965255-d3b416303d12"},
//     {name:"Me*** Pa***",role:"Home Buyer",location:"Chennai",exp:10,meta:"📍 Chennai • Property Case",img:"https://images.unsplash.com/photo-1520813792240-56fc4a3765a7"}
//   ],
  
//   currentType: "advocates",
  
//   initAdvocatesDirectory() {
//     this.renderAdvocates(this.advocates);
//   },
  
//   renderAdvocates(list) {
//     const container = $("#advocates-container");
//     if (!container) return;
    
//     // Virtualized rendering
//     requestAnimationFrame(() => {
//       container.innerHTML = list.map(advocate => `
//         <div class="adv-card premium-card">
//           <div class="adv-image">
//             <img src="${advocate.image}" alt="Advocate profile" loading="lazy">
//           </div>
//           <div class="adv-card-body">
//             <h3 class="adv-name">${this.maskName(advocate.name)}</h3>
//             <p class="adv-role">${advocate.specialization}</p>
//             <p class="adv-meta">📍 ${advocate.location} <span>•</span> ${advocate.experience}+ Years Experience</p>
//             <div class="adv-actions">
//               <button class="btn-outline" onclick="advocateSystem.sendInterest('${advocate.name}')">Interest</button>
//               <button class="btn-outline" onclick="advocateSystem.sendSuperInterest('${advocate.name}')">Super Interest</button>
//               <button class="btn-outline" onclick="advocateSystem.viewProfile('${advocate.name}')">View Profile</button>
//               <button class="btn-outline" onclick="advocateSystem.openChat('${advocate.name}')">Chat</button>
//             </div>
//             <p class="adv-note">Platform facilitated connection only. No legal advice or consultation.</p>
//           </div>
//         </div>
//       `).join("");
//     });
//   },
  
//   sendInterest(name) {
//     alert(`Interest Sent to ${name}!`);
//   },
  
//   sendSuperInterest(name) {
//     alert(`Super Interest Sent to ${name}!`);
//   },
  
//   viewProfile(name) {
//     alert(`Opening Profile for ${name}`);
//   },
  
//   openChat(name) {
//     alert(`Opening Chat with ${name}`);
//   },
  
//   maskName(name) {
//     const isPremiumUser = false; // This would come from auth in real app
//     return isPremiumUser ? name : name.split(" ").map(part => part.slice(0, 2) + "***").join(" ");
//   },
  
//   applyAdvocateFilters() {
//     const location = $("#filter-location")?.value;
//     const experience = $("#filter-experience")?.value;
//     const specialization = $("#filter-specialization")?.value;
    
//     const filtered = this.advocates.filter(advocate => {
//       return (!location || advocate.location === location) &&
//         (!experience || advocate.experience >= parseInt(experience)) &&
//         (!specialization || advocate.specialization === specialization);
//     });
    
//     this.renderAdvocates(filtered);
//   },
  
//   initToggleModule() {
//     const grid = $("#grid");
//     const advBtn = $("#advBtn");
//     const clientBtn = $("#clientBtn");
    
//     if (!grid || !advBtn || !clientBtn) return;
//     if (grid.dataset.initialized === "true") return;
    
//     // Initial render
//     this.renderToggleList(this.toggleAdvocates);
    
//     // Event binding
//     advBtn.addEventListener("click", () => this.showAdvocatesToggle());
//     clientBtn.addEventListener("click", () => this.showClientsToggle());
    
//     // Filter events
//     const locationFilter = $("#locationFilter");
//     const experienceFilter = $("#experienceFilter");
//     const specializationFilter = $("#specializationFilter");
    
//     if (locationFilter) locationFilter.addEventListener("change", () => this.applyToggleFilters());
//     if (experienceFilter) experienceFilter.addEventListener("change", () => this.applyToggleFilters());
//     if (specializationFilter) specializationFilter.addEventListener("change", () => this.applyToggleFilters());
    
//     grid.dataset.initialized = "true";
    
//     this.cleanupToggleModule = () => {
//       advBtn.removeEventListener("click", this.showAdvocatesToggle);
//       clientBtn.removeEventListener("click", this.showClientsToggle);
      
//       if (locationFilter) locationFilter.removeEventListener("change", this.applyToggleFilters);
//       if (experienceFilter) experienceFilter.removeEventListener("change", this.applyToggleFilters);
//       if (specializationFilter) specializationFilter.removeEventListener("change", this.applyToggleFilters);
      
//       grid.dataset.initialized = "false";
//       delete this.cleanupToggleModule;
//     };
//   },
  
//   renderToggleList(list) {
//     const grid = $("#grid");
//     if (!grid) return;
    
//     // Use document fragment for better performance
//     const fragment = document.createDocumentFragment();
    
//     list.slice(0, 6).forEach(person => {
//       const card = document.createElement("div");
//       card.className = "blogcard";
//       card.innerHTML = `
//         <div class="blogavatar" style="background-image:url('${person.img}')"></div>
//         <div class="name">${person.name}</div>
//         <div class="role">${person.role}</div>
//         <div class="meta">${person.meta}</div>
//         <div class="btn-row">
//           <button class="btn primary" onclick="advocateSystem.sendToggleInterest('${person.name}')">Interest</button>
//           <button class="btn" onclick="advocateSystem.sendToggleSuperInterest('${person.name}')">Super Interest</button>
//         </div>
//         <div class="btn-row">
//           <button class="btn" onclick="advocateSystem.viewToggleProfile('${person.name}')">View Profile</button>
//           <button class="btn" onclick="advocateSystem.openToggleChat('${person.name}')">Chat</button>
//         </div>
//         <div class="footer-note">Platform facilitated connection only. No legal advice.</div>
//       `;
//       fragment.appendChild(card);
//     });
    
//     grid.innerHTML = '';
//     grid.appendChild(fragment);
//   },
  
//   sendToggleInterest(name) {
//     alert(`Interest sent to ${name}`);
//   },
  
//   sendToggleSuperInterest(name) {
//     alert(`Super interest sent to ${name}`);
//   },
  
//   viewToggleProfile(name) {
//     alert(`Viewing profile of ${name}`);
//   },
  
//   openToggleChat(name) {
//     alert(`Opening chat with ${name}`);
//   },
  
//   applyToggleFilters() {
//     const loc = $("#locationFilter")?.value;
//     const exp = $("#experienceFilter")?.value;
//     const spec = $("#specializationFilter")?.value;
    
//     const source = this.currentType === "advocates" ? this.toggleAdvocates : this.clients;
    
//     const filtered = source.filter(person => {
//       return (!loc || person.location === loc) &&
//         (!exp || person.exp >= exp) &&
//         (!spec || person.role === spec);
//     });
    
//     this.renderToggleList(filtered);
//   },
  
//   showAdvocatesToggle() {
//     this.currentType = "advocates";
//     $("#advBtn")?.classList.add("active");
//     $("#clientBtn")?.classList.remove("active");
//     this.renderToggleList(this.toggleAdvocates);
//     this.resetToggleFilters();
//   },
  
//   showClientsToggle() {
//     this.currentType = "clients";
//     $("#clientBtn")?.classList.add("active");
//     $("#advBtn")?.classList.remove("active");
//     this.renderToggleList(this.clients);
//     this.resetToggleFilters();
//   },
  
//   resetToggleFilters() {
//     const filters = ["locationFilter", "experienceFilter", "specializationFilter"];
//     filters.forEach(id => {
//       const el = document.getElementById(id);
//       if (el) el.value = "";
//     });
//   },
  
//   cleanup() {
//     if (this.cleanupToggleModule) {
//       this.cleanupToggleModule();
//     }
//   }
// };

// // ================================
// // CONTACT SYSTEM (LIGHTWEIGHT)
// // ================================

// const contactSystem = {
//   init() {
//     this.initContactForm();
//     this.initContactPopup();
//   },
  
//   initContactForm() {
//     const form = $("#contactForm");
//     if (!form) return;
    
//     form.addEventListener("submit", (e) => {
//       e.preventDefault();
//       alert("Message sent successfully ✅");
//       form.reset();
//     });
//   },
  
//   initContactPopup() {
//     const template = $("#contactPopupTemplate");
//     if (!template) return;
    
//     $$(".contact-link").forEach(link => {
//       link.addEventListener("click", (e) => {
//         e.preventDefault();
//         this.openContactPopup();
//       });
//     });
    
//     // Global escape handler
//     document.addEventListener("keydown", (e) => {
//       if (e.key === "Escape" && $("#tatitoContactPopup")) {
//         this.closeContactPopup();
//       }
//     });
//   },
  
//   openContactPopup() {
//     let popup = $("#tatitoContactPopup");
//     if (popup) {
//       popup.style.display = "flex";
//       return;
//     }
    
//     const template = $("#contactPopupTemplate");
//     if (!template) return;
    
//     const clone = document.importNode(template.content, true);
//     document.body.appendChild(clone);
    
//     // Set up close handlers
//     const closeBtns = $$(".tatito-close-btn, .tatito-popup-close");
//     closeBtns.forEach(btn => {
//       btn.addEventListener("click", () => this.closeContactPopup());
//     });
    
//     // Close on overlay click
//     const overlay = $(".tatito-popup-overlay");
//     if (overlay) {
//       overlay.addEventListener("click", (e) => {
//         if (e.target === overlay) this.closeContactPopup();
//       });
//     }
    
//     const copyBtn = $(".tatito-copy-btn");
//     if (copyBtn) {
//       copyBtn.addEventListener("click", this.copyContactDetails.bind(this));
//     }
    
//     // Focus container for accessibility
//     setTimeout(() => {
//       const container = $(".tatito-popup-container");
//       if (container) container.focus();
//     }, 100);
//   },
  
//   closeContactPopup() {
//     const popup = $("#tatitoContactPopup");
//     if (popup) {
//       popup.style.display = "none";
//     }
//   },
  
//   copyContactDetails() {
//     const contactInfo = `E-Advocate Support Contact Details:
// 📞 Phone: +91 70937 04706
// 📧 Email: tatitoprojects@gmail.com
// 📧 Email: support@tatitoprojects.com
// ⏰ Hours: Mon-Fri 10 AM - 6 PM IST, Sat 10 AM - 2 PM IST
// For urgent legal matters, contact local authorities.`;
    
//     navigator.clipboard.writeText(contactInfo)
//       .then(() => {
//         const btn = $(".tatito-copy-btn");
//         if (btn) {
//           const originalText = btn.textContent;
//           btn.textContent = "✓ Copied!";
//           btn.style.backgroundColor = "#4CAF50";
          
//           setTimeout(() => {
//             btn.textContent = originalText;
//             btn.style.backgroundColor = "";
//           }, 2000);
//         }
//       })
//       .catch(() => {
//         alert("Failed to copy to clipboard. Please copy manually.");
//       });
//   },
  
//   cleanup() {
//     // Remove event listeners
//     $$(".contact-link").forEach(link => {
//       link.removeEventListener("click", this.openContactPopup);
//     });
//   }
// };

// // ================================
// // FAQ SYSTEM (OPTIMIZED)
// // ================================

// const faqSystem = {
//   init() {
//     $$(".faq-question").forEach(question => {
//       question.addEventListener("click", (e) => {
//         const item = question.closest(".faq-item");
//         $$(".faq-item").forEach(faq => {
//           if (faq !== item) faq.classList.remove("active");
//         });
//         item.classList.toggle("active");
//       });
//     });
//   },
  
//   cleanup() {
//     // No specific cleanup needed
//   }
// };

// // ================================
// // DASHBOARD SYSTEMS (LAZY LOADED)
// // ================================

// const dashboardSystem = {
//   init(route) {
//     if (route === "dashboard") {
//       this.initDashboard();
//     } else if (route === "advocatedashboard") {
//       this.initAdvocateDashboard();
//     }
//   },
  
//   initDashboard() {
//     const form = $("#dashboardForm");
//     if (!form) return;
    
//     form.addEventListener("submit", (e) => {
//       e.preventDefault();
//       alert("Dashboard data saved (UI only)");
//     });
//   },
  
//   initAdvocateDashboard() {
//     const canvas = $("#earnChart");
//     if (!canvas) return;
    
//     // Lazy load Chart.js only when needed
//     if (typeof Chart === "undefined") {
//       console.warn("Chart.js not loaded - skipping chart initialization");
//       return;
//     }
    
//     new Chart(canvas, {
//       type: "line",
//       data: {
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//         datasets: [{
//           data: [45000, 52000, 48000, 61000, 58000, 70000],
//           borderColor: "#38bdf8",
//           backgroundColor: "rgba(56,189,248,0.2)",
//           borderWidth: 3,
//           tension: 0.4,
//           fill: true
//         }]
//       },
//       options: {
//         plugins: { legend: { display: false } },
//         scales: { 
//           y: { beginAtZero: true },
//           x: { grid: { display: false } }
//         },
//         animation: {
//           duration: 1000,
//           easing: 'easeOutQuart'
//         }
//       }
//     });
//   },
  
//   cleanup() {
//     // No specific cleanup needed
//   }
// };

// // ================================
// // SPA ROUTER (PERFORMANT)
// // ================================

// const router = {
//   routes: {},
//   currentPage: null,
//   currentPageCleanup: null,
  
//   init() {
//     this.cacheRoutes();
//     this.handleInitialRoute();
//     window.addEventListener("hashchange", this.handleRouteChange.bind(this));
//   },
  
//   cacheRoutes() {
//     // Cache all route templates
//     $$(".route-template").forEach(template => {
//       this.routes[template.id] = template.innerHTML;
//     });
//   },
  
//   handleInitialRoute() {
//     const initialRoute = location.hash.replace("#", "") || "home";
//     this.navigate(initialRoute);
//   },
  
//   handleRouteChange() {
//     const route = location.hash.replace("#", "") || "home";
//     this.navigate(route);
//   },
  
//   navigate(route) {
//     // Check authentication for protected routes
//     const protectedRoutes = ["dashboard", "clientdashboard", "advocatedashboard"];
//     if (protectedRoutes.includes(route) && !this.isLoggedIn()) {
//       auth.openAuth();
//       return;
//     }
    
//     // Cleanup previous page resources
//     if (this.currentPageCleanup) {
//       this.currentPageCleanup();
//       this.currentPageCleanup = null;
//     }
    
//     // Update URL hash if needed
//     if (location.hash.replace("#", "") !== route) {
//       history.pushState(null, null, `#${route}`);
//     }
    
//     this.renderPage(route);
//   },
  
//   isLoggedIn() {
//     return localStorage.getItem("isLoggedIn") === "true";
//   },
  
//   renderPage(route) {
//     const app = $("#app");
//     const routeTemplate = this.routes[route] || this.routes["404"];
    
//     if (!app || !routeTemplate) {
//       console.error("App container or route template not found");
//       return;
//     }
    
//     // Show loading state
//     app.innerHTML = '<div class="page-loader">Loading...</div>';
    
//     // Use requestAnimationFrame for smooth transitions
//     requestAnimationFrame(() => {
//       // Render template
//       app.innerHTML = routeTemplate;
      
//       // Update layout based on route
//       const isDashboard = route.includes("dashboard");
//       if (isDashboard) {
//         hidelay();
//       } else {
//         showlay();
//       }
      
//       // Initialize page-specific modules
//       this.initPageModules(route);
      
//       // Update scroll position
//       window.scrollTo({ top: 0, behavior: "smooth" });
      
//       // Set current page
//       this.currentPage = route;
//     });
//   },
  
//   initPageModules(route) {
//     // Common modules for all pages
//     animations.init();
    
//     // Page-specific modules
//     switch(route) {
//       case "home":
//         this.initHomePage();
//         break;
//       case "blogs":
//         this.initBlogPage();
//         break;
//       case "mainblogs":
//         this.initMainBlogsPage();
//         break;
//       case "dashboard":
//       case "clientdashboard":
//       case "advocatedashboard":
//         dashboardSystem.init(route);
//         break;
//     }
    
//     // Always update auth state
//     navbar.updateAuthState();
    
//     // Set cleanup function for this page
//     this.currentPageCleanup = this.getPageCleanup(route);
//   },
  
//   initHomePage() {
//     // Initialize sliders
//     new Slider(".main-slider");
//     new Slider(".cases-slider");
//     new Slider(".testimonials-slider");
    
//     // Load blogs
//     blogSystem.initHomepageBlogs();
    
//     // Render advocates
//     advocateSystem.renderAdvocates(advocateSystem.advocates);
    
//     // Initialize toggle module
//     advocateSystem.initToggleModule();
    
//     // Initialize contact form
//     contactSystem.init();
    
//     // Initialize FAQs
//     faqSystem.init();
//   },
  
//   initBlogPage() {
//     // Blog grid initialization would go here
//   },
  
//   initMainBlogsPage() {
//     blogSystem.initMainBlogsPage();
//   },
  
//   getPageCleanup(route) {
//     const cleanupFunctions = {
//       home: () => {
//         // Cleanup sliders
//         cleanupIntervals();
//         // Cleanup toggle module
//         advocateSystem.cleanup();
//       },
//       blogs: () => {
//         // Blog cleanup
//       },
//       mainblogs: () => {
//         // Main blogs cleanup
//       }
//     };
    
//     return cleanupFunctions[route] || (() => {});
//   },
  
//   cleanup() {
//     window.removeEventListener("hashchange", this.handleRouteChange.bind(this));
//   }
// };

// // ================================
// // APPLICATION INITIALIZATION
// // ================================

// document.addEventListener("DOMContentLoaded", () => {
//   // Initialize core systems
//   navbar.init();
//   chatbot.init();
  
//   // Initialize router
//   router.init();
  
//   // Set initial layout state
//   updateLayoutVisibility();
  
//   // Handle beforeunload for cleanup
//   window.addEventListener("beforeunload", () => {
//     cleanupIntervals();
//     router.cleanup();
//   });
  
//   // Handle visibility change for resource management
//   document.addEventListener("visibilitychange", () => {
//     if (document.hidden) {
//       // Page is hidden, pause non-essential processes
//       cleanupIntervals();
//     } else {
//       // Page is visible again, restart necessary processes
//       if ($(".slider-box")) {
//         // Restart sliders if needed
//       }
//     }
//   });
// });

// // ================================
// // GLOBAL API (MINIMAL EXPOSURE)
// // ================================

// // Expose only necessary functions to global scope
// window.hidelay = hidelay;
// window.showlay = showlay;
// window.toggleChat = chatbot.toggleChat.bind(chatbot);
// window.sendChatMessage = chatbot.sendChatMessage.bind(chatbot);
// window.switchTab = auth.switchTab.bind(auth);
// window.applyAdvocateFilters = advocateSystem.applyAdvocateFilters.bind(advocateSystem);
// window.nextBlog = blogSystem.nextBlog.bind(blogSystem);
// window.prevBlog = blogSystem.prevBlog.bind(blogSystem);
// window.openAuth = auth.openAuth.bind(auth);
// window.closeAuth = auth.closeAuth.bind(auth);
// window.openClientForm = auth.openClientForm.bind(auth);
// window.closeClientForm = auth.closeClientForm.bind(auth);
// window.openAdvocateForm = auth.openAdvocateForm.bind(auth);
// window.closeAdvocateForm = auth.closeAdvocateForm.bind(auth);
// window.openbrowseprofiles = auth.openbrowseprofiles.bind(auth);
// window.closebrowseprofiles = auth.closebrowseprofiles.bind(auth);
// window.copyContactDetails = contactSystem.copyContactDetails.bind(contactSystem);
// window.backToBlogs = () => router.navigate("home");














// /* =====================================================
//    1. CORE UTILITIES
// ===================================================== */
// const $ = (s, r = document) => r.querySelector(s);
// const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// function throttle(fn, delay = 200) {
//   let last = 0;
//   return (...args) => {
//     const now = Date.now();
//     if (now - last >= delay) {
//       last = now;
//       fn(...args);
//     }
//   };
// }

// function debounce(fn, delay = 300) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), delay);
//   };
// }

// function runIdle(fn) {
//   if ("requestIdleCallback" in window) {
//     requestIdleCallback(fn);
//   } else {
//     setTimeout(fn, 50);
//   }
// }

// /* =====================================================
//    2. GLOBAL APP STATE
// ===================================================== */
// const App = {
//   currentPage: null,
//   sidebarOpen: false,
//   intervals: new Set(),
//   observers: new Set(),
//   flags: Object.create(null)
// };

// /* =====================================================
//    3. SIDEBAR MODULE
// ===================================================== */
// const Sidebar = {
//   toggle() {
//     const sidebar = $("#sidebar");
//     const main = $("#main-content");
//     if (!sidebar || !main) return;

//     App.sidebarOpen = !App.sidebarOpen;
//     sidebar.classList.toggle("closed", !App.sidebarOpen);
//     main.classList.toggle("expanded", !App.sidebarOpen);
//   },
//   close() {
//     if (!App.sidebarOpen) return;
//     this.toggle();
//   }
// };

// /* =====================================================
//    4. ROUTER (SPA SAFE)
// ===================================================== */
// function showPage(pageId) {
//   const app = document.getElementById("app");
//   const tpl = document.getElementById(pageId);

//   if (!app || !tpl) {
//     console.warn("Page not found:", pageId);
//     return;
//   }

//   app.innerHTML = "";
//   app.appendChild(tpl.content.cloneNode(true));

//   window.scrollTo({ top: 0, behavior: "smooth" });
// }


// function cleanupPage() {
//   App.intervals.forEach(clearInterval);
//   App.intervals.clear();

//   App.observers.forEach(o => o.disconnect());
//   App.observers.clear();
// }

// /* =====================================================
//    5. FEATURED PROFILES MODULE
// ===================================================== */
// const FeaturedProfiles = {
//   data: [
//     { id:1, name:"Samantha", age:27, loc:"New York, NY", exp:"5+ Years", prac:"Civil & Criminal Law", init:"S" },
//     { id:2, name:"Daniel", age:32, loc:"Austin, TX", exp:"7+ Years", prac:"Corporate Law", init:"D" },
//     { id:3, name:"Priya", age:29, loc:"Mumbai, IN", exp:"6 Years", prac:"Family Law", init:"P" },
//     { id:4, name:"Michael", age:35, loc:"London, UK", exp:"10 Years", prac:"International Law", init:"M" },
//     { id:5, name:"Aisha", age:28, loc:"Dubai, UAE", exp:"5 Years", prac:"Real Estate Law", init:"A" },
//     { id:6, name:"Chris", age:31, loc:"Toronto, CA", exp:"6 Years", prac:"Immigration Law", init:"C" }
//   ],

//   render() {
//     const c = $("#fcProfilesContainer");
//     if (!c) return;

//     c.innerHTML = this.data.map(p => `
//       <div class="fc-card reveal" onclick="DetailedProfile.open(${p.id})">
//         <div class="fc-card-image">${p.init}</div>
//         <div class="fc-card-body">
//           <div class="fc-name">${p.name}, ${p.age}</div>
//           <div class="fc-location">
//             <i class="fa-solid fa-location-dot"></i> ${p.loc}
//           </div>
//           <div class="fc-info">Experience: ${p.exp}</div>
//           <div class="fc-info">Practice: ${p.prac}</div>
//           <div class="fc-id-badge">
//             <i class="fa-solid fa-shield"></i> ${p.id}
//           </div>
//         </div>
//       </div>
//     `).join("");
//   }
// };

// /* =====================================================
//    6. DETAILED PROFILE MODULE
// ===================================================== */
// const DetailedProfile = {
//   open(id) {
//     showPage("detailed-profile-view");

//     runIdle(() => {
//       const el = $("#profile-details");
//       if (!el) return;
//       el.innerHTML = `
//         <h2>Profile ID: ${id}</h2>
//         <p>Detailed profile content goes here.</p>
//         <button onclick="showPage('featured-profiles')">← Back</button>
//       `;
//     });
//   }
// };

// /* =====================================================
//    7. BLOG / INFINITE SCROLL MODULE
// ===================================================== */
// const Blog = {
//   init() {
//     if (App.flags.blogInit) return;
//     App.flags.blogInit = true;

//     const grid = $("#blogGrid");
//     if (!grid) return;

//     const sentinel = document.createElement("div");
//     sentinel.id = "blog-sentinel";
//     grid.appendChild(sentinel);

//     const obs = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting) {
//         this.load();
//       }
//     }, { rootMargin: "800px" });

//     obs.observe(sentinel);
//     App.observers.add(obs);
//   },

//   load() {
//     runIdle(() => {
//       const grid = $("#blogGrid");
//       if (!grid) return;

//       for (let i = 0; i < 4; i++) {
//         const card = document.createElement("div");
//         card.className = "blog-card reveal";
//         card.textContent = "Blog content loaded dynamically";
//         grid.insertBefore(card, $("#blog-sentinel"));
//       }

//       Reveal.init();
//     });
//   }
// };

// /* =====================================================
//    8. FILTER MODULE (SAFE & EXTENDABLE)
// ===================================================== */
// const Filters = {
//   init() {
//     const input = $("#filter-name");
//     if (!input) return;

//     input.addEventListener("input", debounce(e => {
//       console.log("Filter by:", e.target.value);
//     }, 300));
//   }
// };

// /* =====================================================
//    9. SLIDER MODULE (INTERVAL SAFE)
// ===================================================== */
// const Slider = {
//   init() {
//     const slides = $$(".slide");
//     if (!slides.length) return;

//     let i = 0;
//     const interval = setInterval(() => {
//       slides.forEach(s => s.classList.remove("active"));
//       slides[i % slides.length].classList.add("active");
//       i++;
//     }, 5000);

//     App.intervals.add(interval);
//   }
// };

// /* =====================================================
//    10. REVEAL / ANIMATION MODULE
// ===================================================== */
// const Reveal = {
//   init(selector = ".reveal") {
//     const els = $$(selector).filter(el => !el.dataset.revealed);
//     if (!els.length) return;

//     const obs = new IntersectionObserver(entries => {
//       entries.forEach(e => {
//         if (e.isIntersecting) {
//           e.target.classList.add("revealed");
//           e.target.dataset.revealed = "1";
//           obs.unobserve(e.target);
//         }
//       });
//     }, { threshold: 0.15 });

//     els.forEach(el => obs.observe(el));
//     App.observers.add(obs);
//   }
// };

// /* =====================================================
//    11. PAGE INITIALIZER
// ===================================================== */
// const PageInit = {
//   init(pageId) {
//     switch (pageId) {
//       case "featured-profiles":
//         FeaturedProfiles.render();
//         Reveal.init();
//         break;

//       case "blogs":
//         Blog.init();
//         break;

//       default:
//         Filters.init();
//         Slider.init();
//     }
//   }
// };

// /* =====================================================
//    12. TOAST (NON-BLOCKING)
// ===================================================== */
// function showToast(msg) {
//   console.log(msg);
// }

// /* =====================================================
//    13. BOOTSTRAP (ONLY ONCE)
// ===================================================== */
// document.addEventListener("DOMContentLoaded", () => {
//   showPage("featured-profiles");
// });





/* ===============================
   CASE SLIDER SCRIPT
================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // SLIDE DATA
  // ===============================
  const slidesData = [
    {
      img: "https://github.com/BOINISRIHARI/100pages/blob/main/2.png?raw=true",
      title: "E-filing Services Sign In",
      desc: "Find your case status using the petitioner or respondent name.",
      link: "https://services.ecourts.gov.in/ecourtindia_v6/"
    },
    {
      img: "https://github.com/BOINISRIHARI/100pages/blob/main/3.png?raw=true",
      title: "Advocate Registration Flow",
      desc: "Access detailed case status using your case or filing number.",
      link: "https://services.ecourts.gov.in/ecourtindia_v6/"
    }
    // 👉 Add more slides here
  ];

  // ===============================
  // ELEMENTS
  // ===============================
  const slider = document.getElementById("slider");
  const counter = document.getElementById("slideCounter");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (!slider || !counter || !prevBtn || !nextBtn) return;

  // ===============================
  // CREATE SLIDES
  // ===============================
  slidesData.forEach((slide, index) => {
    const div = document.createElement("div");
    div.className = "case-slide" + (index === 0 ? " active" : "");

    div.innerHTML = `
      <img src="${slide.img}" alt="${slide.title}">
      <div class="case-slide-content">
        <h2>${slide.title}</h2>
        <p>${slide.desc}</p>
        <a href="${slide.link}" class="case-btn">Explore →</a>
      </div>
    `;

    slider.insertBefore(div, slider.querySelector(".slider-nav"));
  });

  const slides = document.querySelectorAll(".case-slide");
  let currentIndex = 0;

  // ===============================
  // SHOW SLIDE
  // ===============================
  function showSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    counter.textContent = `${index + 1} of ${slides.length}`;
  }

  // Initial
  showSlide(currentIndex);

  // ===============================
  // EVENTS
  // ===============================
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  // ===============================
  // AUTO SLIDE
  // ===============================
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 5000);

});

