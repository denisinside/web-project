import { formatMockData } from './task1.js';

function sortUsers(users, sortBy, order = 'asc') {
    if (!Array.isArray(users)) {
        console.error('First parameter must be an array');
        return [];
    }

    const validSortFields = ['full_name', 'age', 'b_day', 'country'];
    if (!validSortFields.includes(sortBy)) {
        console.error(`Invalid sort field. Use one of: ${validSortFields.join(', ')}`);
        return [...users];
    }

    const validOrders = ['asc', 'desc'];
    if (!validOrders.includes(order.toLowerCase())) {
        console.error(`Invalid sort order. Use 'asc' or 'desc'`);
        return [...users];
    }

    const sortedUsers = [...users];

    return sortedUsers.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return order === 'asc' ? 1 : -1;
        if (valueB == null) return order === 'asc' ? -1 : 1;

        switch (sortBy) {
            case 'full_name':
            case 'country':
                valueA = valueA.toString().toLowerCase();
                valueB = valueB.toString().toLowerCase();
                break;

            case 'age':
                valueA = Number(valueA);
                valueB = Number(valueB);
                
                if (isNaN(valueA) && isNaN(valueB)) return 0;
                if (isNaN(valueA)) return order === 'asc' ? 1 : -1;
                if (isNaN(valueB)) return order === 'asc' ? -1 : 1;
                break;

            case 'b_day':
                valueA = new Date(valueA);
                valueB = new Date(valueB);
                
                if (isNaN(valueA.getTime()) && isNaN(valueB.getTime())) return 0;
                if (isNaN(valueA.getTime())) return order === 'asc' ? 1 : -1;
                if (isNaN(valueB.getTime())) return order === 'asc' ? -1 : 1;
                break;

            default:
                valueA = valueA.toString().toLowerCase();
                valueB = valueB.toString().toLowerCase();
        }

        let comparison = 0;
        if (valueA > valueB) {
            comparison = 1;
        } else if (valueA < valueB) {
            comparison = -1;
        }

        return order === 'desc' ? -comparison : comparison;
    });
}

export { sortUsers };

// const result = sortUsers(formatMockData(), 'age', 'desc');
// console.log(result.slice(0, 10));