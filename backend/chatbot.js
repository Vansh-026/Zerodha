const { ChatGoogle } = require("@langchain/google");
const { SystemMessage, HumanMessage, AIMessage } = require("@langchain/core/messages");

// Frontend routes map for navigation intent detection
const ROUTE_NAVIGATIONS = [
  {
    path: "/pricing",
    label: "Pricing & Brokerage",
    keywords: ["pricing", "price", "charges", "brokerage", "fees", "cost", "rates"],
    reply: "Navigating to the **Pricing** page where you can check all brokerage charges and fees! [[NAVIGATE:/pricing]]"
  },
  {
    path: "/signup",
    label: "Sign Up / Open Account",
    keywords: ["signup", "sign up", "register", "open account", "new account", "create account", "join"],
    reply: "Taking you to the **Sign Up** page so you can open your Zerodha account online! [[NAVIGATE:/signup]]"
  },
  {
    path: "/login",
    label: "Login",
    keywords: ["login", "log in", "sign in", "signin"],
    reply: "Redirecting you to the **Login** page! [[NAVIGATE:/login]]"
  },
  {
    path: "/product",
    label: "Products",
    keywords: ["product", "products", "platforms", "kite app", "console app", "coin app", "varsity app"],
    reply: "Opening the **Products** page featuring Kite, Console, Coin, and Varsity! [[NAVIGATE:/product]]"
  },
  {
    path: "/about",
    label: "About Us",
    keywords: ["about", "about us", "who is nithin kamath", "who founded zerodha", "founder", "team", "story"],
    reply: "Navigating to the **About Us** page to learn more about Zerodha's team and philosophy! [[NAVIGATE:/about]]"
  },
  {
    path: "/support",
    label: "Support Portal",
    keywords: ["support", "ticket", "tickets", "help desk", "contact", "customer care", "helpline"],
    reply: "Taking you to the **Support Portal** where you can create tickets and find help resources! [[NAVIGATE:/support]]"
  },
  {
    path: "/",
    label: "Home",
    keywords: ["home", "homepage", "main page", "landing page"],
    reply: "Taking you back to the **Home** page! [[NAVIGATE:/]]"
  }
];

