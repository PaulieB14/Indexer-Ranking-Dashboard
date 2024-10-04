# Indexer Ranking Dashboard

## Purpose
The **Indexer Ranking Dashboard** provides a visualization tool for displaying the performance of various indexers on **The Graph** protocol. The rankings are determined by a "pound-for-pound" score, calculated as the ratio of query fees collected relative to the total stake (GRT) for each indexer. The goal is to highlight the most efficient indexers in terms of query fee generation per stake.

## Features
- **Query Fee Power Ranking**, calculated as `Query Fees Collected / Total Stake`.
- **ENS name resolution** for indexer addresses using The Graph's subgraph.
- **Filters out indexers** with:
  - Total stake below 100,000 GRT.
  - No query fees collected.
- Clean and visually appealing table with a **translucent Graph Protocol logo** in the background.
- Data is fetched dynamically from a **GraphQL API via Apollo Client**.

## Technologies Used
- **React**: Frontend framework to build the dashboard.
- **Apollo Client**: For GraphQL queries to fetch indexer and ENS data.
- **Graph Protocol Subgraphs**: Used to gather indexer data and resolve ENS names.
- **CSS**: Styling for the dashboard, including table formatting and background image.

---

## How to Set Up the Project

### Prerequisites
Make sure you have the following tools installed before setting up the project:

- **Node.js**: Version 12.x or higher.
- **Git**: To clone the repository.
- **npm** (or **yarn**): For dependency management.

---

### 1. Clone the Repository
Clone this repository to your local machine:

```bash
git clone https://github.com/PaulieB14/Indexer-Ranking-Dashboard.git
cd Indexer-Ranking-Dashboard
