<template>
    <b-navbar toggleable="lg" type="dark" variant="info" class="navbar sticky-top">

        <b-navbar-brand to="/" id="websiteTitle" class="ml-2 ml-md-4">
            <img src="https://e7.pngegg.com/pngimages/458/458/png-clipart-teal-and-pink-clinica-dental-sonrie-penonome-dentist-tooth-logo-tandartspraktijk-faunabuurt-almere-dentistry-love-miscellaneous-thumbnail.png"
                alt="Company Logo" class="navbar-logo" />
            DentiSmile+
        </b-navbar-brand>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ms-auto">
            <b-nav-item-dropdown right v-if="userStatus.loggedIn" no-caret>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <img src="../assets/MenuButton.svg" alt="Menu Button" />
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item right v-else>
                <b-button to="/login">Sign In</b-button>
                <b-button to="/signup">Sign Up</b-button>
            </b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
export default {
    name: 'NavigationBar',
    data() {
        return {
            userStatus: {
                loggedIn: true,
            },
        };
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cookie&family=Jacquarda+Bastarda+9&display=swap');

#websiteTitle {
    font-size: 1.5em;
    font-weight: bold;
    font-family: 'Cookie', sans-serif;
}

.navbar-logo {
    height: 60px;
    width: auto;
}

@media (max-width: 768px) {
    .navbar-logo {
        height: 30px;
    }
}
</style>