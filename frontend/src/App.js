import logo from "./logo.svg";
import "./App.css";
import $ from "jquery";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FiMail } from "react-icons/fi";
import { FiPhoneCall } from "react-icons/fi";
import { BsGlobe2 } from "react-icons/bs";
import { AiOutlineHeart, AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  HeartFilled,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

function App() {
  const [slideData, setSlideData] = useState([]);
  const [slideData1, setSlideData1] = useState([]);
  const [UserData1, setUserData1] = useState({});
  const [itemIndex, setItemIndex] = useState(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [UserData, setUserData] = useState("");
  const [heartShape, setHeartShape] = useState(false);

  const handleEditClick = (e) => {
    setIsEditModalVisible(true);
    setItemIndex(parseInt($(e.currentTarget).attr("userindex")));
    setUserData1(slideData1[itemIndex]);
    setUserData($(e.currentTarget).attr("userid"));
  };
  const handleDeleteClick = (e) => {
    $(".userData").length > 1
      ? $("#" + $(e.currentTarget).attr("userid")).remove()
      : window.location.reload();
  };
  const handleClose = () => setIsEditModalVisible(false);
  var url = "http://localhost:5000/";
  const headers = {};
  const handleHeart = () =>{
    slideData[itemIndex].favorite = heartShape;
    heartShape ? setHeartShape(false) : setHeartShape(true);
  }
  const updateUser = async () => {
    setIsEditModalVisible(false);
    const userDetail = {
      user_id: UserData1.user_id,
      name: UserData1.name,
      phone: UserData1.phone,
      email: UserData1.email,
      website: UserData1.website,
    };
    slideData1[itemIndex].name = UserData1.name;
    slideData1[itemIndex].phone = UserData1.phone;
    slideData1[itemIndex].email = UserData1.email;
    slideData1[itemIndex].website = UserData1.website;
    const res = await fetch("http://localhost:5000/api/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetail),
    })
      .then((response) => {
        if (!response.ok) {
        }
        $("#" + UserData)
          .find(".userNameLabel")
          .html(UserData1.name);
        $("#" + UserData)
          .find(".userMailLabel")
          .html(UserData1.email);
        $("#" + UserData)
          .find(".userPhoneLabel")
          .html(UserData1.phone);
        $("#" + UserData)
          .find(".userWebLabel")
          .html(UserData1.website);
        return response.json();
      })
      .then((data) => {})
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleUserInput = (e) => {
    const { id, value } = e.target;
    setUserData1((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const getUsersData = async () => {
    setSlideData([]);
    // const res = await fetch(process.env.REACT_APP_VercelUrl + "/products", {
    const res = await fetch(url + "api/get", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
        }
        return response.json();
      })
      .then((data) => {
        setSlideData([]);
        setSlideData(data);
        setSlideData1(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getUsersData();
  }, []);
  return (
    <>
      <div className="row row-cols-0 row-cols-md-4 g-0">
        {slideData.map((item, index) => {
          return (
            <div
              className="col-md-3 userData"
              id={"userDetails_" + index}
              key={item.email}
            >
              <div className="card">
                <div
                  className="cardHeadImage d-flex justify-content-center w-100"
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  <img
                    src={item.user_avatar}
                    style={{ width: "200px", height: "200px" }}
                    className="card-img-top"
                    alt={item.name}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title userNameLabel">{item.name}</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item p-0 mt-2 border-0">
                      <MailOutlined size={20} color="rgba(0,0,0,.65)" />
                      <span
                        className="px-3 userMailLabel"
                        style={{ color: "rgba(0,0,0,.65)" }}
                      >
                        {item.email}
                      </span>
                    </li>
                    <li className="list-group-item p-0 mt-2 border-0">
                      <PhoneOutlined size={20} color="rgba(0,0,0,.65)" />
                      <span
                        className="px-3 userPhoneLabel"
                        style={{ color: "rgba(0,0,0,.65)" }}
                      >
                        {item.phone}
                      </span>
                    </li>
                    <li className="list-group-item p-0 mt-2 border-0">
                      <GlobalOutlined size={20} color="rgba(0,0,0,.65)" />
                      <span
                        className="px-3 userWebLabel"
                        style={{ color: "rgba(0,0,0,.65)" }}
                      >
                        {item.website}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="card-footer w-100 d-flex justify-content-between align-items-center p-0">
                  <ul className="list-inline m-0 w-100 d-flex justify-content-between align-items-center">
                    <li className="list-inline-item m-3" onClick={handleHeart}>
                      {slideData[itemIndex].favorite ? (
                        <HeartFilled className="heartShape" style={{"color":"red"}} />
                      ) : (
                        <HeartOutlined className="heartShape" color="red" />
                      )}
                    </li>
                    <li
                      className="list-inline-item m-3 editBtn"
                      userindex={index}
                      userid={"userDetails_" + index}
                      onClick={handleEditClick}
                    >
                      <EditOutlined color="rgba(0,0,0,.65)" />
                    </li>
                    <li
                      className="list-inline-item m-3 editBtn"
                      userid={"userDetails_" + index}
                      onClick={handleDeleteClick}
                    >
                      <DeleteOutlined color="rgba(0,0,0,.65)" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Modal show={isEditModalVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Leanne Graham"
                className="userName"
                autoFocus
                value={slideData1.length > 0 ? UserData1.name : ""}
                onChange={handleUserInput}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Sincere@april.biz"
                className="userEmail"
                value={slideData1.length > 0 ? UserData1.email : ""}
                onChange={handleUserInput}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="1-770-736-8031 x56442"
                className="userPhone"
                value={slideData1.length > 0 ? UserData1.phone : ""}
                onChange={handleUserInput}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="website">
              <Form.Label>website</Form.Label>
              <Form.Control
                type="text"
                placeholder="hildegard.org"
                className="userWeb"
                value={slideData1.length > 0 ? UserData1.website : ""}
                onChange={handleUserInput}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateUser}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
