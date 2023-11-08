<template>
  <v-app>
    <div class="app">
      <Sidebar />
      <router-view />
    </div>
  </v-app>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";

export default {
  components: {Sidebar},
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
:root {
  --primary: #73A8E7;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}
body {
  background: var(--light);
}
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
.app {
  display: flex;
  main {
    flex: 1 1 0;
    padding-top: 1rem;
    @media (max-width: 1024px) {
      padding-left: 4rem;
      width: 100%;
    }
    @media (max-width: 767px) {
      padding-top: 0;
    }
  }
}
</style>