

window.onerror = function(msg, url, line) {
    console.error("Global Error:", msg);
    const el = document.getElementById('global-error');
    const txt = document.getElementById('global-error-msg');
    if(el && txt) {
        el.classList.remove('hidden');
        txt.textContent = `${msg}`;
    }
};

  window.showToast = function(message, type = 'success') {
    const wrapper = document.createElement('div');
    wrapper.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none";

    // Icon based on type
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        info: 'info',
        warning: 'alert-triangle'
    };
    
    const colors = {
        success: 'text-emerald-500',
        error: 'text-red-500',
        info: 'text-brand-500',
        warning: 'text-amber-500'
    };

    const toast = document.createElement('div');
    toast.className = "bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto";
    toast.innerHTML = `<i data-lucide="${icons[type]}" class="w-5 h-5 ${colors[type]}"></i> ${message}`;  

    // 3. Assemble
    wrapper.appendChild(toast);
    document.body.appendChild(wrapper);

    // Initialize icons
    if(window.lucide) lucide.createIcons({ root: toast });

    // 4. Remove after 4 seconds (Animate out inner toast, then remove wrapper)
    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4');
        setTimeout(() => wrapper.remove(), 300);
    }, 4000);
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
 import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";       

        // --- PASTE YOUR FIREBASE CONFIG HERE ---
        const YOUR_FIREBASE_CONFIG = {
            apiKey: "AIzaSyDcQsD4kPTl4KpU4wphfkNjizPsUMQO64M",
            authDomain: "mystudyplan-74b62.firebaseapp.com",
            projectId: "mystudyplan-74b62",
            storageBucket: "mystudyplan-74b62.firebasestorage.app",
            messagingSenderId: "196958661158",
            appId: "1:196958661158:web:e553fa59e4f21f205e14e7"
        };
        // ----------------------------------------

        let app, auth, db;
        let isFirebaseActive = false;
        let currentUser = null;
        let unsubscribeDoc = null;
        
        // Use global app_id variable if available
        const globalAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        // Premium Sound with Error Handling
        const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        successSound.volume = 0.5;

        // Determine Environment
        const isCanvasEnv = typeof __firebase_config !== 'undefined';
        const hasUserConfig = YOUR_FIREBASE_CONFIG.apiKey !== "";

        if (isCanvasEnv) {
            const canvasConfig = JSON.parse(__firebase_config);
            app = initializeApp(canvasConfig);
            auth = getAuth(app);
            db = getFirestore(app);
            isFirebaseActive = true;
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                signInWithCustomToken(auth, __initial_auth_token);
            } else {
                signInAnonymously(auth);
            }
        } else if (hasUserConfig) {
            app = initializeApp(YOUR_FIREBASE_CONFIG);
            auth = getAuth(app);
            db = getFirestore(app);
            isFirebaseActive = true;
        }
        
        // Helper to safely get document reference based on environment rules
        function getSafeDocRef(uid) {
            const collectionName = "studyData";
            const docName = "main";
            
            if (isCanvasEnv) {
                // Rule: artifacts/{appId}/users/{userId}/{collectionName}
                return doc(db, 'artifacts', globalAppId, 'users', uid, collectionName, docName);
            } else {
                // Default fallback for external hosting
                return doc(db, 'users', uid, collectionName, docName);
            }
        }

// ==========================================
// ✨ ANIMATED NUMBER COUNTER
// ==========================================
function animateNumber(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    
    // If element doesn't exist, just exit
    if (!element) {
        console.log('Element not found:', elementId);
        return;
    }
    
    // Get current value (what's showing now)
    const currentText = element.textContent || '0';
    const startValue = parseInt(currentText.replace(/[^0-9]/g, '')) || 0;
    
    // Calculate how much to change
    const difference = targetValue - startValue;
    const startTime = Date.now();
    
    // Function that runs every frame
    function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed < duration) {
            // Still animating - calculate current value
            const progress = elapsed / duration;
            const currentValue = startValue + (difference * progress);
            element.textContent = Math.round(currentValue);
            
            // Keep animating
            requestAnimationFrame(update);
        } else {
            // Animation done - set final value
            element.textContent = targetValue;
        }
    }
    
    // Start the animation!
    update();
}

 // ==========================================
 // ==========================================
    // 🔐 VIP AUTHENTICATION (Final Fixed Version)
    // ==========================================

    // 1. VIP GUEST LIST
    const allowedEmails = [
        "neo719076@gmail.com"  // <--- REPLACE WITH YOUR EMAIL
            ];

    window.handleAuth = async (mode) => {
        const emailField = document.getElementById('auth-email');
        const passField = document.getElementById('auth-pass');
        const loader = document.getElementById('auth-loader');
        const btnText = document.getElementById('auth-btn-text');

        const email = emailField.value.toLowerCase().trim();
        const pass = passField.value;

        // START SPINNER: Show loader, hide text
        if(loader) loader.classList.remove('hidden');
        if(btnText) btnText.classList.add('opacity-0');

        try {
            // 🛑 BOUNCER CHECK (Only runs if mode is 'signup')
            if (mode === 'signup' || mode === 'register') {
                const isAllowed = allowedEmails.some(allowed => allowed.toLowerCase() === email);
                
                if (!isAllowed) {
                    throw new Error("VIP_ONLY"); 
                }
                
                // Create User
                await createUserWithEmailAndPassword(auth, email, pass);
                
                showPopup('success', 'Welcome Aboard! 🚀', 'Your account has been created successfully!');
            } 
            else {
                // Login User
                await signInWithEmailAndPassword(auth, email, pass);
            }

        } catch (error) {
            console.error("Auth Error:", error);

            // 🚨 HANDLE ERRORS WITH POPUPS
            if (error.message === "VIP_ONLY") {
                showPopup('error', 'Invite Only', 'Sorry! This app is currently exclusively for VIP members.\n\nPlease contact the developer to get access.');
            } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                showPopup('error', 'Account Not Found', 'It looks like you are a new user or the password is wrong.\n\nIf you are new, please create an account first!');
            } else if (error.code === 'auth/email-already-in-use') {
                showPopup('info', 'Already Registered', 'This email is already registered.\nPlease Log In instead.');
            } else if (error.code === 'auth/weak-password') {
                showPopup('error', 'Weak Password', 'Password must be at least 6 characters.');
            } else if (error.code === 'auth/too-many-requests') {
                showPopup('error', 'Too Many Attempts', 'Access blocked due to many failed attempts. Try again later.');
            } else {
                showPopup('error', 'Authentication Failed', error.message);
            }
        } finally {
            // ✅ STOP SPINNER (This runs no matter what!)
            if(loader) loader.classList.add('hidden');
            if(btnText) btnText.classList.remove('opacity-0');
        }
    };  


        // FIXED: Added unsubscribeDoc() call to prevent memory leak
        window.handleLogout = async () => {
            if(isFirebaseActive) {
                if (unsubscribeDoc) {
                    unsubscribeDoc();
                    unsubscribeDoc = null;
                }
                await signOut(auth);
                state.tasks = {};
                state.dailyTestsAttempted = {};
                state.mistakes = []; // Reset mistakes on logout
                state.expandedFocusGroups = {};
                state.expandedTests = {};
                renderAll();
                document.getElementById('auth-modal').classList.remove('hidden');
            } else {
                if(confirm("Exit Demo Mode? This will revert to the login screen.")) {
                    localStorage.removeItem('studyflow_demo_mode');
                    location.reload();
                }
            }
        };

        window.startDemoMode = () => {
            localStorage.setItem('studyflow_demo_mode', 'true');
            document.getElementById('auth-modal').classList.add('hidden');
            initLocalMode();
        };

// --- DARK MODE LOGIC ---
window.toggleTheme = function() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        // Removed 'theme-text' update since the element doesn't exist
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        // Removed 'theme-text' update
    }
};

// Initialize Theme (Default to Dark)
if (localStorage.theme === 'light') {
    document.documentElement.classList.remove('dark');
} else {
    document.documentElement.classList.add('dark');
}


        // --- DATA ---
// ==========================================
// 📅 NEW MASTER TIMELINE (Single Track)
// ==========================================

// ==========================================
// 📅 MASTER TIMELINE (Verified & Detailed)
// ==========================================


// ==========================================
// 📅 MASTER TIMELINE (Granular - No Test Left Behind)
// ==========================================

const masterTimeline = [
   {
       id: "phase-1",
       name: "Phase 1: Foundation",
       startDate: new Date('2026-02-10T00:00:00'),
       endDate: new Date('2026-03-08T00:00:00'),
       syllabus: [
           // =======================================================
           // 🚨 PRIORITY 1: AIATS-07 SYLLABUS (Due Feb 22)
           // =======================================================
           // PHYSICS: Ray Optics (Expanded)
           { 
               category: "AIATS-7", subject: "Physics", topic: "Ray Optics", 
               dailyTests: [ 
                   {name:"DT-23 (Phy)", subs:["Reflection of Light", "Spherical Mirrors", "Mirror Formula"]},
                   {name:"DT-24 (Phy)", subs:["Refraction at Plane Surface", "Total Internal Reflection (TIR)", "Prism & Dispersion"]},
                   {name:"DT-25 (Phy)", subs:["Refraction at Spherical Surfaces", "Lenses", "Lens Maker's Formula", "Power of Lens"]},
                   {name:"DT-26 (Phy)", subs:["Optical Instruments (Microscope, Telescope)", "Defects of Vision"]}
               ] 
           },
           // PHYSICS: Wave Optics
           { 
               category: "AIATS-7", subject: "Physics", topic: "Wave Optics", 
               dailyTests: [ 
                   {name:"DT-27 (Phy)", subs:["Huygens Principle", "Interference of Light", "Young's Double Slit Experiment"]},
                   {name:"DT-28 (Phy)", subs:["Diffraction of Light", "Single Slit Experiment", "Polarization", "Brewster's Law"]}
               ] 
           },
           // PHYSICS: Modern Physics
           { 
               category: "AIATS-7", subject: "Physics", topic: "Dual Nature & Atoms", 
               dailyTests: [ 
                   {name:"DT-29 (Phy)", subs:["Photoelectric Effect", "Matter Waves (De-Broglie Hypothesis)", "Davisson Germer"]},
                   {name:"DT-30 (Phy)", subs:["Alpha Particle Scattering", "Rutherford Model", "Bohr Model of Hydrogen Atom"]}
               ] 
           },
           { 
               category: "AIATS-7", subject: "Physics", topic: "Nuclei", 
               dailyTests: [ 
                   {name:"DT-31 (Phy)", subs:["Composition of Nucleus", "Mass-Energy Relation", "Radioactivity", "Nuclear Fission/Fusion"]}
               ] 
           },
           { 
               category: "AIATS-7", subject: "Physics", topic: "Semiconductors", 
               dailyTests: [ 
                   {name:"DT-32 (Phy)", subs:["Semiconductors", "p-n Junction Diode", "Rectifiers"]},
                   {name:"DT-33 (Phy)", subs:["Zener Diode", "Logic Gates (OR, AND, NOT, NAND, NOR)"]}
               ] 
           },
           // CHEMISTRY: Bio/Poly/Everyday
           { 
               category: "AIATS-7", subject: "Chemistry", topic: "Biomolecules", 
               dailyTests: [ {name:"DT-27 (Chem)", subs:["Carbohydrates", "Proteins", "Vitamins", "Nucleic Acids"]} ] 
           },
           { 
               category: "AIATS-7", subject: "Chemistry", topic: "Polymers", 
               dailyTests: [ {name:"DT-28 (Chem)", subs:["Classification", "Types of Polymerization", "Rubber", "Biodegradable Polymers"]} ] 
           },
           { 
               category: "AIATS-7", subject: "Chemistry", topic: "Chemistry in Everyday Life", 
               dailyTests: [ {name:"DT-29 (Chem)", subs:["Drugs (Antacids, Antihistamines, etc.)", "Chemicals in Food", "Cleansing Agents"]} ] 
           },

           // =======================================================
           // 🧪 PRIORITY 2: ORGANIC CHEMISTRY (Whole)
           // =======================================================
           // Class 11 Hydrocarbons
           { 
               category: "Organic", subject: "Chemistry", topic: "Hydrocarbons", 
               dailyTests: [ 
                   {name:"DT-28 (Chem-XI)", subs:["Alkanes: Preparation, Properties & Conformations"]},
                   {name:"DT-29 (Chem-XI)", subs:["Alkenes: Preparation & Chemical Properties (Markownikov)"]},
                   {name:"DT-30 (Chem-XI)", subs:["Alkynes", "Aromatic Hydrocarbons (Benzene)", "Toxicity & Carcinogenicity"]}
               ] 
           },
           // Class 12 Organic
           { 
               category: "Organic", subject: "Chemistry", topic: "Haloalkanes & Haloarenes", 
               dailyTests: [ 
                   {name:"DT-16 (Chem-XII)", subs:["Classification", "Nomenclature", "Nature of C-X Bond", "Preparation"]},
                   {name:"DT-17 (Chem-XII)", subs:["Physical Properties", "Chemical Reactions (SN1/SN2)", "Polyhalogen Compounds"]}
               ] 
           },
           { 
               category: "Organic", subject: "Chemistry", topic: "Alcohols, Phenols & Ethers", 
               dailyTests: [ 
                   {name:"DT-18 (Chem-XII)", subs:["Alcohols: Preparation & Properties"]},
                   {name:"DT-19 (Chem-XII)", subs:["Phenols: Preparation & Properties"]},
                   {name:"DT-20 (Chem-XII)", subs:["Ethers: Preparation & Properties", "Commercially Important Alcohols"]}
               ] 
           },
           { 
               category: "Organic", subject: "Chemistry", topic: "Aldehydes, Ketones & Acids", 
               dailyTests: [ 
                   {name:"DT-21 (Chem-XII)", subs:["Aldehydes & Ketones: Preparation"]},
                   {name:"DT-22 (Chem-XII)", subs:["Aldehydes & Ketones: Properties (Nucleophilic Addition)"]},
                   {name:"DT-23 (Chem-XII)", subs:["Carboxylic Acids: Preparation & Properties"]}
               ] 
           },
           { 
               category: "Organic", subject: "Chemistry", topic: "Amines", 
               dailyTests: [ 
                   {name:"DT-24 (Chem-XII)", subs:["Amines: Preparation & Structure"]},
                   {name:"DT-25 (Chem-XII)", subs:["Amines: Properties", "Diazonium Salts"]}
               ] 
           },

           // =======================================================
           // 🌿 PRIORITY 3: CLASS 11 BIOLOGY (Whole)
           // =======================================================
           { 
               category: "Bio-11", subject: "Botany", topic: "Diversity in Living World", 
               dailyTests: [ 
                   {name:"DT-01 (Bot)", subs:["The Living World", "Biological Classification"]},
                   {name:"DT-02 (Bot)", subs:["Plant Kingdom: Algae, Bryophytes, Pteridophytes"]},
                   {name:"DT-03 (Bot)", subs:["Plant Kingdom: Gymnosperms, Angiosperms"]} 
               ] 
           },
           { 
               category: "Bio-11", subject: "Botany", topic: "Structural Org. in Plants", 
               dailyTests: [ 
                   {name:"DT-04 (Bot)", subs:["Morphology: Root, Stem, Leaf"]},
                   {name:"DT-05 (Bot)", subs:["Morphology: Flower, Fruit, Seed", "Families"]},
                   {name:"DT-06 (Bot)", subs:["Anatomy of Flowering Plants"]}
               ] 
           },
           { 
               category: "Bio-11", subject: "Botany", topic: "Cell Unit of Life", 
               dailyTests: [ 
                   {name:"DT-07 (Bot)", subs:["Cell Theory", "Prokaryotic Cells"]},
                   {name:"DT-08 (Bot)", subs:["Eukaryotic Cells & Organelles"]},
                   {name:"DT-09 (Bot)", subs:["Biomolecules"]},
                   {name:"DT-10 (Bot)", subs:["Cell Cycle & Cell Division"]}
               ] 
           },
           { 
               category: "Bio-11", subject: "Botany", topic: "Plant Physiology", 
               dailyTests: [ 
                   {name:"DT-11 (Bot)", subs:["Transport in Plants"]},
                   {name:"DT-12 (Bot)", subs:["Mineral Nutrition"]},
                   {name:"DT-13 (Bot)", subs:["Photosynthesis in Higher Plants"]},
                   {name:"DT-14 (Bot)", subs:["Respiration in Plants"]},
                   {name:"DT-15 (Bot)", subs:["Plant Growth & Development"]}
               ] 
           },
           { 
               category: "Bio-11", subject: "Zoology", topic: "Animal Kingdom", 
               dailyTests: [ 
                   {name:"DT-01 (Zoo)", subs:["Basis of Classification", "Porifera to Platyhelminthes"]},
                   {name:"DT-02 (Zoo)", subs:["Aschelminthes to Hemichordata"]},
                   {name:"DT-03 (Zoo)", subs:["Chordata"]}
               ] 
           },
           { 
               category: "Bio-11", subject: "Zoology", topic: "Structural Org. in Animals", 
               dailyTests: [ 
                   {name:"DT-04 (Zoo)", subs:["Animal Tissues"]},
                   {name:"DT-05 (Zoo)", subs:["Cockroach"]},
                   {name:"DT-06 (Zoo)", subs:["Frog"]}
               ] 
           },
           { 
               category: "Bio-11", subject: "Zoology", topic: "Human Physiology", 
               dailyTests: [ 
                   {name:"DT-16 (Zoo)", subs:["Digestion & Absorption"]},
                   {name:"DT-17 (Zoo)", subs:["Breathing & Exchange of Gases"]},
                   {name:"DT-18 (Zoo)", subs:["Body Fluids & Circulation"]},
                   {name:"DT-19 (Zoo)", subs:["Excretory Products & their Elimination"]},
                   {name:"DT-20 (Zoo)", subs:["Locomotion & Movement"]},
                   {name:"DT-21 (Zoo)", subs:["Neural Control & Coordination"]},
                   {name:"DT-22 (Zoo)", subs:["Chemical Coordination & Integration"]}
               ] 
           },

           // =======================================================
           // 🏁 PRIORITY 4: AIATS-06 SYLLABUS (Due Mar 08)
           // =======================================================
           // PHYSICS
           { 
               category: "AIATS-6", subject: "Physics", topic: "Moving Charges & Magnetism", 
               dailyTests: [ 
                   {name:"DT-15 (Phy)", subs:["Magnetic Force", "Motion in Magnetic Field"]},
                   {name:"DT-16 (Phy)", subs:["Biot-Savart Law", "Ampere's Circuital Law"]}
               ] 
           },
           { 
               category: "AIATS-6", subject: "Physics", topic: "Magnetism & Matter", 
               dailyTests: [ {name:"DT-17 (Phy)", subs:["Bar Magnet", "Earth's Magnetism", "Magnetic Properties"]} ] 
           },
           { 
               category: "AIATS-6", subject: "Physics", topic: "EMI", 
               dailyTests: [ 
                   {name:"DT-18 (Phy)", subs:["Faraday's Law", "Lenz's Law", "Motional EMF"]},
                   {name:"DT-19 (Phy)", subs:["Eddy Currents", "Inductance", "AC Generator"]}
               ] 
           },
           { 
               category: "AIATS-6", subject: "Physics", topic: "Alternating Current", 
               dailyTests: [ 
                   {name:"DT-20 (Phy)", subs:["LCR Series Circuit", "Resonance"]},
                   {name:"DT-21 (Phy)", subs:["Power in AC", "Transformers"]}
               ] 
           },
           { 
               category: "AIATS-6", subject: "Physics", topic: "EM Waves", 
               dailyTests: [ {name:"DT-22 (Phy)", subs:["Displacement Current", "EM Spectrum"]} ] 
           },
           // CHEMISTRY
           { 
               category: "AIATS-6", subject: "Chemistry", topic: "d & f Block", 
               dailyTests: [ 
                   {name:"DT-13 (Chem)", subs:["d-Block Properties", "Compounds (KMnO4/K2Cr2O7)"]},
                   {name:"DT-14 (Chem)", subs:["Lanthanoids", "Actinoids"]} 
               ] 
           },
           { 
               category: "AIATS-6", subject: "Chemistry", topic: "Coordination Compounds", 
               dailyTests: [ 
                   {name:"DT-15 (Chem)", subs:["Werner's Theory", "Nomenclature", "Isomerism"]},
                   {name:"DT-16 (Chem)", subs:["Bonding (VBT/CFT)", "Stability"]} 
               ] 
           }
       ]
   }
];
        // --- STATE MODIFICATION: USE REAL DATE ---
        const state = {
            // UPDATED: Now uses current real-world date
            
            displayName: null,
            currentDate: new Date(), 
            selectedDate: new Date(),
            tasks: {}, 
            prayers: {},
            activeView: 'overview',
            nextExam: null,
            dailyTestsAttempted: {},
            expandedTests: {}, 
            expandedFocusGroups: {},
            goalCompletedToday: false, // Track if sound played
            mistakes: [], // NEW: Array for mistakes
            activeNotebook: null // NEW: Currently open subject
        };
