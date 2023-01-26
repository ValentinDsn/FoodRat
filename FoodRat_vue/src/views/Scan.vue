<template>
<main>
  <h1>Vue Barcode Reader Demo</h1>
  <CameraScanner />
</main>
</template>

<script>
import CameraScanner from '@/components/ScanComponent.vue';
export default {
  name: "ScanPage",

  components: {
    CameraScanner
  }
}
</script>

<style scoped>

</style>