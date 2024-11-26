// "use client";
// import UserService from "@/services/RestAPI/requests/userService";
// import { IUser } from "@/types/user/IUser";
// import { AxiosError } from "axios";
// import { useState } from "react";

// export default function Users() {
//     const [users, setUsers] = useState<IUser[]>([]);

//     const fetchUsers = () => {
//         UserService.getUsers()
//             .then(response => {
//                 setUsers(response.data);
//             })
//             .catch(err => {
//                 if (err instanceof AxiosError && err.response) {
//                     const serverErrors = err.response.data;
//                     console.log(serverErrors);
//                 }
//             });
//     }

//     return (
//         <>
//             <button
//                 onClick={fetchUsers}
//             >
//                 Get users
//             </button>

//             <ul>
//                 {users.map(user => (
//                     <li key={user.id}>
//                         <div>
//                             <h3>{user.name} {user.surname}</h3>
//                             <p>Username: {user.username}</p>
//                             <p>Email: {user.email}</p>
//                             <p>Role: {user.role}</p>
//                             <p>Status: {user.isActivated ? 'Activated' : 'Not Activated'}</p>
//                             <p>IP: {user.ip}</p>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </>
//     );
// }