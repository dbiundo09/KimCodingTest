export function sortByYAxis(data, yAxisLabel) {
    return data.sort((a, b) => a[yAxisLabel] - b[yAxisLabel]);
}


export function sortByYAxisDescending(data, yAxisLabel) {
    return data.sort((a, b) => b[yAxisLabel] - a[yAxisLabel]);
}


export function sortByFirstKey(data, yAxisLabel) {
    if (data.length > 0) {
        const firstKey = Object.keys(data[0])[0]; 

        return data.sort((a, b) => {
            const valueA = a[firstKey].toLowerCase();
            const valueB = b[firstKey].toLowerCase();

            if (valueA < valueB) {
                return -1;
            } else if (valueA > valueB) {
                return 1;
            } else {
                return 0;
            }
        });
    }
}