# Nagrik Mesh 🛰️

**Nagrik Mesh** (Citizen Mesh) is an AI Intelligence Layer built on top of CPGRAMS. It doesn't replace existing infrastructure but automates the manual review process, prioritizes urgent grievances, and provides decision-support for government officials.

## 🚀 Key Features

- **Automated Classification**: Sorts grievances into *Common*, *Occasional*, and *New* problems.
- **Dynamic Prioritization**: Scores complaints based on category severity, keyword urgency (e.g. "hospital", "burst"), and location importance.
- **Pattern Detection (Flagging)**: Automatically flags systemic issues or "fake resolutions" by tracking repeated failures in specific wards.
- **Human-in-the-Loop**: Officials can Accept, Modify, or Reject AI-suggested solutions based on historical success data.
- **Premium Admin Interface**: A high-density, glassmorphism-based dashboard that feels familiar yet high-efficiency.

## 🛠️ Technology Stack

- **Core**: Next.js 15 (App Router), TypeScript.
- **Styling**: Tailwind CSS v4, Framer Motion (Animations).
- **Icons**: Lucide React.
- **Logic**: Custom heuristic Intelligence Engine.

## 📈 Dashboard Queues

1. **Critical (🔴)**: Instant action required (e.g., structural cracks, major flooding).
2. **High (🟠)**: Urgent within 48-72 hours.
3. **Moderate (🟡)**: Standard operational grievances.

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## 📄 License
This project is built as a decision-support prototype for government administrative efficiency.
