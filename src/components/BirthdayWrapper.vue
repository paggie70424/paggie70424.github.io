<template>
  <div v-if="showBirthday" class="birthday-wrapper">
    <Birthday
      title="生日快乐"
      message1="大好年华"
      message2="前程似锦"
      message3="生日快乐"
      customWish="愿你的每一天都充满阳光与欢笑，愿所有美好都如期而至！岁岁年年，万事胜意！"
      cursorText="Paggie"
    />
    <!-- Exit button -->
    <button
      class="exit-button"
      @click="exitBirthday"
      title="进入博客"
    >
      <span class="exit-icon">✕</span>
      <span class="exit-text">进入博客</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Birthday from './Birthday.vue';

const showBirthday = ref(false);

onMounted(() => {
  // Check if today is January 28th
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  if (month === 1 && day === 28) {
    showBirthday.value = true;
    // Hide the main page content
    document.body.style.overflow = 'hidden';
  }
});

function exitBirthday() {
  showBirthday.value = false;
  document.body.style.overflow = '';
}
</script>

<style scoped>
.birthday-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.exit-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.exit-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.exit-icon {
  font-size: 16px;
  line-height: 1;
}

.exit-text {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .exit-button {
    top: 10px;
    right: 10px;
    padding: 10px 16px;
    font-size: 12px;
  }
}
</style>
