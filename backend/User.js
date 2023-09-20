const Address = require("./Address");
const Company = require("./Company");
const addressInstance = new Address(
    'sdds',
    'sdsdd',
    'sdsdd',
    'dsdssdd'
)
const companyInstance = new Company(
    'bbh'
)
class User {
    constructor(user_id, username, name, email, phone, website, address, company, user_avatar) {
        this.user_id = user_id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.website = website;
        this.address = addressInstance;
        this.company = companyInstance;
        this.user_avatar = user_avatar;
    }
}

module.exports = User;
