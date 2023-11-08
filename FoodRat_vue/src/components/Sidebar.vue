<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <v-icon
            large
            class="material-icons"
        >
          mdi-chevron-double-right
        </v-icon>
      </button>
    </div>
    <div class="menu">
      <router-link to="/" class="button">
        <v-icon
            large
            class="material-icons">
          mdi-home
        </v-icon>
        <span class="text">Accueil</span>
      </router-link>
      <router-link to="/scan  " class="button">
        <v-icon
            large
            class="material-icons">
          mdi-barcode-scan
        </v-icon>
        <span class="text">Scan</span>
      </router-link>
      <router-link to="/products" class="button">
        <v-icon
            large
            class="material-icons">
          mdi-fridge
        </v-icon>
        <span class="text">Produits par catégories</span>
      </router-link>

      <router-link to="/allProducts" class="button">
        <v-icon
            large
            class="material-icons">
          mdi-food
        </v-icon>
        <span class="text">Tout les produits</span>
      </router-link>
    </div>
    <div class="flex"></div>
    <div class="menu" v-if="currentUser">
      <h3 class="text">
        {{currentUser}}
      </h3>
      <router-link to="/history" class="button">
        <v-icon
            large
            class="material-icons">
          mdi-history
        </v-icon>
        <span class="text">Historique</span>
      </router-link>

    </div>
  </aside>
</template>

<script>
import { mdiArrowExpandRight  } from '@mdi/js'

export default {
  name: 'SidebarItem',
  data: () => ({
    is_expanded: false,
    path: mdiArrowExpandRight
  }),
  mounted() {
    this.is_expanded = localStorage.getItem("is_expanded") === "true";
  },
  computed: {
    currentUser() {
      return "Valou";
    },
  },
  methods: {
    ToggleMenu() {
      this.is_expanded = !this.is_expanded
      localStorage.setItem("is_expanded", this.is_expanded)
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  background-color: var(--dark);
  color: var(--light);
  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;
  transition: 0.2s ease-in-out;
  .flex {
    flex: 1 1 0%;
  }
  .logo {
    margin-bottom: 1rem;
    img {
      width: 2rem;
    }
  }
  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;
    .menu-toggle {
      transition: 0.2s ease-in-out;
      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }
  h3, .button .text {
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
  .menu {
    margin: 0 -1rem;
    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;
      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-in-out;
      }
      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
      }
      &:hover {
        background-color: var(--dark-alt);
        .material-icons, .text {
          color: var(--primary);
        }
      }
      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);
        .material-icons, .text {
          color: var(--primary);
        }
      }
    }
  }
  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    p {
      font-size: 0.875rem;
      color: var(--grey);
    }
  }
  &.is-expanded {
    width: var(--sidebar-width);
    .menu-toggle-wrap {

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }
    h3, .button .text {
      opacity: 1;
    }
    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }
    .footer {
      opacity: 0;
    }
  }
  @media (max-width: 1024px) {
    position: fixed;
    z-index: 99;
  }
}
</style>