window.state = state;
        // --- FIXED: ADDED ESCAPE HELPERS FOR SECURITY ---
        const escapeHtml = (unsafe) => {
            if (typeof unsafe !== 'string') return '';
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const escapeRegex = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

    // Renamed to 'safeQuote' to avoid conflict with global escape()
        const safeQuote = (str) => {
            if (!str) return '';
            return str
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/"/g, '&quot;');
        };    
        const formatDateKey = (d) => {
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        };

        function getSubjectColor(subject) {
            switch(subject) {
                case 'Physics': return 'bg-phy-100 dark:bg-phy-700/30 text-phy-700 dark:text-phy-100';
                case 'Chemistry': return 'bg-chem-100 dark:bg-chem-700/30 text-chem-700 dark:text-chem-100';
                case 'Botany': return 'bg-bio-100 dark:bg-bio-700/30 text-bio-700 dark:text-bio-100';
                case 'Zoology': return 'bg-bio-100 dark:bg-bio-700/30 text-bio-700 dark:text-bio-100';
                default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
            }
        }
// --- NEW PROFILE UI LOGIC ---
window.updateProfileUI = function(user) {
    const isGuest = !user || user.isAnonymous;
    const name = state.displayName || (user && user.email ? user.email.split('@')[0] : "Guest User");
    const initial = name.charAt(0).toUpperCase();

    const guestStyle = {
        cardBorder: "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800",
        avatarBg: "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
        icon: "log-in"
    };

    const userStyle = {
        cardBorder: "border-brand-200 dark:border-brand-900/50 bg-brand-50/50 dark:bg-brand-900/10",
        avatarBg: "bg-gradient-to-br from-brand-500 to-blue-600 text-white shadow-brand-500/30",
        icon: "log-out"
    };

    const currentStyle = isGuest ? guestStyle : userStyle;

    const updateElements = (prefix) => {
        const card = document.getElementById(`${prefix}-user-card`);
        const avatarBg = document.getElementById(`${prefix}-user-avatar-bg`);
        // Removed avatarText because new design puts text directly in avatarBg
        const nameEl = document.getElementById(`${prefix}-user-name`);
        const statusEl = document.getElementById(`${prefix}-sync-status`);
        const btn = document.getElementById(`${prefix}-auth-btn`);

        if(!card) return;

        if(prefix === 'mobile') {
            card.className = `flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all cursor-pointer ${currentStyle.cardBorder}`;
        }
        
        avatarBg.className = `flex items-center justify-center font-bold shadow-sm transition-colors ${prefix === 'mobile' ? 'w-10 h-10 rounded-full text-sm' : 'w-9 h-9 rounded-xl text-xs'} ${currentStyle.avatarBg}`;
        
        // FIX: Set text directly on the background element
        avatarBg.textContent = isGuest ? "?" : initial;
        
        nameEl.textContent = name;
        
        statusEl.innerHTML = isGuest 
            ? `<span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> <span class="text-slate-500 dark:text-slate-400">Local Only</span>`
            : `<span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> <span class="text-green-600 dark:text-green-400">Synced</span>`;

        btn.innerHTML = `<i data-lucide="${currentStyle.icon}" class="${prefix === 'mobile' ? 'w-5 h-5' : 'w-4 h-4'}"></i>`;
        
        if(isGuest) {
            btn.className = `${prefix === 'mobile' ? 'p-2' : 'p-1.5'} rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:scale-105 transition-all`;
        } else {
            btn.className = `${prefix === 'mobile' ? 'p-2' : 'p-1.5'} rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all`;
        }
    };
    updateElements('mobile');
    updateElements('desktop');
    if(window.lucide) lucide.createIcons();
};

window.handleProfileClick = function() {
    if (!currentUser || currentUser.isAnonymous) document.getElementById('auth-modal').classList.remove('hidden');
};

window.handleAuthAction = function(e) {
    e.stopPropagation(); 
    if (!currentUser || currentUser.isAnonymous) document.getElementById('auth-modal').classList.remove('hidden');
    else handleLogout();
};
// ✅ NEW: Detect overlaps between Main Exam and Active Backlog Phase
// ✅ SAFE SILENCE: Overlap check disabled for Single Track mode
window.checkSyllabusOverlap = function() {
    return; 
};
function init() {
    
    // Add this inside init()
setInterval(() => {
    const now = new Date();
    // Check if it's exactly 5:00 PM (or just past it)
    if (now.getHours() === 17 && now.getMinutes() === 0 && now.getSeconds() < 5) {
        setupSchedule(); // Re-run the selection logic
        renderAll();     // Update the UI
        showToast("📅 Syllabus updated for next target!");
    }
}, 5000); // Checks every 5 seconds`
    setupSchedule(); 
    initScrollHeader(); 
    checkSyllabusOverlap();

    if (!isFirebaseActive && !localStorage.getItem('studyflow_demo_mode')) {
        document.getElementById('auth-modal').classList.remove('hidden');
        if(window.lucide) lucide.createIcons();
        return;
    }

    if(isFirebaseActive) {
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            
            if (user) {
                document.getElementById('auth-modal').classList.add('hidden');
                const docRef = getSafeDocRef(user.uid);
                
                unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        state.tasks = data.tasks || {};
                        state.dailyTestsAttempted = data.dailyTestsAttempted || {};
                        state.mistakes = data.mistakes || []; 
                        state.prayers = data.prayers || {};
                        state.displayName = data.displayName || null;
                        
                        updateProfileUI(user);
                        renderAll();

                        // ✅ FORCE UPDATE LEADERBOARD ON LOAD
                        // This fixes the "Old High Score" issue by recalculating 
                        // and syncing your stats immediately with the new formula.
                        saveData(); 

                    } else {
                        saveData();
                        updateProfileUI(user);
                    }
                }, (error) => {
                    console.error("Firestore error fallback:", error);
                    initLocalMode();
                });   
            } else {
                updateProfileUI(null);
                document.getElementById('auth-modal').classList.remove('hidden');
            }
        });
    } else {
        initLocalMode();
    }

    // Setup Mistake Form Listener
    const mistakeForm = document.getElementById('mistake-form');
    if(mistakeForm) {
        const newMForm = mistakeForm.cloneNode(true);
        mistakeForm.parentNode.replaceChild(newMForm, mistakeForm);
        newMForm.addEventListener('submit', window.saveMistake);
    }
}             

function initLocalMode() {
        const storedPrayers = localStorage.getItem('studyflow_prayers');
        if (storedPrayers) state.prayers = JSON.parse(storedPrayers);
        try {
            const storedTasks = localStorage.getItem('studyflow_tasks_v2');
            if (storedTasks) state.tasks = JSON.parse(storedTasks);
            
            const storedAttempts = localStorage.getItem('studyflow_attempts_v2'); 
            if (storedAttempts) state.dailyTestsAttempted = JSON.parse(storedAttempts);
            
            const storedMistakes = localStorage.getItem('studyflow_mistakes'); 
            if (storedMistakes) state.mistakes = JSON.parse(storedMistakes);

            const storedName = localStorage.getItem('studyflow_username');
            if (storedName) state.displayName = storedName;
            
        } catch (e) {
            console.error("Local data corrupted", e);
            localStorage.removeItem('studyflow_tasks_v2');
        }
        renderAll();
    }
        
function setupSchedule() {
    const now = new Date();

    // 1. Find the Active Phase from masterTimeline
    // It checks if TODAY is between the start and end date of a phase
    const activePhase = masterTimeline.find(phase => {
        return now >= phase.startDate && now <= phase.endDate;
    }) || masterTimeline.find(phase => now < phase.startDate) // If none active, show next upcoming
       || masterTimeline[masterTimeline.length - 1]; // Fallback to last

    // 2. Map it to state.nextExam 
    // We map it here so the rest of the UI (which looks for 'state.nextExam') 
    // displays your Current Phase automatically.
    state.nextExam = {
        name: activePhase.name,
        date: activePhase.endDate, // The deadline for this phase
        syllabus: activePhase.syllabus,
        id: activePhase.id
    };

    // 3. Clear old Backlog references to prevent confusion
    window.backlogPlan = undefined;

    // --- Keep existing Event Listeners below ---
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        const newForm = addTaskForm.cloneNode(true);
        addTaskForm.parentNode.replaceChild(newForm, addTaskForm);
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('new-task-input');
            if (input && input.value.trim()) {
                const typeEl = document.getElementById('new-task-type');
                const subEl = document.getElementById('new-task-subject');
                const type = typeEl ? typeEl.value : 'main';
                const subject = subEl ? subEl.value : 'General';
                addTask(input.value.trim(), type, subject);
                input.value = '';
            }
        });
    }
    const mistakeForm = document.getElementById('mistake-form');
    if(mistakeForm) {
        const newMForm = mistakeForm.cloneNode(true);
        mistakeForm.parentNode.replaceChild(newMForm, mistakeForm);
        newMForm.addEventListener('submit', window.saveMistake);
    }
}


function calculateUserStats() {
    // 1. Get Completed Tasks
    const allCompleted = new Set(
        Object.values(state.tasks).flat()
        .filter(t => t.completed)
        .map(t => t.text)
    );

    // 2. Calculate Progress for the CURRENT PHASE
    let totalPts = 0, earnedPts = 0;
    let testCount = 0;
    const validTestNames = new Set();

    if (state.nextExam && state.nextExam.syllabus) {
        state.nextExam.syllabus.forEach(item => {
            item.dailyTests.forEach(dt => {
                validTestNames.add(dt.name);
                testCount++;
                
                // Calculate Points for this topic
                const pts = getSubtopicPoints(dt, item.subject, item.topic);
                dt.subs.forEach(sub => {
                    totalPts += pts;
                    if (allCompleted.has(`Study: ${item.topic} - ${sub}`)) {
                        earnedPts += pts;
                    }
                });
            });
        });
    }

    // Phase Completion Percentage
    const phaseProgress = totalPts ? Math.round((earnedPts / totalPts) * 100) : 0;

    // 3. Test Attempts (Fair Rule)
    // How many of the CURRENT PHASE tests have you attempted?
    const attempts = Object.keys(state.dailyTestsAttempted).filter(k => 
        state.dailyTestsAttempted[k] && validTestNames.has(k)
    ).length;
    
    const testPct = testCount ? Math.round((attempts / testCount) * 100) : 0;

    return {
        mainPct: phaseProgress, // Display Phase Progress in the "Exam" slot
        blPct: 0,               // Backlog slot is empty (Unified track)
        testCount: attempts,
        overallScore: phaseProgress + testPct // Score = Phase % + Test %
    };
}
function saveData() {
    const stats = calculateUserStats(); 

    if(isFirebaseActive && currentUser) {
        const docRef = getSafeDocRef(currentUser.uid);
        
        const statusEl = document.getElementById('desktop-sync-status');
        if(statusEl) statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Saving...`;

        // 1. Save Personal Data
        setDoc(docRef, {
            tasks: state.tasks,
            dailyTestsAttempted: state.dailyTestsAttempted,
            mistakes: state.mistakes || [],
            displayName: state.displayName,
            prayers: state.prayers || {} 
        }, { merge: true }).then(() => {
            if(statusEl) statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Synced`;
        }).catch(err => {
            console.error("Personal Save failed:", err);
            if(statusEl) statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Save Failed`;
        });

        // 2. Save Leaderboard Entry (DETAILED SYNC)
        const lbRef = doc(db, 'leaderboard', currentUser.uid);

        setDoc(lbRef, {
            email: currentUser.email || 'Anonymous',
            displayName: state.displayName || 'Anonymous',
            
            // X, Y, Z Factors
            mainPct: stats.mainPct,
            blPct: stats.blPct,
            testCount: stats.testCount,
            
            // Score & Reset Key
            overallScore: stats.overallScore, 
            currentExam: state.nextExam.name, // Used to filter/reset seasons
            
            lastUpdated: new Date()
        }, { merge: true }).catch(err => {
            console.error("Leaderboard Save failed:", err);
        });
    } else {
        // Local Storage Fallback
        localStorage.setItem('studyflow_tasks_v2', JSON.stringify(state.tasks));
        localStorage.setItem('studyflow_attempts_v2', JSON.stringify(state.dailyTestsAttempted));
        localStorage.setItem('studyflow_mistakes', JSON.stringify(state.mistakes || []));
        localStorage.setItem('studyflow_username', state.displayName);
        localStorage.setItem('studyflow_prayers', JSON.stringify(state.prayers || {}));
    }
    renderAll();
}

 // --- PRAYER FUNCTIONS ---
window.openPrayerModal = function() {
    document.getElementById('modal-prayer-date').textContent = state.selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('prayer-modal').classList.remove('hidden');
    renderPrayerModalItems();
};

window.togglePrayer = function(prayerName) {
    const k = formatDateKey(state.selectedDate);
    if (!state.prayers[k]) state.prayers[k] = {};
    state.prayers[k][prayerName] = !state.prayers[k][prayerName];
    saveData();
    
    // Update both the modal (if open) and the NEW header widget
    renderPrayerModalItems();
    renderHeaderPrayerWidget(); // <--- Changed this line!
    updateSidebarBadges();      // Optional: Updates badges if you add prayer logic there later
};

window.renderPrayerModalItems = function() {
    const list = document.getElementById('modal-prayer-list');
    if(!list) return;
    const k = formatDateKey(state.selectedDate);
    const todayData = state.prayers[k] || {};
    const prayers = [
        { name: 'Fajr', time: 'Before Sunrise' }, { name: 'Dhuhr', time: 'After Noon' },
        { name: 'Asr', time: 'Afternoon' }, { name: 'Maghrib', time: 'After Sunset' }, { name: 'Isha', time: 'Night' }
    ];
    list.innerHTML = prayers.map(p => {
        const isDone = todayData[p.name] === true;
        const bg = isDone ? "bg-emerald-500 border-emerald-600 text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400";
        return `<button onclick="togglePrayer('${p.name}')" class="flex items-center justify-between p-3 rounded-xl border transition-all ${bg}">
            <div class="text-left"><div class="font-bold text-sm ${isDone ? 'text-white' : 'text-slate-800 dark:text-white'}">${p.name}</div><div class="text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-emerald-100' : 'text-slate-400'}">${p.time}</div></div>
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDone ? 'border-white bg-white text-emerald-600' : 'border-slate-300 dark:border-slate-600'}">${isDone ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}</div></button>`;
    }).join('');
    if(window.lucide) lucide.createIcons({ root: list });

   updateSidebarBadges();
};

