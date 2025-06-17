// Fetch Future Career
$(document).ready(function () {
  const API_URL =
    "https://www.ehlcrm.theskyroute.com/api/test/top-future-career";
  const itemsPerPage = 8;
  let careers = [];
  let currentPage = 1;

  const $careerCards = $("#careerCards");
  const $pagination = $("#pagination");

  const skeletonCard = `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="placeholder-glow">
          <div class="card-img-top bg-light placeholder" style="height: 180px;"></div>
        </div>
        <div class="card-body">
          <h5 class="card-title placeholder-glow">
            <span class="placeholder col-6"></span>
          </h5>
          <a class="btn disabled placeholder col-12"></a>
        </div>
      </div>
    </div>`;

  function showSkeletons() {
    $careerCards.empty();
    for (let i = 0; i < itemsPerPage; i++) {
      $careerCards.append(skeletonCard);
    }
  }

  function renderCards(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = careers.slice(start, end);
    $careerCards.empty();

    $.each(pageItems, function (index, item) {
      const card = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="https://www.ehlcrm.theskyroute.com/${
              item.image
            }" class="card-img-top" alt="${item.title || item.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title mb-3">${item.name}</h5>
              <a href="details.html?id=${
                item.id
              }" class="btn btn-outline-primary mt-auto">Read More</a>
            </div>
          </div>
        </div>
      `;
      $careerCards.append(card);
    });
  }

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    $pagination.empty();

    const prevLi = $(`
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `);
    prevLi.on("click", function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderCards(currentPage);
        renderPagination(totalItems);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    $pagination.append(prevLi);

    for (let i = 1; i <= totalPages; i++) {
      const li = $(`<li class="page-item ${i === currentPage ? "active" : ""}">
                    <a class="page-link" href="#">${i}</a>
                  </li>`);
      li.on("click", function (e) {
        e.preventDefault();
        currentPage = i;
        renderCards(currentPage);
        renderPagination(totalItems);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      $pagination.append(li);
    }

    const nextLi = $(`
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `);
    nextLi.on("click", function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderCards(currentPage);
        renderPagination(totalItems);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    $pagination.append(nextLi);
  }

  showSkeletons();

  axios
    .get(API_URL)
    .then(function (response) {
      careers = response.data.rows.data || [];

      if (careers.length === 0) {
        $careerCards.html(
          `<div class="alert alert-warning">No career data found.</div>`
        );
        $pagination.empty();
        return;
      }

      renderCards(currentPage);
      renderPagination(careers.length);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
      $careerCards.html(
        `<div class="alert alert-danger">Failed to load data.</div>`
      );
      $pagination.empty();
    });
});

// Fetch Future Career Details
$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    $("#careerDetails").html(
      '<div class="alert alert-warning">No career ID provided in URL.</div>'
    );
    return;
  }

  axios
    .get(
      `https://www.ehlcrm.theskyroute.com/api/future-career-details?id=${id}`
    )
    .then(function (response) {
      const data = response.data;

      document.title = `${data.name} - Career Details`;

      if (!data || !data.name) {
        $("#careerDetails").html(
          '<div class="alert alert-danger">Career not found.</div>'
        );
        return;
      }

      $("#careerDetails").html(`
            <div class="row g-4">
              <div class="col-lg-4 col-12 mb-auto">
                <img src="https://www.ehlcrm.theskyroute.com${
                  data.image
                }" class="img-fluid rounded shadow-sm w-100 h-auto" alt="${data.name}" style="object-fit: contain">
              </div>
              <div class="col-lg-8 col-12">
                <h2 class="mb-3">${data.name}</h2>
                <p class="text-muted"><strong>Overview:</strong> ${
                  data.overview
                }</p>
                <p><strong>Requirements:</strong><br>${data.requirement.replace(
                  /;/g,
                  "<br>"
                )}</p>
                <p><strong>Why This Career:</strong><br>${data.why_this.replace(
                  /, /g,
                  "<br>"
                )}</p>
                ${
                  data.salary
                    ? `<p><strong>Average Salary:</strong> ${data.salary}</p>`
                    : ""
                }
              </div>
            </div>
          `);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
      $("#careerDetails").html(
        '<div class="alert alert-danger">Failed to load career details. Please try again later.</div>'
      );
    });
});

// Change Nav Active
$(document).ready(function () {
  const currentPath = window.location.pathname;

  $(".nav-link").each(function () {
    const linkPath = $(this).attr("href");

    if (linkPath === currentPath) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });
});
