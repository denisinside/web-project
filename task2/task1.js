import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

const courses = [
    'Mathematics', 'Physics', 'English', 'Computer Science', 
    'Dancing', 'Chess', 'Biology', 'Chemistry', 
    'Law', 'Art', 'Medicine', 'Statistics'
];

const bgColors =  ['#1f75cb', '#dface7', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

function getRandomID() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

function getRandomCourse() {
    return courses[Math.floor(Math.random() * courses.length)];
}

function getRandomBgColor() {
    return Math.random() > 0.3 ? bgColors[Math.floor(Math.random() * bgColors.length)] : null;
}

function userFormatter(user) {
    const formattedUser = {
        gender: user.gender || null,
        title: user.name?.title || user.title || null,
        full_name: user.name ? `${user.name.first} ${user.name.last}` : user.full_name || null,
        city: user.location?.city || user.city || null,
        state: user.location?.state || user.state || null,
        country: user.location?.country || user.country || null,
        postcode: user.location?.postcode || user.postcode || null,
        coordinates: user.location?.coordinates || user.coordinates || null,
        timezone: user.location?.timezone || user.timezone || null,
        email: user.email || null,
        b_date: user.dob?.date || user.b_day || user.b_date || null,
        age: user.dob?.age || user.age || null,
        phone: user.phone || null,
        picture_large: user.picture?.large || user.picture_large || null,
        picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail || null,
        id: getRandomID(),
        favorite: user.favorite !== undefined ? Boolean(user.favorite) : Math.random() > 0.5,
        course: user.course || getRandomCourse(),
        bg_color: user.bg_color !== undefined ? user.bg_color : getRandomBgColor(),
        note: user.note || null
    };
    return formattedUser;
}

function isDuplicate(user1, user2) {
    if (user1.email && user2.email && user1.email === user2.email) {
        return true;
    }
    if (user1.full_name && user2.full_name && user1.full_name === user2.full_name) {
        return true;
    }
    return false;
}

function removeDuplicates(users) {
    const uniqueUsers = [];
    
    for (const user of users) {
        const isExisting = uniqueUsers.some(existingUser => isDuplicate(user, existingUser));
        if (!isExisting) {
            uniqueUsers.push(user);
        }
    }
    
    return uniqueUsers;
}

function formatMockData() {
    try {
        const formattedRandomUsers = randomUserMock.map(user => userFormatter(user));
        const formattedAdditionalUsers = additionalUsers.map(user => userFormatter(user));
        const allUsers = [...formattedRandomUsers, ...formattedAdditionalUsers];
        const uniqueUsers = removeDuplicates(allUsers);
        return uniqueUsers;
        
    } catch (error) {
        console.error('Error formatting mock data:', error);
        return [];
    }
}

export { formatMockData };


// const result = formatMockData();
// console.log('First formatted user:', JSON.stringify(result[0], null, 2));
// console.log(`Total users: ${result.length}`);