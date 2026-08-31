GYLT DIGITAL MENU
VERSION 1 LOOK + VERSION 2 FEATURES

THIS VERSION KEEPS
------------------
The softer premium look of Version 1:
- Black / warm gold palette
- Elegant serif display typography
- Minimal luxury interface
- Generous spacing
- Subtle animations
- No electric blue
- No aggressive club-site typography

BUT IT RETAINS VERSION 2 FEATURES:
----------------------------------
- Google Sheets driven Menu
- Google Sheets Settings tab
- Google Sheets Assets tab
- Sponsor section
- Sponsor logo
- Event / tonight section
- Event artwork
- Reserve table URL
- Featured product state
- Sold Out state
- Search
- Sticky category navigation
- Category ordering
- Product ordering
- Live sheet refresh

FONTS
-----
Cormorant Garamond
Manrope

Both are free Google Fonts.

==================================================
SHEET 1 — Menu
==================================================

Existing columns:
Category
Brand
Product
Serving
Price
Portfolio
Active
Order

Optional supported columns:
Featured
Sold Out
Description
Category Order

==================================================
SHEET 2 — Settings
==================================================

Setting | Value

GYLT Logo | gylt
Hero Title | Curated pours.<br>Made for the night.
Hero Subtitle | The current selection at GYLT.
Footer Location | BENGALURU
Reserve URL |
Event Active | FALSE
Event Title |
Event Date |
Event Meta |
Event Image |
Sponsor Active | FALSE
Sponsor Name |
Sponsor Line | EXCLUSIVE POURS
Sponsor Asset Key |

==================================================
SHEET 3 — Assets
==================================================

Asset Key | URL

gylt | YOUR LOGO URL
pernod | YOUR PERNOD LOGO URL
bacardi | YOUR BACARDI LOGO URL
event1 | YOUR EVENT IMAGE URL

The manager should NEVER need to type long image URLs into Settings.

Example weekly sponsor setup:

Sponsor Active | TRUE
Sponsor Name | Pernod Ricard
Sponsor Line | EXCLUSIVE POURS
Sponsor Asset Key | pernod

No sponsor:

Sponsor Active | FALSE

==================================================
ONE-TIME CODE SETUP
==================================================

Open app.js.

Find:

SHEET_ID:"PASTE_YOUR_GOOGLE_SHEET_ID"

Replace with your actual Google Sheet ID.

Do not change it again.

==================================================
UPDATE EXISTING GITHUB SITE
==================================================

In your existing GitHub repository:

replace:
index.html
styles.css
app.js

with the three files from this folder.

Keep your existing assets.

GitHub Pages should redeploy automatically.

==================================================
MANAGER WORKFLOW
==================================================

Manager only uses Google Sheets.

Menu week:
- Active checkbox
- Price
- Sold Out
- Featured

Sponsor:
- Sponsor Active
- Sponsor Name
- Sponsor Asset Key

Event:
- Event Active
- Event Title
- Event Date
- Event Meta
- Event Image

No weekly HTML editing.
No weekly GitHub changes.