// Comprehensive Knowledge Base for broad instant answers & offline mode
const KNOWLEDGE_BASE = [
  {
    keywords: ["brokerage", "charge", "charges", "fee", "cost", "rates"],
    answer:
      "**Zerodha Brokerage & Charges:**\n- **Equity Delivery:** ₹0 (Free investments)\n- **Intraday & F&O:** Flat ₹20 or 0.03% (whichever is lower) per executed order.\n- **Direct Mutual Funds:** ₹0 brokerage via Coin.\n- **Account Opening:** Free online account opening via Aadhaar OTP.\n\nWant to see the complete breakdown? [[NAVIGATE:/pricing]]"
  },
  {
    keywords: ["cnc", "mis", "difference between cnc and mis"],
    answer:
      "**CNC vs MIS:**\n- **CNC (Cash and Carry):** For buying shares for delivery (long-term investment). You pay 100% upfront and shares are credited to your Demat account.\n- **MIS (Margin Intraday Square-off):** For intraday trades with leverage/margin. Open MIS positions are automatically squared off around 3:20 PM."
  },
  {
    keywords: ["kite", "platform", "trading platform", "charting"],
    answer:
      "**Zerodha Kite:**\nKite is Zerodha's ultra-fast trading platform on Web and Mobile.\n- Integrated with TradingView & ChartIQ (100+ indicators).\n- Level 3 Market Depth (20 bids/offers).\n- Instant GTT (Good Till Triggered) orders and basket orders.\n\nCheck out our platforms: [[NAVIGATE:/product]]"
  },
  {
    keywords: ["coin", "mutual fund", "sip", "direct mutual fund"],
    answer:
      "**Zerodha Coin:**\nCoin lets you invest directly in Mutual Funds at **zero commission** without any distributor fees. Mutual funds are held directly in your Demat account, making portfolio tracking seamless.\n\nLearn more: [[NAVIGATE:/product]]"
  },
  {
    keywords: ["varsity", "learn trading", "education", "courses", "modules"],
    answer:
      "**Zerodha Varsity:**\nVarsity is a 100% free, in-depth educational resource covering stock market basics, technical analysis, fundamental analysis, options theory, and risk management.\n\nCheck products: [[NAVIGATE:/product]]"
  },
  {
    keywords: ["gtt", "good till triggered", "trigger order", "stop loss"],
    answer:
      "**GTT (Good Till Triggered):**\nGTT orders allow you to set target and stop-loss triggers that remain active for up to 1 year until triggered or cancelled. Once triggered, a limit order is placed automatically."
  },
  {
    keywords: ["account", "open", "register", "signup", "documents", "kyc"],
    answer:
      "**Opening a Zerodha Account:**\n1. Go to the Sign Up page and enter your mobile number.\n2. Complete PAN verification.\n3. Verify Aadhaar via DigiLocker OTP.\n4. Link your bank account (UPI / IFSC).\n5. Complete online eSign and in-person verification (IPV).\n\nReady to get started? [[NAVIGATE:/signup]]"
  },
  {
    keywords: ["market hours", "timing", "market open", "market close"],
    answer:
      "**Indian Stock Market Timings (NSE/BSE):**\n- **Pre-Market:** 9:00 AM – 9:08 AM IST\n- **Regular Trading:** 9:15 AM – 3:30 PM IST (Monday to Friday)\n- **Intraday MIS Auto Square-off:** 3:20 PM IST\n- **After Market Orders (AMO):** Can be placed after 3:45 PM for the next trading day."
  },
  {
    keywords: ["nifty", "sensex", "index", "indices"],
    answer:
      "**Nifty & Sensex:**\n- **Nifty 50:** Benchmark stock index of the National Stock Exchange (NSE), representing the 50 largest and most liquid Indian companies across 13 sectors.\n- **BSE Sensex:** Benchmark index of the Bombay Stock Exchange (BSE), comprising 30 financially sound blue-chip companies."
  },
  {
    keywords: ["demat", "trading account", "difference between demat"],
    answer:
      "**Demat vs Trading Account:**\n- **Trading Account:** Used to buy and sell stocks in the stock exchange (acting as the bridge between your bank and demat).\n- **Demat Account (Dematerialized):** Acts like an electronic locker where your purchased shares, mutual funds, and bonds are securely stored."
  },
  {
    keywords: ["dividend", "dividends"],
    answer:
      "**Dividends in Zerodha:**\nDividends are declared by companies and paid directly into your primary linked bank account (not your Zerodha trading balance) via ECS/NEFT. The amount is usually credited on the dividend payment date if you held shares on the Record Date."
  },
  {
    keywords: ["pe ratio", "p/e", "price to earnings"],
    answer:
      "**Price-to-Earnings (P/E) Ratio:**\nThe P/E ratio measures a company's current share price relative to its per-share earnings (EPS). It indicates how much investors are willing to pay per rupee of earnings: `P/E = Market Price per Share / Earnings per Share (EPS)`."
  },
  {
    keywords: ["ipo", "apply ipo"],
    answer:
      "**Applying for IPOs on Zerodha:**\nYou can apply for IPOs via Zerodha Console using your UPI ID. Enter bid price and lot quantity, submit, and approve the mandate on your UPI app (GPay, PhonePe, BHIM) before the mandate cut-off."
  },
  {
    keywords: ["funds", "deposit", "withdraw", "add money"],
    answer:
      "**Adding and Withdrawing Funds:**\n- **Deposit:** Instant 24/7 via UPI (free) or Net Banking from your linked bank account.\n- **Withdrawal:** Place request via Console. Funds are processed in batches and credited to your bank account within 24 hours."
  },
  {
    keywords: ["founder", "who started", "nithin kamath", "nikhil kamath", "ceo"],
    answer:
      "**About Zerodha Founders:**\nZerodha was founded in 2010 by brothers **Nithin Kamath** and **Nikhil Kamath** with the goal of breaking down all barriers that traders and investors face in India in terms of cost, support, and technology.\n\nRead our story: [[NAVIGATE:/about]]"
  },
  {
    keywords: ["hello", "hi", "hey", "hola", "greetings"],
    answer:
      "Hello! 👋 I am your Zerodha AI Assistant. I can help answer **any question** about stocks, trading, charges, orders, markets, or help you navigate anywhere on the website (e.g., 'Take me to pricing' or 'Open signup')! How can I assist you today?"
  },
  {
    keywords: ["who are you", "what can you do", "help"],
    answer:
      "I am Zerodha's AI Assistant! 🤖 Here is what I can do for you:\n- **Answer ANY question:** Ask about stocks, brokerage charges, order types, market concepts, financial terms, or general questions.\n- **Website Navigation:** Ask me to take you anywhere! (e.g., 'Go to pricing', 'Open signup', 'Show products', 'Go to about us').\n- **Explain Features:** Kite, Console, Coin, Varsity, GTT orders, CNC vs MIS, and more!"
  },
  {
    keywords: ["thank", "thanks", "thank you", "great", "awesome"],
    answer:
      "You're very welcome! 😊 Feel free to ask anything else or ask me to navigate you anywhere on Zerodha."
  }
];

function detectNavigationIntent(query) {
  const q = query.toLowerCase().trim();
  const navTrigger = /go to|take me to|navigate to|open|show me|visit|redirect|move to|bring me to|head to|view/;

  for (const nav of ROUTE_NAVIGATIONS) {
    for (const kw of nav.keywords) {
      if (q.includes(kw)) {
        if (navTrigger.test(q) || q === kw || q.startsWith("go ") || q.startsWith("open ") || q.includes("page")) {
          return nav.reply;
        }
      }
    }
  }
  return null;
}

