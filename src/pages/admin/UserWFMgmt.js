import NavBar from "../../components/SharedComponents/NavBar";
import UserWFMgmtList from "../../components/Users/UserWFMgmtList";


const UserWFMgmt = () => {
  var UserSelected = false;
  return (
    <>
      <NavBar />
      <h1>User Workflows Management</h1>
      <UserWFMgmtList/>
    </>
  );
};
export default UserWFMgmt;
