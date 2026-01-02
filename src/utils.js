// Get today's date in YYYY-MM-DD format
export const getTodayDateString = function (datetime=false) {
    let date = new Date();
    const today = date.toLocaleString();
    const [day, month, year] = today.split(',')[0].split('/');
    if (datetime) return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')}`;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}