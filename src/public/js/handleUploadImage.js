const url = `https://api.cloudinary.com/v1_1/djijqsmz8/image/upload`;
const imageClass = document.getElementById("imageContainer");

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mobile_product");

    const dataRes = await fetch(url, {
      method: "post",
      body: formData,
    });
    data = await dataRes.json();
    return data.secure_url;
  } catch (error) {
    console.log(error);
  }
};
console.log("file handleUp");

// const observer = new MutationObserver(() => {
//   const modal = document.getElementById("productModal");
//   if (modal) {
//     console.log("Modal đã xuất hiện!");
//     observer.disconnect(); // Dừng quan sát
//     setupModal(); // Gọi hàm để gắn sự kiện cho modal
//   }
// });
// observer.observe(document.body, { childList: true, subtree: true });

// function setupModal() {
//   const modal = document.getElementById("productModal");
//   if (!modal) return;

//   const bsModal = new bootstrap.Modal(modal); // Khởi tạo modal nếu cần

//   modal.addEventListener("shown.bs.modal", function () {
//     console.log("Modal đã mở!");
//     const fileInput = document.getElementById("fileInput");
//     if (fileInput) {
//       fileInput.addEventListener("change", handleUploadImage);
//     } else {
//       console.error("Không tìm thấy phần tử #fileInput");
//     }
//   });
// }

// Gán sự kiện change cho fileInput
document.addEventListener("change", function (e) {
  if (e.target && e.target.id === "fileInput") {
    handleUploadImage(e);
  }
});
const handleUploadImage = async (e) => {
  const files = e.target.files; // Lấy danh sách file
  console.log(files);

  if (!files || files.length === 0) return;
 // imageClass.innerHTML = "";

  for (const file of files) {
    // Lặp qua từng file
    const imgURL = await uploadImage(file);
    console.log("url files", imgURL);

    if (imgURL) displayImg(imgURL);
  }
};

const displayImg = (imgURL) => {
  const imgElement = document.createElement("img");
  imgElement.classList.add("imgProduct");
  imgElement.src = imgURL;
  imageClass.appendChild(imgElement);
};
