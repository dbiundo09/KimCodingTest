## Reusable Bar Chart Component Assignment

This repository contains the implementation of the "Reusable Bar Chart Component" assignment. The goal of this assignment is to build a dynamic and reusable bar chart component using React and D3.js. The chart should update based on incoming data, and advanced features such as animations for chart updates are encouraged.

### Demo
A live demo of the implemented chart can be found [here](https://dbiundo09.github.io/KimCodingTest/).

### Dataset
The dataset used for this implementation is available in coffee-house-chains.csv.

## Project Structure

src/components/GraphComponent.js: The main implementation of the reusable bar chart component.
src/App.js: Integration of the BarChart component and implementation of the dataset selection dropdown.
src/DisplayPage.js: Component surrounding the BarChart, responsible for parsing the data and providing the props to BarChart component.
src/util: Here utility functions that are related to the parsing of the CSV and the sorting of the data can be found.
public/data/coffee-house-chains.csv: The dataset used for testing the chart.