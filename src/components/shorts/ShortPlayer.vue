<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue';
import { useShortsStore } from '@/stores/shorts';

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  shouldPlay: {
    type: Boolean,
    default: false,
  },
});

const shortsStore = useShortsStore();
const playerContainer = ref(null);
const iframeId = `youtube-player-${props.videoId}`;
let player = null;
const isLoading = ref(true);

// Global Promise for YouTube API loading to avoid race conditions
const getYT = (() => {
  let ytPromise = null;
  return () => {
    if (ytPromise) return ytPromise;
    
    ytPromise = new Promise((resolve) => {
      if (window.YT && typeof window.YT.Player === 'function') {
        resolve(window.YT);
        return;
      }

      // Check if tag already exists
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Instead of overwriting window.onYouTubeIframeAPIReady,
      // we check periodically if the API is ready
      const checkReady = setInterval(() => {
        if (window.YT && typeof window.YT.Player === 'function') {
          clearInterval(checkReady);
          resolve(window.YT);
        }
      }, 100);
    });
    return ytPromise;
  };
})();

const syncMuteState = () => {
  if (player && typeof player.mute === 'function') {
    if (shortsStore.isMuted) {
      player.mute();
    } else {
      player.unMute();
    }
  }
};

const initPlayer = async () => {
  try {
    // Only init if we should play or if we want to pre-load (could add pre-load logic later)
    if (!props.shouldPlay) return;

    const YT = await getYT();
    
    if (player || !playerContainer.value) return;

    player = new YT.Player(iframeId, {
      videoId: props.videoId,
      playerVars: {
        autoplay: 1,
        controls: 0, 
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          isLoading.value = false;
          // Sync with store state
          syncMuteState();
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === 1) { // Playing
            isLoading.value = false;
          } else if (event.data === 3) { // Buffering
            isLoading.value = true;
          } else if (event.data === 0) { // Ended (loop it)
            event.target.playVideo();
          }
        },
      },
    });
  } catch (err) {
    console.error('Failed to init YT player', err);
    isLoading.value = false;
  }
};

watch(() => props.shouldPlay, (newVal) => {
  if (newVal) {
    if (!player) {
      initPlayer();
    } else if (typeof player.playVideo === 'function') {
      syncMuteState();
      player.playVideo();
    }
  } else {
    if (player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  }
});

watch(() => shortsStore.isMuted, () => {
    syncMuteState();
});

onMounted(() => {
  if (props.shouldPlay) {
    initPlayer();
  }
});

onUnmounted(() => {
  if (player && typeof player.destroy === 'function') {
    player.destroy();
  }
});
</script>

<template>
  <div class="w-full h-full bg-black relative flex items-center justify-center overflow-hidden" ref="playerContainer">
    <!-- Loader & Thumbnail Placeholder -->
    <div v-if="isLoading || !player" class="absolute inset-0 flex items-center justify-center bg-black z-20">
      <!-- Thumbnail while loading -->
      <img 
        :src="`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`" 
        class="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
        alt=""
      />
      <div class="z-30 w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>

    <!-- YouTube iframe wrapper -->
    <!-- pointer-events-none helps prevent clicks from showing YT standard UI -->
    <div class="w-full h-full absolute inset-0 pointer-events-none scale-110">
      <div :id="iframeId"></div>
    </div>
  </div>
</template>

<style scoped>
:deep(iframe) {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
