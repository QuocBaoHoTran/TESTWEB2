import { loadData } from "./loadData.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Tải dữ liệu sản phẩm từ JSON (hoặc localStorage)
    const data = await loadData("json/SanPham.json", "SanPham");
    console.log("📦 Dữ liệu sản phẩm:", data);

  // 2️⃣ Các phần cần ẩn khi lọc thể loại
    const listimageSection = document.querySelector('.listimage');
    const sliderSection = document.querySelector('.slidecontainer')
    const banchaySection = document.querySelector('[data-category-section="ban-chay"]');
    const noibatSection = document.querySelector('[data-category-section="noi-bat"]');
    const moiSection = document.querySelector('[data-category-section="moi"]');
    const backHomeBtn = document.getElementById("back-home");

  // 3️⃣ Khu vực hiển thị kết quả
    const container = document.getElementById("product-list-kqtk");
    const title = document.querySelector(".section-box[data-category-section='ketquatimkiem'] h1");
    const ketQuaSection = document.querySelector('[data-category-section="ketquatimkiem"]');
  // 4️⃣ Hàm hiển thị sản phẩm theo thể loại

    function formatPrice(price) {
        if (!price) return "Liên hệ";
        // Chuyển sang số rồi format có dấu chấm
        const num = parseInt(price);
        return isNaN(num) ? "Liên hệ" : num.toLocaleString("vi-VN");
    }

    function showCategory(category) {
        console.log("🔍 Đang lọc thể loại:", category);
        // An banner khac
        sliderSection.style.display = "none"
        listimageSection.style.display = "none"
        banchaySection.style.display=" none"
        noibatSection.style.display = "none"
        moiSection.style.display = "none"

        if (ketQuaSection) ketQuaSection.style.display = "block";
        backHomeBtn.style.display = "block";
        container.innerHTML = "";
        title.textContent = `Thể loại: ${category}`;

        const filtered = data.filter(
            sp => sp.theloai && sp.theloai.toLowerCase() === category.toLowerCase()
        );
        console.log("📘 Sản phẩm lọc được:", filtered);

        if (filtered.length === 0) {
            container.innerHTML = "<p>Không có sản phẩm nào trong thể loại này.</p>";
            return;
        }

        filtered.forEach(sp => {
            const div = document.createElement("div");
            div.className = "product-card";
            // ✅ fix lỗi đường dẫn ảnh
            const imgSrc = sp.img?.startsWith("img/")
            ? `./${sp.img}`
            : sp.img || "https://placehold.co/200x300?text=Ảnh+lỗi";
            div.innerHTML = `
            <img src="${imgSrc}" alt="${sp.name}"
                onerror="this.src='https://placehold.co/200x300?text=Ảnh+lỗi';">
            <p class="title">${sp.name}</p>
            <p class="price">${formatPrice(sp.price)} VNĐ</p>

            `;
            container.appendChild(div);
        });
        console.log("✅ Container HTML:", container.innerHTML);
        console.log("✅ Container hiển thị:", getComputedStyle(container).display);
        console.log("✅ Section hiển thị:", getComputedStyle(ketQuaSection).display);
        console.log("✅ Đã render sản phẩm vào:", container);
}



// 5️⃣ Gán sự kiện cho tất cả các nút thể loại
    const allCategoryBtns = document.querySelectorAll("#sach_truyen a");
        allCategoryBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const id = btn.id; // ví dụ: tamlyhoc, vanhoc, ...
            showCategory(id);
        });
    });


    backHomeBtn.addEventListener("click", () => {
    // Ẩn section kết quả
        ketQuaSection.style.display = "none";
        backHomeBtn.style.display = "none";
        // Hiện lại các section chính (banner, bán chạy, mới, nổi bật)
        sliderSection.style.display = "block"
        listimageSection.style.display = ""
        banchaySection.style.display=" block"
        noibatSection.style.display = "block"
        moiSection.style.display = "block"


        
        // Ẩn nút quay về
        console.log("🏠 Đã quay về trang chính");
    });


    //Chức năng tìm kiếm & lọc sản phẩm 



//  Gán sự kiện cho tất cả các nút thể loại
    const theloaiBtns = document.querySelectorAll("#sach_truyen a");
        theloaiBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const id = btn.id; // ví dụ: tamlyhoc, vanhoc, ...
            showCategory(id);
        });
    });



// --- Hàm hiển thị kết quả tìm kiếm ---
    function showSearchResult(filtered, keyword) {
    // Ẩn các phần khác
        sliderSection.style.display = "none";
        listimageSection.style.display = "none";
        banchaySection.style.display = "none";
        noibatSection.style.display = "none";
        moiSection.style.display = "none";

    // Hiện khu vực kết quả + nút quay về
        ketQuaSection.style.display = "block";
        backHomeBtn.style.display = "block";

    // Gán tiêu đề
        title.textContent = keyword
            ? `Kết quả tìm kiếm: "${keyword}"`
            : "Kết quả lọc sản phẩm";

    // Xóa nội dung cũ
        container.innerHTML = "";

    // Nếu không có kết quả
        if (!filtered.length) {
            container.innerHTML = `<p>Không tìm thấy sản phẩm nào phù hợp.</p>`;
            return;
        }

    // Hiển thị sản phẩm tìm thấy
        filtered.forEach(sp => {
            const div = document.createElement("div");
            div.className = "product-card";
            const imgSrc = sp.img?.startsWith("img/")
            ? `./${sp.img}`
            : sp.img || "https://placehold.co/200x300?text=Ảnh+lỗi";
            div.innerHTML = `
            <img src="${imgSrc}" alt="${sp.name}"
                onerror="this.src='https://placehold.co/200x300?text=Ảnh+lỗi';">
            <p class="title">${sp.name}</p>
            <p class="price">${formatPrice(sp.price)} VNĐ</p>
            `;
            container.appendChild(div);
        });
    }

    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("submit_btn");
    const filterBtn = document.getElementById("filter-btn");
    const filterForm = document.getElementById("filter-form");
    const filterSelect = filterForm.querySelector("select");
    const minInput = document.getElementById("minRange");
    const maxInput = document.getElementById("maxRange");

    filterBtn.addEventListener("click", () => {
        filterForm.style.display =
        filterForm.style.display === "block" ? "none" : "block";
    });

    searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
        const keyword = searchInput.value.trim().toLowerCase();
        const min = parseInt(minInput.value) || 0;
        const max = parseInt(maxInput.value) || Infinity;
        const sortType = filterSelect.value;

        const data = JSON.parse(localStorage.getItem("SanPham")) || [];
        let filtered = data.filter(
        sp =>
            (sp.name && sp.name.toLowerCase().includes(keyword)) ||
            (sp.theloai && sp.theloai.toLowerCase().includes(keyword))
        );

        filtered = filtered.filter(sp => {
            const price = parseInt(sp.price) || 0;
            return price >= min && price <= max;
        });

        if (sortType === "Thấp đến cao") {
            filtered.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        } else if (sortType === "Cao đến thấp") {
            filtered.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        }

        showSearchResult(filtered, keyword);
    });

    // ✅ Cho phép nhấn Enter để tìm kiếm
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchBtn.click(); // Giả lập hành động bấm nút tìm kiếm
        }
    });


});











