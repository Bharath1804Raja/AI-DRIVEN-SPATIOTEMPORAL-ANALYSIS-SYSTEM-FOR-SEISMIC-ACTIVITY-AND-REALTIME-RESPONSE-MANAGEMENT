/* ========================================
   EARTHQUAKE DASHBOARD - SCRIPT.JS
   ======================================== */

/* ========================================
   GLOBAL STATE
   ======================================== */

let currentLanguage = 'en';
let currentDataView = 'latest';
let earthquakeData = [];
let isChatbotOpen = false;
let timelineData = [];
let riskData = [];
let forecastData = {};

/* ========================================
   LANGUAGE DEFINITIONS
   ======================================== */

const LANGUAGES = {
    en: {
        greeting: "Hello! I'm your Earthquake Safety Assistant. How can I help you today?",
        askQuestion: "Ask about earthquakes, safety, or shelters...",
        recentEarthquakes: "Latest Earthquakes",
        safety: "Earthquake Safety Guidelines",
        shelter: "Earthquake Shelters in Your Area",
        noData: "No earthquake data available"
    },
    es: {
        greeting: "¡Hola! Soy tu asistente de seguridad ante terremotos. ¿Cómo puedo ayudarte?",
        askQuestion: "Pregunta sobre terremotos, seguridad o refugios...",
        recentEarthquakes: "Últimos Terremotos",
        safety: "Directrices de Seguridad ante Terremotos",
        shelter: "Refugios para Terremotos en Tu Área",
        noData: "No hay datos de terremotos disponibles"
    },
    fr: {
        greeting: "Bonjour! Je suis votre assistant en matière de sécurité lors des tremblements de terre. Comment puis-je vous aider?",
        askQuestion: "Posez des questions sur les tremblements de terre, la sécurité ou les abris...",
        recentEarthquakes: "Derniers Tremblements de Terre",
        safety: "Directives de Sécurité lors des Tremblements de Terre",
        shelter: "Abris contre les Tremblements de Terre Dans Votre Région",
        noData: "Aucune donnée de tremblement de terre disponible"
    },
    ar: {
        greeting: "مرحبا! أنا مساعدك في سلامة الزلازل. كيف يمكنني مساعدتك؟",
        askQuestion: "اسأل عن الزلازل والسلامة أو الملاجئ...",
        recentEarthquakes: "آخر الزلازل",
        safety: "إرشادات سلامة الزلازل",
        shelter: "ملاجئ الزلازل في منطقتك",
        noData: "لا توجد بيانات زلزال متاحة"
    },
    pt: {
        greeting: "Olá! Sou seu assistente de segurança durante terremotos. Como posso ajudá-lo?",
        askQuestion: "Pergunte sobre terremotos, segurança ou abrigos...",
        recentEarthquakes: "Últimos Terremotos",
        safety: "Diretrizes de Segurança Durante Terremotos",
        shelter: "Abrigos para Terremotos em Sua Área",
        noData: "Nenhum dado de terremoto disponível"
    },
    ru: {
        greeting: "Привет! Я ваш помощник по безопасности при землетрясениях. Как я могу вам помочь?",
        askQuestion: "Спросите о землетрясениях, безопасности или убежищах...",
        recentEarthquakes: "Последние Землетрясения",
        safety: "Руководство по Безопасности при Землетрясениях",
        shelter: "Убежища от Землетрясений в Вашем Районе",
        noData: "Данные о землетрясениях недоступны"
    },
    id: {
        greeting: "Halo! Saya adalah asisten keselamatan gempa bumi Anda. Bagaimana saya dapat membantu Anda?",
        askQuestion: "Tanya tentang gempa bumi, keselamatan, atau perlindungan...",
        recentEarthquakes: "Gempa Bumi Terbaru",
        safety: "Pedoman Keselamatan Gempa Bumi",
        shelter: "Tempat Perlindungan Gempa Bumi di Area Anda",
        noData: "Tidak ada data gempa bumi yang tersedia"
    },
    hi: {
        greeting: "नमस्ते! मैं आपका भूकंप सुरक्षा सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?",
        askQuestion: "भूकंप, सुरक्षा या आश्रयों के बारे में पूछें...",
        recentEarthquakes: "हाल की भूकंपें",
        safety: "भूकंप सुरक्षा दिशानिर्देश",
        shelter: "आपके क्षेत्र में भूकंप आश्रय",
        noData: "भूकंप डेटा उपलब्ध नहीं है"
    },
    ta: {
        greeting: "வணக்கம்! நான் உங்கள் நிலநடுக்க பாதுகாப்பு உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        askQuestion: "நிலநடுக்கங்கள், பாதுகாப்பு அல்லது புகலிடங்களைப் பற்றி கேளுங்கள்...",
        recentEarthquakes: "சமீபத்திய நிலநடுக்கங்கள்",
        safety: "நிலநடுக்க பாதுகாப்பு வழிகாட்டுதல்",
        shelter: "உங்கள் பகுதியில் நிலநடுக்க புகலிடங்கள்",
        noData: "நிலநடுக்க தரவு கிடைக்கவில்லை"
    }
};

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('[v0] Initializing earthquake dashboard...');
    fetchEarthquakeData();
    setupTabNavigation();
    setupChatbot();
    updateLastUpdated();
    setInterval(updateLastUpdated, 60000); // Update every minute
});

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Scroll to a specific section
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Update last updated timestamp
 */
