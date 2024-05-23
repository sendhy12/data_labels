document.addEventListener("DOMContentLoaded", function () {
  let lineChart; // Variabel untuk menyimpan objek chart

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

        // Memproses data yang sudah difilter
        processFilteredData(filteredData);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Fungsi untuk memproses data yang sudah difilter
  function processFilteredData(data) {
    // Mengelompokkan total profit berdasarkan bulan
    const profitByMonth = {};
    data.forEach((item) => {
      const month = item.Month;
      const profit = parseFloat(item.Total_Profit);
      if (!profitByMonth[month]) {
        profitByMonth[month] = profit;
      } else {
        profitByMonth[month] += profit;
      }
    });

    // Mengurutkan bulan secara alfanumerik
    const months = Object.keys(profitByMonth).sort((a, b) => {
      return new Date("2000-" + a + "-01") - new Date("2000-" + b + "-01");
    });

    // Mengambil total profit yang sesuai dengan urutan bulan
    const profits = months.map((month) => profitByMonth[month]);

    // Update chart dengan data yang baru
    updateLineChart(months, profits);
  }

  // Fungsi untuk membuat grafik garis atau memperbarui data pada grafik yang sudah ada
  function updateLineChart(labels, data) {
    const ctx = document.getElementById("lineChart1").getContext("2d");
    if (lineChart) {
      lineChart.destroy(); // Hancurkan chart yang ada jika sudah ada
    }
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Profit by Month",
            data: data,
            backgroundColor: "#003049",
            borderColor: "#003049",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            align: 'top',
            color: 'black',
            formatter: function(value) {
              return new Intl.NumberFormat('id-ID', {
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 2
              }).format(value).replace('M', 'jt'); // Mengubah 'M' menjadi 'jt'
            },
            font: {
              weight: 'bold',
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "black"
            },
            border: {
              color: "black"
            }
          },
          y: {
            min: 0,
            max: 4000000,
            ticks: {
              stepSize: 1000000,
              color: "black", 
              callback: function(value) {
                return new Intl.NumberFormat('id-ID', {
                  notation: 'compact',
                  compactDisplay: 'short',
                  maximumFractionDigits: 2
                }).format(value).replace('M', 'jt'); // Mengubah 'M' menjadi 'jt'
              },
            },
            grid: {
              display: false,
            },
            border: {
              color: "black"
            }
          },
        },
      },
      plugins: [ChartDataLabels] // Menambahkan plugin ChartDataLabels
    });
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
