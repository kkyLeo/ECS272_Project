# Game Statistics Visualization Tool

Welcome to the Game Statistics Visualization Tool! This project provides an interactive platform for gamers to explore various aspects of popular games, such as ratings, playtime, and genre similarities. Below is a detailed description of the project's functionalities, its structure, and instructions on how to use it effectively.

## Project Overview
This React-based project consists of two main parts:
1. **Overview Page**: Allows users to explore top games across four different categories and compare playtime statistics.
2. **Information Page**: Provides detailed information and visualizations about a specific game chosen by the user, including ratings, platform-specific playtime, and genre similarities.

The main components of the system are managed using React Router to navigate between pages and D3.js for creating the interactive visualizations.

## File Structure and Functionalities
Below is a summary of the key files and folders in the project and their functionalities:

### **Root Files**
- **`App.tsx`**: The central file of the project, responsible for managing the overall layout of the system. It uses routing (`Route`) to determine which page (Overview or Information) is displayed based on user actions.
- **`types.ts`**: Stores TypeScript interfaces used throughout the project to maintain consistent type definitions.

### **Components Folder**
The `components` folder contains two subfolders: `overview` and `infoPage`, each serving a specific part of the project.

#### **Overview Folder**
This folder contains files for the **Overview Page**, the first part of the project:
- **`ListView.tsx`**: Displays four game lists categorized by "Backlogged Games", "Completed Games", "Rated Games", and "Retired Games". Users can navigate these lists to see different categories.
- **`GroupedBarChart.tsx`**: Displays a grouped bar chart that compares the **average playtime reported by players** versus the **designed playtime for the main story**. Users can click a game name to access detailed information, transitioning to the Information Page.

#### **infoPage Folder**
This folder contains files for the **Information Page**, which offers more detailed game insights. The `infoPage` folder is further divided into two subfolders (`combination1` and `combination2`) and also contains several core files.

- **`TextInfo.tsx`**: Displays static information about the selected game, including the title, genres, developers, and platforms.
- **`Layout.tsx`**: Manages the layout for static information (`TextInfo.tsx`) and interactive visualizations from other files. It also uses a drop-down menu to let users choose between three types of visualizations:
  - **Rating and Retirement Information**
  - **Platform-specific Playing Time Information**
  - **Genre Similarity Information**

##### **Combination1 Folder**
The `combination1` folder focuses on displaying **Rating and Retirement Information**:
- **`Combination1.tsx`**: Manages the layout of visualizations for this section.
- **`RatingRetirement.tsx`**: Displays two pie charts showing the **overall rating** and **retirement rate** of the selected game.
- **`RatingRange.tsx`**: Shows a bar chart representing the **rating distribution** from **100% to 10%**.
- **`PlatformRatingRange.tsx`**: Displays a bar chart showing the **rating for different platforms**.

##### **Combination2 Folder**
The `combination2` folder is used for displaying **Platform-Specific Playing Time Information**:
- **`Combination2.tsx`**: Manages the layout of visualizations for this section.
- **`PlayingTime.tsx`**: Displays a **heatmap** representing the **playing time** of different play styles (e.g., main story, side quests, completionist) across various platforms.
- **`Players.tsx`**: Shows a **bar chart** representing the **number of players** on different platforms. Users can filter this information using an interactive legend.

- **`Network.tsx`**: Displays information about **genre similarity** through an interactive network graph. This visualization shows the genres associated with the selected game and highlights other games that share the same genres. Users can use the legend to filter and refine the displayed information.

## How to Use the Tool
### Running the Project
To run the project locally:
1. Clone the repository from GitHub.
2. Install dependencies using `npm install`.
3. Start the development server with `npm start`.
4. Open your browser and navigate to `http://localhost:3000` to access the tool.

### User Instructions
- **Overview Page**: 
  - Start by exploring the four game lists shown on the Overview Page. You can click on any of the lists (e.g., Backlogged or Completed) to view more details.
  - The grouped bar chart in the center shows comparisons between average player playtime and the designed time for the main story.
  - Use the timeline at the top to navigate between different years.
- **Information Page**:
  - Click on any game from the Overview Page to access the Information Page.
  - On the Information Page, static details about the game are shown on the left, while a drop-down menu lets you switch between different visualizations.
  - Use the drop-down to explore **Rating and Retirement Information**, **Platform-Specific Playing Time**, or **Genre Similarity**.
  - The **interactive visualizations** allow filtering data for a customized experience, enabling users to explore specific genres, platforms, or ratings.

## Summary of Functionalities
- **Game Lists and Comparisons**: Users can explore different categories of games and compare playtime metrics on the Overview Page.
- **Detailed Game Insights**: Provides in-depth information on ratings, playtime, and genre similarities on the Information Page.
- **Interactive Visualizations**: Includes bar charts, pie charts, a heatmap, and an interactive network graph to help users discover and analyze game data comprehensively.

## Technologies Used
- **React**: For building the user interface and managing the overall layout of the tool.
- **D3.js**: For creating the dynamic and interactive visualizations.
- **TypeScript**: For ensuring type safety across the project.

## Contact
For any questions or further information, please contact the development team.

We hope you enjoy exploring the Game Statistics Visualization Tool and gain meaningful insights into your favorite games!