function updateLastUpdated() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('last-update').textContent = time;
}

/**
 * Format magnitude color based on value
 */
function getMagnitudeClass(magnitude) {
    if (magnitude < 5) return 'magnitude-low';
    if (magnitude < 6) return 'magnitude-medium';
    return 'magnitude-high';
}

/**
 * Get risk color based on score
 */
function getRiskColor(score) {
    if (score > 70) return '#ef4444'; // red
    if (score > 50) return '#f59e0b'; // orange
    if (score > 30) return '#eab308'; // yellow
    return '#10b981'; // green
}

/* ========================================
   EARTHQUAKE DATA FETCHING
   ========================================*/

/**
 * Fetch earthquake data from USGS API
 */
async function fetchEarthquakeData() {
    try {
        console.log('[v0] Fetching earthquake data from USGS...');
        
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const data = await response.json();
        
        earthquakeData = data.features.map((feature, idx) => ({
            id: feature.id,
            magnitude: feature.properties.mag,
            location: feature.properties.place,
            timestamp: new Date(feature.properties.time),
            depth: feature.geometry.coordinates[2],
            lat: Math.abs(feature.geometry.coordinates[1]),
            lng: Math.abs(feature.geometry.coordinates[0]),
            time: new Date(feature.properties.time).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        }));
        
        console.log(`[v0] Loaded ${earthquakeData.length} earthquakes`);
        
        // Update UI with data
        updateEarthquakeTable();
        generateTimeline();
        calculateRiskIndex();
        calculateForecast();
        
    } catch (error) {
        console.error('[v0] Error fetching earthquake data:', error);
        document.getElementById('earthquake-count').textContent = 'Error loading data';
    }
}

/**
 * Update earthquake table with data
 */
