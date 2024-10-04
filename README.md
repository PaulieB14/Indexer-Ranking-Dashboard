# Indexer Ranking Dashboard

## Purpose

The **Indexer Ranking Dashboard** provides a visualization tool for displaying the performance of various indexers on The Graph protocol. The rankings are determined by a "pound-for-pound" score, calculated as the ratio of query fees collected relative to the total stake (GRT) for each indexer. This dashboard aims to highlight the most efficient indexers in terms of query fee generation per stake.

### Features
- Query Fee Power Ranking, calculated as `Query Fees Collected / Total Stake`.
- ENS name resolution for indexer addresses using The Graph’s subgraph.
- Filters out indexers with:
  - Total stake below 100,000 GRT.
  - No query fees collected.
- Clean and visually appealing table with a translucent **Graph Protocol** logo as the background.
- Data fetched dynamically from a GraphQL API via **Apollo Client**.

---

## Technologies Used

- **React**: Frontend framework to build the dashboard.
- **Apollo Client**: For GraphQL queries to fetch indexer and ENS data.
- **Graph Protocol Subgraphs**: Used to gather indexer data and resolve ENS names.
- **CSS**: Styling for the dashboard, including table formatting and background image.

---

## How to Set Up the Project

### Prerequisites

Before setting up the project, make sure you have the following tools installed:

- **Node.js**: Version 12.x or higher.
- **Git**: To clone the repository.
- **npm** (or **yarn**) for dependency management.

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/PaulieB14/Indexer-Ranking-Dashboard.git
cd Indexer-Ranking-Dashboard

2. Install Dependencies
Once you're in the project folder, install all the necessary dependencies using npm:

bash
Copy code
npm install
3. Set Up Environment Variables
In the root directory, create a .env file to securely store your Infura API URL. Add the following line to the .env file, replacing YOUR_INFURA_API_URL with your actual Infura URL:

bash
Copy code
REACT_APP_INFURA_URL=https://mainnet.infura.io/v3/YOUR_INFURA_API_URL
4. Running the Application
After setting up the environment and installing the dependencies, start the development server:

bash
Copy code
npm start
This will start the application on http://localhost:3000. Open the link in your browser to view the dashboard.

How it Works
Fetching Indexer Data:

The dashboard fetches data from a subgraph using Apollo Client. It retrieves indexers’ details such as staked tokens, delegated tokens, query fees collected, and allocated tokens.
ENS Resolution:

The dashboard resolves indexer wallet addresses to ENS names using a separate subgraph query, enhancing the readability of indexers’ names.
Ranking Calculation:

For each indexer, the Query Fee Power Ranking is calculated as:
mathematica
Copy code
Query Fee Power Ranking = Query Fees Collected / Total Stake
The list is then sorted by this ranking in descending order to display the top performers.
Filters:

The dashboard filters out indexers that:
Have a total stake of less than 100,000 GRT.
Have not collected any query fees.

