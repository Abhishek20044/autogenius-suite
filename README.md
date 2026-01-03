## 📌 App Description

**AutoGenius Suite** is a **GenAI-powered Software Defined Vehicle (SDV) development accelerator** designed to simplify and speed up the creation of **Service-Oriented Automotive Applications**.
The app provides an intuitive interface to transform **high-level automotive problem statements** into **structured requirements, modular service designs, and deployable application components**.

It focuses on **Vehicle Health & Diagnostics**, enabling developers to visualize, analyze, and extend vehicle data such as speed, battery state-of-charge, braking, throttle, and tyre pressure. The architecture is designed to be **OTA-ready**, allowing new services and features to be added without impacting existing systems.

---

## 🚗 About AutoGenius Suite

Modern automotive software development is complex due to multiple vehicle variants, strict safety standards, and rapidly evolving features. AutoGenius Suite addresses this challenge by leveraging **Generative AI and Service-Oriented Architecture (SoA)** principles to create a **predictable, scalable, and efficient SDV development workflow**.

### Key Highlights:

* 🔹 GenAI-assisted requirement and feature interpretation
* 🔹 Modular Service-Oriented design aligned with SDV architecture
* 🔹 Scalable for EV, ICE, and Hybrid vehicle platforms
* 🔹 Frontend dashboard for real-time Vehicle Health & Diagnostics visualization
* 🔹 Easily extendable through OTA updates and subscription-based features

AutoGenius Suite is built as a **frontend-first application** using modern web technologies and is designed to integrate seamlessly with backend AI services and vehicle simulation platforms in the future.

---

## 🎯 Vision

To reduce development time, improve software quality, and enable faster innovation in **Software Defined Vehicles** by combining **Generative AI, modular architectures, and modern visualization tools**.


**frontend web application** (likely a dashboard/UI project) built using **TypeScript, Vite, Tailwind CSS, and possibly frameworks like React or similar** (common with `.tsx`, `vite.config.ts`, Tailwind, etc.) ([GitHub][1])

Here’s what’s inside:

* **`src/`** — Main app source code
* **`public/`** — Static assets
* **`package.json` & `package-lock.json`** — JavaScript dependencies
* **`tsconfig.json`** / **`vite.config.ts`** — TypeScript + Vite config
* **Tailwind config** — Styles setup
* **`.env`** — Environment variables (probably API keys or backend URLs) ([GitHub][1])

## 🧠 **What This App Is Likely For**

Although the README doesn’t explain the purpose, the structure suggests:

✅ A **frontend UI project**
✅ Probably uses API calls (backend) — hence `.env`
✅ Built with **Vite + TypeScript + Tailwind**
✅ Designed to run in a browser

If it’s part of your “AutoGenius Suite,” maybe this is the interface users use to interact with your GenAI services.

---

## 🛠️ **How to Run This App in VS Code**

Follow these steps:

### **1. Clone the Repo**

Open your terminal in VS Code and run:

```bash
git clone https://github.com/Abhishek20044/autogenius-suite
cd autogenius-suite
```

---

### **2. Install Dependencies**

Make sure you have **Node.js (v16+)** installed.

Then install packages:

```bash
npm install
```

or if you prefer:

```bash
yarn
```

---

### **3. Set Up Environment Variables**

Open the `.env` file at the root — this likely includes keys like:

```
VITE_API_URL=...
```

(You may need to fill in your API endpoints, depending on how the frontend interacts.)

> If you need help on what to put here, let me know what API or backend you are connecting this UI to.

---

### **4. Start Dev Server**

Run the Vite development server:

```bash
npm run dev
```

or:

```bash
yarn dev
```

This will start a local server (usually at **[http://localhost:5173](http://localhost:5173)**). Open that in your browser to see the app.

---

### **5. Build for Production (Optional)**

If you want a production build:

```bash
npm run build
```

This generates optimized files in a `dist/` folder.

---

## 📌 **VS Code Tips**

✅ Open the project folder in VS Code
✅ Install **ESLint + Tailwind CSS IntelliSense** for better coding support
✅ If you run into missing types or errors, check `tsconfig.json`


## 🧰 Required Software (Before Opening VS Code)

Make sure the following are installed on your system:

### 1️⃣ **Node.js (Mandatory)**

* Version: **v16 or above**
* Download: [https://nodejs.org](https://nodejs.org)
* Verify installation:

```bash
node -v
npm -v
```

---

### 2️⃣ **Git**

* Required to clone the repository
* Download: [https://git-scm.com](https://git-scm.com)
* Verify:

```bash
git --version
```

---

### 3️⃣ **Visual Studio Code**

* Code editor used to run and debug the app
* Download: [https://code.visualstudio.com](https://code.visualstudio.com)

---

### 4️⃣ **Web Browser**

* Google Chrome / Edge / Firefox
* Used to view the running app at `localhost`

---

## 🧩 Required VS Code Extensions (Recommended)

Install these extensions in VS Code for smooth development and error-free execution:

### 🔹 **Core Extensions**

1. **ESLint**
   → Detects syntax and TypeScript errors

2. **Prettier – Code Formatter**
   → Keeps code clean and consistent

3. **TypeScript and JavaScript Language Features**
   → Usually pre-installed with VS Code

---

### 🔹 **UI & Styling**

4. **Tailwind CSS IntelliSense**
   → Autocomplete & styling support for Tailwind classes

5. **PostCSS Language Support** *(optional)*
   → Better CSS handling if PostCSS is used

---

### 🔹 **Productivity & Debugging**

6. **GitLens** *(optional)*
   → Helps track code changes and commits

7. **Live Server** *(optional)*
   → Not required (Vite already runs a dev server), but useful for static previews

---

## ⚙️ Optional (If You Extend the Project)

* **Docker Desktop** – for containerized builds (future SDV deployment)
* **Postman / Thunder Client** – to test backend APIs
* **Python / Backend Runtime** – only if AI or API services are added later

---

## ✅ Final Checklist (Quick View)

| Requirement           | Needed          |
| --------------------- | --------------- |
| Node.js               | ✅               |
| Git                   | ✅               |
| VS Code               | ✅               |
| Browser               | ✅               |
| ESLint                | ✅               |
| Prettier              | ✅               |
| Tailwind IntelliSense | ✅               |
