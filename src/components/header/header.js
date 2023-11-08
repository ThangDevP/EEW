

function dropdownFunc() {
  var x = document.getElementById("dropdown_menu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
function createSubMenu() {
  var userChange = document.getElementById('user-change');
  var subMenu = document.createElement('ul');
  subMenu.classList.add('sub-menu'); // You can add CSS classes for styling
  subMenu.innerHTML = `
    <li><a href="/profile">User Profile</a></li>
    <li><a href="#" id="logout">Logout</a></li>
  `;

  userChange.appendChild(subMenu);
  

  // Add event listener to hide the sub-menu when the cursor leaves "user-change"
  userChange.addEventListener('mouseleave', function () {
    subMenu.style.display = 'none';
  });

  // Add event listener to show the sub-menu when hovering over "user-change"
  userChange.addEventListener('mouseenter', function () {
    subMenu.style.display = 'block';
  });

  // Event listener for the logout button
  var logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('username');
    userChange.textContent = 'Đăng nhập';
    subMenu.style.display = 'none';
  });
}

function userName() {
  var name = localStorage.getItem('username');
  var userChange = document.getElementById('user-change');
  var subMenu = document.createElement('ul');
  subMenu.classList.add('sub-menu');
    subMenu.style.display = 'none'; // Initially hide the submenu

  
  if (name) {
    userChange.textContent = name;

    // Create and populate the sub-menu
    subMenu.innerHTML = `
      <li><a href="/profile">Hồ sơ người dùng</a></li>
      <li><a href="#" id="logout">Đăng xuất</a></li>
    `;

    userChange.appendChild(subMenu);

    // Add event listener to hide the sub-menu when the cursor leaves "user-change"
    userChange.addEventListener('mouseleave', function () {
      subMenu.style.display = 'none';
    });

    // Add event listener to show the sub-menu when hovering over "user-change"
    userChange.addEventListener('mouseenter', function () {
      subMenu.style.display = 'block';
    });

    // Event listener for the logout button
    var logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('username');
      userChange.textContent = 'Đăng nhập';
      subMenu.style.display = 'none';
    });
  } else {
    userChange.textContent = 'Đăng nhập';
  }
}