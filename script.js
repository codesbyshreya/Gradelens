document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. THEME HANDLING (Light / Dark Mode)
    // ==========================================
    const savedTheme = localStorage.getItem("theme");

    // Apply saved theme on initial page load
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        document.documentElement.setAttribute("data-theme", "light");
    }

    // A. Theme Toggle for Welcome / Login Pages (#themeToggle)
    const themeToggle = document.querySelector("#themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            toggleTheme();
        });
    }

    // B. Dark Mode Button for Teacher Dashboard (.dark-mode-btn / #darkModeBtn)
    const darkModeBtn = document.querySelector(".dark-mode-btn, #darkModeBtn");
    if (darkModeBtn) {
        updateDashboardThemeBtn(document.body.classList.contains("dark-mode"));
        darkModeBtn.addEventListener("click", function () {
            toggleTheme();
        });
    }

    function toggleTheme() {
        const isDark = document.body.classList.toggle("dark-mode");
        const currentTheme = isDark ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);

        updateDashboardThemeBtn(isDark);

        // Re-render chart colors if charts are present
        if (window.renderTeacherCharts) {
            window.renderTeacherCharts(currentTheme);
        }
    }

    function updateDashboardThemeBtn(isDark) {
        if (!darkModeBtn) return;
        darkModeBtn.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }

    // ==========================================
    // 2. ROLE SELECTION ROUTING (welcome.html)
    // ==========================================
    const studentBtn = document.querySelector("#studentBtn");
    const teacherBtn = document.querySelector("#teacherBtn");

    if (studentBtn) {
        studentBtn.addEventListener("click", function () {
            window.location.href = "student-login.html";
        });
    }

    if (teacherBtn) {
        teacherBtn.addEventListener("click", function () {
            window.location.href = "teacher-login.html";
        });
    }

    // ==========================================
    // 3. LOGIN FORMS (Teacher & Student)
    // ==========================================
    const teacherLoginForm = document.querySelector("#teacherLoginForm");
    if (teacherLoginForm) {
        teacherLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            window.location.href = "teacher.html";
        });
    }

    const studentLoginForm = document.querySelector("#studentLoginForm");
    if (studentLoginForm) {
        studentLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            window.location.href = "student-dashboard.html";
        });
    }

    // ==========================================
    // 4. SIGNUP FORMS WITH MATCH VALIDATION
    // ==========================================
    const teacherSignupForm = document.querySelector("#teacherSignupForm");
    if (teacherSignupForm) {
        teacherSignupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const pass = document.querySelector("#teacherPassword")?.value;
            const confirmPass = document.querySelector("#teacherConfirmPassword")?.value;

            if (pass && confirmPass && pass !== confirmPass) {
                alert("Passwords do not match. Please verify.");
                return;
            }
            window.location.href = "teacher-login.html";
        });
    }

    const studentSignupForm = document.querySelector("#studentSignupForm");
    if (studentSignupForm) {
        studentSignupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const pass = document.querySelector("#studentPassword")?.value;
            const confirmPass = document.querySelector("#studentConfirmPassword")?.value;

            if (pass && confirmPass && pass !== confirmPass) {
                alert("Passwords do not match. Please verify.");
                return;
            }
            window.location.href = "student-login.html";
        });
    }
// ==========================================
// 5. TEACHER DASHBOARD CHARTS
// ==========================================

const performanceCanvas = document.querySelector("#performanceChartCanvas");
const attendanceCanvas = document.querySelector("#attendanceChartCanvas");

if (performanceCanvas && attendanceCanvas && window.Chart) {

    let performanceChart = null;
    let attendanceChart = null;

    window.renderTeacherCharts = function (theme) {

        const isDark = theme === "dark";

        const textColor = isDark ? "#94a3b8" : "#64748b";
        const gridColor = isDark ? "#1e293b" : "#edeef5";

        // ------------------------------------------
        // Subject Performance Chart
        // ------------------------------------------

        if (performanceChart) {
            performanceChart.destroy();
        }

        performanceChart = new Chart(
            performanceCanvas.getContext("2d"),
            {
                type: "bar",

                data: {
                    labels: [
                        "UHV-II", 
                        "Maths-III", 
                        "DLDCA", 
                        "DBMS", 
                        "DSUJ"
                    ],

                    datasets: [
                        {
                            label: "Class Average (%)",

                            data: [
                                78,
                                82,
                                74,
                                85,
                                79
                            ],

                            backgroundColor: "#8b5cf6",

                            borderRadius: 6
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: false
                        }
                    },

                    scales: {

                        y: {
                            beginAtZero: true,
                            max: 100,

                            ticks: {
                                color: textColor,
                                stepSize: 20
                            },

                            grid: {
                                color: gridColor
                            }
                        },

                        x: {
                            ticks: {
                                color: textColor
                            },

                            grid: {
                                display: false
                            }
                        }

                    }
                }
            }
        );


        // ------------------------------------------
        // Attendance Chart
        // ------------------------------------------

        if (attendanceChart) {
            attendanceChart.destroy();
        }

        attendanceChart = new Chart(
            attendanceCanvas.getContext("2d"),
            {
                type: "doughnut",

                data: {
                    labels: [
                        "Present",
                        "Absent",
                        "Late"
                    ],

                    datasets: [
                        {
                            data: [
                                91.2,
                                5.4,
                                3.4
                            ],

                            backgroundColor: [
                                "#06b6d4",
                                "#ec4899",
                                "#f59e0b"
                            ],

                            borderWidth: 0
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "bottom",

                            labels: {
                                color: textColor,
                                boxWidth: 10,

                                font: {
                                    size: 11
                                }
                            }
                        }

                    },

                    cutout: "72%"
                }
            }
        );

    };


    // Render charts using the current theme

    const activeTheme =
        document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

    window.renderTeacherCharts(activeTheme);

}
});


