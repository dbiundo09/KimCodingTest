import * as d3 from 'd3';


/* Parses a CSV for Company, Stores, Revenue and returns an array of objects in the following format:

  {company: 'Tim Hortons', stores: '4671', revenue: '3.16'}

  Params: 
    csvFile : [String] -> This is the path to the CSV being parsed
    callback : [() => Void] -> Callback function executing once the data is done being parsed

*/
export function parseCSVForBarChart(csvFile, callback) {
  d3.csv(csvFile)
    .then((data) => {
      // Assuming the first column is the grouping column
      const groupingColumn = Object.keys(data[0])[0];

      // Group data by the first column
      const groupedData = d3.group(data, (d) => d[groupingColumn]);

      // Transform data for the bar chart
      const chartData = Array.from(groupedData, ([group, groupData]) => {
        // Extract data points dynamically based on CSV file header
        const entry = { [groupingColumn]: group };

        // Include other columns using their names from the CSV file header
        Object.keys(groupData[0]).forEach((columnName) => {
          if (columnName !== groupingColumn) {
            entry[columnName] = d3.sum(groupData, (d) => +d[columnName]);
          }
        });

        return entry;
      });

      // Call the callback function with the transformed data
      callback(null, chartData);
    })
    .catch((error) => {
      console.error('Error reading CSV file:', error);
      callback(error, null);
    });
}




/*
  Converts an array of objects to an array of objects of the following format: 

   object = {
        xAxis: [Number or String],
        yAxis: [Double]
    }

    Params:
      xAxisLabel : [String] -> This is the key for the value that will be converted to the xAxis
      yAxis: [String] -> This is the key for the value that will be converted to the yAxis
      data: [[Object]] -> this is the data being transformed
    
*/
