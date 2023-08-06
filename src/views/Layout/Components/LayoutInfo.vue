<script setup></script>

<template>
  <div class="no">
    <div class="no-hd">
      <ul>
        <li>24870895</li>
        <li>5815462</li>
      </ul>
    </div>
    <div class="no-bd">
      <ul>
        <li>上海市人口总数</li>
        <li>60岁以上老年人口数</li>
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
      font-size: 5vh;
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

  li {
    flex: 1;
    height: 1vh;
    line-height: 1vh;
    text-align: center;
    font-size: 1.6vh;
    color: #fff
  }
}
</style>