import React from "react";
import GraphComponent from "../components/graphs/GraphComponent";
import { convertToGraphFormat, parseCSVForBarChart } from "../util/parsingFunctions";
import Button from '@mui/material/Button';
import { Box, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { sortByYAxis, sortByYAxisDescending } from "../util/SortingFunctions";
import SortIcon from '@mui/icons-material/Sort';

//Returns the "options" for the CSV. Esentially returns the label for each column except for the first one.
const getOptions = (data) => {
    return Object.keys(data[0]).slice(1);
}

// Generic dropdown element to control selection\
const Dropdown = ({ options, handleChange, selected }) => {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="yAxis-select"> Select Y-Axis </InputLabel>
                <Select
                    labelId="yAxis-select"
                    id="simple-yAxis-select"
                    label="Y Axis label"
                    onChange={handleChange}
                    value={selected}
                >
                    {options.map((label) => (
                        <MenuItem key={label} value={label}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};


//Main display page
const DisplayPage = () => {
    const [data, setData] = React.useState(null);
    const [allYLabelOptions, setYLabelOptions] = React.useState(null);
    const [yAxisLabel, setYAxisLabel] = React.useState(null);
    const [xAxisLabel, setXAxisLabel] = React.useState(null);

    //Sort Mode, ascending == true, descending == false
    const [sortMode, setSortMode] = React.useState(true);

    const handleChange = (newLabel) => {
        setYAxisLabel(newLabel.target.value);
    }


    //This useEffect parses the CSV and extracts the yAxis options (every column header except the first one) and the xAxis label (the label for the first column header)
    React.useEffect(() => {
        const pathToCsv = process.env.PUBLIC_URL + '/coffee-house-chains.csv';

        parseCSVForBarChart(pathToCsv, (error, chartData) => {
            if (!error) {
                const xAxisLabel = Object.keys(chartData[0])[0];
                const allOptions = getOptions(chartData);
                setXAxisLabel(xAxisLabel);
                setYLabelOptions(allOptions);
                setYAxisLabel(allOptions[0]);
                setData(chartData);
            } else {
                console.log("Error occurred parsing data.");
            }
        })
    }, [])

    //If data is still being parsed, return a loading bar
    if (!data) {
        return <LinearProgress />
    }

    return (
        <Box sx={{ m: 3 }}>
            <Typography sx={{ m: 1 }} variant="h3">Coffee House Chains</Typography>
            <Typography sx={{ m: 1, marginBottom: 3 }} variant='subtitle1'>A ranking of selected leading coffee house chains worldwide</Typography>

            {/* Center the Dropdown and Titles */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography
                    variant="h6"
                    component={'h4'}
                    sx={{ marginRight: 2 }}
                >Group By: </Typography>
                <Dropdown options={allYLabelOptions} handleChange={handleChange} selected={yAxisLabel} />

                {/* Sort button that toggles between ascending and descending */}
                <Button
                    sx={{ marginLeft: 30 }}
                    variant="contained"
                    startIcon={<SortIcon />}  
                    onClick={() => setSortMode(!sortMode)}>
                    <Typography>Sort</Typography>
                </Button>
            </Box>
            {/* Graph component itself */}
            <GraphComponent
                data={data}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                sortingFunction={sortMode ? sortByYAxis : sortByYAxisDescending}
            />
        </Box>
    )
}

export default DisplayPage;
