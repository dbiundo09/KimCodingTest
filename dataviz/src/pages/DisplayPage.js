import React from "react";
import GraphComponent from "../components/graphs/GraphComponent";
import { convertToGraphFormat, parseCSVForBarChart } from "../util/parsingFunctions";
import Button from '@mui/material/Button';
import { Box, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { sortByYAxis, sortByYAxisDescending } from "../util/SortingFunctions";
import SortIcon from '@mui/icons-material/Sort';

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

const DisplayPage = () => {
    const [data, setData] = React.useState(null);
    const [allYLabelOptions, setYLabelOptions] = React.useState(null);
    const [yAxisLabel, setYAxisLabel] = React.useState(null);
    const [xAxisLabel, setXAxisLabel] = React.useState(null);
    const [sortMode, setSortMode] = React.useState(true);

    const handleChange = (newLabel) => {
        setYAxisLabel(newLabel.target.value);
    }

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

    if (!data) {
        return <LinearProgress />
    }

    return (
        <Box sx={{ m: 3 }}>
            <Typography sx={{ m: 1 }} variant="h3">Coffee House Chains</Typography>
            <Typography sx={{ m: 1, marginBottom: 3 }} variant='subtitle1'>A ranking of selected leading coffee house chains worldwide</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography
                    variant="h6"
                    component={'h4'}
                    sx={{ marginRight: 2 }}
                >Group By: </Typography>
                <Dropdown options={allYLabelOptions} handleChange={handleChange} selected={yAxisLabel} />
                <Button
                    sx={{ marginLeft: 30 }}
                    variant="contained"
                    startIcon={<SortIcon />}  // Add SortIcon as the start icon
                    onClick={() => setSortMode(!sortMode)}>
                    <Typography>Sort</Typography>
                </Button>
            </Box>
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
