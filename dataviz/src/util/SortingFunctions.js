export function sortByYAxis(data) {
    return data.sort((a, b) => a.yAxis - b.yAxis);
}


export function sortByYAxisDescending(data) {
    return data.sort((a, b) => b.yAxis - a.yAxis);
}
