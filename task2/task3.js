import { formatMockData } from './task1.js';

function filterUsers(users, filters = {}) {
    if (!Array.isArray(users)) {
        console.error('First parameter must be an array');
        return [];
    }

    return users.filter(user => {
        if (filters.country !== undefined) {
            if (!user.country || user.country.toLowerCase() !== filters.country.toLowerCase()) {
                return false;
            }
        }

        if (filters.age !== undefined) {
            if (!user.age) {
                return false;
            }
            
            if (typeof filters.age === 'number') {
                if (user.age !== filters.age) {
                    return false;
                }
            } else if (typeof filters.age === 'object' && filters.age !== null) {
                const { min, max } = filters.age;
                if (min !== undefined && user.age < min) {
                    return false;
                }
                if (max !== undefined && user.age > max) {
                    return false;
                }
            }
        }

        if (filters.gender !== undefined) {
            if (!user.gender || user.gender.toLowerCase() !== filters.gender.toLowerCase()) {
                return false;
            }
        }

        if (filters.favorite !== undefined) {
            if (user.favorite !== filters.favorite) {
                return false;
            }
        }

        return true;
    });
}

export { filterUsers };

// const result = filterUsers(formatMockData(), { country: 'Ireland', age: { min: 40, max: 90} });
// console.log(result);