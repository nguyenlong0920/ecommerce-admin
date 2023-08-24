import axios from "axios";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import {withSwal} from "react-sweetalert2";
import {prettyDate} from "@/lib/date";
import {useEffect, useState} from "react";

function AdminsPage({ swal }) {
    const [email, setEmail] = useState("");
    const [adminEmails, setAdminEmails] = useState([]);
    const [editedAdminEmail, setEditedAdminEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function loadAdmins() {
        setIsLoading(true);
        axios.get("/api/admins").then((res) => {
            setAdminEmails(res.data);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        loadAdmins();
    }, []);

    function addAdmin(ev) {
        ev.preventDefault();
        const httpMethod = editedAdminEmail ? axios.put : axios.post;

        httpMethod("/api/admins", {email}).then((res) => {
            swal.fire({
                title: editedAdminEmail ? "Admin edited!" : "Admin created!",
                icon: "success",
            });
            loadAdmins(); // Refresh the admin list after editing or creating an admin
        })
        .catch((err) => {
            swal.fire({
                title: "Error!",
                text: err.response.data.message,
                icon: "error",
            });
        })
        .finally(() => {
            setEditedAdminEmail(null);
            setEmail("");
        });
    }

    function saveAdmin() {
        const apiEndpoint = editedAdminEmail ? `/api/admins?_id=${editedAdminEmail._id}` : "/api/admins";
        const httpMethod = editedAdminEmail ? axios.put : axios.post;

        httpMethod(apiEndpoint, {email}).then((res) => {
            const successMessage = editedAdminEmail ? "Admin updated!" : "Admin created!";
            swal.fire({
                title: successMessage,
                icon: "success",
            });
            loadAdmins(); // Refresh the admin list after the update or creation
        })
            .catch((err) => {
                swal.fire({
                    title: "Error!",
                    text: err.response.data.message,
                    icon: "error",
                });
            })
            .finally(() => {
                setEmail("");
                setEditedAdminEmail(null);
            });
    }

    function editAdmin(adminEmail) {
        setEditedAdminEmail(adminEmail);
        setEmail(adminEmail.email);
    }

    function cancelEdit() {
        setEditedAdminEmail(null);
        setEmail("");
    }

    function deleteAdmin(_id, email) {
        // Check if it's the last admin before deleting
        axios.get("/api/admins").then((res) => {
            const remainingAdmins = res.data;
            if (remainingAdmins.length === 1) {
                swal.fire({
                    title: "Warning",
                    text: "This is the last admin. At least one admin is required.",
                    icon: "warning",
                });
            } else {
                swal
                    .fire({
                        title: "Are you sure?",
                        text: `Do you want to delete admin "${email}"?`,
                        showCancelButton: true,
                        cancelButtonText: "Cancel",
                        confirmButtonText: "Yes, Delete!",
                        confirmButtonColor: "#d55",
                        reverseButtons: true,
                    })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            axios.delete(`/api/admins?_id=${_id}`).then(() => {
                                swal.fire({
                                    title: "Admin deleted!",
                                    icon: "success",
                                });
                                loadAdmins();
                            });
                        }
                    });
            }
        });
    }

    return (
        <Layout>
            <h1>Admins</h1>
            <h2>{editedAdminEmail ? `Edit admin email "${editedAdminEmail.email}"` : 'Add new admin'}</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input
                        className="mb-0"
                        type="text"
                        placeholder="Google email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    {!editedAdminEmail && (
                        <button type="submit" className="btn-primary py-1 whitespace-nowrap">
                            Add admin
                        </button>
                    )}

                    {editedAdminEmail && (
                        <div className="flex gap-1">
                            <button className="btn-default" type="button" onClick={cancelEdit}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary py-1 whitespace-nowrap"
                                    onClick={saveAdmin}>
                                Save
                            </button>
                        </div>
                    )}
                </div>

            </form>
            <h2>Existing Admin</h2>
            <table className="basic text-center">
                <thead>
                    <tr>
                        <th>Admin Google email</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={3}>
                            <div className="py-4">
                                <Spinner fullwidth={true}/>
                            </div>
                        </td>
                    </tr>
                ) : adminEmails.length > 0 ? (adminEmails.map((adminEmail) => (
                    <tr key={adminEmail._id}>
                        <td>{adminEmail.email}</td>
                        <td>{adminEmail.createdAt && prettyDate(adminEmail.createdAt)}</td>
                        <td>
                            <button onClick={() => editAdmin(adminEmail)} className="btn-default w-24">
                                <span className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth={1.5}
                                         stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                    </svg>
                                    Edit
                                </span>
                            </button>
                            <button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)}
                                    className="btn-red w-24">
                                <span className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth={1.5}
                                         stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round"  strokeLinejoin="round"
                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                    </svg>
                                    Delete
                                </span>
                            </button>
                        </td>
                    </tr>
                ))) : (
                    <tr>
                        <td colSpan={3}>No admin emails found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }) => <AdminsPage swal={swal} />);