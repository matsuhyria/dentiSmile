// negative if the first date is earlier
// positive if the second date is earlier
// 0 if both dates are exactly the same
const compareIsoDates = (stringDate1, stringDdate2) => {
    return new Date(stringDate1).valueOf() - new Date(stringDdate2).valueOf();
};

export { compareIsoDates };