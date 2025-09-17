import { formatMockData } from './task1.js';

function validateNameValue(name) {
    return typeof name === 'string' && name.length > 0 && name.charAt(0).toUpperCase() === name.charAt(0);
}

function validateAge(age) {
    return typeof age === 'number' && age > 0 && age < 150;
}

function validatePhone(phone) {
    return typeof phone === 'string' && phone.match(/^[\+]?[0-9]{0,3}[\W]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
}

function validateEmail(email) {
    return typeof email === 'string' && email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

function validateUser(user) {
    if(user.full_name && !validateNameValue(user.full_name)) {
        return false;
    }
    // if(user.gender && !validateNameValue(user.gender)) {
    //     return false;
    // }
    if(user.note && !validateNameValue(user.note)) {
        return false;
    }
    if(user.state && !validateNameValue(user.state)) {
        return false;
    }
    if(user.city && !validateNameValue(user.city)) {
        return false;
    }
    if(user.country && !validateNameValue(user.country)) {
        return false;
    }
    if(user.age && !validateAge(user.age)) {
        return false;
    }
    if(user.phone && !validatePhone(user.phone)) {
        return false;
    }
    if(user.email && !validateEmail(user.email)) {
        return false;
    }
    return true;
}


export { validateUser };

// const result = validateUser(formatMockData()[0]);
// console.log(result);