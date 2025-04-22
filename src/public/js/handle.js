// Login Form Submission
const loginForm = document.querySelector(".login");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toastr.success(data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else if (data.error) {
        toastr.error(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toastr.error("An error occurred. Please try again.");
    }
  });
}

const signupForm = document.querySelector(".signUp");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      username: document.getElementById("userName").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      rePassword: document.getElementById("rePassword").value,
    };

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toastr.success(data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else if (data.error) {
        toastr.error(data.message);
      }
    } catch (error) {
      toastr.error(error);
    }
  });
}
// Handle Logout
const handleLogout = async () => {
  try {
    const response = await fetch("/logout", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      toastr.success(data.message);

      // Đợi 2 giây trước khi chuyển hướng
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else if (data.error) {
      toastr.error(data.message);
    }
  } catch (error) {
    console.error("Error during logout:", error);
    toastr.error("An error occurred. Please try again.");
  }
};
const fetchAllUser = async () => {
  try {
    const response = await fetch("/get-users"); // Gọi API lấy dữ liệu
    const data = await response.text(); // Nhận HTML từ server
    document.querySelector(".list").innerHTML = data; // Chèn vào danh sách
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
const fetchAllProduct = async () => {
  try {
    const response = await fetch("/get-products"); // Gọi API lấy dữ liệu
    const data = await response.text(); // Nhận HTML từ server
    document.querySelector(".list").innerHTML = data;
    loadUploadScript("/js/handleUploadImage.js")
    loadUploadScript("/js/product.js")
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
function loadUploadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.defer = true;
  document.body.appendChild(script);
}
document.getElementById("allUsers").addEventListener("click", fetchAllUser);
document
  .getElementById("allProducts")
  .addEventListener("click", fetchAllProduct);

// $("#allProducts").click(function () {
//     $(".list").load("/get-products"); // Gọi route /products để hiển thị danh sách sản phẩm
// });
$(document).ready(function () {
  // Sử dụng Event Delegation
  $(document).on("click", ".edit-user", function () {
    // Lấy dữ liệu từ thuộc tính data- của nút được click
    let username = $(this).data("username");
    let email = $(this).data("email");
    let userId = $(this).data("id");

    // Hiển thị thông tin trong modal
    $("#modal-username").text(username);
    $("#modal-email").text(email);
    $(".change").data("id", userId); // Lưu userId vào nút "Thay đổi"
  });
});
$(document).ready(function () {
  // Bắt sự kiện khi nhấn nút "Thay đổi"
  $(document).on("click", ".change", async function () {
    let userId = $(this).data("id"); // Lấy userId từ nút "Thay đổi"
    let newRole = $(".role").val(); // Lấy giá trị role mới

    if (!userId || !newRole) {
      toastr.error("Lỗi: Không tìm thấy ID hoặc vai trò người dùng.");
      return;
    }

    try {
      const response = await fetch("/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        toastr.success("Cập nhật quyền thành công!");
        $("#myModal").modal("hide"); // Đóng modal

        setTimeout(() => location.reload(), 1500); // Reload để cập nhật giao diện
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      toastr.error("Không thể thay đổi quyền. Vui lòng thử lại.");
    }
  });
});

$(document).ready(function () {
  // Bắt sự kiện khi nhấn nút "delete "
  $(document).on("click", ".delete", async function () {
    let userId = $(this).data("id"); // Lấy userId từ nút "delete"

    if (!userId) {
      toastr.error("Lỗi: Không tìm thấy ID hoặc vai trò người dùng.");
      return;
    }

    try {
      console.log("delete id: ", userId);
      const response = await fetch("/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        toastr.success(data.message);
        fetchAllUser(); // Reload để cập nhật giao diện
      } else {
        toastr.error(data.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      toastr.error(error);
    }
  });
});