function updateEarthquakeTable() {
    const tbody = document.getElementById('earthquake-list');
    const dataToDisplay = currentDataView === 'latest' ? earthquakeData.slice(0, 20) : earthquakeData;
    
    document.getElementById('earthquake-count').textContent = `Total: ${earthquakeData.length} earthquakes`;
    
    if (dataToDisplay.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="loading">No earthquake data available</td></tr>`;
        return;
    }
    
    tbody.innerHTML = dataToDisplay.map((eq, idx) => `
        <tr>
            <td><strong>${eq.location}</strong></td>
            <td>
                <span class="magnitude-badge ${getMagnitudeClass(eq.magnitude)}">
                    M${eq.magnitude.toFixed(1)}
                </span>
            </td>
            <td>${eq.time}</td>
            <td>${eq.depth.toFixed(1)}</td>
            <td>${eq.lat.toFixed(2)}°N, ${eq.lng.toFixed(2)}°E</td>
        </tr>
    `).join('');
}

/**
 * Switch between latest 20 and all earthquakes
 */
function switchDataView(view) {
    currentDataView = view;
    
    // Update button states
    document.querySelectorAll('.data-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateEarthquakeTable();
}

/* ========================================
   TIMELINE GENERATION
   ======================================== */

/**
 * Generate 24-hour timeline
 */
function generateTimeline() {
    const timelineContainer = document.getElementById('timeline-events');
    
    if (earthquakeData.length === 0) {
        timelineContainer.innerHTML = '<div class="loading">No events in the past 24 hours</div>';
        return;
    }
    
    const events = earthquakeData.slice(0, 12);
    
    timelineContainer.innerHTML = events.map((eq, idx) => `
        <div class="timeline-event">
            <div class="timeline-marker">${(idx + 1).toString().padStart(2, '0')}</div>
            <div class="timeline-content">
                <div class="timeline-time">${eq.time}</div>
                <div class="timeline-location">${eq.location}</div>
                <div class="timeline-details">
                    Magnitude: ${eq.magnitude.toFixed(1)} | Depth: ${eq.depth.toFixed(1)} km
                </div>
            </div>
        </div>
    `).join('');
}

/* ========================================
   RISK CALCULATION
   ======================================== */

/**
 * Calculate global risk index and regional distribution
 */
function calculateRiskIndex() {
    const regions = {
        'Pacific Ring': { count: 0, maxMag: 0, bounds: { lat: [20, 45, -35, -10], lng: [130, 160, 140, 180] } },
        'Mediterranean': { count: 0, maxMag: 0, bounds: { lat: [30, 45], lng: [-10, 45] } },
        'Southeast Asia': { count: 0, maxMag: 0, bounds: { lat: [-10, 25], lng: [95, 145] } },
        'North America': { count: 0, maxMag: 0, bounds: { lat: [15, 50], lng: [-130, -60] } },
        'Europe': { count: 0, maxMag: 0, bounds: { lat: [35, 70], lng: [-10, 40] } },
        'Africa': { count: 0, maxMag: 0, bounds: { lat: [-35, 35], lng: [-20, 55] } },
        'South America': { count: 0, maxMag: 0, bounds: { lat: [-56, -10], lng: [-82, -34] } },
        'Indian Ocean': { count: 0, maxMag: 0, bounds: { lat: [-40, 15], lng: [35, 110] } }
    };
    
    earthquakeData.forEach(eq => {
        const lat = eq.lat;
        const lng = eq.lng;
        
        // Categorize by region
        if ((lat > 20 && lat < 45 && lng > 130 && lng < 160) || (lat > 10 && lat < 35 && lng > 140 && lng < 180)) {
            regions['Pacific Ring'].count++;
            regions['Pacific Ring'].maxMag = Math.max(regions['Pacific Ring'].maxMag, eq.magnitude);
        } else if (lat > 30 && lat < 45 && lng > 10 && lng < 45) {
            regions['Mediterranean'].count++;
            regions['Mediterranean'].maxMag = Math.max(regions['Mediterranean'].maxMag, eq.magnitude);
        } else if (lat < 25 && lat > 5 && lng > 95 && lng < 145) {
            regions['Southeast Asia'].count++;
            regions['Southeast Asia'].maxMag = Math.max(regions['Southeast Asia'].maxMag, eq.magnitude);
        } else if (lat > 15 && lat < 50 && lng > 130 && lng < 160) {
            regions['North America'].count++;
            regions['North America'].maxMag = Math.max(regions['North America'].maxMag, eq.magnitude);
        } else if (lat > 35 && lat < 70 && lng > 10 && lng < 40) {
            regions['Europe'].count++;
            regions['Europe'].maxMag = Math.max(regions['Europe'].maxMag, eq.magnitude);
        } else if (lat > 5 && lat < 35 && lng > 20 && lng < 55) {
            regions['Africa'].count++;
            regions['Africa'].maxMag = Math.max(regions['Africa'].maxMag, eq.magnitude);
        } else if (lat < 10 && lat > 56 && lng > 82 && lng < 34) {
            regions['South America'].count++;
            regions['South America'].maxMag = Math.max(regions['South America'].maxMag, eq.magnitude);
        } else if (lat > 40 && lat < 15 && lng > 35 && lng < 110) {
            regions['Indian Ocean'].count++;
            regions['Indian Ocean'].maxMag = Math.max(regions['Indian Ocean'].maxMag, eq.magnitude);
        }
    });
    
    // Calculate risk scores
    let globalRisk = 0;
    const regionsHtml = Object.entries(regions).map(([name, data]) => {
        const riskScore = Math.min(100, (data.count * 10) + (data.maxMag * 5));
        globalRisk += riskScore;
        const fillColor = getRiskColor(riskScore);
        return `
            <div class="region-card" onclick="selectRegion('${name}')">
                <div class="region-name">${name}</div>
                <div class="region-risk-bar">
                    <div class="region-risk-fill" style="width: ${riskScore}%; background: ${fillColor};"></div>
                </div>
                <div class="region-stats">
                    <span>Risk: ${riskScore}/100</span>
                    <span>Events: ${data.count}</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Update global risk
    globalRisk = Math.min(100, Math.round(globalRisk / Object.keys(regions).length));
    document.getElementById('global-risk').textContent = globalRisk;
    
    document.getElementById('regions-list').innerHTML = regionsHtml;
}

/**
 * Select region (for future interactivity)
 */
function selectRegion(regionName) {
    console.log(`[v0] Selected region: ${regionName}`);
}

/* ========================================
   FORECAST CALCULATION
   ======================================== */

/**
 * Calculate earthquake forecast probabilities
 */
async function calculateForecast() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
        const data = await response.json();
        
        const now = Date.now();
        const periods = { 3: 0, 7: 0, 14: 0, 30: 0 };
        
        data.features.forEach(feature => {
            const timeGap = now - feature.properties.time;
            const daysOld = timeGap / (24 * 60 * 60 * 1000);
            
            if (daysOld <= 3) periods[3]++;
            if (daysOld <= 7) periods[7]++;
            if (daysOld <= 14) periods[14]++;
            if (daysOld <= 30) periods[30]++;
        });
        
        const forecastHtml = Object.entries(periods).map(([days, count]) => {
            const probability = Math.min(95, Math.max(5, (count / 50) * 100));
            const trend = count > 20 ? '📈' : count > 10 ? '➡️' : '📉';
            
            return `
                <div class="forecast-card">
                    <div class="forecast-days">${days}</div>
                    <div class="forecast-days-label">Days</div>
                    <div class="forecast-probability">${probability.toFixed(0)}%</div>
                    <div class="forecast-trend">${trend}</div>
                    <div class="forecast-label">Probability</div>
                </div>
            `;
        }).join('');
        
        document.getElementById('forecast-list').innerHTML = forecastHtml;
    } catch (error) {
        console.error('[v0] Error calculating forecast:', error);
    }
}

