<template>
  <div class="sheet">
    <!-- 
  Created with css-doodle 
  http://yuanchuan.name/css-doodle 
-->

    <css-doodle click-to-update>
      :doodle { --rspeed: @rand(28s, 35s); --delay: @rand(-200ms, -10ms); --cycle: @rand(.5s, 2.5s);
      --angle: @rand(2deg, 4deg); --da: @rand(1vmin, 8vmin); --db: @rand(1vmin, 8vmin); --bg:
      hsl(@rand(360), 80%, 80%); @grid: 1x180 / 50vmin; animation: r var(--rspeed) linear infinite;
      } @size: 1px 100%; @place-cell: center; transform: rotate(calc( @calc(@index() - 1) *
      var(--angle) )); :after { content: ''; @size: 100%; background: var(--bg); will-change:
      transform; animation: w var(--cycle) linear calc(@index() * var(--delay)) infinite; } --f:
      calc(@sin(@index() / 4) * @PI()); @keyframes w { 0 { transform: translateY(calc(var(--da) *
      var(--f))) } 50% { transform: translateY(calc(var(--db) * var(--f))) } } @keyframes r { to {
      transform: rotate(@pick(-1turn, 1turn)) } }
    </css-doodle>
  </div>
</template>

<script setup lang="ts">
// https://codepen.io/yuanchuan/pens/public 资源代码

import 'css-doodle'
</script>

<style lang="less">
css-doodle {
  margin: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.sheet {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  margin: 0;
  background: #0b253a;
  align-items: center;
}
</style>
