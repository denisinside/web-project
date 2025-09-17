import { formatMockData } from './task1.js';

function findUser(users, searchParams = {}, findAll = true) {
    if (!Array.isArray(users)) {
        console.error('First parameter must be an array');
        return findAll ? [] : null;
    }

    if (searchParams == {}) {
        console.warn('No search parameters provided');
        return findAll ? users : users[0] || null;
    }

    const results = users.filter(user => {
        if (searchParams.name !== undefined) {
            if (!user.full_name) {
                return false;
            }
            const userName = user.full_name.toLowerCase();
            const searchName = searchParams.name.toString().toLowerCase();
            if (!userName.includes(searchName)) {
                return false;
            }
        }

        if (searchParams.note !== undefined) {
            if (!user.note) {
                return false;
            }
            const userNote = user.note.toLowerCase();
            const searchNote = searchParams.note.toString().toLowerCase();
            if (!userNote.includes(searchNote)) {
                return false;
            }
        }

        if (searchParams.age !== undefined) {
            if (!user.age) {
                return false;
            }

            if (typeof searchParams.age === 'number') {
                if (user.age !== searchParams.age) {
                    return false;
                }
            } else if (typeof searchParams.age === 'object' && searchParams.age !== null) {
                const { min, max } = searchParams.age;
                
                if (min !== undefined && user.age < min) {
                    return false;
                }
                if (max !== undefined && user.age > max) {
                    return false;
                }
            }
        }

        return true;
    });

    return findAll ? results : (results.length > 0 ? results[0] : null);
}

export { findUser };

//const result = findUser(formatMockData(), { name: 'Elias', age: { min: 20, max: 99 } });
//console.log(result);