window.updateHeaderPrayerBtn = function() {
    const el = document.getElementById('header-prayer-count');
    if(!el) return;
    const k = formatDateKey(state.selectedDate);
    const todayData = state.prayers[k] || {};
    const count = Object.values(todayData).filter(v => v === true).length;
    el.textContent = `${count}/5`;
    if(count === 5) el.className = "bg-yellow-400 text-black text-[9px] px-1.5 py-0.5 rounded ml-1 font-bold shadow-sm";
    else el.className = "bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded ml-1";
};

 // ==========================================
// 🌙 RAMADAN & SPIRITUAL ENGINE V2.0 (Srinagar Edition)
// ==========================================

// 1. DATA: RAMADAN 2026 CALENDAR (SRINAGAR)
// derived from your uploaded screenshot
const ramadanCalendar2026 = [
    { day: 1, date: "2026-02-19", sehri: "05:47 AM", iftar: "06:19 PM" },
    { day: 2, date: "2026-02-20", sehri: "05:46 AM", iftar: "06:20 PM" },
    { day: 3, date: "2026-02-21", sehri: "05:45 AM", iftar: "06:21 PM" },
    { day: 4, date: "2026-02-22", sehri: "05:44 AM", iftar: "06:22 PM" },
    { day: 5, date: "2026-02-23", sehri: "05:43 AM", iftar: "06:23 PM" },
    { day: 6, date: "2026-02-24", sehri: "05:42 AM", iftar: "06:24 PM" },
    { day: 7, date: "2026-02-25", sehri: "05:41 AM", iftar: "06:24 PM" },
    { day: 8, date: "2026-02-26", sehri: "05:39 AM", iftar: "06:25 PM" },
    { day: 9, date: "2026-02-27", sehri: "05:38 AM", iftar: "06:26 PM" },
    { day: 10, date: "2026-02-28", sehri: "05:37 AM", iftar: "06:27 PM" },
    { day: 11, date: "2026-03-01", sehri: "05:36 AM", iftar: "06:28 PM" },
    { day: 12, date: "2026-03-02", sehri: "05:35 AM", iftar: "06:29 PM" },
    { day: 13, date: "2026-03-03", sehri: "05:33 AM", iftar: "06:30 PM" },
    { day: 14, date: "2026-03-04", sehri: "05:32 AM", iftar: "06:30 PM" },
    { day: 15, date: "2026-03-05", sehri: "05:31 AM", iftar: "06:31 PM" },
    { day: 16, date: "2026-03-06", sehri: "05:30 AM", iftar: "06:32 PM" },
    { day: 17, date: "2026-03-07", sehri: "05:28 AM", iftar: "06:33 PM" },
    { day: 18, date: "2026-03-08", sehri: "05:27 AM", iftar: "06:34 PM" },
    { day: 19, date: "2026-03-09", sehri: "05:26 AM", iftar: "06:34 PM" },
    { day: 20, date: "2026-03-10", sehri: "05:24 AM", iftar: "06:35 PM" },
    { day: 21, date: "2026-03-11", sehri: "05:23 AM", iftar: "06:36 PM" },
    { day: 22, date: "2026-03-12", sehri: "05:22 AM", iftar: "06:37 PM" },
    { day: 23, date: "2026-03-13", sehri: "05:20 AM", iftar: "06:38 PM" },
    { day: 24, date: "2026-03-14", sehri: "05:19 AM", iftar: "06:38 PM" },
    { day: 25, date: "2026-03-15", sehri: "05:18 AM", iftar: "06:39 PM" },
    { day: 26, date: "2026-03-16", sehri: "05:16 AM", iftar: "06:40 PM" },
    { day: 27, date: "2026-03-17", sehri: "05:15 AM", iftar: "06:41 PM" },
    { day: 28, date: "2026-03-18", sehri: "05:13 AM", iftar: "06:42 PM" },
    { day: 29, date: "2026-03-19", sehri: "05:12 AM", iftar: "06:42 PM" },
    { day: 30, date: "2026-03-20", sehri: "05:10 AM", iftar: "06:43 PM" }
];

// 2. DATA: EXTENSIVE HADITH COLLECTION (Sahih Bukhari & Muslim)
const hadithCollection = [
    { t: "The difference between a man and shirk and kufr is the abandoning of the Prayer.", s: "Sahih Muslim" },
    { t: "Actions are judged by intentions.", s: "Sahih Bukhari" },
    { t: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.", s: "Sahih Muslim" },
    { t: "None of you truly believes until he loves for his brother what he loves for himself.", s: "Sahih Bukhari" },
    { t: "He who prays the two cool prayers (Asr and Fajr) will enter Paradise.", s: "Sahih Bukhari" },
    { t: "Cleanliness is half of faith.", s: "Sahih Muslim" },
    { t: "The best of you are those who learn the Quran and teach it.", s: "Sahih Bukhari" },
    { t: "A good word is charity.", s: "Sahih Bukhari" },
    { t: "Do not get angry.", s: "Sahih Bukhari" },
    { t: "He who does not show mercy to our young ones and recognize the rights of our elders is not one of us.", s: "Sahih Bukhari" },
    { t: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", s: "Sahih Bukhari" },
    { t: "Whoever fasts Ramadan out of faith and hope for reward, his past sins will be forgiven.", s: "Sahih Bukhari" },
    { t: "When Ramadan enters, the gates of Paradise are opened, the gates of Hellfire are closed and the devils are chained.", s: "Sahih Bukhari" },
    { t: "Eat Suhoor, for in Suhoor there is blessing.", s: "Sahih Bukhari" },
    { t: "Whoever does not give up false statements (i.e. telling lies), and evil deeds, and speaking bad words to others, Allah is not in need of his (fasting) leaving his food and drink.", s: "Sahih Bukhari" },
    { t: "Umrah in Ramadan is equal (in reward) to Hajj with me.", s: "Sahih Bukhari" },
    { t: "The five daily prayers and the Friday Prayer to the Friday Prayer are expiations for what is between them, as long as major sins are avoided.", s: "Sahih Muslim" },
    { t: "Whoever establishes prayers during the nights of Ramadan faithfully out of sincere faith and hoping to attain Allah's rewards (not for showing off), all his past sins will be forgiven.", s: "Sahih Bukhari" },
    { t: "Search for the Night of Qadr in the odd nights of the last ten days of Ramadan.", s: "Sahih Bukhari" },
    { t: "Be in this world as if you were a stranger or a traveler.", s: "Sahih Bukhari" },
    { t: "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death.", s: "Sahih Al-Jami" },
    { t: "Richness is not having many possessions, but richness is being content with oneself.", s: "Sahih Bukhari" },
    { t: "Allah is Beautiful and He loves beauty.", s: "Sahih Muslim" },
    { t: "Do not waste water even if you were at a running stream.", s: "Sunan Ibn Majah" },
    { t: "Fear Allah wherever you may be; follow up a bad deed with a good deed which will wipe it out, and behave well towards the people.", s: "At-Tirmidhi" },
    { t: "The best among you are those who have the best manners and character.", s: "Sahih Bukhari" },
    { t: "Modesty brings nothing but good.", s: "Sahih Bukhari" },
    { t: "A Muslim is the one from whose tongue and hands the Muslims are safe.", s: "Sahih Bukhari" },
    { t: "Do not envy one another, and do not inflate prices for one another, and do not hate one another.", s: "Sahih Muslim" },
    { t: "Allah helps His slave as long as he helps his brother.", s: "Sahih Muslim" },
    { t: "There are two blessings which many people lose: (They are) Health and free time for doing good.", s: "Sahih Bukhari" },
    { t: "Seven people will be shaded by Allah under His shade on the day when there will be no shade except His.", s: "Sahih Bukhari" },
    { t: "The world is a prison for the believer and a paradise for the unbeliever.", s: "Sahih Muslim" },
    { t: "Make things easy for people and not difficult. Give people good news and bring them joy, and do not turn them away.", s: "Sahih Bukhari" }
];

// 3. MAIN RENDER FUNCTION
// 3. MAIN RENDER FUNCTION (UPDATED WITH ISLAMIC THEME CLASSES)
window.renderNamazView = function() {
    // --- A. RAMADAN COUNTDOWN (Target: Feb 19, 2026) ---
    const ramadanDate = new Date('2026-02-19T00:00:00'); // Srinagar Start Date
    
    if (window.ramadanTimerInterval) clearInterval(window.ramadanTimerInterval);

    const container = document.getElementById('view-namaz');
    if (!container) return;
    
    const sleepPref = localStorage.getItem('studyflow_sehri_buffer') || '2'; 

    let html = `
    <header class="px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="moon-star" class="w-6 h-6 text-emerald-500"></i> Spiritual Insights
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Track prayers & Prepare for Ramadan 2026</p>
    </header>

    <div class="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 pb-32">
        <div class="max-w-5xl mx-auto space-y-8">
            
            <div class="relative overflow-hidden rounded-3xl p-8 shadow-2xl group transition-all duration-500 border border-emerald-500/30 bg-emerald-900">
                <div class="absolute inset-0 bg-pattern-islamic opacity-20 z-0"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 opacity-90 z-0"></div>
                
                <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div class="float-majestic">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> 19 Feb 2026 (Srinagar)
                        </div>
                        <h2 class="text-4xl md:text-6xl font-black text-gradient-gold drop-shadow-sm mb-2 font-serif tracking-tight">Ramadan 2026</h2>
                        <p class="text-emerald-100/80 text-sm max-w-md mx-auto md:mx-0 font-medium italic">"O you who have believed, decreed upon you is fasting... that you may become righteous."</p>
                    </div>
                    
                    <div id="ramadan-timer-display" class="flex gap-3">
                        </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-5">
                    <i data-lucide="clock" class="w-32 h-32 rotate-12"></i>
                </div>

                <div class="relative z-10">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <i data-lucide="bed-double" class="w-5 h-5 text-indigo-500"></i> Sehri Sleep Planner
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-3">Wake Up Buffer (Before Sehri)</label>
                            <div class="flex gap-2" id="buffer-buttons">
                                <button onclick="setBuffer('1')" class="flex-1 py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all">1 Hr Before</button>
                                <button onclick="setBuffer('2')" class="flex-1 py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all">2 Hrs Before</button>
                                <button onclick="setBuffer('3')" class="flex-1 py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all">3 Hrs Before</button>
                            </div>
                            <p class="text-xs text-slate-400 mt-2">Calculates bedtime to get exactly <b class="text-indigo-500">5 hours</b> of sleep.</p>
                        </div>

                        <div id="sleep-suggestion-box" class="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-center items-center text-center">
                            </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                        <span class="flex items-center gap-2"><i data-lucide="bar-chart-2" class="w-4 h-4 text-emerald-500"></i> Prayer Consistency (30 Days)</span>
                        <span id="stat-total-prayers" class="text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">0 Offered</span>
                    </h3>
                    
                    <div class="space-y-5" id="prayer-bars-container">
                        </div>
                </div>

                <div class="space-y-4">
                    <div class="bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-100 dark:border-amber-900/30 text-center relative h-full flex flex-col justify-center">
                        <i data-lucide="quote" class="w-8 h-8 text-amber-300 dark:text-amber-800/50 absolute top-6 left-6"></i>
                        <h3 class="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-4">Daily Hadith</h3>
                        <p class="text-lg font-medium text-slate-800 dark:text-slate-200 font-serif leading-relaxed italic mb-4" id="daily-hadith-text">...</p>
                        <div class="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-400" id="daily-hadith-source">...</div>
                    </div>
                </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-800 pt-8">
                <button onclick="document.getElementById('calendar-grid').classList.toggle('hidden')" class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mx-auto w-full justify-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <i data-lucide="calendar" class="w-4 h-4"></i> View Full Srinagar Ramadan Calendar (2026)
                    <i data-lucide="chevron-down" class="w-4 h-4 ml-1"></i>
                </button>
                <div id="calendar-grid" class="hidden mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    ${ramadanCalendar2026.map(d => `
                        <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                            <div class="text-[10px] font-bold text-slate-400 uppercase">Day ${d.day} • ${d.date.substring(5)}</div>
                            <div class="flex justify-center gap-3 mt-1">
                                <div><div class="text-[10px] text-slate-500 uppercase">Sehri</div><div class="text-sm font-bold text-slate-800 dark:text-white">${d.sehri}</div></div>
                                <div class="w-px bg-slate-200 dark:bg-slate-600"></div>
                                <div><div class="text-[10px] text-slate-500 uppercase">Iftar</div><div class="text-sm font-bold text-slate-800 dark:text-white">${d.iftar}</div></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

        </div>
    </div>`;

    container.innerHTML = html; 
    
    // --- B. START LOGIC (WITH NEW BOX STYLING) ---
    startRamadanTimer(ramadanDate);
    updateSleepCalculator(sleepPref);
    calculateAndRenderStats();
    renderUniqueHadith();

    if(window.lucide) lucide.createIcons({ root: container });
};

// 4. HELPER: TIMER LOGIC (WITH GLASS-EMERALD CLASS)
window.startRamadanTimer = function(targetDate) {
    const display = document.getElementById('ramadan-timer-display');
    
    const update = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            display.innerHTML = "<span class='text-white font-bold text-2xl animate-pulse'>Ramadan Mubarak! 🌙</span>";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // APPLIED: glass-emerald class here
        const boxClass = "glass-emerald flex flex-col items-center justify-center rounded-xl p-2 md:p-3 min-w-[60px] md:min-w-[70px] transition-transform hover:scale-105";
        const numClass = "text-2xl md:text-3xl font-black text-white font-mono leading-none drop-shadow-md";
        const labelClass = "text-[9px] font-bold text-emerald-200 uppercase mt-1 tracking-widest";

        display.innerHTML = `
            <div class="${boxClass}"><span class="${numClass}">${d}</span><span class="${labelClass}">Days</span></div>
            <div class="${boxClass}"><span class="${numClass}">${h}</span><span class="${labelClass}">Hrs</span></div>
            <div class="${boxClass}"><span class="${numClass}">${m}</span><span class="${labelClass}">Mins</span></div>
            <div class="${boxClass}"><span class="${numClass}">${s}</span><span class="${labelClass}">Secs</span></div>
        `;
    };
    
    update();
    window.ramadanTimerInterval = setInterval(update, 1000);
};

// 4. HELPER: SLEEP CALCULATOR LOGIC
window.setBuffer = function(hours) {
    localStorage.setItem('studyflow_sehri_buffer', hours);
    updateSleepCalculator(hours);
    
    // Update button visual states
    const btns = document.getElementById('buffer-buttons').querySelectorAll('button');
    btns.forEach(b => {
        if(b.textContent.includes(hours)) {
            b.className = "flex-1 py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm";
        } else {
            b.className = "flex-1 py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800";
        }
    });
};

window.updateSleepCalculator = function(bufferHours) {
    const box = document.getElementById('sleep-suggestion-box');
    if(!box) return;

    // 1. Determine "Active" Sehri Day
    // If current time is AFTER today's Sehri, we plan for TOMORROW.
    // If before, we plan for TODAY.
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Default to first day if outside calendar range
    let targetDay = ramadanCalendar2026.find(d => d.date >= todayStr) || ramadanCalendar2026[0];
    
    // Check precise timing if strictly inside Ramadan
    const sehriTimeStr = targetDay.sehri; // "05:47 AM"
    
    // Parse time
    let [tPart, mod] = sehriTimeStr.split(' ');
    let [h, m] = tPart.split(':');
    let hNum = parseInt(h);
    if(hNum === 12) hNum = 0; // handle 12 AM edge case
    
    const sehriDate = new Date(targetDay.date);
    sehriDate.setHours(hNum, parseInt(m), 0);
    
    // If today's sehri has passed, look at next day in array
    if(now > sehriDate) {
        const nextIdx = ramadanCalendar2026.indexOf(targetDay) + 1;
        if(nextIdx < ramadanCalendar2026.length) {
            targetDay = ramadanCalendar2026[nextIdx];
            
            // Re-parse for new target
            [tPart, mod] = targetDay.sehri.split(' ');
            [h, m] = tPart.split(':');
            hNum = parseInt(h);
            if(hNum === 12) hNum = 0;
            
            sehriDate.setTime(new Date(targetDay.date).getTime());
            sehriDate.setHours(hNum, parseInt(m), 0);
        }
    }

    // Calculate Wake Up Time (Sehri - Buffer)
    const wakeUpDate = new Date(sehriDate);
    wakeUpDate.setHours(sehriDate.getHours() - parseInt(bufferHours));

    // Calculate Sleep Time (Wake Up - 5 hours)
    const sleepDate = new Date(wakeUpDate);
    sleepDate.setHours(wakeUpDate.getHours() - 5);

    // Format Times
    const fmt = (d) => d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const isToday = sleepDate.getDate() === now.getDate();
    const dayLabel = isToday ? "Tonight" : "Tomorrow Night";

    box.innerHTML = `
        <div class="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">For Sehri (${targetDay.sehri})</div>
        <div class="text-4xl font-black mb-1 animate-in zoom-in duration-300">${fmt(sleepDate)}</div>
        <div class="text-sm font-medium opacity-90">Sleep by this time ${dayLabel}</div>
        <div class="mt-4 pt-4 border-t border-white/20 w-full flex justify-between text-xs">
            <span>Wake Up: <b>${fmt(wakeUpDate)}</b></span>
            <span>Sleep Duration: <b>5 hrs</b></span>
        </div>
    `;
};

// 5. HELPER: TIMER LOGIC (With Holy Light Visuals)
window.startRamadanTimer = function(targetDate) {
    const display = document.getElementById('ramadan-timer-display');
    
    const update = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            display.innerHTML = "<span class='text-white font-bold text-2xl'>Ramadan Mubarak! 🌙</span>";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const boxClass = "flex flex-col items-center justify-center bg-black/30 backdrop-blur-md rounded-xl border border-emerald-400/30 p-2 md:p-3 min-w-[60px] md:min-w-[70px] shadow-lg";
        const numClass = "text-2xl md:text-3xl font-black text-white font-mono leading-none";
        const labelClass = "text-[9px] font-bold text-emerald-300 uppercase mt-1 tracking-widest";

        display.innerHTML = `
            <div class="${boxClass}"><span class="${numClass}">${d}</span><span class="${labelClass}">Days</span></div>
            <div class="${boxClass}"><span class="${numClass}">${h}</span><span class="${labelClass}">Hrs</span></div>
            <div class="${boxClass}"><span class="${numClass}">${m}</span><span class="${labelClass}">Mins</span></div>
            <div class="${boxClass}"><span class="${numClass}">${s}</span><span class="${labelClass}">Secs</span></div>
        `;
    };
    
    update();
    window.ramadanTimerInterval = setInterval(update, 1000);
};

// 6. HELPER: ADVANCED STATS (Heatmap Style)
window.calculateAndRenderStats = function() {
    const counts = { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
    let totalOffered = 0;
    const totalDays = 30; // Look back period

    // Analyze Data
    for(let i=0; i<totalDays; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = formatDateKey(d);
        if(state.prayers && state.prayers[k]) {
            const p = state.prayers[k];
            ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(name => {
                if(p[name]) { counts[name]++; totalOffered++; }
            });
        }
    }

    // Update "Total" Badge
    const totalBadge = document.getElementById('stat-total-prayers');
    if(totalBadge) totalBadge.innerText = `${totalOffered} Offered`;

    // Calculate Percentages & Render Bars
    const container = document.getElementById('prayer-bars-container');
    if(container) {
        container.innerHTML = Object.entries(counts).map(([name, count]) => {
            const pct = (count / totalDays) * 100;
            let barColor = 'bg-emerald-500'; 
            if(pct < 50) barColor = 'bg-orange-500';
            if(pct < 20) barColor = 'bg-red-500';

            return `
            <div>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-slate-700 dark:text-slate-300 w-20">${name}</span>
                    <span class="text-slate-400">${count}/${totalDays} days</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full ${barColor} shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000 relative" style="width: ${pct}%">
                        <div class="absolute inset-0 bg-white/20 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }
};

// 7. HELPER: UNIQUE HADITH ROTATION
window.renderUniqueHadith = function() {
    // Generate a consistent index based on the day of the year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Use modulus to cycle through the array
    const index = dayOfYear % hadithCollection.length;
    const selected = hadithCollection[index];

    const textEl = document.getElementById('daily-hadith-text');
    const sourceEl = document.getElementById('daily-hadith-source');

    if(textEl) textEl.textContent = `"${selected.t}"`;
    if(sourceEl) sourceEl.textContent = selected.s;
};       


// ======================================================
        // 🧠 ADVANCED SMART MIX ENGINE (Context-Aware Fix)
        // ======================================================

        // --- 1. CONFIGURATION: THE POINTS SYSTEM ---
        const POINT_RULES = {
            Physics: 4,
            Chemistry: 3,
            HighYieldBio: 3, 
            StandardBio: 2
        };

        const HIGH_YIELD_TOPICS = [
            "Sexual Reproduction in Plants", 
            "Principles of Inheritance", 
            "Molecular Basis of Inheritance", 
            "Evolution"
        ];

        function getTestPoints(subject, topic) {
            if (subject === 'Physics') return POINT_RULES.Physics;
            if (subject === 'Chemistry') return POINT_RULES.Chemistry;
            if (subject === 'Botany' || subject === 'Zoology' || subject === 'Biology') {
                const isHighYield = HIGH_YIELD_TOPICS.some(h => topic.includes(h));
                return isHighYield ? POINT_RULES.HighYieldBio : POINT_RULES.StandardBio;
            }
            return 1;
        }

        function getSubtopicPoints(testObj, subject, topic) {
            const totalPts = getTestPoints(subject, topic);
            const count = testObj.subs.length || 1;
            return totalPts / count;
        }

   // --- 2. THE MATH ENGINE (Calculates Syllabus Stats) ---
function calculateSmartMath(type) {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let targetDate, syllabus;
    
    // ✅ DYNAMIC PHASE CALCULATION
    // We calculate this upfront so we can filter EVERYTHING by it
    let activePhase = 1;
    if (typeof backlogPlan !== 'undefined') {
        const planStart = backlogPlan.startDate;
        const diff = Math.ceil((new Date() - planStart) / (1000 * 60 * 60 * 24));
        if(diff > 45) activePhase = 4;
        else if(diff > 30) activePhase = 3;
        else if(diff > 15) activePhase = 2;
    }

    if (type === 'main') {
        targetDate = state.nextExam ? new Date(state.nextExam.date) : new Date(); 
        syllabus = state.nextExam ? state.nextExam.syllabus : [];
    } else {
        // Backlog Target: End of current phase (Start + Phase*15 days)
        const planStart = typeof backlogPlan !== 'undefined' ? backlogPlan.startDate : new Date();
        targetDate = new Date(planStart);
        targetDate.setDate(planStart.getDate() + (activePhase * 15));
        
        // ✅ STRICT FILTERING: Only include chapters from the ACTIVE phase
        // This prevents future chapters (like Hydrocarbons in Phase 3) from counting as "Planned Points" now
        const fullSyllabus = typeof backlogPlan !== 'undefined' ? backlogPlan.syllabus : [];
        syllabus = fullSyllabus.filter(c => c.phase === activePhase);
    }

    const daysLeft = Math.max(1, Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)));

    let totalPoints = 0;
    let earnedPoints = 0;
    let pendingTasks = []; 

    const allCompleted = new Set(Object.values(state.tasks).flat().filter(t => t.completed).map(t => t.text));
    const plannedToday = new Set((state.tasks[formatDateKey(today)] || []).map(t => t.text));

    syllabus.forEach(chap => {
        chap.dailyTests.forEach(dt => {
            const subPts = getSubtopicPoints(dt, chap.subject, chap.topic);
            
            dt.subs.forEach(sub => {
                totalPoints += subPts;
                const taskName = `Study: ${chap.topic} - ${sub}`;
                
                if (allCompleted.has(taskName) || state.dailyTestsAttempted[dt.name]) {
                    earnedPoints += subPts;
                } else if (!plannedToday.has(taskName)) {
                    pendingTasks.push({
                        text: taskName,
                        subject: chap.subject,
                        points: subPts,
                        chapter: chap.topic,
                        type: type
                    });
                }
            });
        });
    });

    const remainingPoints = totalPoints - earnedPoints;
    const dailyTargetPoints = remainingPoints / daysLeft;

    return { daysLeft, totalPoints, remainingPoints, dailyTargetPoints, pendingTasks, syllabusRef: syllabus };
}   
  
       // --- 3. HELPER: CALCULATE POINTS ALREADY IN PLANNER ---
