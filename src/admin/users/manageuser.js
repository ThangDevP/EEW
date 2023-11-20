const myModal = new bootstrap.Modal(document.getElementById("myModal"));
document.querySelector(".btn-close-myModal").addEventListener("click", () => {
  myModal.hide();
  document.querySelector(".modal-backdrop").remove();
});
document.addEventListener("DOMContentLoaded", function () {
  isAuthenticated()
    .then((isUserAuthenticated) => {
      if (isUserAuthenticated) {
        console.log('User is not authenticated');
      }
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
    });
});

function isAuthenticated() {
  const userID = localStorage.getItem('userID');

  if (userID !== null) {
    fetch(`/api/users/${userID}`)
      .then(response => response.json())
      .then(user => {
        if (user && user.role === 'user') {
          window.location.href = '/';
        } else {
          fetchDataAndPopulateTable();
        }
      })
  }
}
function fetchDataAndPopulateTable() {
  const role = "user"; // Đặt giá trị role bạn muốn fetch
  fetch(`/api/users?role=${role}`)
    .then((response) => response.json())
    .then((data) => {
      const userCount = data.length;
        document.getElementById("userCount").textContent = userCount;
      const userTableBody = document.getElementById("userTableBody");
      userTableBody.innerHTML = ""; // Xóa dữ liệu cũ trong bảng

      data.forEach((user) => {
        const row = userTableBody.insertRow();
        const avatarCell = row.insertCell(0);
        const fullNameCell = row.insertCell(1);
        const emailCell = row.insertCell(2);
        const dobCell = row.insertCell(3);
        const phoneNumberCell = row.insertCell(4);

        fullNameCell.textContent = user.username;
        emailCell.textContent = user.email;
        avatarCell.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 150px; height: 150px;">`;
        phoneNumberCell.textContent = user.phoneNumber || "";
        dobCell.textContent = user.dob || "";

        const updateButton = document.createElement("a");
        updateButton.textContent = "Xem thêm";
        updateButton.className = "btn btn-sm btn-neutral";
        updateButton.href = "#";
        updateButton.setAttribute("data-bs-toggle", "modal");
        updateButton.setAttribute("data-bs-target", "#myModal");
        updateButton.addEventListener("click", () => {
          console.log("View button clicked");
          const userId = user.id;
          fetchAndPopulateUserData(userId);
        });

        const deleteButton = document.createElement("a");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-sm btn-neutral";
        deleteButton.href = "#";
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteModal");
        deleteButton.innerHTML =
          '<span class="mt-1"><i class="bi bi-trash"></i></span';
        deleteButton.addEventListener("click", () => {
          // Lưu userId vào thuộc tính data để sử dụng trong modal
          deleteModal.dataset.userId = user.id;
        });

        // Xác nhận xóa
        const deleteConfirmButton = document.querySelector(".deletebtn");
        deleteConfirmButton.addEventListener("click", () => {
          // Lấy userId từ thuộc tính data
          const userId = deleteModal.dataset.userId;

          fetch(`/api/users/${userId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(() => {
              const rowToDelete = deleteButton.closest("tr");
              rowToDelete.remove();
              deleteModal.hide();
              // Đóng modal xác nhận xóa
              const deleteModal = new bootstrap.Modal(
                document.getElementById("deleteModal")
              );
            })
            .catch((error) => {
              console.error("Lỗi khi xóa user: ", error);
            });
            fetchDataAndPopulateTable();
        });
        const actionCell = row.insertCell(5);
        actionCell.classList.add("text-end");
        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    });
  }

function fetchAndPopulateUserData(userId) {
  fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((userData) => {
      const modal = document.getElementById("myModal");
      const userIDInput = modal.querySelector("#userID");
      const usernameInput = modal.querySelector("#username");
      const emailInput = modal.querySelector("#email");
      const addressInput = modal.querySelector("#address");
      const phoneNumberInput = modal.querySelector("#phoneNumber");
      const avatarInput = modal.querySelector("#avatar");
      const previewImage = modal.querySelector("#previewImage"); // Add this line

      userIDInput.value = userData.id;
      usernameInput.value = userData.username;
      emailInput.value = userData.email;
      addressInput.value = userData.address;
      phoneNumberInput.value = userData.phoneNumber;
      previewImage.src = userData.avatar || "/1.jpg"; // Change "/1.jpg" to your default image URL

      // Update modal for the new avatar input
      // Update modal for the new avatar input
      avatarInput.value = userData.avatar;
      previewImage.src = userData.avatar; // Set the source of the preview image

      const myModal = new bootstrap.Modal(modal);
      myModal.show();
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu người dùng: ", error);
    });
}

async function handleUpload(avatarInput, folderName) {
  if (avatarInput.files.length > 0) {
    // Create a new FormData just for Cloudinary upload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", avatarInput.files[0]); // Cloudinary expects 'file' as the parameter name
    cloudinaryFormData.append("folder", folderName); // Specify the folder name

    const uploadPreset = "zjyg5sbx"; // Replace with your actual upload preset name

    // Gửi file avatar lên Cloudinary
    return fetch(
      `https://api.cloudinary.com/v1_1/darhyd9z6/upload?upload_preset=${uploadPreset}`,
      {
        method: "POST",
        body: cloudinaryFormData, // Send the new FormData specifically for Cloudinary
      }
    )
      .then((response) => response.json())
      .then((cloudinaryData) => {
        return cloudinaryData.secure_url;
      });
  }
}
async function handleImageChange() {
  const avatarInput = document.getElementById("avatar");
  const previewImage = document.getElementById("previewImage");
  const loadingSpinnerModal = document.getElementById("loadingSpinner");
  const editButtonText = document.getElementById("editButtonText");
  try{
    if (avatarInput.files.length > 0) {
      loadingSpinnerModal.querySelector('.spinner-border').style.display = "inline-block";
      editButtonText.style.display = "none";
      const imageUrl = await handleUpload(avatarInput, "users");
      previewImage.src = imageUrl; // Set the source of the preview image to the uploaded image
      loadingSpinnerModal.querySelector('.spinner-border').style.display = "none";
      editButtonText.style.display = "inline";
    }
  } catch (error){
    console.error("Error uploading image: ", error);
    loadingSpinnerModal.querySelector('.spinner-border').style.display = "none";
    editButtonText.style.display = "inline";
  }
}
async function handleAddOrUpdateUser() {
  const userId = document.getElementById("userID").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const avatarInput = document.getElementById("avatar");

  try {
    // Lấy giá trị cũ của người dùng
    const response = await fetch(`/api/users/${userId}`);
    const oldUserData = await response.json();

    // Thực hiện kiểm tra xem có đủ thông tin hay không
    if (!username || !email || !oldUserData) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const urlImage = await handleUpload(avatarInput, "users");

    // Update user data
    const updatedUserData = {
      username,
      email,
      address,
      phoneNumber,
      avatar: urlImage || oldUserData.avatar,
      role: oldUserData.role,
      gender: oldUserData.gender,
      dob: oldUserData.dob,
      password: oldUserData.password, // Giữ nguyên giá trị cũ của role
    };

    // Gửi yêu cầu cập nhật người dùng đến API
    const apiUrl = `/api/users/${userId}`;
    const apiResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    });
    if (!apiResponse.ok) {
      throw new Error(`HTTP error! Status: ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    console.log("API response:", responseData);
    // Refresh bảng để hiển thị thông tin mới
    
    fetchDataAndPopulateTable();
    previewImage.src = urlImage || oldUserData.avatar;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng: ", error);
  }
}

const addButton = document.querySelector(".view");
addButton.addEventListener("click", () => {
  handleAddOrUpdateUser();
});
function logoutUser() {
  // Display a confirmation dialog
  const confirmLogout = confirm("Are you sure you want to logout?");

  // If the user confirms, proceed with logout
  if (confirmLogout) {
    // Clear localStorage
    localStorage.clear();

    // Redirect the user to the home page ("/" in this case)
    window.location.href = "/";
  }

  // If the user cancels, do nothing
  return false;
}
