document.addEventListener("DOMContentLoaded", function () {
    let horizontalBarChart; // Variabel untuk menyimpan objek chart

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
        // Mengelompokkan produk berdasarkan jumlah penjualan
        const salesByProduct = {};
        data.forEach((item) => {
            const product = item.Product;
            const sales = parseInt(item.Order_Quantity);
            if (!salesByProduct[product]) {
                salesByProduct[product] = sales;
            } else {
                salesByProduct[product] += sales;
            }
        });

        // Mengurutkan produk dari yang terlaris
        const sortedProducts = Object.keys(salesByProduct).sort((a, b) => salesByProduct[b] - salesByProduct[a]);

        // Menyiapkan data untuk 10 produk terlaris
        const topProducts = sortedProducts.slice(0, 10);
        const sales = topProducts.map(product => salesByProduct[product]);

        // Update chart dengan data yang baru
        updateHorizontalBarChart(topProducts, sales);
    }

    // Fungsi untuk membuat atau memperbarui horizontal bar chart
    function updateHorizontalBarChart(labels, data) {
        const ctx = document.getElementById("barChart3").getContext("2d");
        if (horizontalBarChart) {
            horizontalBarChart.destroy(); // Hancurkan chart yang ada jika sudah ada
        }
        horizontalBarChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Top 10 Product Sales",
                        data: data,
                        backgroundColor: "#003049",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: "black",
                        },
                        border: {
                            color:"black"
                        }
                    },
                    x: {
                        min: 0,
                        max: 1750,
                        ticks: {
                          stepSize: 250,
                          color: "black",
                        },
                        grid: {
                          display: false,
                        },
                        border: {
                            color:"black"
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        display: true,
                        align: 'end',
                        color: 'white',
                        formatter: function(value) {
                            return new Intl.NumberFormat('id-ID', {
                                notation: 'compact',
                                compactDisplay: 'short',
                                maximumFractionDigits: 1
                            }).format(value);
                        },
                        font: {
                            weight: 'bold',
                        },
                    }
                }
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