function getPlannerPointsForToday(mode, syllabusRef) {
    const k = formatDateKey(state.selectedDate);
    const tasks = state.tasks[k] || [];
    let sum = 0;

    tasks.forEach(t => {
        // ✅ CRITICAL FIX: Only count tasks that match the requested mode
        // If mode is 'main', ignore 'backlog' tasks, and vice versa.
        if (t.type !== mode) return; 

        // Try to find this task in the syllabus to get its point value
        syllabusRef.forEach(chap => {
            chap.dailyTests.forEach(dt => {
                dt.subs.forEach(sub => {
                    if (t.text.includes(sub)) {
                        sum += getSubtopicPoints(dt, chap.subject, chap.topic);
                    }
                });
            });
        });
    });
    return sum;
}

  // ==========================================
// ⚡ MODERN SMART MIX CONTROLLER
// ==========================================
let tempMixData = null; // Store data while modal is open

window.generateSmartMix = function(mode = 'main') {
    const math = calculateSmartMath(mode);
    const alreadyPlannedPts = getPlannerPointsForToday(mode, math.syllabusRef);
    const pointsNeeded = Math.max(0, math.dailyTargetPoints - alreadyPlannedPts);

    // 1. If Target Met, show simple toast
    if (pointsNeeded < 0.5) {
        showToast("✅ Daily target already met! Great job.");
        return;
    }

    // 2. Calculate the Candidates (The "Mix")
    const subjectLoad = {};
    math.pendingTasks.forEach(t => {
        if (!subjectLoad[t.subject]) subjectLoad[t.subject] = [];
        subjectLoad[t.subject].push(t);
    });

    let currentPoints = 0;
    let mixPool = [];
    const SAFE_CAP = 50; 

    while (currentPoints < pointsNeeded && mixPool.length < SAFE_CAP && math.pendingTasks.length > 0) {
        const heavySubject = Object.keys(subjectLoad).reduce((a, b) => 
            subjectLoad[a].length > subjectLoad[b].length ? a : b
        );

        if (!subjectLoad[heavySubject] || subjectLoad[heavySubject].length === 0) break;

        const task = subjectLoad[heavySubject].shift();
        mixPool.push(task);
        currentPoints += task.points;

        const index = math.pendingTasks.indexOf(task);
        if (index > -1) math.pendingTasks.splice(index, 1);
    }

    // Shuffle & Interleave
    let finalMix = [];
    let lastSubject = "";
    while (mixPool.length > 0) {
        let candidateIndex = mixPool.findIndex(t => t.subject !== lastSubject);
        if (candidateIndex === -1) candidateIndex = 0;
        const selected = mixPool[candidateIndex];
        finalMix.push(selected);
        lastSubject = selected.subject;
        mixPool.splice(candidateIndex, 1);
    }

    // 3. STORE DATA FOR CONFIRMATION
    tempMixData = finalMix;

    // 4. POPULATE THE MODERN MODAL
    document.getElementById('sm-target').innerText = math.dailyTargetPoints.toFixed(1);
    document.getElementById('sm-planned').innerText = alreadyPlannedPts.toFixed(1);
    document.getElementById('sm-gap').innerText = pointsNeeded.toFixed(1);
    document.getElementById('sm-suggestion').innerHTML = `I have selected <b class="text-indigo-500">${finalMix.length} tasks</b> (${currentPoints.toFixed(1)} Pts) to bridge this gap perfectly.`;
    
    document.getElementById('smartMixSubtitle').innerText = mode === 'main' ? 'Exam Sprint Mode' : 'Backlog Recovery Mode';
    
    const header = document.getElementById('smartMixHeader');
    if(mode === 'main') header.className = "relative h-32 bg-gradient-to-br from-brand-600 to-indigo-600 p-6 flex flex-col justify-between";
    else header.className = "relative h-32 bg-gradient-to-br from-orange-500 to-red-500 p-6 flex flex-col justify-between";

    // 5. OPEN MODAL ANIMATION
    const modal = document.getElementById('smart-mix-modal');
    const backdrop = document.getElementById('smartMixBackdrop');
    const card = document.getElementById('smartMixCard');
    
    modal.classList.remove('hidden');
    // Micro-delay for CSS transition
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 10);

    // 6. ATTACH CONFIRM LISTENER
    const btn = document.getElementById('btn-confirm-mix');
    btn.onclick = () => confirmSmartMixExecute();
};

window.closeSmartMixModal = function() {
    const modal = document.getElementById('smart-mix-modal');
    const backdrop = document.getElementById('smartMixBackdrop');
    const card = document.getElementById('smartMixCard');

    backdrop.classList.add('opacity-0');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        tempMixData = null;
    }, 300);
};

window.confirmSmartMixExecute = function() {
    if(!tempMixData) return;

    tempMixData.forEach(t => {
        const key = formatDateKey(state.selectedDate);
        if (!state.tasks[key]) state.tasks[key] = [];
        state.tasks[key].push({
            id: Date.now() + Math.random().toString(36).substr(2, 9), 
            text: t.text, type: t.type, subject: t.subject, chapter: t.chapter, completed: false 
        });
    });
    
    saveData();
    renderAll();
    closeSmartMixModal();
    
    // Confetti!
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    showToast(`🚀 Added ${tempMixData.length} tasks to your plan.`);
};      

