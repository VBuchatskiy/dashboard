<script setup lang="ts">
definePageMeta({ layout: 'login' })

function onSuccess() {
  navigateTo('/dashboard')
}
</script>

<template>
  <AuthLoginForm @success="onSuccess" />
</template>
