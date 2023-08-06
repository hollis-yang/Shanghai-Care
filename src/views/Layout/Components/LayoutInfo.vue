<script setup>
import { ref, onMounted } from 'vue'

const numArr1 = [24870895, 15051900]
const numArr2 = [5815462, 5536600]
const nameArr1 = ['上海市常驻人口数', '上海市户籍人口数']
const num1 = ref(numArr1[0])
const num2 = ref(numArr2[0])
const name1 = ref(nameArr1[0])

const current = ref(0)

const timeId = ref(null)

const startInterval = () => {
  timeId.value = setInterval(() => {
    if (current.value === 0) {
      current.value = 1
    } else {
      current.value = 0
    }
    num1.value = numArr1[current.value]
    num2.value = numArr2[current.value]
    name1.value = nameArr1[current.value]
  }, 3000)
}

onMounted(() => {
  startInterval()
})


// 监听.no的mouseover/out
const noMouseOver = () => {
  clearInterval(timeId.value)
}
const noMouseOut = () => {
  startInterval()
}
</script>

<template>
  <div class="no" @mouseover="noMouseOver" @mouseout="noMouseOut">
    <div class="no-hd">
      <ul>
        <li>{{ num1 }}</li>
        <li>{{ num2 }}</li>
      </ul>
    </div>
    <div class="no-bd">
      <ul>
        <li>{{ name1 }}</li>
        <li>其中老年人口数</li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
ul {
  padding: 0;

  li {
    list-style: none;
  }
}

@font-face {
  font-family: electronicFont;
  src: url('../../../assets/font/DS-DIGIT.TTF');
}

.no .no-hd {
  position: relative;
  border: 1px solid transparent;

  ul {
    display: flex;

    li {
      position: relative;
      flex: 1;
      text-align: center;
      // 居中
      height: 5vh;
      line-height: 5vh;
      font-size: 5.5vh;
      color: #ffeb7b;
      font-family: electronicFont;
      font-weight: bold;

      &:first-child::after {
        content: "";
        position: absolute;
        height: 90%;
        width: 0.1vw;
        background: rgba(255, 255, 255, 0.7);
        right: -3%;
      }
    }
  }
}

.no .no-bd ul {
  display: flex;
  margin-top: 0vh;

  li {
    flex: 1;
    height: 1vh;
    line-height: 1vh;
    text-align: center;
    font-size: 2vh;
    color: #fff
  }
}
</style>