// --- ✨ NEW VISUAL: POINTS REWARD TOAST (Fixed Centering) ---
window.showPointsToast = function(points, current, target, subject, type) {
    // 1. Remove existing to prevent stacking
    const existing = document.getElementById('points-toast-wrapper');
    if (existing) existing.remove();

    // 2. Calculate Progress
    const percent = Math.min(100, Math.round((current / target) * 100));
    
    // 3. Subject Colors
    let gradient = "from-emerald-500 to-teal-500";
    let icon = "zap";
    
    if (subject === 'Physics') {
        gradient = "from-blue-500 to-indigo-500";
        icon = "atom";
    } else if (subject === 'Chemistry') {
        gradient = "from-orange-500 to-amber-500";
        icon = "flask-conical";
    } else if (subject === 'Botany' || subject === 'Zoology' || subject === 'Biology') {
        gradient = "from-green-500 to-emerald-600";
        icon = "leaf";
    }

    // 4. Create WRAPPER (Positioning Only)
    const wrapper = document.createElement('div');
    wrapper.id = "points-toast-wrapper";
    wrapper.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm pointer-events-none";

    // 5. Create INNER CARD (Styling & Animation)
    const toast = document.createElement('div');
    toast.className = "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-2xl p-4 ring-1 ring-black/5 animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-auto";
    
    // Extract color name for shadow (e.g., 'emerald' from 'from-emerald-500')
    const colorName = gradient.split('-')[1];

    toast.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shadow-${colorName}-500/30">
                    <i data-lucide="${icon}" class="w-5 h-5"></i>
                </div>
                <div>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${subject} • ${type === 'main' ? 'Exam' : 'Backlog'}</h4>
                    <div class="text-xl font-black text-slate-800 dark:text-white flex items-center gap-1">
                        +${points.toFixed(2)} <span class="text-sm font-bold text-slate-400">Pts</span>
                    </div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-[10px] font-bold uppercase text-slate-400">Target</div>
                <div class="text-sm font-bold text-slate-700 dark:text-slate-300">
                    <span class="${percent >= 100 ? 'text-green-500' : ''}">${current.toFixed(1)}</span>
                    <span class="opacity-50">/</span> 
                    ${target.toFixed(1)}
                </div>
            </div>
        </div>

        <div class="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out" style="width: ${percent}%"></div>
        </div>
        <div class="mt-1 flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400">
            <span>Daily Progress</span>
            <span>${percent}%</span>
        </div>
    `;

    // 6. Assemble & Inject
    wrapper.appendChild(toast);
    document.body.appendChild(wrapper);

    if (window.lucide) lucide.createIcons({ root: toast });

    // 7. Remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4');
        setTimeout(() => wrapper.remove(), 300);
    }, 3500);
};
   


// --- 5. MANUAL ADD HOOK (With NEW Visuals & Duplicate Check) ---

window.addTask = function(text, type = 'main', subject = 'General', chapter = null) {
    // 1. Get Today's List
    const key = formatDateKey(state.selectedDate);
    if (!state.tasks[key]) state.tasks[key] = [];

    // PREVENT DUPLICATES
    const alreadyExists = state.tasks[key].some(t => t.text === text);
    if (alreadyExists) {
        showToast("⚠️ Task already added to planner");
        return; 
    }

    // 2. Add New Task
    state.tasks[key].push({
        id: Date.now() + Math.random().toString(36).substr(2, 9), 
        text, type, subject, chapter, completed: false 
    });
    saveData();
    renderAll();

    // 3. CHECK POINTS & SHOW UPDATED VISUALS
    let pointsFound = 0;
    let detectedType = 'main';
    let detectedSubject = subject; 
    let syllabusRef = [];

    // Scan Main Syllabus Only
    if (state.nextExam) {
        state.nextExam.syllabus.forEach(chap => {
            chap.dailyTests.forEach(dt => {
                dt.subs.forEach(sub => {
                    if (text.includes(sub)) {
                        pointsFound = getSubtopicPoints(dt, chap.subject, chap.topic);
                        detectedType = 'main';
                        detectedSubject = chap.subject; 
                        syllabusRef = state.nextExam.syllabus;
                    }
                });
            });
        });
    }

    // 4. TRIGGER THE NEW VISUAL TOAST
    if (pointsFound > 0) {
        const math = calculateSmartMath(detectedType);
        const planned = getPlannerPointsForToday(detectedType, syllabusRef);
        showPointsToast(pointsFound, planned, math.dailyTargetPoints, detectedSubject, detectedType);
    } else {
        showToast("Task added to planner");
    }
};
      window.deleteGroup = function(chapterName) {
    // ✅ NO CONFIRMATION: Deletes immediately
    const key = formatDateKey(state.selectedDate);
    if(state.tasks[key]) {
        state.tasks[key] = state.tasks[key].filter(t => {
            let chap = t.chapter;
            if (!chap && t.text.startsWith("Study: ")) {
                const parts = t.text.replace("Study: ", "").split(" - ");
                if (parts.length > 1) chap = parts[0];
            }
            return chap !== chapterName;
        });
        
        saveData();
        if (state.expandedFocusGroups[chapterName]) delete state.expandedFocusGroups[chapterName];
        renderAll();
        
        // Optional: Feedback
        showToast(`Deleted group: ${chapterName}`);
    }
};  
        
        window.toggleTask = function(id) {
            const key = formatDateKey(state.selectedDate);
            if(state.tasks[key]) {
                const t = state.tasks[key].find(x => x.id === id);
                if(t) { t.completed = !t.completed; saveData(); }
            }
        };

        window.toggleFocusGroup = function(chapterName) {
            state.expandedFocusGroups[chapterName] = !state.expandedFocusGroups[chapterName];
            renderTasks(); // Re-renders only the tasks list
        };

        window.toggleTestAttempt = function(testName) {
            // FIXED: Explicitly set to false instead of deleting key so that { merge: true } updates the DB correctly
            if (state.dailyTestsAttempted[testName]) {
                 state.dailyTestsAttempted[testName] = false; 
            } else {
                 state.dailyTestsAttempted[testName] = true;
            }
            saveData();
        };

window.switchView = function(view) {
    state.activeView = view;
    toggleMobileMenu(true); // Close mobile menu if open
    
    // 1. Update Buttons Highlighting
  ['overview','target','backlog', 'mistakes', 'leaderboard', 'namaz', 'points'].forEach(v => {
         const btn = document.getElementById(`nav-${v}`);
        if(btn) {
            // Reset all to default style
            btn.className = "group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 hover:translate-x-1";
            
            // Remove any existing active indicators
            const existingDot = btn.querySelector('.active-indicator');
            if(existingDot) existingDot.classList.add('hidden');

            // Apply Active Style
            if(v === view) {
                btn.className = "group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 shadow-sm ring-1 ring-brand-200 dark:ring-brand-800 transition-all";
                if(existingDot) existingDot.classList.remove('hidden');
            }
        }
        
        // Hide all Views
        const viewEl = document.getElementById(`view-${v}`);
        if(viewEl) viewEl.classList.add('hidden');
    });

    // 2. Show Active View
    const activeEl = document.getElementById(`view-${view}`);
    if(activeEl) activeEl.classList.remove('hidden');
    
    // 3. FORCE RENDER (This fixes the blank page issue)
    if(view === 'target') renderSyllabus('main');
    if(view === 'backlog') renderSyllabus('backlog');
    if(view === 'leaderboard') fetchLeaderboard();
    if(view === 'namaz') renderNamazView();
    if(view === 'points') renderPointsAnalytics();
    if(view === 'mistakes') {
        if(state.activeNotebook) renderNotebookEntries();
        else updateShelfCounts();
    }
    if(view === 'overview') renderTasks();
    
    // Initialize icons for the new view
    if(window.lucide) lucide.createIcons();
};

window.toggleMobileMenu = function(forceClose = false) {
    // TARGET THE NEW ID "sidebar" INSTEAD OF "mobile-sidebar"
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (!sidebar) return;

    if (forceClose) {
        // Force Close: Hide sidebar off-screen & hide overlay
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0'); // Ensure it slides out
        if(overlay) overlay.classList.add('hidden');
    } else {
        // Toggle: Slide in or out
        const isClosed = sidebar.classList.contains('-translate-x-full');
        
        if (isClosed) {
            // OPEN IT
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            if(overlay) overlay.classList.remove('hidden');
        } else {
            // CLOSE IT
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            if(overlay) overlay.classList.add('hidden');
        }
    }
};
                
        // --- BOOKSHELF FUNCTIONS ---

        window.openNotebook = function(subject) {
            state.activeNotebook = subject;
            
            // UI Transitions
            document.getElementById('notebook-shelf').classList.add('hidden');
            document.getElementById('notebook-content').classList.remove('hidden');
            
            // Set Headers
            document.getElementById('notebook-title').textContent = `${subject} Notebook`;
            document.getElementById('mistake-subject-display').value = subject;
            
            // Dynamic Header Colors
            const headerBg = document.getElementById('notebook-header-bg');
            if(subject === 'Physics') headerBg.className = "px-6 py-4 border-b border-blue-100 dark:border-blue-900 flex items-center justify-between transition-colors bg-blue-50 dark:bg-blue-900/20";
            else if(subject === 'Chemistry') headerBg.className = "px-6 py-4 border-b border-orange-100 dark:border-orange-900 flex items-center justify-between transition-colors bg-orange-50 dark:bg-orange-900/20";
            else headerBg.className = "px-6 py-4 border-b border-green-100 dark:border-green-900 flex items-center justify-between transition-colors bg-green-50 dark:bg-green-900/20";

            renderNotebookEntries();
        };

        window.closeNotebook = function() {
            state.activeNotebook = null;
            document.getElementById('notebook-content').classList.add('hidden');
            document.getElementById('notebook-shelf').classList.remove('hidden');
            updateShelfCounts();
        };

        // --- IMAGE HANDLING ---

        window.handleImageUpload = function(input) {
            const file = input.files[0];
            if (file) {
                // INCREASED SIZE LIMIT: 800KB (approx 800,000 bytes)
                // This balances larger images with storage stability.
               if(file.size > 1048576) { // 1MB limit                    alert("Image is too large! Please use an image under 800KB.");
                    input.value = ''; // clear
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    // Show preview
                    document.getElementById('upload-placeholder').classList.add('hidden');
                    document.getElementById('image-preview-container').classList.remove('hidden');
                    document.getElementById('image-preview').src = e.target.result;
                    // Store base64 string in hidden input
                    document.getElementById('mistake-image-base64').value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        window.clearImage = function() {
            document.getElementById('mistake-file').value = '';
            document.getElementById('mistake-image-base64').value = '';
            document.getElementById('upload-placeholder').classList.remove('hidden');
            document.getElementById('image-preview-container').classList.add('hidden');
            // Prevent event bubbling if clicking the X
            if(event) event.stopPropagation(); 
        };

        window.viewFullImage = function(src) {
            document.getElementById('full-size-image').src = src;
            document.getElementById('image-viewer-modal').classList.remove('hidden');
        };

        // --- MISTAKE RENDERING & SAVING ---

        window.saveMistake = function(e) {
            e.preventDefault();
            if(!state.activeNotebook) return;

            const type = document.getElementById('mistake-type').value;
            const chapter = document.getElementById('mistake-chapter').value;
            const desc = document.getElementById('mistake-desc').value;
            const answer = document.getElementById('mistake-answer').value; // NEW
            const imgData = document.getElementById('mistake-image-base64').value;

            if(!chapter || !desc) {
                alert("Please fill in Chapter and Question Description");
                return;
            }

            const newMistake = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                subject: state.activeNotebook,
                chapter: chapter,
                type: type,
                desc: desc,
                answer: answer, // NEW
                image: imgData,
                resolved: false
            };

            if(!state.mistakes) state.mistakes = [];
            state.mistakes.unshift(newMistake);

            // Reset Form
            document.getElementById('mistake-form').reset();
            clearImage();
            document.getElementById('add-mistake-modal').classList.add('hidden');

            saveData();
            renderNotebookEntries();
            updateShelfCounts();
        };
        
        window.deleteMistake = function(id) {
            if(confirm("Delete this entry?")) {
                state.mistakes = state.mistakes.filter(m => m.id !== id);
                saveData();
                renderNotebookEntries();
            }
        };

        window.toggleMistakeResolved = function(id) {
            const m = state.mistakes.find(m => m.id === id);
            if(m) {
                m.resolved = !m.resolved;
                saveData();
                renderNotebookEntries();
                updateShelfCounts();
            }
        };

        window.renderNotebookEntries = function() {
            const list = document.getElementById('notebook-entries');
            if(!list || !state.activeNotebook) return;

            list.innerHTML = '';
            
            // Filter by the currently open notebook (Subject)
            const entries = (state.mistakes || []).filter(m => m.subject === state.activeNotebook);

            if(entries.length === 0) {
                list.innerHTML = `
                    <div class="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60">
                        <i data-lucide="book-open" class="w-12 h-12 mb-3"></i>
                        <p>No errors logged in ${state.activeNotebook} yet.</p>
                    </div>`;
            }

            entries.forEach(m => {
                const dateStr = new Date(m.date).toLocaleDateString();
                
                let typeBadge = 'bg-slate-200 text-slate-700';
                if(m.type === 'Conceptual') typeBadge = 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
                if(m.type === 'Silly') typeBadge = 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
                if(m.type === 'Memory') typeBadge = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';

                const html = `
                    <div class="bg-white dark:bg-slate-900 border ${m.resolved ? 'border-green-200 dark:border-green-900' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-0 shadow-sm overflow-hidden group">
                        <div class="p-4 flex flex-col md:flex-row gap-4">
                            <!-- Text Content -->
                             <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2">
        <p class="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[110px]" id="mobile-user-email">Guest</p>
        <button onclick="openProfileModal()" class="shrink-0 p-1.5 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-lg hover:bg-brand-200 transition-colors" aria-label="Edit Profile">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>
    </div>
    <p class="text-[10px] font-medium text-slate-500 dark:text-slate-400" id="mobile-sync-status">Local Storage</p>
</div>                               
                                <div class="mb-2">
                                    <p class="text-xs font-bold text-slate-400 uppercase mb-1">Question / Mistake</p>
                                    <p class="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap ${m.resolved ? 'line-through opacity-60' : ''}">${escapeHtml(m.desc)}</p>
                                </div>
                                
                                <div id="answer-container-${m.id}" class="hidden mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 border-dashed">
                                    <p class="text-xs font-bold text-green-600 dark:text-green-400 uppercase mb-1">Correct Answer / Explanation</p>
                                    <p class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">${escapeHtml(m.answer || 'No answer recorded.')}</p>
                                </div>
                                
                                <button onclick="document.getElementById('answer-container-${m.id}').classList.remove('hidden'); this.classList.add('hidden')" class="mt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                                    <i data-lucide="eye" class="w-3 h-3"></i> Reveal Answer
                                </button>
                            </div>
                            
                            <!-- Thumbnail (if exists) -->
                            ${m.image ? `
                                <div class="w-24 h-24 flex-shrink-0 cursor-zoom-in border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 relative group/img" onclick="viewFullImage('${m.image}')">
                                    <img src="${m.image}" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors"></div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Actions Footer -->
                        <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                            <button onclick="deleteMistake('${m.id}')" class="text-xs text-slate-400 hover:text-red-500 font-medium flex items-center gap-1">
                                <i data-lucide="trash-2" class="w-3 h-3"></i> Delete
                            </button>
                            <button onclick="toggleMistakeResolved('${m.id}')" class="text-xs font-bold flex items-center gap-1 ${m.resolved ? 'text-green-600 dark:text-green-400' : 'text-slate-500 hover:text-brand-600'}">
                                <i data-lucide="${m.resolved ? 'check-circle-2' : 'circle'}" class="w-3 h-3"></i>
                                ${m.resolved ? 'Resolved' : 'Mark Resolved'}
                            </button>
                        </div>
                    </div>
                `;
                list.insertAdjacentHTML('beforeend', html);
            });

            if(window.lucide) lucide.createIcons({ root: list });
        };

        window.updateShelfCounts = function() {
            const counts = { Physics: 0, Chemistry: 0, Biology: 0 };
            (state.mistakes || []).forEach(m => {
                if(counts[m.subject] !== undefined && !m.resolved) counts[m.subject]++;
            });
            
            const pEl = document.getElementById('count-physics');
            const cEl = document.getElementById('count-chemistry');
            const bEl = document.getElementById('count-biology');

            if(pEl) pEl.textContent = `${counts.Physics} Active Errors`;
            if(cEl) cEl.textContent = `${counts.Chemistry} Active Errors`;
            if(bEl) bEl.textContent = `${counts.Biology} Active Errors`;
        };

        window.updateFooterProgress = function() { renderStats(); };
        window.toggleDailyTest = function(uniqueId) { state.expandedTests[uniqueId] = !state.expandedTests[uniqueId]; renderSyllabus(state.activeView === 'backlog' ? 'backlog' : 'main'); };
        window.toggleChapter = function(uniqueId) { state.expandedTests[uniqueId] = !state.expandedTests[uniqueId]; renderSyllabus(state.activeView === 'backlog' ? 'backlog' : 'main'); };
        window.addSyllabusTask = function(txt, type, subject, chapter) { addTask(`Study: ${txt}`, type, subject, chapter); };
        
        // FIXED: Immutable date operation
        window.changeDay = function(d) { 
            const newDate = new Date(state.selectedDate);
            newDate.setDate(newDate.getDate() + d);
            state.selectedDate = newDate;
            renderAll(); 
        };
        
        window.goToToday = function() {
            state.selectedDate = new Date();
            renderAll();
        };


// --- LEADERBOARD LOGIC ---
let leaderboardCache = [];
let activeRankTab = 'overall';

window.switchRankTab = function(tab) {
    activeRankTab = tab;
    ['overall', 'exam', 'backlog', 'tests'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if(btn) {
            if(t === tab) btn.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400 ring-1 ring-black/5 dark:ring-white/10";
            else btn.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200";
        }
    });
    renderLeaderboardList();
};

