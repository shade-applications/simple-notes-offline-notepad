# Google Play Store Submission Guide - Simple Notes

This document contains all the text and configuration answers needed to upload **Simple Notes** to the Google Play Console.

---

## 1. Main Store Listing

### App Details
| Field | Value | Character Limit |
| :--- | :--- | :--- |
| **App Name** | Simple Notes – Offline Notepad | 30 |
| **Short Description** | Minimal, secure, and offline notepad. Auto-save, dark mode, and no login. | 80 |
| **Full Description** | **Simple Notes** is the cleanest, fastest, and most privacy-focused notepad for your device.<br><br><b>🚀 ZERO CLUTTER, MAXIMUM SPEED</b><br>Just open and write. No loading screens, no login requirements, and no unnecessary distractions. Your notes are available instantly, anytime.<br><br><b>🔒 PRIVATE & OFFLINE</b><br>Your data stays on your device. We don't store your notes on any server. With the built-in App Lock, only you can access your private thoughts.<br><br><b>✨ FEATURES YOU'LL LOVE:</b><br>• **100% Offline:** Works without internet.<br>• **App Lock:** Secure notes with PIN or Biometrics.<br>• **Rich Formatting:** Pin, Color code, and sort notes easily.<br>• **Auto-save:** Never lose a single word.<br>• **Dark Mode:** Beautiful AMOLED-friendly theme.<br>• **Backup & Restore:** Export your data locally to keep it safe.<br><br>Perfect for grocery lists, quick ideas, journaling, or daily planning.<br><br>Download **Simple Notes** today and experience the peace of an organized mind. | 4000 |

### Graphics
*Note: You need to generate these images.*

| Asset Type | Requirements |
| :--- | :--- |
| **App Icon** | 512px x 512px, 32-bit PNG |
| **Feature Graphic** | 1024px x 500px, JPEG or 24-bit PNG, no alpha |
| **Phone Screenshots** | Min 2, Max 8. Aspect ratio 16:9 or 9:16. (Suggestion: Show Home Screen, Dark Mode Editor, and Settings) |
| **7-inch Tablet** | Upload same screenshots if layout adapts. |

---

## 2. Store Settings

| Field | Value |
| :--- | :--- |
| **App Category** | Productivity |
| **Tags** | Production, Note-taking, Text Editor, Offline, Utilities |
| **Store Listing Email** | [Your Support Email] |
| **Phone/Website** | [Optional - Leave blank] |

---

## 3. App Content (Policy Declarations)

### Privacy Policy
*You must provide a URL. Since this is an offline app, a simple hosted text file works.*
*   **Recommendation**: Use a free generator (e.g., Flycricket, TermsFeed) or host a GitHub Gist.
*   **Key points to include**: "We do not collect personal user data. AdMob may collect device identifiers for advertising purposes."

### Ads
*   **Does your app contain ads?** -> **Yes, my app contains ads** (Banner ads).

### App Access
*   **All functionalities are available without special access.** (Unless you eventually gate "Remove Ads" behind a login, but currently it's local).

### Content Ratings (Questionnaire)
*   **Email Address**: [Your Email]
*   **Category**: Utility, Productivity, Communication, or Other.
*   **Violence**: No.
*   **Sexuality**: No.
*   **Language**: No.
*   **Controlled Substance**: No.
*   **Miscellaneous**:
    *   Does the app natively allow users to interact or exchange content? **No**. (Sharing is via system intent, not internal social network).
    *   Does the app share user's physical location? **No**.
    *   Does the app allow purchasing digital goods? **No** (unless IAP added later).
*   **Result**: PEGI 3 / Everyone.

### Target Audience
*   **Target Age**: 13-15, 16-17, 18+.
*   **Appeal to Children**: **No**. (Important: Select 'No' to avoid strict family policy requirements unless you specifically want to target kids).

### News Apps
*   **Is your app a news app?** -> **No**.

### COVID-19 Contact Tracing
*   **Is your app a publicly available COVID-19 contact tracing or status app?** -> **My app is not a publicly available COVID-19 contact tracing or status app**.

### Data Safety (CRITICAL)
*Since you used **AdMob**, you CANNOT say "No data collected". AdMob SDK collects device IDs.*

1.  **Does your app collect or share any of the required user data types?** -> **Yes**.
2.  **Is all of the user data collected by your app encrypted in transit?** -> **Yes**.
3.  **Do you provide a way for users to request that their data be deleted?** -> **No** (Data is local-only, clearing storage deletes it).

**Data Types to Select:**
*   **Device or other IDs**
    *   **Collected**: Yes.
    *   **Shared**: Yes (with Google/Ad Providers).
    *   **Purpose**: Advertising or Marketing, Fraud Prevention, Analytics.
*   **App Info and Performance (Crash logs, Diagnostics)**
    *   **Collected**: Yes (via Google Mobile Ads / Expo).
    *   **Purpose**: Analytics, Fraud Prevention.

*Note for "Offline" claim*: In your store description, you can clarify "Your **notes** are never sent to a server". The data collection above is strictly technical metadata for the Ad network.

---

## 4. Release Dashboard

| Country Availability | Select All countries (or exclude GDPR regions if you want less hassle, but AdMob handles most). |
| :--- | :--- |
| **Testers** | Add your own email to "Internal Testing" to test the AdMob production IDs safely. |
