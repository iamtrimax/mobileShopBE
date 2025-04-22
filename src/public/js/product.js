document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("productModal");
    
    modal.addEventListener("hidden.bs.modal", function () {
        console.log("Modal đóng, dữ liệu đã được reset!");

        // Xóa toàn bộ dữ liệu nhập trong form
        const form = modal.querySelector("form");
        if (form) form.reset();

        // Xóa ảnh đã chọn
        document.getElementById("imageContainer").innerHTML = "";

        // Xóa file đã chọn
        document.getElementById("fileInput").value = "";
    });
});