window.fetchLeaderboard = async function() {
    if (!isFirebaseActive) {
        document.getElementById('leaderboard-list').innerHTML = `<div class="p-8 text-center text-slate-400">Leaderboard requires Cloud Sync. Please log in.</div>`;
        return;
    }
    try {
        // Fetch top 50 users
        const q = query(collection(db, "leaderboard"), orderBy("overallScore", "desc"), limit(50));
        const snapshot = await getDocs(q);
        leaderboardCache = [];
        snapshot.forEach(doc => {
            leaderboardCache.push({ id: doc.id, ...doc.data() });
        });
        renderLeaderboardList();
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        document.getElementById('leaderboard-list').innerHTML = `<div class="p-8 text-center text-red-400">Failed to load rankings.<br>Check Firestore rules.</div>`;
    }
};
window.renderLeaderboardList = function() {
    const list = document.getElementById('leaderboard-list');
    if(!list) return;

    // 1. Get Live Stats for "You" so the list updates instantly when you interact
    const myStats = calculateUserStats();
    
    // 2. Update Profile Card (Top Section)
    const myNameEl = document.getElementById('lb-user-name');
    if(myNameEl) myNameEl.textContent = state.displayName || (currentUser ? currentUser.email.split('@')[0] : "Guest");
    
    // Update Your Pill Stats
    if(document.getElementById('lb-my-exam')) document.getElementById('lb-my-exam').textContent = `${myStats.mainPct}%`;
    if(document.getElementById('lb-my-backlog')) document.getElementById('lb-my-backlog').textContent = `${myStats.blPct}%`;
    // Note: We now use testPct (%) for consistency with the new Fair Rule
    if(document.getElementById('lb-my-tests')) document.getElementById('lb-my-tests').textContent = `${myStats.testPct || 0}%`;
    
    // 3. FILTER & SORT (By Season)
    const currentExamName = state.nextExam.name;
    const headerTitle = document.querySelector('#view-leaderboard h1');
    
    // Add Season Badge to Title
    if(headerTitle) headerTitle.innerHTML = `<i data-lucide="trophy" class="w-5 h-5 text-yellow-500"></i> Leaderboard <span class="hidden md:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full ml-2 align-middle border border-slate-200 dark:border-slate-700">${currentExamName}</span>`;

    let sortedData = [...leaderboardCache]
        .filter(u => u.currentExam === currentExamName) 
        .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));

    // Update My Rank Display
    const myId = currentUser ? currentUser.uid : null;
    const myRankIndex = sortedData.findIndex(u => u.id === myId);
    const myRankEl = document.getElementById('lb-my-rank');
    if(myRankEl) myRankEl.textContent = myRankIndex > -1 ? `#${myRankIndex + 1}` : '-';

    // 4. EMPTY STATE
    if(sortedData.length === 0) {
        list.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-slate-400 opacity-60">
                <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                    <i data-lucide="flag" class="w-8 h-8 text-slate-300 dark:text-slate-600"></i>
                </div>
                <p class="text-sm font-medium">New Season Started!</p>
                <p class="text-xs">Complete a task to be the first.</p>
            </div>`;
        if(window.lucide) lucide.createIcons({ root: list });
        return;
    }

    // 5. RENDER CARDS (New Design)
    list.innerHTML = sortedData.map((user, index) => {
        const isMe = user.id === myId;
        const stats = isMe ? myStats : user; // Use live stats for yourself
        
        // --- RANK STYLING (Gold/Silver/Bronze) ---
        let rankDisplay = `<span class="text-sm font-bold text-slate-500 w-6 text-center">#${index + 1}</span>`;
        let borderClass = "border-slate-200 dark:border-slate-800";
        let bgClass = "bg-white dark:bg-slate-900";

        if (index === 0) {
            rankDisplay = `<div class="w-7 h-7 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center shadow-sm ring-1 ring-yellow-200"><i data-lucide="crown" class="w-3.5 h-3.5 fill-current"></i></div>`;
            borderClass = "border-yellow-400/60 ring-1 ring-yellow-400/20";
            bgClass = "bg-gradient-to-r from-yellow-50/50 to-white dark:from-yellow-900/10 dark:to-slate-900";
        } else if (index === 1) {
            rankDisplay = `<div class="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm ring-1 ring-slate-200 font-bold text-xs">2</div>`;
            borderClass = "border-slate-300 dark:border-slate-600";
        } else if (index === 2) {
            rankDisplay = `<div class="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shadow-sm ring-1 ring-orange-200 font-bold text-xs">3</div>`;
            borderClass = "border-orange-300 dark:border-orange-700";
        }

        // Highlight "Me"
        if (isMe) {
            borderClass = "border-brand-500 ring-1 ring-brand-500 shadow-md shadow-brand-500/10";
            bgClass = "bg-brand-50 dark:bg-brand-900/10";
        }

        // Safe Fallbacks for display
        const dispMain = stats.mainPct || 0;
        const dispBacklog = stats.blPct || 0;
        // Show % if available (new data), otherwise count (old data) to avoid showing "0%" for valid old tests
        const dispTest = (stats.testPct !== undefined) ? `${stats.testPct}%` : (stats.testCount || 0); 

        return `
            <div class="relative flex flex-col gap-3 p-4 rounded-2xl border ${borderClass} ${bgClass} mb-3 transition-transform active:scale-[0.99]">
                
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        ${rankDisplay}
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                                ${user.displayName || 'User'}
                                ${isMe ? '<span class="bg-brand-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide">YOU</span>' : ''}
                            </span>
                            <span class="text-[10px] text-slate-400 font-medium">Rank ${index + 1}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="block text-lg font-black text-brand-600 dark:text-brand-400 leading-none">${stats.overallScore || 0}</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Points</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2 mt-1">
                    <div class="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-2 rounded-lg border border-slate-100 dark:border-white/5">
                        <div class="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <i data-lucide="target" class="w-3.5 h-3.5"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="text-[9px] text-slate-400 font-bold uppercase truncate">Exam</div>
                            <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${dispMain}%</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-2 rounded-lg border border-slate-100 dark:border-white/5">
                        <div class="w-6 h-6 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                            <i data-lucide="history" class="w-3.5 h-3.5"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="text-[9px] text-slate-400 font-bold uppercase truncate">Backlog</div>
                            <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${dispBacklog}%</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-2 rounded-lg border border-slate-100 dark:border-white/5">
                        <div class="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <i data-lucide="file-check" class="w-3.5 h-3.5"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="text-[9px] text-slate-400 font-bold uppercase truncate">Tests</div>
                            <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${dispTest}</div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }).join('');

    if(window.lucide) lucide.createIcons({ root: list });
    updateSidebarBadges();
};     
// --- PROFILE FUNCTIONS ---
    window.openProfileModal = function() {
        const input = document.getElementById('profile-name-input');
        if(state.displayName) input.value = state.displayName;
        document.getElementById('profile-modal').classList.remove('hidden');
        input.focus();
    };

    window.saveProfileName = function() {
        const input = document.getElementById('profile-name-input');
        const newName = input.value.trim();
        
        if(newName) {
            state.displayName = newName;
            if(isFirebaseActive && currentUser) {
                const docRef = getSafeDocRef(currentUser.uid);
                setDoc(docRef, { displayName: newName }, { merge: true });
            } else {
                localStorage.setItem('studyflow_username', newName);
            }
            saveData();
        }
        document.getElementById('profile-modal').classList.add('hidden');
        renderHeader(); 
    };


window.updateSidebarBadges = function() {
    // 1. Mistake Badge (Count unresolved)
    const mistakeCount = (state.mistakes || []).filter(m => !m.resolved).length;
    const mBadge = document.getElementById('badge-mistakes');
    if(mBadge) {
        mBadge.textContent = mistakeCount;
        if(mistakeCount > 0) mBadge.classList.remove('hidden');
        else mBadge.classList.add('hidden');
    }

    // 2. Backlog Phase Badge
    const bBadge = document.getElementById('badge-backlog');
    if(bBadge && typeof backlogPlan !== 'undefined') {
        const planStart = backlogPlan.startDate || new Date();
        const diffDays = Math.ceil((new Date() - planStart) / (1000 * 60 * 60 * 24)); 
        let phase = 1;
        if(diffDays > 45) phase = 4;
        else if(diffDays > 30) phase = 3;
        else if(diffDays > 15) phase = 2;
        
        bBadge.textContent = `Ph ${phase}`;
        bBadge.classList.remove('hidden');
    }

    // 3. Leaderboard Rank (From Cache)
    const rBadge = document.getElementById('badge-rank');
    if(rBadge && leaderboardCache.length > 0 && currentUser) {
        const myRank = leaderboardCache.findIndex(u => u.id === currentUser.uid);
        if(myRank > -1) {
            rBadge.textContent = `#${myRank + 1}`;
            rBadge.classList.remove('hidden');
        }
    }
};

// --- PLANNER FUNCTIONS ---



window.initScrollHeader = function() {
    // 🛑 LOGIC DISABLED for GitHub Style
    const headerEl = document.getElementById('overview-header');
    if(headerEl) headerEl.style.transform = "none";
};

document.addEventListener('DOMContentLoaded', init);
        // Optimization: FOUC listener - Triggered on DOMContentLoaded instead of Load for faster paint
        document.addEventListener('DOMContentLoaded', () => {
            // Small timeout to allow Tailwind CDN to parse initial classes
            setTimeout(() => document.body.classList.add('loaded'), 50);
        });

        // UTILITY: Debounce for search performance
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        // Global search handler with debounce
        const debouncedRender = debounce((query, type) => {
            renderSyllabus(type, query);
        }, 300); // 300ms delay

        window.handleSearch = function(query, type) {
            debouncedRender(query, type);
        };

        
window.renderAll = function() {
    renderHeader();
renderHeaderPrayerWidget();
    renderStats();
    updateSidebarBadges();


    // Performance Optimization: Lazy Rendering
    if (state.activeView === 'overview') {
        renderTasks();
            } else if (state.activeView === 'target') {
        renderSyllabus('main');
    } else if (state.activeView === 'backlog') {
        renderSyllabus('backlog');
    } else if (state.activeView === 'mistakes') {
        if(state.activeNotebook) {
            renderNotebookEntries();
        } else {
            updateShelfCounts();
        }
    } else if (state.activeView === 'namaz') {
        renderNamazView();
    } else if (state.activeView === 'leaderboard') {
        renderLeaderboardList();
    }
    else if (state.activeView === 'points') {
        renderPointsAnalytics();
    }
    // Re-scan icons if library is loaded
    if(window.lucide) lucide.createIcons();
};

window.renderTasks = renderTasks;


