import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Assuming you are using next-auth for authentication
import ImageUploader from "./ImageUploader"; // Assuming ImageUploader is a separate component
import { FaEdit } from "react-icons/fa"; // Pencil icon for editing
import { useToast } from "@/components/ui/ToastProvider"; // Assuming you're using a toast provider
import Image from "next/image";

const Logo = () => {
    const { data: session } = useSession();
    const { showToast } = useToast();
    const [logo, setLogo] = useState(null);
    const [image, setImage] = useState(null);

    // Fetch the logo from the database on component load
    useEffect(() => {
        async function fetchLogo() {
            const res = await fetch("/api/logo?type=logo");
            const data = await res.json();
            if (data?.url) {
                setLogo(data); // Set logo if found in the database
            } else {
                showToast("Logo not found", "error");
            }
        }

        fetchLogo();
    }, []);

    // Handle logo submission (POST request)
    const handleSubmit = async () => {
        if (!image) {
            showToast("Please upload an image", "error");
            return;
        }

        try {
            const res = await fetch("/api/logo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "logo", // Type is "logo" for this case
                    url: image.url,
                    publicId: image.publicId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setLogo(data); // Update the logo displayed
                document.getElementById("my_modal_1").close(); // Close the modal
                showToast("Logo uploaded successfully", "success");
            } else {
                showToast(data.message || "Failed to upload logo", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
        }
    };


    return (
        <div className="relative text-black">
            <div className="flex justify-center items-center">
                {/* Display logo */}
                {logo ? (
                    <Image
                        src={logo.url}
                        alt="Logo"
                        width={500}
                        height={500}
                        className="object-cover rounded-full"
                    />
                ) : (
                    <p className="text-black text-lg">{process.env.NEXT_PUBLIC_WEB_TITLE}</p>
                )}

                {/* Show the pencil icon only for admin/manager */}
                {session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER" ? (
                    <button
                        className="absolute top-0 right-0 text-2xl text-blue-600 hover:text-blue-800"
                        onClick={() => document.getElementById("my_modal_1").showModal()}
                    >
                        <FaEdit />
                    </button>
                ) : null}
            </div>

            {/* Modal for uploading logo */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h2 className="text-xl mb-4 text-blue-500">Upload Logo</h2>
                    <ImageUploader onUpload={(img) => setImage(img)} />
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <form method="dialog">
                            {/* Close button for the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Logo;
