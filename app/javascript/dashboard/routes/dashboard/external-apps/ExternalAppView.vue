<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useMapGetter } from 'dashboard/composables/store';

const props = defineProps({
  appUrl: {
    type: String,
    required: true,
  },
  appName: {
    type: String,
    default: 'External App',
  },
});

const iframeRef = ref(null);
const isLoading = ref(true);

const currentUser = useMapGetter('getCurrentUser');

const userPayload = computed(() => ({
  email: currentUser.value?.email,
  name: currentUser.value?.name,
  avatarUrl: currentUser.value?.avatar_url,
}));

const onIframeLoad = () => {
  isLoading.value = false;
  sendAuthInfo();
};

const sendAuthInfo = () => {
  if (!iframeRef.value?.contentWindow) return;
  iframeRef.value.contentWindow.postMessage(
    { type: 'CHATWOOT_USER', payload: userPayload.value },
    props.appUrl
  );
};

const handleMessage = event => {
  if (!props.appUrl.startsWith(event.origin)) return;
  if (event.data?.type === 'REQUEST_AUTH') {
    sendAuthInfo();
  }
};

onMounted(() => window.addEventListener('message', handleMessage));
onBeforeUnmount(() => window.removeEventListener('message', handleMessage));
</script>

<template>
  <div class="relative flex flex-col w-full h-full overflow-hidden">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-n-surface-1 z-10"
    >
      <span class="i-lucide-loader-circle size-6 text-n-slate-10 animate-spin" />
    </div>
    <iframe
      ref="iframeRef"
      :src="appUrl"
      :title="appName"
      class="flex-1 w-full h-full border-0"
      allow="fullscreen clipboard-read clipboard-write"
      @load="onIframeLoad"
    />
  </div>
</template>
