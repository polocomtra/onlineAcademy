// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

//paging Info
// nice select
$(document).ready(function () {
    $('select').niceSelect();
    $('.searchInput').on('focus', function () {
        $('.searchForm').css('border', 'none');
    })
    $(document).on('click', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });
    // make it as accordion for smaller screens
    if ($(window).width() < 992) {
        $('.dropdown-menu a').click(function (e) {
            e.preventDefault();
            if ($(this).next('.submenu').length) {
                $(this).next('.submenu').toggle();
            }
            $('.dropdown').on('hide.bs.dropdown', function () {
                $(this).find('.submenu').hide();
            })
        });
    }


});

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 2
        },
        1000: {
            items: 3
        }
    }
});

$('.course-carousel').owlCarousel({
    items: 4,
    loop: true,
    margin: 20,
    nav: true,
    smartSpeed: 900,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 5
        }
    },
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true
})

//Home search
//1: ascending; 0:descending
$('#search-form').submit(function () {
    let query = document.getElementById('searchBar').value;
    document.getElementById('search-form').action = `/course/search?q=${query}&p=1&price=1&view=0`;
})




