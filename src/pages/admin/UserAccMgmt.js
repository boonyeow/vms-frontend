import NavBar from "../../components/SharedComponents/NavBar";
import UserList from "../../components/Users/UserAccMgmtList";


const UserMgmt = () => {
  var UserSelected = false;
  return (
    <>
      <NavBar />
      <h1>User Management</h1>
      <UserList/>
    </>
  );
};
export default UserMgmt;
