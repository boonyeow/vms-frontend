import NavBar from "../../components/SharedComponents/NavBar";
import UserAccMgmtList from "../../components/Users/UserAccMgmtList";


const UserAccMgmt = () => {
  return (
    <>
      <NavBar />
      <h1>User Management</h1>
      <UserAccMgmtList/>
    </>
  );
};
export default UserAccMgmt;