function getFallbackResponse(query) {
  const normalized = query.toLowerCase().trim();

  // 1. Check for navigation request
  const navReply = detectNavigationIntent(normalized);
  if (navReply) return navReply;

  // 2. Check knowledge base
  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      return item.answer;
    }
  }

  // 3. Informative response with guidance
  return (
    `**I'm here to help with all questions!**\n\n` +
    `You can ask me about:\n` +
    `- **Navigation:** *"Take me to pricing"*, *"Open signup"*, *"Show products"*, *"Go to about us"*\n` +
    `- **Brokerage & Fees:** Equity delivery (₹0), Intraday & F&O (₹20)\n` +
    `- **Order Types:** CNC, MIS, GTT, AMO, Stop Loss\n` +
    `- **Ecosystem:** Kite trading app, Coin mutual funds, Varsity education\n` +
    `- **Market Concepts:** Market timings, Nifty & Sensex, Demat accounts, P/E ratio, IPOs`
  );
}

let llmInstance = null;

function getLLM() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
    return null;
  }
  if (!llmInstance) {
    llmInstance = new ChatGoogle({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      maxRetries: 2,
      apiKey: apiKey.trim(),
    });
  }
  return llmInstance;
}

const SYSTEM_PROMPT = `You are Zerodha's intelligent, versatile AI Assistant.
You have two primary capabilities:

1. ANSWER ALL USER QUESTIONS:
   - You can answer ANY question the user asks: stock market, trading concepts, companies, finance, economics, calculations, technical analysis, general knowledge, tech, or conversational chat.
   - You are especially an expert on Zerodha:
     * Brokerage: ₹0 for Equity Delivery and Direct Mutual Funds. Flat ₹20 or 0.03% (whichever lower) per executed order for Intraday & F&O. Free account opening.
     * Products: Kite (trading web/mobile), Console (reports & analytics), Coin (zero commission direct mutual funds), Varsity (free educational modules).
     * Order types: CNC (Cash & Carry - delivery), MIS (Margin Intraday Square-off), AMO (After Market Orders), GTT (Good Till Triggered), Stop-loss, Limit vs Market orders.
     * Account opening: 100% paperless via Aadhaar OTP, PAN, DigiLocker, and bank link.
   - Keep answers clear, polite, structured, and helpful. Use markdown bullet points and bold text where appropriate.

2. PAGE NAVIGATION:
   - When a user asks or implies they want to visit, open, view, or navigate to a page, you MUST append a navigation tag at the end of your response in the format: [[NAVIGATE:/route]]
   Available website routes:
   - /pricing : Pricing & Brokerage charges page
   - /product : Products page (Kite, Console, Coin, Varsity)
   - /about : About Us & Founder story
   - /support : Support Portal & Ticket system
   - /signup : Account opening / Registration page
   - /login : Login page
   - /logout : Logout
   - / : Home page
   Examples:
   - User: "take me to pricing page" -> Response: "Taking you to our Pricing page where you can see all brokerage and regulatory charges! [[NAVIGATE:/pricing]]"
   - User: "how can i open an account?" -> Response: "You can open an account online in minutes using PAN and Aadhaar OTP. Let me take you to the Sign Up page! [[NAVIGATE:/signup]]"
   - User: "show me products" -> Response: "Here is our product ecosystem including Kite, Console, Coin, and Varsity. Navigating to Products! [[NAVIGATE:/product]]"
`;

async function handleChat(message, history = []) {
  // First, check if user directly asked to navigate
  const directNav = detectNavigationIntent(message);
  
  const llm = getLLM();

  if (llm) {
    try {
      const messages = [new SystemMessage(SYSTEM_PROMPT)];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item && item.role === "user" && item.content) {
            messages.push(new HumanMessage(item.content));
          } else if (item && item.role === "assistant" && item.content) {
            messages.push(new AIMessage(item.content));
          }
        }
      }

      messages.push(new HumanMessage(message));

      const response = await llm.invoke(messages);
      let text =
        typeof response.content === "string"
          ? response.content
          : Array.isArray(response.content)
          ? response.content.map((c) => (typeof c === "string" ? c : c.text || "")).join("")
          : String(response.content || "");

      // If user clearly wanted to navigate and the model didn't append [[NAVIGATE:...]], append it
      if (directNav && !text.includes("[[NAVIGATE:")) {
        const match = directNav.match(/\[\[NAVIGATE:([a-zA-Z0-9_/]+)\]\]/);
        if (match) {
          text += ` ${match[0]}`;
        }
      }

      return text || getFallbackResponse(message);
    } catch (err) {
      console.warn("Gemini Chatbot error, falling back to knowledge base:", err.message);
      return getFallbackResponse(message);
    }
  }

  // If no GOOGLE_API_KEY is configured, use fallback engine
  return getFallbackResponse(message);
}

module.exports = {
  handleChat,
  getFallbackResponse,
  detectNavigationIntent,
  ROUTE_NAVIGATIONS
};
