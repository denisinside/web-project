import { formatMockData } from './task1.js';
import { findUser } from './task5.js';

function getMatchingPercentage(users, searchParams = {}) {
    const matchingCount = findUser(users, searchParams, true).length;
    const totalCount = users.length;
    return Math.round((matchingCount / totalCount) * 100);
}

export { getMatchingPercentage };

//const result = getMatchingPercentage(formatMockData(), { age: { min: 29, max: 40 } });
//console.log(result);