window.renderHeader = function() {
    const container = document.getElementById('header-dynamic-greeting');
    if (!container) return;

    // 1. IF OVERVIEW: Show Date Switcher
    if (state.activeView === 'overview') {
        const isToday = formatDateKey(state.selectedDate) === formatDateKey(new Date());
        
        // Format: "Jan 30" or "Today"
        const dateDisplay = isToday 
            ? `<span class="font-extrabold text-brand-600 dark:text-brand-400">Today</span>` 
            : state.selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        container.innerHTML = `
            <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in zoom-in duration-200">
                <button onclick="changeDay(-1)" class="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-all active:scale-90" aria-label="Previous Day">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                </button>
                
                <button onclick="goToToday()" class="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[80px] text-center active:scale-95 transition-transform" title="Jump to Today">
                    ${dateDisplay}
                </button>

                <button onclick="changeDay(1)" class="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-all active:scale-90" aria-label="Next Day">
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    } 
    // 2. OTHER VIEWS: Show Page Title
    else {
        const titles = {
            'target': 'Target Syllabus',
            'backlog': 'Recovery Plan',
            'mistakes': 'Mistake Notebook',
            'leaderboard': 'Leaderboard',
            'namaz': 'Spiritual Growth',
            'points': 'Points Analytics'
        };
        const title = titles[state.activeView] || 'StudyFlow';
        
        container.innerHTML = `
            <h1 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight px-1 flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-200">
                ${title}
            </h1>
        `;
    }

    // 3. Render Widgets (Prayer Strip)
    if(typeof window.renderHeaderPrayerWidget === 'function') {
        window.renderHeaderPrayerWidget();
    }
    
    // 4. Refresh Icons
    if(window.lucide) lucide.createIcons({ root: container });
};

// ✅ RESTORED: This function was missing!
window.renderHeaderPrayerWidget = function() {
    const container = document.getElementById('header-prayer-widget');
    if (!container) return;

    const k = formatDateKey(state.selectedDate);
    const todayData = state.prayers[k] || {};
    
    const prayers = [
        { key: 'Fajr', label: 'F' },
        { key: 'Dhuhr', label: 'D' },
        { key: 'Asr', label: 'A' },
        { key: 'Maghrib', label: 'M' },
        { key: 'Isha', label: 'I' }
    ];

    container.innerHTML = prayers.map(p => {
        const isDone = todayData[p.key] === true;
        
        let baseClass = "flex-1 md:flex-none h-9 w-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm";
        
        let stateClass = isDone 
            ? "bg-emerald-500 text-white !border-emerald-500 shadow-md shadow-emerald-500/30 scale-105" 
            : "text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700";

        return `
            <button onclick="togglePrayer('${p.key}')" class="${baseClass} ${stateClass}" title="Mark ${p.key} as done">
                ${isDone ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : p.label}
            </button>
        `;
    }).join('');

    if(window.lucide) lucide.createIcons({ root: container });
};
// ==========================================
// 🚀 TACTICAL DASHBOARD V4 (Strict Phases + Total %)
// ==========================================

window.renderStats = function() {
    const container = document.getElementById('stats-container');
    if (!container) return;

    // --- 1. CONFIGURATION ---
    const now = new Date();
    const phaseEnd = state.nextExam.date;
    
    // Determine Current Test (AIATS 7 before Feb 22, AIATS 6 after)
    const aiats7Date = new Date('2026-02-22T23:59:59');
    const currentTestName = now < aiats7Date ? "AIATS-7" : "AIATS-6";
    const currentTestTarget = now < aiats7Date ? aiats7Date : new Date('2026-03-08T00:00:00');

    // --- 2. HELPER: CALCULATE PROGRESS FOR A SPECIFIC CATEGORY ---
    const calculateCategoryStats = (categoryFilter) => {
        const syllabus = state.nextExam.syllabus.filter(item => {
            if (categoryFilter === 'ALL') return true;
            if (categoryFilter === 'TEST') return item.category === currentTestName;
            return item.category === categoryFilter;
        });

        let total = 0, earned = 0;
        const allCompleted = new Set(Object.values(state.tasks).flat().filter(t => t.completed).map(t => t.text));

        syllabus.forEach(chap => {
            chap.dailyTests.forEach(dt => {
                const subPts = 1; // Simplify points for visual clarity
                dt.subs.forEach(sub => {
                    total += subPts;
                    if (allCompleted.has(`Study: ${chap.topic} - ${sub}`) || state.dailyTestsAttempted[dt.name]) {
                        earned += subPts;
                    }
                });
            });
        });

        const pct = total === 0 ? 0 : Math.round((earned / total) * 100);
        return { total, earned, pct };
    };

    // --- 3. GET STATS ---
    const statsPhase1 = calculateCategoryStats('ALL');
    const statsTest   = calculateCategoryStats('TEST');
    const statsBio    = calculateCategoryStats('Bio-11');
    const statsOrganic= calculateCategoryStats('Organic');

    // Helper for days left
    const getDaysLeft = (target) => Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

    // --- 4. RENDER CARDS ---
    const createCard = (title, subtitle, stats, color, icon, days) => `
        <div class="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <i data-lucide="${icon}" class="w-16 h-16 text-${color}-500"></i>
            </div>
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-lg text-slate-800 dark:text-white leading-tight">${title}</h3>
                        <p class="text-xs font-bold text-${color}-600 dark:text-${color}-400 uppercase tracking-wide mt-0.5">${subtitle}</p>
                    </div>
                    <div class="text-right">
                        <span class="block text-2xl font-black text-slate-900 dark:text-white">${stats.pct}%</span>
                    </div>
                </div>
                
                <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div class="h-full bg-${color}-500 transition-all duration-1000" style="width: ${stats.pct}%"></div>
                </div>
                
                <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>${stats.earned}/${stats.total} Pts</span>
                    <span>${days} Days Left</span>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            ${createCard("Phase 1 Total", "Feb 10 - Mar 08", statsPhase1, "brand", "layers", getDaysLeft(phaseEnd))}
            ${createCard(currentTestName, "Current Focus", statsTest, "rose", "crosshair", getDaysLeft(currentTestTarget))}
            ${createCard("11th Biology", "Whole Syllabus", statsBio, "emerald", "dna", getDaysLeft(phaseEnd))}
            ${createCard("Organic Chem", "Except GOC (11th)", statsOrganic, "amber", "flask-conical", getDaysLeft(phaseEnd))}
        </div>
    `;

    if(window.lucide) lucide.createIcons({ root: container });
};
 function createTaskElementHTML(t, isSubTask = false) {
            // Updated Styles for "Pill" look
            let wrapperClass = "group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border relative overflow-hidden ";
            
            if (t.type === 'main') {
                wrapperClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md dark:hover:shadow-none hover:shadow-brand-500/5";
            } else if (t.type === 'backlog') {
                wrapperClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md hover:shadow-orange-500/5";
            } else {
                wrapperClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm";
            }

            // Subtasks (inside groups) get a slightly different look
            if(isSubTask) {
                wrapperClass = "flex items-center justify-between p-2.5 pl-4 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all mb-1";
            }

            // Completed State
            if (t.completed) {
                wrapperClass += " opacity-60 grayscale";
            }

            // Tags
            let typeColorClass = t.type === 'main' 
                ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-300' 
                : (t.type === 'backlog' ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300' : 'text-slate-500 bg-slate-100 dark:bg-slate-800');
            
            let subjectColor = getSubjectColor(t.subject).replace('bg-', 'bg-opacity-50 bg-'); // Make lighter

            let displayText = t.text;
            if(isSubTask && t.chapter) {
                 const prefix = `Study: ${t.chapter} - `;
                 if(displayText.startsWith(prefix)) displayText = displayText.substring(prefix.length);
            }

            // Safe HTML escape to match your security standards
            const safeText = escapeHtml(displayText);

            return `
                <div class="${wrapperClass}">
                    ${t.completed ? '<div class="absolute inset-0 bg-slate-100/50 dark:bg-black/50 z-0 pointer-events-none"></div>' : ''}
                    
                    <div class="flex items-center gap-4 overflow-hidden cursor-pointer flex-1 relative z-10" onclick="toggleTask('${t.id}')">
                        <div class="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${t.completed ? 'bg-green-500 border-green-500 scale-110' : 'border-slate-300 dark:border-slate-600 hover:border-brand-400'}">
                            <i data-lucide="check" class="w-3.5 h-3.5 text-white transform ${t.completed ? 'scale-100' : 'scale-0'} transition-transform duration-200"></i>
                        </div>
                        
                        <div class="flex flex-col min-w-0">
                            <span class="truncate text-sm font-semibold ${t.completed ? 'text-slate-400 line-through decoration-2 decoration-slate-300' : 'text-slate-800 dark:text-slate-200'}">${safeText}</span>
                            
                            ${!isSubTask ? `
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${subjectColor}">${t.subject}</span>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColorClass}">${t.type === 'main' ? 'Exam Prep' : (t.type === 'backlog' ? 'Backlog' : 'Task')}</span>
                            </div>` : ''}
                        </div>
                    </div>
                    
                    <button onclick="deleteTask('${t.id}')" class="relative z-10 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all" aria-label="Delete Task">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        }       

function renderTasks() {

            const list = document.getElementById('overview-task-list');
            if(!list) return;
            const k = formatDateKey(state.selectedDate);
            const tasks = state.tasks[k] || [];
            
            list.innerHTML = '';

            // --- IMPROVED LOGIC: DETECT "READY" TESTS ONLY ---
            
            // 1. Snapshot of all completed tasks
            const allCompleted = new Set(Object.values(state.tasks).flat().filter(t => t.completed).map(t => t.text));
            const readyTests = [];

            // 2. Scan Syllabus
            function scanSyllabus(syllabusArray, source) {
                if(!syllabusArray) return;
                
                syllabusArray.forEach(chapter => {
                    chapter.dailyTests.forEach(test => {
                        // Skip if already done
                        if(state.dailyTestsAttempted[test.name]) return;

                        // Check subtopics
                        const missingSubs = [];
                        test.subs.forEach(sub => {
                            const expectedTaskName = `Study: ${chapter.topic} - ${sub}`;
                            if(!allCompleted.has(expectedTaskName)) {
                                missingSubs.push(sub);
                            }
                        });

                        const total = test.subs.length;
                        const missingCount = missingSubs.length;

                        // Case A: Fully Ready (All topics done)
                        if(missingCount === 0 && total > 0) {
                            readyTests.push({
                                name: test.name,
                                topic: chapter.topic,
                                subject: chapter.subject,
                                subs: test.subs,
                                source: source
                            });
                        }
                    });
                });
            }

            // 3. Run Scan
            if(state.nextExam) scanSyllabus(state.nextExam.syllabus, 'main');
            if(typeof backlogPlan !== 'undefined') scanSyllabus(backlogPlan.syllabus, 'backlog');

     
// 4. Render "READY" Cards (Smart Grouping - ALWAYS BUNDLE)
            if(readyTests.length > 0) {
                // Helper to generate a single card HTML
                const generateCard = (test, isGrouped = false) => {
                    const subSummary = test.subs.slice(0, 3).join(', ') + (test.subs.length > 3 ? '...' : '');
                    const safeTestName = test.name.replace(/'/g, "\\'");
                    
                    return `
                    <div class="${isGrouped ? 'mb-3 last:mb-0' : 'mb-6'} bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group animate-in slide-in-from-top-2 fade-in duration-300">
                        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><i data-lucide="award" class="w-24 h-24 rotate-12"></i></div>
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <span class="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">Unlocked</span>
                                    <h3 class="text-xl font-bold text-white tracking-tight mt-1">${test.name}</h3>
                                    <p class="text-xs text-emerald-100 font-medium">Topic: ${test.topic}</p>
                                </div>
                                <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm shadow-sm animate-pulse"><i data-lucide="unlock" class="w-6 h-6 text-white"></i></div>
                            </div>
                            <div class="bg-black/10 rounded-lg p-2 mb-4">
                                <p class="text-[10px] uppercase font-bold text-emerald-200 mb-1">Includes</p>
                                <p class="text-xs text-white/90 font-medium truncate">${subSummary}</p>
                            </div>
                            <button onclick="confetti({particleCount: 150, spread: 60, origin: { y: 0.7 }}); toggleTestAttempt('${safeTestName}'); renderAll();" class="w-full bg-white text-emerald-700 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <i data-lucide="check-circle-2" class="w-4 h-4"></i> Attempt & Mark Done
                            </button>
                        </div>
                    </div>`;
                };

                // --- ALWAYS BUNDLE LOGIC ---
                const bundleId = `unlock-bundle-${Date.now()}`;
                
                const finalHtml = `
                <div class="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-1 shadow-xl shadow-indigo-500/20 animate-in slide-in-from-top-2 fade-in duration-300 cursor-pointer select-none group" onclick="const el = document.getElementById('${bundleId}'); el.classList.toggle('hidden'); this.querySelector('.arrow-icon').classList.toggle('rotate-180');">
                    <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg flex justify-between items-center border border-white/10 hover:bg-white/20 transition-all">
                        <div class="flex items-center gap-4">
                            <div class="bg-white p-2.5 rounded-xl text-indigo-600 shadow-sm relative">
                                <i data-lucide="layers" class="w-6 h-6"></i>
                                <div class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-indigo-600">
                                    ${readyTests.length}
                                </div>
                            </div>
                            <div class="text-white">
                                <h3 class="font-bold text-lg leading-tight">Tests Ready!</h3>
                                <p class="text-xs text-indigo-100 font-medium opacity-80">Tap to expand stack</p>
                            </div>
                        </div>
                        <div class="bg-black/20 p-2 rounded-full arrow-icon transition-transform duration-300">
                            <i data-lucide="chevron-down" class="w-5 h-5 text-white"></i>
                        </div>
                    </div>
                </div>
                
                <div id="${bundleId}" class="hidden pl-2 border-l-2 border-indigo-100 dark:border-indigo-900/30 mb-8 space-y-4">
                    ${readyTests.map(test => generateCard(test, true)).join('')}
                </div>
                `;

                list.insertAdjacentHTML('beforeend', finalHtml);
            }

            // --- END NEW LOGIC ---

            // --- STANDARD TASK RENDERING ---
            if(tasks.length === 0 && readyTests.length === 0) {
                list.innerHTML = `<div class="h-40 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-sm"><i data-lucide="coffee" class="w-8 h-8 mb-2 opacity-50"></i>No focus targets set.</div>`;
                if(window.lucide) lucide.createIcons({ root: list });        
                return;
            }

            const groups = {};
            const standalone = [];
            tasks.forEach(t => {
                let chap = t.chapter;
                if (!chap && t.text.startsWith("Study: ")) {
                    const parts = t.text.replace("Study: ", "").split(" - ");
                    if (parts.length > 1) chap = parts[0];
                }
                if (chap) {
                    if (!groups[chap]) groups[chap] = { name: chap, tasks: [], subject: t.subject, type: t.type };
                    groups[chap].tasks.push(t);
                } else standalone.push(t);
            });

            standalone.forEach(t => {
                const el = document.createElement('div');
                el.innerHTML = createTaskElementHTML(t, false);
                list.appendChild(el.firstElementChild);
            });

            Object.values(groups).forEach(group => {
                const isExpanded = state.expandedFocusGroups[group.name];
                const completedCount = group.tasks.filter(t => t.completed).length;
                const totalCount = group.tasks.length;
                const isAllDone = totalCount > 0 && completedCount === totalCount;
                
                let groupBorder = 'border-slate-200 dark:border-slate-800';
                let groupBg = 'bg-white dark:bg-slate-900';
                if(group.type === 'main') { groupBorder = 'border-brand-200 dark:border-brand-900'; groupBg = 'bg-brand-50/30 dark:bg-brand-900/10'; }
                if(group.type === 'backlog') { groupBorder = 'border-orange-200 dark:border-orange-900'; groupBg = 'bg-orange-50/30 dark:bg-orange-900/10'; }
                
                let typeBadge = '';
                if (group.type === 'main') typeBadge = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">Exam</span>`;
                else if (group.type === 'backlog') typeBadge = `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">Backlog</span>`;
                
                const safeGroupName = group.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                const escapeQuote = (str) => str.replace(/'/g, "\\'");

                const groupContainer = document.createElement('div');
                groupContainer.className = `rounded-xl border ${groupBorder} ${groupBg} overflow-hidden mb-2 transition-all shadow-sm group`;
                
                const headerHtml = `
                    <div class="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-50 transition-colors" onclick="toggleFocusGroup('${escapeQuote(group.name)}')">
                        <div class="flex items-center gap-3">
                            <div class="p-1.5 rounded-lg ${isAllDone ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-white dark:bg-slate-800 shadow-sm text-slate-500 dark:text-slate-400'}">
                                <i data-lucide="${isAllDone ? 'check-circle' : 'book-open'}" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">${safeGroupName}</h4>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <span class="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">${group.subject}</span>
                                    ${typeBadge}
                                    <span class="text-[9px] font-medium text-slate-400">•</span>
                                    <span class="text-[9px] font-medium ${isAllDone ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}">${completedCount}/${totalCount} Done</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="deleteGroup('${escapeQuote(group.name)}'); event.stopPropagation();" class="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100" title="Delete Chapter">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}"></i>
                        </div>
                    </div>
                `;
                
                let bodyHtml = '';
                if (isExpanded) {
                    const taskListHtml = group.tasks.map(t => createTaskElementHTML(t, true)).join('');
                    bodyHtml = `
                        <div class="border-t ${groupBorder} p-2 pl-4 bg-white/50 dark:bg-slate-900/50 animate-in fade-in slide-in-from-top-1 duration-200">
                            ${taskListHtml}
                        </div>
                    `;
                }
                groupContainer.innerHTML = headerHtml + bodyHtml;
                list.appendChild(groupContainer);
            });
            
            if(window.lucide) lucide.createIcons({ root: list });
        }
// Global state for the active tab (Defaults to AIATS-7 as it's the priority)
let activeSyllabusTab = "AIATS-7"; 

window.renderSyllabus = function(type, searchQuery = '') {
    const container = document.getElementById(type === 'main' ? 'main-syllabus-container' : 'backlog-syllabus-container');
    const filterContainer = document.getElementById('syllabus-filters');
    
    // Cleanup old tabs if they exist
    if (filterContainer) filterContainer.innerHTML = ''; 
    
    if(!container) return;
    
    if (type === 'backlog') {
        container.innerHTML = `<div class="p-8 text-center text-slate-500">All targets merged into Phase 1.</div>`;
        return;
    }

    container.innerHTML = '';
    const rawData = state.nextExam.syllabus;
    
    // Group Data
    const grouped = { "AIATS-7": [], "Organic": [], "Bio-11": [], "AIATS-6": [] };
    rawData.forEach(item => {
        if(grouped[item.category]) grouped[item.category].push(item);
        else grouped["AIATS-7"].push(item);
    });

    const displayOrder = ["AIATS-7", "Organic", "Bio-11", "AIATS-6"];
    const allCompleted = new Set(Object.values(state.tasks).flat().filter(t => t.completed).map(t => t.text));
    const k = formatDateKey(state.selectedDate);
    const todaysTasks = new Set((state.tasks[k] || []).map(t => t.text));
    const lowerQuery = searchQuery.toLowerCase().trim();

    displayOrder.forEach((category, catIndex) => {
        const items = grouped[category];
        if(!items || items.length === 0) return;

        // Section Styling
        let milestoneColor = "slate", milestoneTitle = category, milestoneDesc = "Upcoming", isActive = false;

        if(category === "AIATS-7") { 
            milestoneColor = "rose"; milestoneTitle = "🔥 AIATS-7 SPRINT"; milestoneDesc = "High Priority • Due Feb 22"; isActive = true;
        } else if(category === "Organic") {
            milestoneColor = "amber"; milestoneTitle = "🧪 Organic Chemistry"; milestoneDesc = "Daily Habit Track";
        } else if(category === "Bio-11") {
            milestoneColor = "emerald"; milestoneTitle = "🌿 Class 11 Biology"; milestoneDesc = "Daily Reading Track";
        } else {
            milestoneColor = "blue"; milestoneTitle = "🏁 AIATS-6"; milestoneDesc = "Starts after Feb 22";
        }

        // Render Section Header
        const section = document.createElement('div');
        section.className = "relative pl-8 pb-8 last:pb-0";
        if (catIndex < displayOrder.length - 1) section.innerHTML += `<div class="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800"></div>`;
        section.innerHTML += `<div class="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-${milestoneColor}-500 shadow-sm z-10"></div>`;
        section.innerHTML += `<div class="mb-4"><h3 class="text-lg font-black text-slate-800 dark:text-white leading-none">${milestoneTitle}</h3><p class="text-xs font-bold text-${milestoneColor}-600 dark:text-${milestoneColor}-400 uppercase tracking-wide mt-1">${milestoneDesc}</p></div>`;

        const contentDiv = document.createElement('div');
        contentDiv.className = "space-y-3";

        items.forEach((item, idx) => {
            // Search Filter
            const chapterMatch = item.topic.toLowerCase().includes(lowerQuery) || item.subject.toLowerCase().includes(lowerQuery);
            const matchingTests = item.dailyTests.filter(dt => {
                if (chapterMatch) return true; 
                return dt.name.toLowerCase().includes(lowerQuery) || dt.subs.some(sub => sub.toLowerCase().includes(lowerQuery));
            });
            if (lowerQuery && !chapterMatch && matchingTests.length === 0) return;

            const chapterId = `roadmap-${category}-${idx}`;
            
            // ✅ THE FIX IS HERE: Respect 'false' if user closed it
            // Logic: 1. Search? True. 2. User clicked? Use saved state. 3. Default? Expand first 2 of active group.
            const isExpanded = lowerQuery ? true : (state.expandedTests[chapterId] !== undefined ? state.expandedTests[chapterId] : (isActive && idx < 2));
            
            const allDone = item.dailyTests.every(dt => state.dailyTestsAttempted[dt.name]);
            const borderClass = isActive ? `border-${milestoneColor}-200 dark:border-${milestoneColor}-900` : "border-slate-200 dark:border-slate-800";
            
            const card = document.createElement('div');
            card.className = `bg-white dark:bg-slate-900 border ${borderClass} rounded-xl overflow-hidden shadow-sm transition-all ${allDone ? "opacity-60 grayscale" : "opacity-100"}`;
            
            let html = `
                <div class="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 select-none" onclick="toggleChapter('${chapterId}')">
                    <div class="flex items-center gap-3">
                        <div class="w-1 h-8 rounded-full bg-${milestoneColor}-500"></div>
                        <div>
                            <div class="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">${item.subject}</div>
                            <div class="font-bold text-sm text-slate-800 dark:text-white leading-tight">${item.topic.replace(/'/g, "&#039;")}</div>
                        </div>
                    </div>
                    ${allDone ? `<i data-lucide="check-circle-2" class="w-5 h-5 text-green-500 fill-green-100 dark:fill-green-900"></i>` : `<i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>`}
                </div>
            `;

            if (isExpanded) {
                html += `<div class="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-2 grid gap-2">`;
                (lowerQuery ? matchingTests : item.dailyTests).forEach((dt, dtIdx) => {
                    const testId = `${chapterId}-dt-${dtIdx}`;
                    const isTestExpanded = lowerQuery ? true : state.expandedTests[testId];
                    const isAttempted = state.dailyTestsAttempted[dt.name];
                    const doneCount = dt.subs.filter(s => allCompleted.has(`Study: ${item.topic} - ${s}`)).length;
                    const total = dt.subs.length;

                    html += `
                    <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div class="p-2.5 flex items-center justify-between cursor-pointer" onclick="toggleDailyTest('${testId}')">
                            <div class="flex items-center gap-3">
                                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400 transition-transform ${isTestExpanded ? 'rotate-90' : ''}"></i>
                                <div class="flex items-center gap-2" onclick="event.stopPropagation()">
                                    <input type="checkbox" ${isAttempted ? 'checked' : ''} onchange="toggleTestAttempt('${dt.name.replace(/'/g, "\\'")}')" class="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer">
                                    <span class="text-xs font-bold ${isAttempted ? 'text-green-600 line-through opacity-60' : 'text-slate-700 dark:text-slate-200'}">${dt.name}</span>
                                </div>
                            </div>
                            <span class="text-[10px] font-bold text-slate-400">${doneCount}/${total}</span>
                        </div>
                        ${isTestExpanded ? `
                        <div class="px-8 pb-3 space-y-1">
                            ${dt.subs.map(sub => {
                                const isDone = allCompleted.has(`Study: ${item.topic} - ${sub}`);
                                const isAdded = todaysTasks.has(`Study: ${item.topic} - ${sub}`);
                                return `
                                <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 -mx-2 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <span class="${isDone ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'} truncate pr-2">${sub}</span>
                                    ${!isDone ? `<button onclick="addSyllabusTask('Study: ${item.topic.replace(/'/g, "\\'")} - ${sub.replace(/'/g, "\\'")}', 'main', '${item.subject}', '${item.topic.replace(/'/g, "\\'")}')" class="text-brand-500 hover:text-brand-600"><i data-lucide="${isAdded ? 'check' : 'plus'}" class="w-3.5 h-3.5"></i></button>` : ''}
                                </div>`;
                            }).join('')}
                        </div>` : ''}
                    </div>`;
                });
                html += `</div>`;
            }
            card.innerHTML = html;
            contentDiv.appendChild(card);
        });
        section.appendChild(contentDiv);
        container.appendChild(section);
    });

    if(window.lucide) lucide.createIcons({ root: container });
};
// --- NEW HELPER FUNCTION ---
window.switchSyllabusTab = function(tabName) {
    activeSyllabusTab = tabName;
    renderSyllabus('main');
};
      
    // --- MODAL CONTROLLER ---
const modal = document.getElementById('customModal');
const backdrop = document.getElementById('modalBackdrop');
const card = document.getElementById('modalCard');
const icon = document.getElementById('modalIcon');
const iconBg = document.getElementById('modalIconBg');
const title = document.getElementById('modalTitle');
const msg = document.getElementById('modalMessage');
const btn = document.getElementById('modalBtn');

// FIX: Must use 'window.' so other functions can call it
window.showPopup = function(type, header, text) {
    // 1. Setup Colors based on Type
    if (type === 'error') {
        // Red Style
        iconBg.className = "mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-red-100 dark:bg-red-900/30";
        icon.className = "h-8 w-8 text-red-600 dark:text-red-400";
        icon.setAttribute('data-lucide', 'alert-circle');
        btn.className = "w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20";
    } else if (type === 'success') {
        // Green Style
        iconBg.className = "mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-green-100 dark:bg-green-900/30";
        icon.className = "h-8 w-8 text-green-600 dark:text-green-400";
        icon.setAttribute('data-lucide', 'check-circle-2');
        btn.className = "w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/20";
    } else {
        // Blue/Info Style
        iconBg.className = "mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-blue-100 dark:bg-blue-900/30";
        icon.className = "h-8 w-8 text-blue-600 dark:text-blue-400";
        icon.setAttribute('data-lucide', 'info');
        btn.className = "w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20";
    }

    // 2. Set Content
    title.innerText = header;
    msg.innerText = text;
    if(window.lucide) lucide.createIcons();

    // 3. Show Animation
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 10);
};

// FIX: Must use 'window.' so the HTML onclick="closeModal()" can see it
window.closeModal = function() {
    backdrop.classList.add('opacity-0');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    
setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); 
};

// --- FINAL "BALANCED REALISM" SNOW ENGINE ---
let snowActive = false;
let snowFrameId = null;
let snowLedges = []; 
let flakeImage = null; // Stores the pre-rendered snowflake image

// UI Toggles
window.toggleSnow = function() {
    snowActive = !snowActive;
    localStorage.setItem('studyflow_snow', snowActive);
    updateSnowUI();
    if(snowActive) startSnow();
    else stopSnow();
};

function updateSnowUI() {
    const transform = snowActive ? 'translateX(16px)' : 'translateX(0)';
    ['snow-dot-pc', 'snow-dot-mobile'].forEach(id => {
        const dot = document.getElementById(id);
        if(dot) {
            dot.style.transform = transform;
            dot.parentElement.className = `relative w-8 h-4 rounded-full transition-colors ${snowActive ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'}`;
        }
    });
}

// 1. PERFORMANCE: PRE-RENDER FLAKE (Zero Lag)
function preRenderFlake() {
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');

    // Draw a soft, white, fluffy circle ONCE
    const grad = ctx.createRadialGradient(10, 10, 0, 10, 10, 10);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Center core
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)'); // Fluffy mid
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fade out
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(10, 10, 10, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
}

// 2. MAIN ENGINE
function startSnow() {
    const canvas = document.getElementById('snow-canvas');
    if(!canvas) return;
    
    // Create the sprite once
    if(!flakeImage) flakeImage = preRenderFlake();

    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

const maxFalling = 400; 
    const fallingFlakes = [];
    let landedFlakes = []; 

    // LEDGE SCANNER
    function updateSurfaces() {
        snowLedges = [];
        // We select ALL containers to ensure bottom cards get recognized
        const elements = document.querySelectorAll('header, button, .rounded-xl, .rounded-2xl, .rounded-3xl, nav');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Only add if visible on screen
            if(rect.bottom > 0 && rect.top < height && rect.width > 0) {
                snowLedges.push({
                    top: rect.top + 3, // Slight overlap
                    left: rect.left,
                    right: rect.right
                });
            }
        });
    }
    updateSurfaces();
    window.addEventListener('scroll', () => { if(snowActive) updateSurfaces(); }, { passive: true });

    // SPAWN PARTICLES (Everywhere on screen immediately)
    for(let i = 0; i < maxFalling; i++) {
        fallingFlakes.push(createFlake(width, height, true));
    }

    // ANIMATION LOOP
    let globalTime = 0;
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        globalTime += 0.01;
        
        // WIND PHYSICS: Sine wave + Random Gusts
        const baseWind = Math.sin(globalTime * 0.2) * 0.5; // Gentle sway
        const gust = Math.sin(globalTime * 1.5) * 0.2; // Fast random gusts
        const windSpeed = baseWind + gust; 

        // A. DRAW LANDED FLAKES
        landedFlakes = landedFlakes.filter(f => {
            f.meltTime--;
            if(f.meltTime <= 0) return false;

            // Fade out as it melts
            ctx.globalAlpha = f.meltTime < 60 ? f.meltTime / 60 : 0.8;
            ctx.drawImage(flakeImage, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
            return true;
        });

        // B. DRAW FALLING FLAKES
        fallingFlakes.forEach(f => {
            // Depth-based Opacity (Far flakes = dim)
            ctx.globalAlpha = f.z * 0.9;
            
            // Draw Cached Image
            ctx.drawImage(flakeImage, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);

            // Move
            f.y += f.speed; 
            // Sway logic: Wind affects lighter/closer flakes differently
            f.x += windSpeed * f.z + Math.sin(globalTime * 2 + f.swayOffset) * (0.3 * f.z);

            // COLLISION (Accumulation)
            // Only check collision for flakes that are "close" (Z > 0.6)
            if (f.y < height && f.y > 0 && f.z > 0.6) {
                for (let ledge of snowLedges) {
                    if (Math.abs(f.y - ledge.top) < 6 && f.x > ledge.left && f.x < ledge.right) {
                        
                        // FIX: Reduced chance from 30% -> 2% per frame
                        // This allows snow to fall past the header and hit bottom cards
                        if(Math.random() > 0.98) { 
                            landedFlakes.push({
                                x: f.x,
                                y: ledge.top,
                                r: f.r * (0.8 + Math.random() * 0.4), // Varied pile size
                                meltTime: 200 + Math.random() * 200 // 3-6 seconds
                            });
                            // Teleport to top immediately to maintain air density
                            resetFlake(f, width, height);
                        }
                        break;
                    }
                }
            }

            // LOOP & WRAP
            if(f.y > height + 10) resetFlake(f, width, height);
            
            // Screen Wrapping (Ensures sides stay populated)
            if(f.x > width + 20) f.x = -20;
            if(f.x < -20) f.x = width + 20;
        });

        snowFrameId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        updateSurfaces();
    });

    draw();
}