/* ========================================
   TAB NAVIGATION
   ======================================== */

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            
            // Update button states
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

/* ========================================
   CHATBOT FUNCTIONALITY
   ======================================== */

/**
 * Setup chatbot
 */
function setupChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.add('open');
    
    const greeting = LANGUAGES[currentLanguage].greeting;
    addChatMessage(greeting, 'bot');
}

/**
 * Toggle chatbot visibility
 */
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('open');
}

/**
 * Change language
 */
function changeLanguage(lang) {
    currentLanguage = lang;
    console.log(`[v0] Language changed to: ${lang}`);
    
    // Update placeholder
    document.getElementById('chatbot-input').placeholder = LANGUAGES[lang].askQuestion;
}

/**
 * Add message to chat
 */
function addChatMessage(message, sender = 'bot') {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Send chat message
 */
function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // Process message with NLP
    const response = processNLPQuery(message);
    setTimeout(() => {
        addChatMessage(response, 'bot');
    }, 500);
}

/**
 * Handle chat input keypress
 */
function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

/**
 * NLP-based query processor
 */
function processNLPQuery(message) {
    const lower = message.toLowerCase();
    
    // Recent earthquakes query
    if (lower.includes('recent') || lower.includes('latest') || lower.includes('today')) {
        if (earthquakeData.length === 0) {
            return LANGUAGES[currentLanguage].noData;
        }
        const recent = earthquakeData.slice(0, 3);
        return `${LANGUAGES[currentLanguage].recentEarthquakes}:\n\n${recent.map(
            eq => `📍 ${eq.location}\nM${eq.magnitude.toFixed(1)} | ${eq.time}`
        ).join('\n\n')}`;
    }
    
    // Safety query
    if (lower.includes('safe') || lower.includes('safety') || lower.includes('protect')) {
        return `${LANGUAGES[currentLanguage].safety}:\n\n1️⃣ DROP → Get down on hands and knees\n2️⃣ COVER → Take cover under desk\n3️⃣ HOLD ON → Hold until shaking stops\n\nSafe locations:\n• Under sturdy furniture\n• Against interior walls\n• Away from windows`;
    }
    
    // Shelter query
    if (lower.includes('shelter') || lower.includes('refuge') || lower.includes('safe place')) {
        return `${LANGUAGES[currentLanguage].shelter}:\n\n🏢 Government Buildings\n• Location: Walking distance\n• Safety: Seismic-rated\n\n🏛️ Community Centers\n• Location: Nearby\n• Safety: Standard codes\n\n🏭 Emergency Shelters\n• Contact: Local authority\n• Status: Available 24/7`;
    }
    
    // Magnitude query
    if (lower.includes('magnitude') || lower.includes('strongest')) {
        if (earthquakeData.length === 0) {
            return LANGUAGES[currentLanguage].noData;
        }
        const strongest = earthquakeData.reduce((max, eq) => eq.magnitude > max.magnitude ? eq : max);
        return `Strongest Earthquake:\n📍 ${strongest.location}\n📊 M${strongest.magnitude.toFixed(1)}\n📏 Depth: ${strongest.depth.toFixed(1)}km`;
    }
    
    // Default response
    return "I can help you with:\n• Current earthquake data\n• Safety guidelines\n• Shelter information\n• Forecast information\n\nWhat would you like to know?";
}

