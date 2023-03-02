import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Code to submit login form to server
  };

  return (
    <div className=" vh-100 container-fluid d-flex justify-content-center align-items-center">
      <section className="row justify-content-center border p-3">
        <div className="col-12">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group row">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                    style={{ height: "100%" }}
                  >
                    <FaUserAlt />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="User ID"
                  value={userId}
                  onChange={handleUserIdChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mt-2">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                    style={{ height: "100%" }}
                  >
                    <RiLockPasswordFill />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="*******"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <div className="form-group text-end mt-2">
              <button type="submit" className="btn btn-primary ">
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
