<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import SDK, { WS_FROM } from '@ifreeovo/track-link-sdk'

SDK.init({
    trackingClientURL: 'http://localhost:8000',
    socket: {
        devtoolURL: `ws://localhost:3000/api/v1/remote/devtool`,
        from: WS_FROM.CLIENT,
    },
})

const showNewBtn = ref(false)
const changeBtn = () => {
    showNewBtn.value = true
}
</script>

<template>
    <div>
        <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue" :showNewBtn="showNewBtn" />

    <hr />

    <nav>
        <div><RouterLink to="/home">Go to 列表</RouterLink></div>
        <div><RouterLink to="/about">Go to 无列表</RouterLink></div>
    </nav>
    <main>
        <RouterView />
    </main>
    <!-- eslint-disable -->
    <button @click="changeBtn">点击修改按钮</button>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
