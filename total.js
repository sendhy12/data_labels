document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("filterForm");

  // Tambahkan event listener untuk setiap perubahan pada dropdown
  filterForm.addEventListener("change", applyFilters);

  // Fungsi untuk mengambil data dan menerapkan filter
  function applyFilters() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        const selectedQuarter = document.getElementById("quarters").value;
        const selectedYear = document.getElementById("year").value;
        const selectedCountry = document.getElementById("country").value;
        const selectedCategory = document.getElementById("bikes-category").value;
        const selectedAgeGroup = document.getElementById("age-group").value;
        const selectedGender = document.getElementById("gender").value;

        // Filter data berdasarkan pilihan dropdown
        const filteredData = data.filter((item) => {
          const itemQuarter = getQuarter(item.Date);

          return (
            (selectedQuarter === "All" || itemQuarter === selectedQuarter) &&
            (selectedYear === "All" || item.Year === selectedYear) &&
            (selectedCountry === "All" || item.Country === selectedCountry) &&
            (selectedCategory === "All" || item.Sub_Category === selectedCategory) &&
            (selectedAgeGroup === "All" || item.Age_Group === selectedAgeGroup) &&
            (selectedGender === "All" || item.Customer_Gender === selectedGender)
          );
        });

        // Hitung total berdasarkan data yang difilter
        let totalCost = 0;
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalSales = 0;
        let totalTransactions = filteredData.length;

        filteredData.forEach((item) => {
          totalCost += parseFloat(item.Total_Cost);
          totalRevenue += parseFloat(item.Total_Revenue);
          totalProfit += parseFloat(item.Total_Profit);
          totalSales += parseInt(item.Order_Quantity);
        });

        // Menampilkan informasi pada masing-masing section dengan format angka
        document.getElementById("totalCost").innerHTML = `${totalCost.toLocaleString()} €`;
        document.getElementById("totalRevenue").innerHTML = `${totalRevenue.toLocaleString()} €`;
        document.getElementById("totalProfit").innerHTML = `${totalProfit.toLocaleString()} €`;
        document.getElementById("totalSales").innerHTML = `${totalSales.toLocaleString()}`;
        document.getElementById("totalTransactions").innerHTML = `${totalTransactions.toLocaleString()}`;
      })
      .catch((error) => console.error("Error:", error));
  }

  // Fungsi untuk mendapatkan kuartal dari tanggal
  function getQuarter(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    if (month <= 3) {
      return "Quarters 1";
    } else if (month <= 6) {
      return "Quarters 2";
    } else if (month <= 9) {
      return "Quarters 3";
    } else {
      return "Quarters 4";
    }
  }

  // Panggil applyFilters saat halaman pertama kali dimuat
  applyFilters();
});