function stopSnow() {
    const canvas = document.getElementById('snow-canvas');
    if(canvas) canvas.classList.add('hidden');
    if(snowFrameId) cancelAnimationFrame(snowFrameId);
}

// Helper: Create a Flake
function createFlake(w, h, preWarm = false) {
    const z = Math.random(); 
    return {
        x: Math.random() * w,
        y: preWarm ? Math.random() * h : -20 - (Math.random() * 100), 
        z: z, // Depth 0-1
        r: (z * 3) + 2, // Size: 2px to 5px
        speed: (z * 1.5) + 1, // Speed: 1px to 2.5px
        swayOffset: Math.random() * Math.PI * 2
    };
}

// Helper: Reset Flake to Top
function resetFlake(f, w, h) {
    const z = Math.random();
    f.x = Math.random() * w; 
    f.y = -20 - (Math.random() * 100); 
    f.z = z;
    f.r = (z * 3) + 2;
    f.speed = (z * 1.5) + 1;
}

// AUTO-START
document.addEventListener('DOMContentLoaded', () => {
    const storedVal = localStorage.getItem('studyflow_snow');
    if(storedVal === null || storedVal === 'true') {
        snowActive = true;
        updateSnowUI();
        startSnow();
    } else {
        snowActive = false;
        updateSnowUI();
    }
});

// --- OPTIONAL: ADVANCED FLUID PHYSICS ---
document.addEventListener('mousemove', (e) => {
    // Parallax Effect
    const layers = document.querySelectorAll('.blob');
    layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.05;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// ✅ AUTO-FIX: Close mobile menu when resizing to PC view
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        // If screen becomes desktop width, ensure mobile overlays are gone
        const overlay = document.getElementById('mobile-menu-overlay');
        const sidebar = document.getElementById('sidebar');
        
        if (overlay) overlay.classList.add('hidden');
        if (sidebar) {
            // Reset specific mobile classes if necessary, 
            // but the CSS md:translate-x-0 handles the main visibility.
            sidebar.classList.add('-translate-x-full'); // Reset toggle state
            sidebar.classList.remove('translate-x-0');
        }
        document.body.classList.remove('overflow-hidden'); // Restore scrolling
    }
});
// ==========================================
// 📊 POINTS ANALYTICS VIEW ENGINE (Fixed Math & Breakdown)
// ==========================================

window.renderPointsAnalytics = function() {
    const container = document.getElementById('points-content');
    if (!container) return;

    // --- HELPER: Analyze a Syllabus Tree ---
    const analyzeSyllabus = (syllabusArray, type, endDate) => {
        let counts = { Physics: 0, Chemistry: 0, Biology: 0, Total: 0 };
        let points = { Total: 0, Earned: 0 };
        let breakdown = { Physics: 0, Chemistry: 0, Biology: 0 }; // NEW: Track points per subject
        
        const allCompleted = new Set(Object.values(state.tasks).flat().filter(t => t.completed).map(t => t.text));

        syllabusArray.forEach(chap => {
            let subj = chap.subject;
            if (subj === 'Botany' || subj === 'Zoology') subj = 'Biology';

            chap.dailyTests.forEach(dt => {
                // 1. Count Tests
                counts.Total++;
                if (counts[subj] !== undefined) counts[subj]++;

                // 2. Calculate Points (FIXED LOGIC)
                // Get the Full Value of the test (e.g. 4 pts for Physics)
                const fullTestValue = getTestPoints(chap.subject, chap.topic); 
                
                // Add FULL value to Total Possible
                points.Total += fullTestValue;
                
                // Add to Subject Breakdown
                if (breakdown[subj] !== undefined) breakdown[subj] += fullTestValue;

                // 3. Calculate Earned Points (Fractional based on completion)
                const subsCount = dt.subs.length || 1;
                const subValue = fullTestValue / subsCount;
                
                dt.subs.forEach(sub => {
                    const taskName = `Study: ${chap.topic} - ${sub}`;
                    if (allCompleted.has(taskName) || state.dailyTestsAttempted[dt.name]) {
                        points.Earned += subValue;
                    }
                });
            });
        });

        // 4. Daily Targets
        const today = new Date(); today.setHours(0,0,0,0);
        const targetDate = new Date(endDate);
        const daysLeft = Math.max(1, Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)));
        const remaining = points.Total - points.Earned;
        const dailyNeed = remaining / daysLeft;

        return { counts, points, daysLeft, dailyNeed, breakdown };
    };

    // --- 1. MAIN EXAM ANALYTICS ---
    const mainStats = analyzeSyllabus(state.nextExam.syllabus, 'main', state.nextExam.date);

    // --- 2. BACKLOG ANALYTICS (Active Phase Only) ---
    const planStart = backlogPlan.startDate;
    const diff = Math.ceil((new Date() - planStart) / (1000 * 60 * 60 * 24));
    let activePhase = 1;
    if(diff > 45) activePhase = 4;
    else if(diff > 30) activePhase = 3;
    else if(diff > 15) activePhase = 2;

    const backlogFiltered = backlogPlan.syllabus.filter(c => c.phase === activePhase);
    const phaseEndDate = new Date(planStart);
    phaseEndDate.setDate(planStart.getDate() + (activePhase * 15));
    
    const backlogStats = analyzeSyllabus(backlogFiltered, 'backlog', phaseEndDate);


    // --- 3. RENDER HTML ---
    const generateCard = (title, icon, color, stats, isBacklog) => `
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 flex items-center justify-center shadow-sm">
                        <i data-lucide="${icon}" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-white">${title}</h2>
                        <p class="text-xs text-slate-500 font-medium">Strategy & Breakdown</p>
                    </div>
                </div>
                ${isBacklog ? `<span class="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wide">Phase ${activePhase}</span>` : ''}
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Total Load Breakdown</h3>
                    <div class="flex items-center gap-4 mb-6">
                        <div class="text-4xl font-black text-slate-800 dark:text-white">${stats.counts.Total}</div>
                        <div class="text-sm font-medium text-slate-500 leading-tight">Total Daily<br>Tests Available</div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span class="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"><i data-lucide="atom" class="w-4 h-4"></i> Physics</span>
                            <div class="text-right">
                                <span class="block text-sm font-black text-slate-700 dark:text-slate-200">${stats.counts.Physics} Tests</span>
                                <span class="block text-[10px] font-bold text-slate-400">${stats.breakdown.Physics.toFixed(0)} Pts</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span class="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2"><i data-lucide="flask-conical" class="w-4 h-4"></i> Chemistry</span>
                            <div class="text-right">
                                <span class="block text-sm font-black text-slate-700 dark:text-slate-200">${stats.counts.Chemistry} Tests</span>
                                <span class="block text-[10px] font-bold text-slate-400">${stats.breakdown.Chemistry.toFixed(0)} Pts</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span class="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><i data-lucide="dna" class="w-4 h-4"></i> Biology</span>
                            <div class="text-right">
                                <span class="block text-sm font-black text-slate-700 dark:text-slate-200">${stats.counts.Biology} Tests</span>
                                <span class="block text-[10px] font-bold text-slate-400">${stats.breakdown.Biology.toFixed(0)} Pts</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-l border-slate-100 dark:border-slate-800 md:pl-8">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Points & Targets</h3>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-900/10 border border-${color}-100 dark:border-${color}-900/30 text-center">
                            <div class="text-2xl font-black text-${color}-600 dark:text-${color}-400">${stats.points.Earned.toFixed(1)}</div>
                            <div class="text-[10px] font-bold uppercase text-${color}-700/60 dark:text-${color}-300/60">Live Points</div>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                            <div class="text-2xl font-black text-slate-600 dark:text-slate-400">${stats.points.Total.toFixed(0)}</div>
                            <div class="text-[10px] font-bold uppercase text-slate-400">Total Possible</div>
                        </div>
                    </div>

                    <div class="bg-slate-900 dark:bg-black rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-r from-${color}-600 to-${color}-500 opacity-20"></div>
                        <div class="relative z-10 flex justify-between items-center">
                            <div>
                                <p class="text-xs text-${color}-200 font-bold uppercase tracking-wide mb-1">Required Velocity</p>
                                <div class="text-3xl font-black">${stats.dailyNeed <= 0 ? 'GOAL MET' : stats.dailyNeed.toFixed(1)} <span class="text-sm font-medium opacity-60">pts/day</span></div>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-slate-300 font-bold uppercase tracking-wide mb-1">Time Left</p>
                                <div class="text-2xl font-bold">${stats.daysLeft} <span class="text-sm font-medium opacity-60">Days</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- 4. EXPLANATION CARD ---
    const explanationHtml = `
        <div class="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-3xl">
            <h3 class="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4"></i> How Points Are Calculated
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center">
                    <div class="text-2xl font-black text-blue-500">4 Pts</div>
                    <div class="text-xs font-medium text-slate-500">Per Physics Test</div>
                </div>
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center">
                    <div class="text-2xl font-black text-teal-500">3 Pts</div>
                    <div class="text-xs font-medium text-slate-500">Per Chem Test</div>
                </div>
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center">
                    <div class="text-2xl font-black text-green-500">2 Pts</div>
                    <div class="text-xs font-medium text-slate-500">Per Bio Test</div>
                </div>
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center ring-2 ring-indigo-500/20">
                    <div class="text-2xl font-black text-indigo-500">3 Pts</div>
                    <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400">High Yield Bio</div>
                </div>
            </div>
            <p class="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 italic opacity-80">
                * High Yield Bio includes Genetics, Reproduction, & Evolution topics.
            </p>
        </div>
    `;

    container.innerHTML = `
        ${generateCard("Main Exam (AIATS)", "crosshair", "brand", mainStats, false)}
        ${generateCard("Backlog Recovery", "history", "orange", backlogStats, true)}
        ${explanationHtml}
    `;

    if(window.lucide) lucide.createIcons({ root: container });
};
// --- PRELOAD SOUND (Place this outside the function) ---
// This ensures the sound is ready the moment the user clicks
const lampSound = new Audio('lamp.mp3');
lampSound.volume = 0.6; // Adjust volume (0.0 to 1.0)
// --- NEW LAMP LOGIC (With Built-in Sound Generator) ---
window.toggleLamp = function() {
    const modal = document.getElementById('auth-modal');
    const chain = document.getElementById('pull-chain-trigger');
    
    // 1. Animate Chain (Visual Feedback)
    chain.classList.remove('pull-anim');
    void chain.offsetWidth; // Trigger reflow to restart animation
    chain.classList.add('pull-anim');

    // 2. Play Generated Switch Sound (No external file needed)
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            
            // Oscillator 1: The "Click" (High snap)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);

            // Oscillator 2: The "Thud" (Low mechanical sound)
            const thud = ctx.createOscillator();
            const thudGain = ctx.createGain();
            thud.type = 'sine';
            thud.frequency.setValueAtTime(200, ctx.currentTime);
            thud.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
            thudGain.gain.setValueAtTime(0.1, ctx.currentTime);
            thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            thud.connect(thudGain);
            thudGain.connect(ctx.destination);
            thud.start();
            thud.stop(ctx.currentTime + 0.15);
        }
    } catch (e) {
        console.warn("AudioContext not supported or blocked");
    }

    // 3. Toggle Light State
    setTimeout(() => {
        modal.classList.toggle('lights-on');
        
        // Haptic feedback for mobile
        if (navigator.vibrate) navigator.vibrate(15);
    }, 200);
};

// Ensure modal starts hidden/dark correctly on load
document.addEventListener('DOMContentLoaded', () => {
    // If not logged in, show auth modal in dark mode
    if (!currentUser) {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('auth-modal').classList.remove('lights-on');
    }
});
// ==========================================
// 🔍 SEARCH & TOGGLE LOGIC (Fixes Closing Bug)
// ==========================================

// 1. Handle Search Bar Toggle
window.toggleSearchMode = function() {
    const row = document.getElementById('syllabus-search-row');
    const input = document.getElementById('syllabus-search-input');
    
    if (row.classList.contains('hidden')) {
        row.classList.remove('hidden');
        input.focus();
    } else {
        row.classList.add('hidden');
        input.value = '';
        // Reset the view to show full roadmap
        renderSyllabus('main', ''); 
    }
};

// 2. Toggle Chapter (Fixes "Not Closing" bug)
window.toggleChapter = function(chapterId) {
    // Flip the state (Open <-> Closed)
    state.expandedTests[chapterId] = !state.expandedTests[chapterId];
    saveData();
    
    // Check if we are searching so we don't lose the filter
    const searchInput = document.getElementById('syllabus-search-input');
    const currentSearch = searchInput ? searchInput.value : '';
    
    // Re-render immediately to show the change
    renderSyllabus('main', currentSearch);
};

// 3. Toggle Daily Test Details
window.toggleDailyTest = function(testId) {
    state.expandedTests[testId] = !state.expandedTests[testId];
    saveData();
    
    const searchInput = document.getElementById('syllabus-search-input');
    const currentSearch = searchInput ? searchInput.value : '';
    
    renderSyllabus('main', currentSearch);
};