/* ========================================
   VOICE & LOCATION FEATURES
   ======================================== */

/**
 * Start voice input (placeholder)
 */
function startVoiceInput() {
    addChatMessage('🎤 Voice recording started...', 'bot');
    setTimeout(() => {
        addChatMessage('What would you like to know about earthquakes?', 'bot');
    }, 1500);
}

/**
 * Share location (placeholder)
 */
function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lng = position.coords.longitude.toFixed(2);
                addChatMessage(`📍 Location shared: ${lat}°, ${lng}°`, 'user');
                addChatMessage(`I'll provide earthquake alerts for your area at coordinates ${lat}°, ${lng}°`, 'bot');
            },
            () => {
                addChatMessage('Location access denied. Please enable location services.', 'bot');
            }
        );
    } else {
        addChatMessage('Geolocation is not supported in your browser.', 'bot');
    }
}

/**
 * Download report (placeholder)
 */
function downloadReport() {
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earthquake-report-${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    addChatMessage('📥 Report downloaded!', 'bot');
}

/**
 * Generate CSV report
 */
function generateCSVReport() {
    let csv = 'Location,Magnitude,Date,Time,Depth (km),Latitude,Longitude\n';
    
    earthquakeData.forEach(eq => {
        csv += `"${eq.location}",${eq.magnitude},"${eq.time}",${eq.depth.toFixed(1)},${eq.lat.toFixed(2)},${eq.lng.toFixed(2)}\n`;
    });
    
    return csv;
}

/* ========================================
   AUTO-REFRESH DATA
   ======================================== */

// Refresh earthquake data every 5 minutes
setInterval(() => {
    console.log('[v0] Auto-refreshing earthquake data...');
    fetchEarthquakeData();
}, 300000);
