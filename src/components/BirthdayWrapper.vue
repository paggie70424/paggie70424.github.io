<template>
  <div v-if="showBirthday" class="birthday-overlay">
    <Birthday
      title="生日快乐"
      message1="大好年华"
      message2="前程似锦"
      message3="生日快乐"
      customWish="愿你的每一天都充满阳光与欢笑，愿所有美好都如期而至！岁岁年年，万事胜意！"
      cursorText="Paggie"
    />
    <button class="birthday-exit-btn" @click="exitBirthday">
      <span>✕</span>
      <span>进入博客</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Birthday from './Birthday.vue';

const showBirthday = ref(false);

onMounted(() => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Show birthday page on January 28th
  if (month === 1 && day === 28) {
    showBirthday.value = true;
  }
});

function exitBirthday() {
  showBirthday.value = false;
}
</script>

<style>
.birthday-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: #000;
}

.birthday-overlay .birthday-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

.birthday-exit-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100000;
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
}

.birthday-exit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}
</style>
