const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./User");
const Address = require("./Address");
const Company = require("./Company");

const mysql = require("mysql2/promise");

const db = mysql.createPool({
  // host: "localhost",
  // port: "3307",
  // user: "root",
  // password: "Test1234",
  // database: "bytivetech",

  host: "localhost",
  user: "root",
  password: "Test12345",
  database: "bytivetech",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// insert query:->
var id = 1;
app.get("/", (req, res) => {
  res.send("Hi I am live!");
});
app.post("/api/save", (req, res) => {
  insertUser(res, req);
  // setTimeout(() => {
  //   getUser(res);
  //   insertAddress(res);
  //   insertCompany(res);
  // }, 500);
});
app.put("/api/update", (req, res) => {
  updateUser(req, res)
});
async function updateUser(req, res) {
  const updateQuery = `UPDATE user SET
    name = ?,
    email = ?,
    phone = ?,
    website = ?
    WHERE user_id = ?`;

  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.website,
    req.body.user_id,
  ];
  const connection = await db.getConnection();

  try {
    const [result] = await connection.execute(updateQuery, values);
    console.log("Result: ", JSON.stringify(result));
    res.send("User updated successfully");
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    connection.release();
  }
}


async function insertUser(res, req) {

  const insert1 = "INSERT INTO user values(?,?,?,?,?,?,?)";
  const values = [
    0,
    req.body.username,
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.website,
    `https://avatars.dicebear.com/v2/avataaars/${req.body.name}.svg?options[mood][]=happy`
  ];
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(insert1, values);
    console.log("Result: ", JSON.stringify(result));
    //res.send("MyApp Backend");
    setTimeout(() => {
      getUser(res, req);
    }, 500);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    connection.release();
  }
}

async function getUser(res, req) {
  //app.get("/api/get", (req, res)=>{
  const viewall = " select user_id from user order by 1 desc";
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(viewall);
    console.log("Result: ", JSON.stringify(result));
    id = result[0].user_id;
    insertAddress(res, req);
    insertCompany(res, req);
    //res.send("MyApp Backend");
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    connection.release();
  }
  //});
}
async function insertAddress(res, req) {
  const insert2 = "INSERT INTO address values(?,?,?,?,?,?)";
  const values1 = [
    0,
    id,
    req.body.address.street,
    req.body.address.suite,
    req.body.address.city,
    req.body.address.zipcode,
  ];
  const connection = await db.getConnection();
  try {
    const [result] = await db.execute(insert2, values1);
    console.log("Result: ", JSON.stringify(result));
    //res.send("MyApp Backend");
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    connection.release();
  }
}
async function insertCompany(res, req) {
  const insertQuery = "INSERT INTO companies VALUES (?, ?, ?)";
  const values = [0, id, req.body.company.name];
  const connection = await db.getConnection();

  try {
    const [result] = await connection.execute(insertQuery, values);
    console.log("Result: ", JSON.stringify(result));
    res.send("MyApp Backend");
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    connection.release();
  }
}
//async function getUser(res) {
app.get("/api/get", (req, res) => {
  getAllUsers(res);
});
//}
async function getAllUsers(res) {
  const viewall =
    "select * from user u left join address a on u.user_id = a.user_id left join companies c on u.user_id = c.user_id";
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(viewall);
    const userInstances = [];

    for (const item of result) {
      const userInstance = new User();
      userInstance.user_id = item.user_id;
      userInstance.username = item.username;
      userInstance.name = item.name;
      userInstance.email = item.email;
      userInstance.phone = item.phone;
      userInstance.website = item.website;
      userInstance.user_avatar = item.user_avatar;

      const addressInstance = new Address();
      addressInstance.street = item.street;
      addressInstance.suite = item.suite;
      addressInstance.city = item.city;
      addressInstance.zipcode = item.zipcode;

      const companyInstance = new Company();
      companyInstance.company_name = item.company_name;

      userInstance.address = addressInstance;
      userInstance.company = companyInstance;

      userInstances.push(userInstance);
    }

    // Send the list of userInstances as a response
    res.send(userInstances);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    connection.release();
  }
}
app.listen(5000, () => {
  console.log("Server Is running on port 5000");
});
