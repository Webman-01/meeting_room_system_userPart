<template>
  <div>
    <h1>404 NOT FOUND</h1>
    <button ref="runawayBtn">点我有奖<img src="../assets/dogge.png" alt=""></button>
  </div>
</template>

<script setup>
import anime from "animejs/lib/anime.es.js";
import { onMounted, ref } from "vue";
const runawayBtn = ref(null);

const animateMove = (element, prop, pixels) =>
  anime({
    targets: element,
    [prop]: `${pixels}px`,
    easing: "easeOutCirc",
  });

const getRandomNumber = (num) => {
  return Math.floor(Math.random() * (num + 1));
};

onMounted(() => {
  ["mouseover", "click"].forEach((el) => {
    runawayBtn.value.addEventListener(el, function (event) {
      const top = getRandomNumber(window.innerHeight - this.offsetHeight);
      const left = getRandomNumber(window.innerWidth - this.offsetWidth);

      animateMove(this, "left", left).play();
      animateMove(this, "top", top).play();
    });
  });
});
</script>

<style scoped>
/* 按钮的样式 */
button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 4rem;
  width: 10rem;
  font-size: 1.5rem;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px black;
  background-color: white;
}
img{
  width: 30px;
  height: 30px;
}
</style>
