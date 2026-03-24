# DDM Metal Building Configurator

A production-quality multi-step sales configurator for **Your Building Company**. Built with React + Vite + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **8-step configurator**: Building Use → Dimensions → Roof Style → Doors & Windows → Insulation → Finish → Lead Capture → Estimate
- **Client-side only** — no backend required
- **Live estimate calculation** with pricing formula
- **Form validation** on all required fields
- **Responsive** — works on desktop and mobile
- **Accessible** — keyboard-friendly, ARIA labels, focus states

## Steps

| # | Step | Description |
|---|------|-------------|
| 1 | Building Use | Select building type (barn, warehouse, commercial, etc.) |
| 2 | Dimensions | Width × Length × Height (ft) |
| 3 | Roof Style | Gambrel, Single Slope, Gable, or Mansard |
| 4 | Doors & Windows | Walk doors, roll-up doors, windows |
| 5 | Insulation | None / Basic 2" / Standard 4" / Premium 6" |
| 6 | Finish | Exterior color selection (6 options) |
| 7 | Lead Capture | Name, email (required), phone (optional) |
| 8 | Estimate | Ballpark price range + configuration summary |

## Pricing Formula

```
squareFootBase = width × length × 8
roofAdjusted   = squareFootBase × roofMultiplier
total          = roofAdjusted + insulationAdder + (walkDoors × $300) + (rollUpDoors × $800) + (windows × $150)
rangeLow       = total × 0.85
rangeHigh      = total × 1.15
```

## Project Structure

```
src/
├── components/
│   ├── StepLayout.jsx       # Shared step wrapper
│   ├── Stepper.jsx          # Progress indicator
│   ├── NavigationButtons.jsx # Back/Next controls
│   ├── OptionCard.jsx       # Selectable card component
│   └── SummaryRow.jsx       # Summary table row
├── steps/
│   ├── BuildingUseStep.jsx
│   ├── DimensionsStep.jsx
│   ├── RoofStyleStep.jsx
│   ├── OpeningsStep.jsx
│   ├── InsulationStep.jsx
│   ├── FinishStep.jsx
│   ├── LeadCaptureStep.jsx
│   └── EstimateSummaryStep.jsx
├── data/
│   └── options.js           # All options, labels, constraints
├── utils/
│   ├── pricing.js           # Estimate calculation
│   ├── validation.js        # Form validation helpers
│   └── format.js            # Currency formatting
├── App.jsx                  # Root component + state management
├── main.jsx
└── index.css                # Tailwind base + custom components
```

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 3**
- Client-side only — no backend, no API calls

## Contact

Your Building Company · **(555) 000-0000**
