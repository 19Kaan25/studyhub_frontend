<script setup lang="ts">
defineProps<{ favorited: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    class="fav-btn"
    :class="{ active: favorited }"
    :title="favorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
    :aria-label="favorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
    :aria-pressed="favorited"
    @click.prevent="emit('toggle')"
  >
    <!-- gefüllter Stern bei Favorit, sonst nur Umriss -->
    <svg
      class="star"
      viewBox="0 0 24 24"
      :fill="favorited ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  </button>
</template>

<style scoped>
.fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0.25rem;
  color: var(--muted);
  cursor: pointer;
  transition:
    color 0.15s ease,
    transform 0.1s ease;
}
.fav-btn:hover {
  color: #f5a623;
}
.fav-btn:active {
  transform: scale(0.9);
}
.fav-btn.active {
  color: #f5a623;
}
.star {
  width: 22px;
  height: 22px;
}
</style>
