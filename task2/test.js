import { formatMockData } from './task1.js';
import { validateUser } from './task2.js';
import { filterUsers } from './task3.js';
import { sortUsers } from './task4.js';
import { findUser } from './task5.js';
import { getMatchingPercentage } from './task6.js';


const users = formatMockData();
console.log("Formatted users:", users.length);

const validUsers = users.filter(validateUser);
console.log("Valid users:", validUsers.length);

const filteredUsers = filterUsers(validUsers, { country: 'Germany' });
console.log("Filtered users:", filteredUsers.length);

const sortedUsers = sortUsers(validUsers, 'full_name', 'desc');
console.log("Sorted users:", sortedUsers.length, "\n", sortedUsers.slice(0, 5));

const matchingUsers = findUser(validUsers, { age: { min: 29, max: 40 } });
console.log("Matching users:", matchingUsers.length);
console.log("Percentage:", getMatchingPercentage(validUsers, { age: { min: 29, max: 40 } }));