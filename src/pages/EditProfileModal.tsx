import { FC, useState } from "react";
import EditProfileModal from "../EditProfile/EditProfileModal";


interface EditProfileFormProps {
  onClose: () => void;
}

const EditProfileForm: FC<EditProfileFormProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Thêm các state khác nếu cần thiết

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Thực hiện logic để cập nhật thông tin người dùng vào Firebase Firestore
    // Sau khi cập nhật xong, đóng form chỉnh sửa Profile
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 p-2 border rounded-lg w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-2 border rounded-lg w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Thêm các trường dữ liệu khác ở đây */}
        <div className="flex justify-end">
          <button type="button" className="mr-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
