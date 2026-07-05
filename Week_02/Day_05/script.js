/*==========================================
        SALESFLOW CRM DASHBOARD
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==========================================
                SELECT ELEMENTS
    ==========================================*/

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".overlay");
    const greeting = document.getElementById("greeting");
    const searchInput = document.querySelector(".search input");
    const tableRows = document.querySelectorAll("tbody tr");
    const sidebarItems = document.querySelectorAll(".sidebar li");
    const notificationIcons = document.querySelectorAll(".icon");
    const closeBtn = document.querySelector(".close-menu");
    /*==========================================
                SIDEBAR TOGGLE
    ==========================================*/

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.add("show");

            overlay.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    }

    /*==========================================
                CLOSE SIDEBAR
    ==========================================*/

    if (overlay) {

        overlay.addEventListener("click", () => {

            sidebar.classList.remove("show");
            overlay.classList.remove("show");
            document.body.style.overflow = "auto";

        });

    }



    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            sidebar.classList.remove("show");

            overlay.classList.remove("show");

            document.body.style.overflow = "auto";

        }

    });

    /*==========================================
            CLOSE SIDEBAR AFTER CLICK
    ==========================================*/

    sidebarItems.forEach(item => {

        item.addEventListener("click", () => {

            sidebar.classList.remove("show");
            overlay.classList.remove("show");

        });

    });

    /*==========================================
                DYNAMIC GREETING
    ==========================================*/

    const hour = new Date().getHours();

    let message = "";

    if (hour >= 5 && hour < 12) {

        message = "☀️ Good Morning, Mohsin";

    }
    else if (hour >= 12 && hour < 17) {

        message = "🌤 Good Afternoon, Mohsin";

    }
    else if (hour >= 17 && hour < 21) {

        message = "🌇 Good Evening, Mohsin";

    }
    else {

        message = "🌙 Good Night, Mohsin";

    }

    if (greeting) {

        greeting.textContent = message;

    }

    /*==========================================
            SEARCH FILTER
    ==========================================*/

    if (searchInput) {

        searchInput.addEventListener("keyup", () => {

            const value = searchInput.value.toLowerCase();

            tableRows.forEach(row => {

                const text = row.innerText.toLowerCase();

                if (text.includes(value)) {

                    row.style.display = "";

                }
                else {

                    row.style.display = "none";

                }

            });

        });

    }

    /*==========================================
            ACTIVE SIDEBAR ITEM
    ==========================================*/

    sidebarItems.forEach(item => {

        item.addEventListener("click", () => {

            sidebarItems.forEach(nav => {

                nav.classList.remove("active");

            });

            item.classList.add("active");

        });

    });



    /*Close Sidebar on clicking the close button*/
    closeBtn.addEventListener("click", () => {

        sidebar.classList.remove("show");

        overlay.classList.remove("show");

        document.body.style.overflow = "auto";

    });

    /*==========================================
            NOTIFICATION ANIMATION
    ==========================================*/

    notificationIcons.forEach(icon => {

        icon.addEventListener("mouseenter", () => {

            icon.style.transform = "scale(1.12)";

        });

        icon.addEventListener("mouseleave", () => {

            icon.style.transform = "scale(1)";

        });

    });

    /*==========================================
            KPI CARD ANIMATION
    ==========================================*/

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {

            card.style.transition = ".5s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, index * 150);

    });

    /*==========================================
            ACTION BUTTON RIPPLE
    ==========================================*/

    const buttons = document.querySelectorAll(".action-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            button.style.transform = "scale(.96)";

            setTimeout(() => {

                button.style.transform = "scale(1)";

            }, 120);

        });

    });

});