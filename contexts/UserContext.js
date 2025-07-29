// // src/contexts/UserContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import { fetchUsers } from '../services/api';

// // Tạo Context
// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Hàm để lấy dữ liệu người dùng từ API
//   const loadUsers = async () => {
//     setLoading(true);
//     const data = await fetchUsers();
//     setUsers(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadUsers(); // Tự động gọi API khi component được mount
//   }, []);

//   return (
//     <UserContext.Provider value={{ users, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
// export default UserContext;

