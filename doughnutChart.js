document.addEventListener("DOMContentLoaded", function () {
    let donutChart; // Variabel untuk menyimpan objek chart

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
        // Mengelompokkan penjualan berdasarkan kategori sepeda
        const salesByCategory = {};
        data.forEach((item) => {
            const category = item.Sub_Category;
            const sales = parseInt(item.Order_Quantity);
            if (!salesByCategory[category]) {
                salesByCategory[category] = sales;
            } else {
                salesByCategory[category] += sales;
            }
        });

        // Menyiapkan data untuk chart
        const categories = Object.keys(salesByCategory);
        const sales = categories.map(category => salesByCategory[category]);

        // Update chart dengan data yang baru
        updateDonutChart(categories, sales);
    }

    // Fungsi untuk membuat atau memperbarui donut chart
    function updateDonutChart(labels, data) {
        const ctx = document.getElementById("doughnutChart").getContext("2d");
        if (donutChart) {
            donutChart.destroy(); // Hancurkan chart yang ada jika sudah ada
        }
        donutChart = new Chart(ctx, {
            type: "doughnut", // Mengubah tipe chart menjadi doughnut
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Total Sales by Bike Category",
                        data: data,
                        backgroundColor: [
                            "#003049",
                            "#4D6E80",
                            "#99ACB6",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: "black",
                            usePointStyle: true,
                            pointStyle: "circle",
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    },
                    datalabels: {
                        formatter: (value, ctx) => {
                            const dataset = ctx.chart.data.datasets[0];
                            const total = dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2) + '%';
                            return percentage; // Tampilkan hanya persentase
                        },
                        color: 'white', // Warna teks label
                        font: {
                            weight: 'bold', // Tebal teks label
                        }
                    }
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
