<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  shouldPlay: {
    type: Boolean,
    default: true, // default true for autoplay
  },
});

const playerContainer = ref(null);
const iframeId = `youtube-player-${props.videoId}`;
let player = null;

const isLoading = ref(true); // Spinner state

const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    }
  });
};

const initPlayer = async () => {
  const YT = await loadYouTubeAPI();
  
  if (player) return;

  player = new YT.Player(iframeId, {
    videoId: props.videoId,
    playerVars: {
      autoplay: 1, // Auto-play enabled
      controls: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      fs: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
};

const onPlayerReady = (event) => {
  if (props.shouldPlay) {
    event.target.playVideo();
  }
};

const onPlayerStateChange = (event) => {
  // YouTube Player States
  // -1 = unstarted
  // 0 = ended
  // 1 = playing
  // 2 = paused
  // 3 = buffering
  // 5 = video cued

  if (event.data === 1) {
    isLoading.value = false; // Playing, hide spinner
  } else if (event.data === 3) {
    isLoading.value = true; // Buffering, show spinner
  }
};

watch(() => props.shouldPlay, (newVal) => {
  if (player && player.playVideo) {
    if (newVal) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }
});

onMounted(() => {
  initPlayer();
});

onUnmounted(() => {
  if (player && player.destroy) {
    player.destroy();
  }
});
</script>

<template>
  <div class="w-full h-full bg-black relative flex items-center justify-center overflow-hidden" ref="playerContainer">
    <!-- Loader -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
      <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- YouTube iframe -->
    <div :id="iframeId" class="w-full h-full absolute inset-0 pointer-events-auto"></div>
  </div>
</template>

<style scoped>
/* Ensure the iframe covers the container */
:deep(iframe) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
