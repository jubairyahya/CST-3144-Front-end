const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const currentPage = ref('home');
    const lessons = ref([]);
    const cart = ref([]);
    const searchQuery = ref('');
    const sortField = ref('');
    const sortOrder = ref('asc');

    // Admin
    const username = ref('');
    const password = ref('');
    const loggedIn = ref(false);
    const adminKey = ref('');

    // lesson from (admin)
    const topic =ref('');
    const location =ref('');
    const price=ref('null');
    const space=ref('null');
    const imageFile=ref('null');

    // Checkout form
    const firstName = ref('');
    const lastName = ref('');
    const address = ref('');
    const city = ref('');
    const country = ref('');
    const countries = ref([
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
      "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
      "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
      "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
      "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile",
      "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
      "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
      "Egypt", "El Salvador", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
      "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
      "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
      "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
      "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
      "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
      "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico",
      "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
      "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
      "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palestine", "Panama",
      "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
      "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Samoa",
      "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
      "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
      "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
      "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga",
      "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
      "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
      "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ]);

    const postcode = ref('');
    const phone = ref('');
    const email = ref('');
    // Payment fields
    const paymentMethod = ref('card'); // default
    const cardType = ref('');
    const cardNumber = ref('');
    const cardName = ref('');
    const cardExpiry = ref(''); // MM/YY
    const cardCVV = ref('');
    const cardError = ref('');

    // total in the cart 
    const totalItems = computed(() =>
      cart.value.reduce((sum, i) => sum + i.quantity, 0)
    );

    const totalPrice = computed(() =>
      cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
    );

    function sortLessons() {
      if (!sortField.value) return;
      lessons.value.sort((a, b) => {
        let aVal = a[sortField.value];
        let bVal = b[sortField.value];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    }

    //admin
    async function login() {
      try {
        const res = await fetch('http://localhost:5000/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.value,
            password: password.value,
          }),
        });

        if (!res.ok) {
          alert('Invalid credentials');
          return;
        }

        const data = await res.json();
        adminKey.value = data.adminKey;
        loggedIn.value = true;
        alert('Login successful!');
        currentPage.value = 'admin'; // Stay on admin page after login
      } catch (err) {
        console.error('Login error:', err);
        alert('Login failed.');
      }
    }

// fetch lessons
    async function fetchLessons(skipPageChange = false) {
      try {
        let url = 'http://localhost:5000/lessons';
        if (searchQuery.value)
          url = `http://localhost:5000/search?q=${encodeURIComponent(searchQuery.value)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load lessons');
        lessons.value = await res.json();
        sortLessons();
        if (!skipPageChange) currentPage.value = currentPage.value;
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
      }
    }

    onMounted(fetchLessons);
    return {
      currentPage, searchQuery, cart, searchQuery, sortField, sortOrder,
      firstName, lastName, address, city, country, countries, postcode, phone,
      email, paymentMethod, cardType, cardNumber, cardName, cardExpiry, cardCVV,
      cardError, totalItems, totalPrice,topic,location, price, space,imageFile,
    };
  },
}).mount('#app');