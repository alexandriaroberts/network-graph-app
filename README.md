# Netmaker Network Visualization

## Overview

This project is a network visualization tool for Netmaker, built using React and Next.js. It provides an interactive graph interface to display and manage network nodes and their connections.

## Features

- Interactive network graph visualization
- Node filtering and search functionality
- Detailed node information display via tooltips
- Responsive design for both desktop and mobile devices
- Dark mode UI

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later) or yarn

## Installation

1. Clone the repository:

   ```
   git clone git@github.com:alexandriaroberts/network-graph-app.git
   cd netmaker-network-visualization
   ```

2. Install the dependencies:
   ```
   npm install
   # or
   yarn install
   ```

## Usage

To run the development server:

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/components`: React components used in the project
  - `/ui`: Reusable UI components (Button, Input, etc.)
  - `network-graph.tsx`: Main network graph component
- `/pages`: Next.js pages
- `/styles`: Global styles and Tailwind CSS configuration
- `/lib`: Utility functions and helpers

## Dependencies

This project uses the following main dependencies:

- React
- Next.js
- ReactFlow
- Tailwind CSS
- shadcn/ui components
- Lucide React (for icons)

For a full list of dependencies, please refer to the `package.json` file.

## Customization

To customize the network graph:

1. Modify the `initialNodes` and `initialEdges` in `network-graph.tsx` to change the graph structure.
2. Adjust the `mockNodeData` object to update node information.
3. Customize styles in the component files or in the Tailwind configuration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any problems or have any questions, please open an issue in the GitHub repository.
