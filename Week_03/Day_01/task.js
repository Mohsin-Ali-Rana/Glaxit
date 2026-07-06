const users = [
    { name: "Mohsin", role: "admin", active_status: true },
    { name: "Rayyan", role: "developer", active_status: false },
    { name: "Ali", role: "manager", active_status: true },
    { name: "Hamza", role: "admin", active_status: false },
    { name: "Shazil", role: "developer", active_status: true },
    { name: "Ahsan", role: "admin", active_status: true },
    { name: "Haris", role: "manager", active_status: false },
    { name: "Zeeshan", role: "designer", active_status: true },
    { name: "Adeel", role: "admin", active_status: false },
];

// console.log(users);

function getActiveUsers(users) {
    return users.filter(user => user.active_status);
}

function getActiveUserNames(users) {
    return users
        .filter(user => user.active_status)
        .map(user => user.name);
}

function countAdmins(users) {
    return users.filter(user => user.role === "admin").length;
}

console.log(getActiveUsers(users));
console.log(getActiveUserNames(users));
console.log(countAdmins(users));
