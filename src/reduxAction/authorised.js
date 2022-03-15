// import * as api from "../reduxApi";

// export const getEmployeeCredentials =
//   (employeeID, password) => async (dispatch) => {
//     try {
//       const { data } = await api.fetchEmployeeCredentials(employeeID, password);
//       dispatch({ type: "AUTHORISED_LOGIN", payload: data });
//     } catch (error) {
//       console.log(error);
//     }
//   };
export const logOutEmployee = () => async (dispatch) => {
    try {
      dispatch({ type: "AUTHORISED_LOGOUT" });
    } catch (error) {
      console.log(error);
    }
  };